import { Resend } from 'resend';

const APP_URL = process.env.APP_URL || 'http://localhost:3001';
const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev';

// Initialize Resend only if API key is available
let resend: Resend | null = null;
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
} else {
  console.warn('⚠️  RESEND_API_KEY not configured - email verification will not work');
}

export async function sendVerificationEmail(email: string, token: string): Promise<boolean> {
  if (!resend) {
    console.error('Cannot send verification email: Resend not configured');
    return false;
  }

  try {
    const verificationUrl = `${APP_URL}/verify-email?token=${token}`;

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Bestätige deine E-Mail-Adresse - Multi-AI Hub',
      html: `
        <!DOCTYPE html>
        <html lang="de">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>E-Mail Bestätigung</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">

                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px 12px 0 0;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Multi-AI Hub</h1>
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <h2 style="margin: 0 0 20px; color: #1a1a1a; font-size: 24px; font-weight: 600;">Willkommen! 🎉</h2>

                      <p style="margin: 0 0 20px; color: #4a5568; font-size: 16px; line-height: 1.6;">
                        Vielen Dank für deine Registrierung bei Multi-AI Hub. Um deinen Account zu aktivieren und loszulegen, bestätige bitte deine E-Mail-Adresse.
                      </p>

                      <p style="margin: 0 0 30px; color: #4a5568; font-size: 16px; line-height: 1.6;">
                        Klicke einfach auf den Button unten:
                      </p>

                      <!-- Button -->
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" style="padding: 0 0 30px;">
                            <a href="${verificationUrl}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);">
                              E-Mail bestätigen
                            </a>
                          </td>
                        </tr>
                      </table>

                      <p style="margin: 0 0 10px; color: #718096; font-size: 14px; line-height: 1.6;">
                        Oder kopiere diesen Link in deinen Browser:
                      </p>

                      <p style="margin: 0 0 30px; color: #667eea; font-size: 14px; line-height: 1.6; word-break: break-all;">
                        ${verificationUrl}
                      </p>

                      <div style="padding: 20px; background-color: #fef5e7; border-left: 4px solid #f39c12; border-radius: 4px; margin-bottom: 20px;">
                        <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.6;">
                          ⚠️ <strong>Hinweis:</strong> Dieser Link ist 24 Stunden gültig.
                        </p>
                      </div>

                      <p style="margin: 0; color: #a0aec0; font-size: 13px; line-height: 1.6;">
                        Wenn du dich nicht bei Multi-AI Hub registriert hast, kannst du diese E-Mail ignorieren.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding: 30px 40px; background-color: #f7fafc; border-radius: 0 0 12px 12px; text-align: center;">
                      <p style="margin: 0; color: #a0aec0; font-size: 12px; line-height: 1.6;">
                        © ${new Date().getFullYear()} Multi-AI Hub. Alle Rechte vorbehalten.
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Error sending verification email:', error);
      return false;
    }

    console.log('Verification email sent successfully:', data);
    return true;
  } catch (error) {
    console.error('Failed to send verification email:', error);
    return false;
  }
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
  if (!resend) {
    console.error('Cannot send password reset email: Resend not configured');
    return false;
  }

  try {
    const resetUrl = `${APP_URL}/reset-password?token=${token}`;

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Passwort zurücksetzen - Multi-AI Hub',
      html: `
        <!DOCTYPE html>
        <html lang="de">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Passwort zurücksetzen</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">

                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px 12px 0 0;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Multi-AI Hub</h1>
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <h2 style="margin: 0 0 20px; color: #1a1a1a; font-size: 24px; font-weight: 600;">Passwort zurücksetzen 🔒</h2>

                      <p style="margin: 0 0 20px; color: #4a5568; font-size: 16px; line-height: 1.6;">
                        Du hast eine Anfrage zum Zurücksetzen deines Passworts gestellt. Klicke auf den Button unten, um ein neues Passwort zu setzen.
                      </p>

                      <!-- Button -->
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" style="padding: 0 0 30px;">
                            <a href="${resetUrl}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);">
                              Passwort zurücksetzen
                            </a>
                          </td>
                        </tr>
                      </table>

                      <p style="margin: 0 0 10px; color: #718096; font-size: 14px; line-height: 1.6;">
                        Oder kopiere diesen Link in deinen Browser:
                      </p>

                      <p style="margin: 0 0 30px; color: #667eea; font-size: 14px; line-height: 1.6; word-break: break-all;">
                        ${resetUrl}
                      </p>

                      <div style="padding: 20px; background-color: #fef5e7; border-left: 4px solid #f39c12; border-radius: 4px; margin-bottom: 20px;">
                        <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.6;">
                          ⚠️ <strong>Hinweis:</strong> Dieser Link ist 1 Stunde gültig.
                        </p>
                      </div>

                      <p style="margin: 0; color: #a0aec0; font-size: 13px; line-height: 1.6;">
                        Wenn du diese Anfrage nicht gestellt hast, kannst du diese E-Mail ignorieren. Dein Passwort bleibt unverändert.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding: 30px 40px; background-color: #f7fafc; border-radius: 0 0 12px 12px; text-align: center;">
                      <p style="margin: 0; color: #a0aec0; font-size: 12px; line-height: 1.6;">
                        © ${new Date().getFullYear()} Multi-AI Hub. Alle Rechte vorbehalten.
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Error sending password reset email:', error);
      return false;
    }

    console.log('Password reset email sent successfully:', data);
    return true;
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    return false;
  }
}
