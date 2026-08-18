import { Router } from 'express';
import { thesportsdb } from '../services/thesportsdb.js';
import { findBroadcastChannels } from '../services/tvScraper.js';
import { sendSuccess } from '../utils/helpers.js';

const router = Router();

// GET /api/tv/schedule?date=X&sport=Y&country=Z&channel=W
router.get('/schedule', async (req, res, next) => {
  try {
    const { date, sport, country, channel } = req.query;
    const data = await thesportsdb.eventsTV(date, sport, country, channel);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
});

// GET /api/tv/match/:eventId
router.get('/match/:eventId', async (req, res, next) => {
  try {
    const eventId = req.params.eventId;
    
    // 1. Obter detalhes do evento
    const eventData = await thesportsdb.lookupEvent(eventId);
    if (!eventData || !eventData.events || eventData.events.length === 0) {
      return res.status(404).json({ error: { message: 'Evento não encontrado', status: 404 } });
    }
    
    const event = eventData.events[0];
    
    // 2. Obter canais de TV internacionais da TheSportsDB
    const internationalTv = await thesportsdb.lookupEventTV(eventId);
    
    // 3. Obter canais de TV brasileiros via web scraping
    const tvBrasil = await findBroadcastChannels(
      event.strHomeTeam,
      event.strAwayTeam,
      event.dateEvent,
      event.strLeague
    );
    
    // 4. Combinar tudo
    const combinedData = {
      event: {
        idEvent: event.idEvent,
        strEvent: event.strEvent,
        strHomeTeam: event.strHomeTeam,
        strAwayTeam: event.strAwayTeam,
        dateEvent: event.dateEvent,
        strTime: event.strTime,
        strLeague: event.strLeague,
        strThumb: event.strThumb
      },
      internationalTv: internationalTv && internationalTv.tvevents ? internationalTv.tvevents : [],
      tvBrasil: tvBrasil
    };
    
    sendSuccess(res, combinedData);
  } catch (err) {
    next(err);
  }
});

export default router;
