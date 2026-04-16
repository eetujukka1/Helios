import { Router } from 'express';
import { authenticateWorker } from '../controllers/workerAuthController.js';

const router = Router();

router.post('/login', authenticateWorker);

export default router;