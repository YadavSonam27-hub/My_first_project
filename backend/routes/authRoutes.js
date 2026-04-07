import express from 'express';
import { body } from 'express-validator';
import { login, me, signup } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();

router.post(
  '/signup',
  [body('name').trim().notEmpty(), body('email').isEmail(), body('password').isLength({ min: 6 })],
  validateRequest,
  signup
);

router.post('/login', [body('email').isEmail(), body('password').notEmpty()], validateRequest, login);
router.get('/me', protect, me);

export default router;
