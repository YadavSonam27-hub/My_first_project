import express from 'express';
import { query } from 'express-validator';
import { askAgent, getHistory, getWeather } from '../controllers/weatherController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();

router.get('/weather', protect, [query('city').trim().notEmpty()], validateRequest, getWeather);
router.get('/weather/agent', protect, askAgent);
router.get('/history', protect, getHistory);

export default router;
