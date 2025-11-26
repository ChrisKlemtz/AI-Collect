import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);
router.get('/session', AuthController.checkSession);
router.get('/me', requireAuth, AuthController.getCurrentUser);
router.get('/verify-email', AuthController.verifyEmail);
router.post('/resend-verification', AuthController.resendVerification);

export default router;
