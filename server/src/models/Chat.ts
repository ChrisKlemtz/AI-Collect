import db from '../config/database';

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface Chat {
  id: string;
  user_id: number;
  title: string;
  provider: string;
  messages: string; // JSON string
  last_message: string;
  message_count: number;
  created_at: string;
  updated_at: string;
}

export interface ChatWithMessages extends Omit<Chat, 'messages'> {
  messages: Message[];
}

export interface ChatCreateData {
  id: string;
  user_id: number;
  title: string;
  provider: string;
}

export class ChatModel {
  static async create(data: ChatCreateData): Promise<Chat> {
    const { id, user_id, title, provider } = data;

    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO chats (id, user_id, title, provider, messages, last_message, message_count) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [id, user_id, title, provider, JSON.stringify([]), '', 0],
        function (err) {
          if (err) {
            reject(err);
          } else {
            ChatModel.findById(id)
              .then((chat) => resolve(chat!))
              .catch(reject);
          }
        }
      );
    });
  }

  static async findById(id: string): Promise<Chat | null> {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM chats WHERE id = ?', [id], (err, row: Chat) => {
        if (err) {
          reject(err);
        } else {
          resolve(row || null);
        }
      });
    });
  }

  static async findByUserId(userId: number): Promise<Chat[]> {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM chats WHERE user_id = ? ORDER BY updated_at DESC',
        [userId],
        (err, rows: Chat[]) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows || []);
          }
        }
      );
    });
  }

  static async findByUserIdAndProvider(
    userId: number,
    provider: string
  ): Promise<Chat[]> {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM chats WHERE user_id = ? AND provider = ? ORDER BY updated_at DESC',
        [userId, provider],
        (err, rows: Chat[]) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows || []);
          }
        }
      );
    });
  }

  static async updateMessages(
    chatId: string,
    messages: Message[]
  ): Promise<void> {
    const userMessages = messages.filter((m) => m.role === 'user');
    const lastUserMessage = userMessages[userMessages.length - 1];
    const lastMessage = lastUserMessage?.content || '';
    const messageCount = messages.length;

    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE chats SET messages = ?, last_message = ?, message_count = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [JSON.stringify(messages), lastMessage, messageCount, chatId],
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

  static async updateTitle(chatId: string, title: string): Promise<void> {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE chats SET title = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [title, chatId],
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

  static async delete(chatId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM chats WHERE id = ?', [chatId], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  static async getMessages(chatId: string): Promise<Message[]> {
    const chat = await this.findById(chatId);
    if (!chat) {
      return [];
    }
    try {
      return JSON.parse(chat.messages);
    } catch (error) {
      console.error('Error parsing messages:', error);
      return [];
    }
  }
}
