import { Router } from 'express';
import { thesportsdb } from '../services/thesportsdb.js';
import { sendSuccess } from '../utils/helpers.js';

const router = Router();

// GET /api/players/search?name=X
router.get('/search', async (req, res, next) => {
  try {
    const data = await thesportsdb.searchPlayers(req.query.name);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
});

// GET /api/players/:id
router.get('/:id', async (req, res, next) => {
  try {
    const data = await thesportsdb.lookupPlayer(req.params.id);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
});

// GET /api/players/:id/honours
router.get('/:id/honours', async (req, res, next) => {
  try {
    const data = await thesportsdb.lookupHonours(req.params.id);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
});

// GET /api/players/:id/former-teams
router.get('/:id/former-teams', async (req, res, next) => {
  try {
    const data = await thesportsdb.lookupFormerTeams(req.params.id);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
});

// GET /api/players/:id/milestones
router.get('/:id/milestones', async (req, res, next) => {
  try {
    const data = await thesportsdb.lookupMilestones(req.params.id);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
});

// GET /api/players/:id/contracts
router.get('/:id/contracts', async (req, res, next) => {
  try {
    const data = await thesportsdb.lookupContracts(req.params.id);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
});

// GET /api/players/:id/stats
router.get('/:id/stats', async (req, res, next) => {
  try {
    const data = await thesportsdb.lookupPlayerStats(req.params.id);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
});

export default router;
