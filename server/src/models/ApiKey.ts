import db from '../config/database';
import { encryptApiKey, decryptApiKey } from '../utils/encryption';

export interface ApiKey {
  id: number;
  user_id: number;
  provider: string;
  encrypted_key: string;
  created_at: string;
  updated_at: string;
}

export interface ApiKeyWithDecrypted extends ApiKey {
  decrypted_key: string;
}

export class ApiKeyModel {
  static async create(userId: number, provider: string, apiKey: string): Promise<ApiKey> {
    const encryptedKey = encryptApiKey(apiKey);

    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO api_keys (user_id, provider, encrypted_key)
         VALUES (?, ?, ?)
         ON CONFLICT(user_id, provider)
         DO UPDATE SET encrypted_key = ?, updated_at = CURRENT_TIMESTAMP`,
        [userId, provider, encryptedKey, encryptedKey],
        function (err) {
          if (err) {
            reject(err);
          } else {
            ApiKeyModel.findById(this.lastID)
              .then((key) => resolve(key!))
              .catch(reject);
          }
        }
      );
    });
  }

  static async findById(id: number): Promise<ApiKey | null> {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM api_keys WHERE id = ?',
        [id],
        (err, row: ApiKey) => {
          if (err) {
            reject(err);
          } else {
            resolve(row || null);
          }
        }
      );
    });
  }

  static async findByUserAndProvider(
    userId: number,
    provider: string
  ): Promise<ApiKeyWithDecrypted | null> {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM api_keys WHERE user_id = ? AND provider = ?',
        [userId, provider],
        (err, row: ApiKey) => {
          if (err) {
            reject(err);
          } else if (!row) {
            resolve(null);
          } else {
            try {
              const decryptedKey = decryptApiKey(row.encrypted_key);
              resolve({ ...row, decrypted_key: decryptedKey });
            } catch (error) {
              reject(error);
            }
          }
        }
      );
    });
  }

  static async findAllByUser(userId: number): Promise<{ [provider: string]: string }> {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM api_keys WHERE user_id = ?',
        [userId],
        (err, rows: ApiKey[]) => {
          if (err) {
            reject(err);
          } else {
            try {
              const keys: { [provider: string]: string } = {};
              rows.forEach((row) => {
                keys[row.provider] = decryptApiKey(row.encrypted_key);
              });
              resolve(keys);
            } catch (error) {
              reject(error);
            }
          }
        }
      );
    });
  }

  static async delete(userId: number, provider: string): Promise<void> {
    return new Promise((resolve, reject) => {
      db.run(
        'DELETE FROM api_keys WHERE user_id = ? AND provider = ?',
        [userId, provider],
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

  static async deleteAllByUser(userId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM api_keys WHERE user_id = ?', [userId], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}
