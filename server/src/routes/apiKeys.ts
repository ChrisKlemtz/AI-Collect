import { Router } from 'express';
import { ApiKeyController } from '../controllers/apiKeyController';
import { requireAuth } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(requireAuth);

router.get('/', ApiKeyController.getAll);
router.post('/', ApiKeyController.save);
router.delete('/:provider', ApiKeyController.delete);
router.get('/:provider/validate', ApiKeyController.validate);

export default router;
