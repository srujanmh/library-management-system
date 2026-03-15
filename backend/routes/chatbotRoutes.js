import express from 'express';
import { handleChatQuery } from '../controllers/chatbotController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, handleChatQuery);

export default router;
