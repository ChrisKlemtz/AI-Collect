import { Response } from 'express';
import { ChatModel, Message } from '../models/Chat';
import { AuthRequest } from '../middleware/auth';

export class ChatController {
  // Get all chats for the authenticated user
  static async getAllChats(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Nicht authentifiziert' });
      }

      const { provider } = req.query;

      let chats;
      if (provider && typeof provider === 'string') {
        chats = await ChatModel.findByUserIdAndProvider(req.userId, provider);
      } else {
        chats = await ChatModel.findByUserId(req.userId);
      }

      // Parse messages for each chat and convert to frontend format
      const chatsWithParsedMessages = chats.map((chat) => {
        let messages: Message[] = [];
        try {
          messages = JSON.parse(chat.messages);
        } catch (error) {
          console.error('Error parsing messages:', error);
        }

        return {
          id: chat.id,
          title: chat.title,
          provider: chat.provider,
          lastMessage: chat.last_message,
          messageCount: chat.message_count,
          createdAt: chat.created_at,
          updatedAt: chat.updated_at,
        };
      });

      res.json({ chats: chatsWithParsedMessages });
    } catch (error) {
      console.error('Get chats error:', error);
      res.status(500).json({ error: 'Serverfehler beim Laden der Chats' });
    }
  }

  // Get a specific chat with messages
  static async getChat(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Nicht authentifiziert' });
      }

      const { chatId } = req.params;

      const chat = await ChatModel.findById(chatId);
      if (!chat) {
        return res.status(404).json({ error: 'Chat nicht gefunden' });
      }

      // Verify ownership
      if (chat.user_id !== req.userId) {
        return res.status(403).json({ error: 'Keine Berechtigung' });
      }

      const messages = await ChatModel.getMessages(chatId);

      res.json({
        chat: {
          id: chat.id,
          title: chat.title,
          provider: chat.provider,
          lastMessage: chat.last_message,
          messageCount: chat.message_count,
          createdAt: chat.created_at,
          updatedAt: chat.updated_at,
          messages,
        },
      });
    } catch (error) {
      console.error('Get chat error:', error);
      res.status(500).json({ error: 'Serverfehler beim Laden des Chats' });
    }
  }

  // Create a new chat
  static async createChat(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Nicht authentifiziert' });
      }

      const { id, title, provider } = req.body;

      if (!id || !title || !provider) {
        return res.status(400).json({ error: 'ID, Titel und Provider sind erforderlich' });
      }

      const chat = await ChatModel.create({
        id,
        user_id: req.userId,
        title,
        provider,
      });

      res.status(201).json({
        chat: {
          id: chat.id,
          title: chat.title,
          provider: chat.provider,
          lastMessage: chat.last_message,
          messageCount: chat.message_count,
          createdAt: chat.created_at,
          updatedAt: chat.updated_at,
        },
      });
    } catch (error) {
      console.error('Create chat error:', error);
      res.status(500).json({ error: 'Serverfehler beim Erstellen des Chats' });
    }
  }

  // Update chat messages
  static async updateChatMessages(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Nicht authentifiziert' });
      }

      const { chatId } = req.params;
      const { messages } = req.body;

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Nachrichten sind erforderlich' });
      }

      const chat = await ChatModel.findById(chatId);
      if (!chat) {
        return res.status(404).json({ error: 'Chat nicht gefunden' });
      }

      // Verify ownership
      if (chat.user_id !== req.userId) {
        return res.status(403).json({ error: 'Keine Berechtigung' });
      }

      await ChatModel.updateMessages(chatId, messages);

      res.json({ message: 'Chat-Nachrichten aktualisiert' });
    } catch (error) {
      console.error('Update chat messages error:', error);
      res.status(500).json({ error: 'Serverfehler beim Aktualisieren der Nachrichten' });
    }
  }

  // Rename a chat
  static async renameChat(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Nicht authentifiziert' });
      }

      const { chatId } = req.params;
      const { title } = req.body;

      if (!title) {
        return res.status(400).json({ error: 'Titel ist erforderlich' });
      }

      const chat = await ChatModel.findById(chatId);
      if (!chat) {
        return res.status(404).json({ error: 'Chat nicht gefunden' });
      }

      // Verify ownership
      if (chat.user_id !== req.userId) {
        return res.status(403).json({ error: 'Keine Berechtigung' });
      }

      await ChatModel.updateTitle(chatId, title);

      res.json({ message: 'Chat umbenannt' });
    } catch (error) {
      console.error('Rename chat error:', error);
      res.status(500).json({ error: 'Serverfehler beim Umbenennen des Chats' });
    }
  }

  // Delete a chat
  static async deleteChat(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Nicht authentifiziert' });
      }

      const { chatId } = req.params;

      const chat = await ChatModel.findById(chatId);
      if (!chat) {
        return res.status(404).json({ error: 'Chat nicht gefunden' });
      }

      // Verify ownership
      if (chat.user_id !== req.userId) {
        return res.status(403).json({ error: 'Keine Berechtigung' });
      }

      await ChatModel.delete(chatId);

      res.json({ message: 'Chat gelöscht' });
    } catch (error) {
      console.error('Delete chat error:', error);
      res.status(500).json({ error: 'Serverfehler beim Löschen des Chats' });
    }
  }
}
