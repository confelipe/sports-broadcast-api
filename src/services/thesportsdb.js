
const API_KEY = process.env.TSDB_API_KEY || '3';
const BASE_URL = `https://www.thesportsdb.com/api/v1/json/${API_KEY}`;

/**
 * Realiza uma requisição para a API do TheSportsDB
 * @param {string} endpoint - O endpoint da API (ex: searchteams.php?t=Arsenal)
 * @returns {Promise<Object|null>}
 */
async function fetchFromAPI(endpoint) {
  try {
    const url = `${BASE_URL}/${endpoint}`;
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Erro ao buscar dados do TheSportsDB (${endpoint}):`, error.message);
    return null;
  }
}

export const thesportsdb = {
  searchTeams: (name) => fetchFromAPI(`searchteams.php?t=${encodeURIComponent(name)}`),
  searchPlayers: (name) => fetchFromAPI(`searchplayers.php?p=${encodeURIComponent(name)}`),
  searchEvents: (name, season, date) => {
    let url = `searchevents.php?e=${encodeURIComponent(name)}`;
    if (season) url += `&s=${encodeURIComponent(season)}`;
    // date doesn't seem natively supported in searchevents.php by docs, but we can append it if requested
    return fetchFromAPI(url);
  },
  searchVenues: (name) => fetchFromAPI(`searchvenues.php?v=${encodeURIComponent(name)}`),
  
  lookupLeague: (id) => fetchFromAPI(`lookupleague.php?id=${encodeURIComponent(id)}`),
  lookupTeam: (id) => fetchFromAPI(`lookupteam.php?id=${encodeURIComponent(id)}`),
  lookupPlayer: (id) => fetchFromAPI(`lookupplayer.php?id=${encodeURIComponent(id)}`),
  lookupEvent: (id) => fetchFromAPI(`lookupevent.php?id=${encodeURIComponent(id)}`),
  lookupVenue: (id) => fetchFromAPI(`lookupvenue.php?id=${encodeURIComponent(id)}`),
  lookupTable: (leagueId, season) => {
    let url = `lookuptable.php?l=${encodeURIComponent(leagueId)}`;
    if (season) url += `&s=${encodeURIComponent(season)}`;
    return fetchFromAPI(url);
  },
  lookupEquipment: (teamId) => fetchFromAPI(`lookupequipment.php?id=${encodeURIComponent(teamId)}`),
  lookupHonours: (playerId) => fetchFromAPI(`lookuphonours.php?id=${encodeURIComponent(playerId)}`),
  lookupFormerTeams: (playerId) => fetchFromAPI(`lookupformerteams.php?id=${encodeURIComponent(playerId)}`),
  lookupMilestones: (playerId) => fetchFromAPI(`lookupmilestones.php?id=${encodeURIComponent(playerId)}`),
  lookupContracts: (playerId) => fetchFromAPI(`lookupcontracts.php?id=${encodeURIComponent(playerId)}`),
  lookupPlayerStats: (playerId) => fetchFromAPI(`lookupplayerstats.php?id=${encodeURIComponent(playerId)}`),
  lookupEventResults: (eventId) => fetchFromAPI(`eventresults.php?id=${encodeURIComponent(eventId)}`),
  lookupEventLineup: (eventId) => fetchFromAPI(`lookuplineup.php?id=${encodeURIComponent(eventId)}`),
  lookupEventTimeline: (eventId) => fetchFromAPI(`lookuptimeline.php?id=${encodeURIComponent(eventId)}`),
  lookupEventStats: (eventId) => fetchFromAPI(`lookupeventstats.php?id=${encodeURIComponent(eventId)}`),
  lookupEventTV: (eventId) => fetchFromAPI(`lookuptv.php?id=${encodeURIComponent(eventId)}`),
  
  allSports: () => fetchFromAPI('all_sports.php'),
  allCountries: () => fetchFromAPI('all_countries.php'),
  allLeagues: () => fetchFromAPI('all_leagues.php'),
  
  listLeagues: (country, sport) => {
    let url = `search_all_leagues.php?`;
    if (country) url += `c=${encodeURIComponent(country)}&`;
    if (sport) url += `s=${encodeURIComponent(sport)}`;
    return fetchFromAPI(url);
  },
  listSeasons: (leagueId) => fetchFromAPI(`search_all_seasons.php?id=${encodeURIComponent(leagueId)}`),
  listTeams: (league) => fetchFromAPI(`search_all_teams.php?l=${encodeURIComponent(league)}`),
  listTeamsBySportCountry: (sport, country) => fetchFromAPI(`search_all_teams.php?s=${encodeURIComponent(sport)}&c=${encodeURIComponent(country)}`),
  listPlayers: (teamId) => fetchFromAPI(`lookup_all_players.php?id=${encodeURIComponent(teamId)}`),
  
  nextTeamEvents: (teamId) => fetchFromAPI(`eventsnext.php?id=${encodeURIComponent(teamId)}`),
  lastTeamEvents: (teamId) => fetchFromAPI(`eventslast.php?id=${encodeURIComponent(teamId)}`),
  nextLeagueEvents: (leagueId) => fetchFromAPI(`eventsnextleague.php?id=${encodeURIComponent(leagueId)}`),
  lastLeagueEvents: (leagueId) => fetchFromAPI(`eventspastleague.php?id=${encodeURIComponent(leagueId)}`),
  
  eventsDay: (date, sport, league) => {
    let url = `eventsday.php?d=${encodeURIComponent(date)}`;
    if (sport) url += `&s=${encodeURIComponent(sport)}`;
    if (league) url += `&l=${encodeURIComponent(league)}`;
    return fetchFromAPI(url);
  },
  eventsSeason: (leagueId, season) => fetchFromAPI(`eventsseason.php?id=${encodeURIComponent(leagueId)}&s=${encodeURIComponent(season)}`),
  eventsTV: (date, sport, country, channel) => {
    let url = `eventstv.php?d=${encodeURIComponent(date)}`;
    if (sport) url += `&s=${encodeURIComponent(sport)}`;
    if (country) url += `&a=${encodeURIComponent(country)}`;
    if (channel) url += `&c=${encodeURIComponent(channel)}`;
    return fetchFromAPI(url);
  },
  eventHighlights: (date, leagueId, sport) => {
    let url = 'eventshighlights.php?';
    if (date) url += `d=${encodeURIComponent(date)}&`;
    if (leagueId) url += `l=${encodeURIComponent(leagueId)}&`;
    if (sport) url += `s=${encodeURIComponent(sport)}`;
    return fetchFromAPI(url);
  }
};
