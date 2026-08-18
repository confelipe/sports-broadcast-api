// Polyfill para compatibilidade do Cheerio/Undici com Node.js 18
if (typeof globalThis.File === 'undefined') {
  globalThis.File = class File {};
}

import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler.js';
import { cache } from './middleware/cache.js';
import { rateLimiter } from './middleware/rateLimiter.js';

// Importando rotas
import sportsRoutes from './routes/sports.js';
import leaguesRoutes from './routes/leagues.js';
import teamsRoutes from './routes/teams.js';
import playersRoutes from './routes/players.js';
import eventsRoutes from './routes/events.js';
import tvRoutes from './routes/tv.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globais
app.use(cors());
app.use(express.json());
app.use(rateLimiter);

// Documentação simples na raiz
app.get('/', (req, res) => {
  res.json({
    message: 'Bem-vindo à API TheSportsDB + TV Broadcast',
    version: '1.0.0',
    endpoints: {
      sports: '/api/sports',
      countries: '/api/sports/countries',
      leagues: {
        all: '/api/leagues',
        search: '/api/leagues/search?country=X&sport=Y',
        details: '/api/leagues/:id',
        table: '/api/leagues/:id/table?season=X',
        seasons: '/api/leagues/:id/seasons',
        teams: '/api/leagues/:id/teams',
        nextEvents: '/api/leagues/:id/events/next',
        lastEvents: '/api/leagues/:id/events/last',
        seasonEvents: '/api/leagues/:id/events/season/:season'
      },
      teams: {
        search: '/api/teams/search?name=X',
        details: '/api/teams/:id',
        players: '/api/teams/:id/players',
        equipment: '/api/teams/:id/equipment',
        nextEvents: '/api/teams/:id/events/next',
        lastEvents: '/api/teams/:id/events/last'
      },
      players: {
        search: '/api/players/search?name=X',
        details: '/api/players/:id',
        honours: '/api/players/:id/honours',
        formerTeams: '/api/players/:id/former-teams',
        milestones: '/api/players/:id/milestones',
        contracts: '/api/players/:id/contracts',
        stats: '/api/players/:id/stats'
      },
      events: {
        search: '/api/events/search?name=X&season=Y&date=Z',
        day: '/api/events/day/:date?sport=X&league=Y',
        highlights: '/api/events/highlights?date=X&league=Y&sport=Z',
        details: '/api/events/:id',
        results: '/api/events/:id/results',
        lineup: '/api/events/:id/lineup',
        timeline: '/api/events/:id/timeline',
        stats: '/api/events/:id/stats',
        tv: '/api/events/:id/tv'
      },
      tv: {
        schedule: '/api/tv/schedule?date=X&sport=Y&country=Z&channel=W',
        matchDetails: '/api/tv/match/:eventId'
      }
    }
  });
});

// Cache global para as rotas /api
app.use('/api', cache);

// Montando as rotas
app.use('/api/sports', sportsRoutes);
app.use('/api/leagues', leaguesRoutes);
app.use('/api/teams', teamsRoutes);
app.use('/api/players', playersRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/tv', tvRoutes);

// Tratamento de rotas não encontradas
app.use((req, res, next) => {
  const error = new Error('Rota não encontrada');
  error.status = 404;
  next(error);
});

// Middleware de erros global
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`\x1b[32m[Servidor]\x1b[0m Iniciado na porta \x1b[36m${PORT}\x1b[0m`);
  console.log(`\x1b[33m[Acesso]\x1b[0m http://localhost:${PORT}`);
  console.log(`\x1b[35m[Info]\x1b[0m Rotas mapeadas sob /api`);
});
