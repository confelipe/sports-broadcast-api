import { Router } from 'express';
import { thesportsdb } from '../services/thesportsdb.js';
import { findBroadcastChannels } from '../services/tvScraper.js';
import { sendSuccess } from '../utils/helpers.js';

const router = Router();

// GET /api/teams/search?name=X
router.get('/search', async (req, res, next) => {
  try {
    const data = await thesportsdb.searchTeams(req.query.name);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
});

// GET /api/teams/:id
router.get('/:id', async (req, res, next) => {
  try {
    const data = await thesportsdb.lookupTeam(req.params.id);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
});

// GET /api/teams/:id/players
router.get('/:id/players', async (req, res, next) => {
  try {
    const data = await thesportsdb.listPlayers(req.params.id);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
});

// GET /api/teams/:id/equipment
router.get('/:id/equipment', async (req, res, next) => {
  try {
    const data = await thesportsdb.lookupEquipment(req.params.id);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
});

// GET /api/teams/:id/events/next
router.get('/:id/events/next', async (req, res, next) => {
  try {
    const data = await thesportsdb.nextTeamEvents(req.params.id);
    
    if (data && data.events) {
      // Enriquecer com dados de TV para cada evento
      const enrichedEvents = await Promise.all(data.events.map(async (event) => {
        const tvData = await findBroadcastChannels(
          event.strHomeTeam,
          event.strAwayTeam,
          event.dateEvent,
          event.strLeague
        );
        return {
          ...event,
          tvBrasil: tvData
        };
      }));
      data.events = enrichedEvents;
    }
    
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
});

// GET /api/teams/:id/events/last
router.get('/:id/events/last', async (req, res, next) => {
  try {
    const data = await thesportsdb.lastTeamEvents(req.params.id);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
});

export default router;
