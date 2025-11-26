import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = path.join(__dirname, 'data', 'database.sqlite');
const db = new Database(dbPath);

console.log('\n📊 Users in database:\n');

const users = db.prepare(`
  SELECT id, email, email_verified, verification_token, created_at
  FROM users
  ORDER BY created_at DESC
`).all();

if (users.length === 0) {
  console.log('No users found in database.\n');
} else {
  users.forEach(user => {
    console.log(`ID: ${user.id}`);
    console.log(`Email: ${user.email}`);
    console.log(`Verified: ${user.email_verified ? 'Yes ✅' : 'No ❌'}`);
    console.log(`Token: ${user.verification_token || 'N/A'}`);
    console.log(`Created: ${user.created_at}`);
    console.log('---');
  });
}

db.close();
