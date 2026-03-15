import express from 'express';
import { issueBook, returnBook, getMyIssues, getIssues } from '../controllers/issueController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, admin, getIssues).post(protect, admin, issueBook);
router.route('/myissues').get(protect, getMyIssues);
router.route('/:id/return').put(protect, admin, returnBook);

export default router;
