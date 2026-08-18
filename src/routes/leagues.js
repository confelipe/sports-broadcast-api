import { Router } from 'express';
import { thesportsdb } from '../services/thesportsdb.js';
import { sendSuccess } from '../utils/helpers.js';

const router = Router();

// GET /api/leagues
router.get('/', async (req, res, next) => {
  try {
    const data = await thesportsdb.allLeagues();
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
});

// GET /api/leagues/search?country=X&sport=Y
router.get('/search', async (req, res, next) => {
  try {
    const { country, sport } = req.query;
    const data = await thesportsdb.listLeagues(country, sport);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
});

// GET /api/leagues/:id
router.get('/:id', async (req, res, next) => {
  try {
    const data = await thesportsdb.lookupLeague(req.params.id);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
});

// GET /api/leagues/:id/table?season=X
router.get('/:id/table', async (req, res, next) => {
  try {
    const data = await thesportsdb.lookupTable(req.params.id, req.query.season);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
});

// GET /api/leagues/:id/seasons
router.get('/:id/seasons', async (req, res, next) => {
  try {
    const data = await thesportsdb.listSeasons(req.params.id);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
});

// GET /api/leagues/:id/teams
router.get('/:id/teams', async (req, res, next) => {
  try {
    // lookupLeague first to get league name since search_all_teams requires league name
    const leagueData = await thesportsdb.lookupLeague(req.params.id);
    if (!leagueData || !leagueData.leagues || !leagueData.leagues.length) {
      return res.status(404).json({ error: { message: 'Liga não encontrada.', status: 404 }});
    }
    const leagueName = leagueData.leagues[0].strLeague;
    const data = await thesportsdb.listTeams(leagueName);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
});

// GET /api/leagues/:id/events/next
router.get('/:id/events/next', async (req, res, next) => {
  try {
    const data = await thesportsdb.nextLeagueEvents(req.params.id);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
});

// GET /api/leagues/:id/events/last
router.get('/:id/events/last', async (req, res, next) => {
  try {
    const data = await thesportsdb.lastLeagueEvents(req.params.id);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
});

// GET /api/leagues/:id/events/season/:season
router.get('/:id/events/season/:season', async (req, res, next) => {
  try {
    const data = await thesportsdb.eventsSeason(req.params.id, req.params.season);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
});

export default router;
