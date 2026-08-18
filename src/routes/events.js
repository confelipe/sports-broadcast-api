import { Router } from 'express';
import { thesportsdb } from '../services/thesportsdb.js';
import { findBroadcastChannels } from '../services/tvScraper.js';
import { sendSuccess } from '../utils/helpers.js';

const router = Router();

// GET /api/events/search?name=X&season=Y&date=Z
router.get('/search', async (req, res, next) => {
  try {
    const { name, season, date } = req.query;
    const data = await thesportsdb.searchEvents(name, season, date);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
});

// GET /api/events/day/:date?sport=X&league=Y
router.get('/day/:date', async (req, res, next) => {
  try {
    const { sport, league } = req.query;
    const data = await thesportsdb.eventsDay(req.params.date, sport, league);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
});

// GET /api/events/highlights?date=X&league=Y&sport=Z
router.get('/highlights', async (req, res, next) => {
  try {
    const { date, league, sport } = req.query;
    const data = await thesportsdb.eventHighlights(date, league, sport);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
});

// GET /api/events/:id
router.get('/:id', async (req, res, next) => {
  try {
    const data = await thesportsdb.lookupEvent(req.params.id);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
});

// GET /api/events/:id/results
router.get('/:id/results', async (req, res, next) => {
  try {
    const data = await thesportsdb.lookupEventResults(req.params.id);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
});

// GET /api/events/:id/lineup
router.get('/:id/lineup', async (req, res, next) => {
  try {
    const data = await thesportsdb.lookupEventLineup(req.params.id);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
});

// GET /api/events/:id/timeline
router.get('/:id/timeline', async (req, res, next) => {
  try {
    const data = await thesportsdb.lookupEventTimeline(req.params.id);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
});

// GET /api/events/:id/stats
router.get('/:id/stats', async (req, res, next) => {
  try {
    const data = await thesportsdb.lookupEventStats(req.params.id);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
});

// GET /api/events/:id/tv
router.get('/:id/tv', async (req, res, next) => {
  try {
    const tsdbTvData = await thesportsdb.lookupEventTV(req.params.id);
    
    // Obter também o evento para usar no scraper
    const eventData = await thesportsdb.lookupEvent(req.params.id);
    
    let tvBrasil = null;
    if (eventData && eventData.events && eventData.events.length > 0) {
      const event = eventData.events[0];
      tvBrasil = await findBroadcastChannels(
        event.strHomeTeam,
        event.strAwayTeam,
        event.dateEvent,
        event.strLeague
      );
    }
    
    sendSuccess(res, {
      ...tsdbTvData,
      tvBrasil
    });
  } catch (err) {
    next(err);
  }
});

export default router;
