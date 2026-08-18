import { Router } from 'express';
import { thesportsdb } from '../services/thesportsdb.js';
import { sendSuccess } from '../utils/helpers.js';

const router = Router();

// GET /api/sports
router.get('/', async (req, res, next) => {
  try {
    const data = await thesportsdb.allSports();
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
});

// GET /api/countries (Adding to sports router for simplicity or could be separate, but let's keep it here or as requested)
router.get('/countries', async (req, res, next) => {
  try {
    const data = await thesportsdb.allCountries();
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
});

export default router;
