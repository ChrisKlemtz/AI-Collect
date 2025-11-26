import { Request, Response } from 'express';
import { UserModel } from '../models/User';
import { AuthRequest } from '../middleware/auth';
import { sendVerificationEmail } from '../services/emailService';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { email, password, passwordConfirm } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email und Passwort sind erforderlich' });
      }

      // Validate password confirmation if provided
      if (passwordConfirm !== undefined && password !== passwordConfirm) {
        return res.status(400).json({ error: 'Die Passwörter stimmen nicht überein' });
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Ungültige E-Mail-Adresse' });
      }

      // Password validation
      if (password.length < 6) {
        return res.status(400).json({ error: 'Passwort muss mindestens 6 Zeichen lang sein' });
      }

      // Check if user already exists
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ error: 'Benutzer existiert bereits' });
      }

      // Create user
      const user = await UserModel.create({ email, password });

      // Send verification email if Resend is configured
      const emailConfigured = process.env.RESEND_API_KEY;
      if (emailConfigured && user.verification_token) {
        const emailSent = await sendVerificationEmail(user.email, user.verification_token);

        res.status(201).json({
          message: 'Registrierung erfolgreich. Bitte überprüfe deine E-Mail, um deinen Account zu verifizieren.',
          user: {
            id: user.id,
            email: user.email,
          },
          emailVerificationRequired: true,
        });
      } else {
        // If email service not configured, auto-verify the user
        await UserModel.verifyEmail(user.id);

        // Create session immediately
        req.session.userId = user.id;
        req.session.email = user.email;

        res.status(201).json({
          message: 'Registrierung erfolgreich',
          user: {
            id: user.id,
            email: user.email,
          },
          emailVerificationRequired: false,
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Serverfehler bei der Registrierung' });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email und Passwort sind erforderlich' });
      }

      // Find user
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Ungültige Anmeldedaten' });
      }

      // Verify password
      const isValid = await UserModel.verifyPassword(user, password);
      if (!isValid) {
        return res.status(401).json({ error: 'Ungültige Anmeldedaten' });
      }

      // Check email verification
      if (!user.email_verified) {
        return res.status(403).json({
          error: 'E-Mail noch nicht verifiziert',
          code: 'EMAIL_NOT_VERIFIED'
        });
      }

      // Create session
      req.session.userId = user.id;
      req.session.email = user.email;

      res.json({
        message: 'Anmeldung erfolgreich',
        user: {
          id: user.id,
          email: user.email,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Serverfehler bei der Anmeldung' });
    }
  }

  static async logout(req: Request, res: Response) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Logout error:', err);
        return res.status(500).json({ error: 'Fehler beim Abmelden' });
      }
      res.clearCookie('connect.sid');
      res.json({ message: 'Erfolgreich abgemeldet' });
    });
  }

  static async getCurrentUser(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Nicht authentifiziert' });
      }

      const user = await UserModel.findById(req.userId);
      if (!user) {
        return res.status(404).json({ error: 'Benutzer nicht gefunden' });
      }

      res.json({
        user: {
          id: user.id,
          email: user.email,
        },
      });
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({ error: 'Serverfehler' });
    }
  }

  static async checkSession(req: Request, res: Response) {
    if (req.session && req.session.userId) {
      res.json({
        authenticated: true,
        user: {
          id: req.session.userId,
          email: req.session.email,
        },
      });
    } else {
      res.json({ authenticated: false });
    }
  }

  static async verifyEmail(req: Request, res: Response) {
    try {
      const { token } = req.query;

      if (!token || typeof token !== 'string') {
        return res.status(400).json({ error: 'Ungültiger Verifizierungstoken' });
      }

      // Find user by token
      const user = await UserModel.findByVerificationToken(token);
      if (!user) {
        return res.status(404).json({ error: 'Ungültiger oder abgelaufener Token' });
      }

      // Check if token is expired
      if (user.verification_expires && new Date(user.verification_expires) < new Date()) {
        return res.status(410).json({ error: 'Token ist abgelaufen' });
      }

      // Verify email
      await UserModel.verifyEmail(user.id);

      // Create session automatically after verification
      req.session.userId = user.id;
      req.session.email = user.email;

      res.json({
        message: 'E-Mail erfolgreich verifiziert',
        user: {
          id: user.id,
          email: user.email,
        },
      });
    } catch (error) {
      console.error('Email verification error:', error);
      res.status(500).json({ error: 'Serverfehler bei der Verifizierung' });
    }
  }

  static async resendVerification(req: Request, res: Response) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'E-Mail ist erforderlich' });
      }

      // Find user
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(404).json({ error: 'Benutzer nicht gefunden' });
      }

      // Check if already verified
      if (user.email_verified) {
        return res.status(400).json({ error: 'E-Mail ist bereits verifiziert' });
      }

      // Generate new token and send email
      const newToken = await UserModel.generateNewVerificationToken(user.id);
      await sendVerificationEmail(user.email, newToken);

      res.json({ message: 'Verifizierungs-E-Mail wurde erneut gesendet' });
    } catch (error) {
      console.error('Resend verification error:', error);
      res.status(500).json({ error: 'Serverfehler beim Versenden der E-Mail' });
    }
  }
}
