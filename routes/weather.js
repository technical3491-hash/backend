import express from 'express';

const router = express.Router();
import { getWeather } from '../controllers/weather.js';

router.get('/:city', getWeather);

export default router;