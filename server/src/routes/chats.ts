import { Router } from 'express';
import { ChatController } from '../controllers/chatController';
import { requireAuth } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.get('/', requireAuth, ChatController.getAllChats);
router.get('/:chatId', requireAuth, ChatController.getChat);
router.post('/', requireAuth, ChatController.createChat);
router.put('/:chatId/messages', requireAuth, ChatController.updateChatMessages);
router.put('/:chatId/title', requireAuth, ChatController.renameChat);
router.delete('/:chatId', requireAuth, ChatController.deleteChat);

export default router;
