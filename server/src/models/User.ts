import db from '../config/database';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export interface User {
  id: number;
  email: string;
  password_hash: string;
  email_verified: number;
  verification_token: string | null;
  verification_expires: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserCreateData {
  email: string;
  password: string;
}

export class UserModel {
  static async create(data: UserCreateData): Promise<User> {
    const { email, password } = data;
    const passwordHash = await bcrypt.hash(password, 10);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours

    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO users (email, password_hash, verification_token, verification_expires) VALUES (?, ?, ?, ?)',
        [email, passwordHash, verificationToken, verificationExpires],
        function (err) {
          if (err) {
            reject(err);
          } else {
            UserModel.findById(this.lastID)
              .then((user) => resolve(user!))
              .catch(reject);
          }
        }
      );
    });
  }

  static async findByEmail(email: string): Promise<User | null> {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM users WHERE email = ?',
        [email],
        (err, row: User) => {
          if (err) {
            reject(err);
          } else {
            resolve(row || null);
          }
        }
      );
    });
  }

  static async findById(id: number): Promise<User | null> {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM users WHERE id = ?',
        [id],
        (err, row: User) => {
          if (err) {
            reject(err);
          } else {
            resolve(row || null);
          }
        }
      );
    });
  }

  static async verifyPassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password_hash);
  }

  static async updatePassword(userId: number, newPassword: string): Promise<void> {
    const passwordHash = await bcrypt.hash(newPassword, 10);

    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [passwordHash, userId],
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  static async delete(userId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM users WHERE id = ?', [userId], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  static async findByVerificationToken(token: string): Promise<User | null> {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM users WHERE verification_token = ?',
        [token],
        (err, row: User) => {
          if (err) {
            reject(err);
          } else {
            resolve(row || null);
          }
        }
      );
    });
  }

  static async verifyEmail(userId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE users SET email_verified = 1, verification_token = NULL, verification_expires = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [userId],
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  static async generateNewVerificationToken(userId: number): Promise<string> {
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE users SET verification_token = ?, verification_expires = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [verificationToken, verificationExpires, userId],
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(verificationToken);
          }
        }
      );
    });
  }
}
