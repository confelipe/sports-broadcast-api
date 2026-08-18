import * as cheerio from 'cheerio';

/**
 * Mapeamento oficial de direitos de transmissão no Brasil por competição
 */
export const COMPETITION_RIGHTS_BR = {
  'copa libertadores': ['ESPN', 'Disney+', 'Paramount+', 'Globo'],
  'copa sudamericana': ['ESPN', 'Disney+', 'Paramount+', 'SBT'],
  'copa sul-americana': ['ESPN', 'Disney+', 'Paramount+', 'SBT'],
  'brazilian serie a': ['Globo', 'SporTV', 'Premiere', 'CazéTV'],
  'brasileirao': ['Globo', 'SporTV', 'Premiere', 'CazéTV'],
  'copa do brasil': ['Globo', 'SporTV', 'Premiere', 'Amazon Prime'],
  'uefa champions league': ['TNT Sports', 'Space', 'Max', 'SBT'],
  'english premier league': ['ESPN', 'Disney+'],
  'premier league': ['ESPN', 'Disney+'],
  'spanish la liga': ['ESPN', 'Disney+'],
  'la liga': ['ESPN', 'Disney+'],
  'italian serie a': ['ESPN', 'Disney+'],
  'german bundesliga': ['CazéTV', 'SporTV', 'RedeTV', 'Canal GOAT'],
  'french ligue 1': ['CazéTV']
};

/**
 * Definição rigorosa de canais e padrões de regex contextuais
 */
const CHANNEL_DEFINITIONS = [
  { name: 'Globo', regex: /\b(TV\s*Globo|Rede\s*Globo|Globo\s*Play|Globoplay|na\s*Globo|pela\s*Globo)\b/i },
  { name: 'SporTV', regex: /\b(SporTV|Sportv\s*[1-3]?)\b/i },
  { name: 'Premiere', regex: /\b(Premiere|PFC)\b/i },
  { name: 'ESPN', regex: /\b(ESPN|ESPN\s*[1-4]?|ESPN\s*Brasil)\b/i },
  { name: 'Disney+', regex: /\b(Disney\+|Disney\s*Plus|Star\+)\b/i },
  { name: 'Paramount+', regex: /\b(Paramount\+|Paramount\s*Plus)\b/i },
  { name: 'Amazon Prime', regex: /\b(Amazon\s*Prime|Prime\s*Video)\b/i },
  { name: 'CazéTV', regex: /\b(CazéTV|Caze\s*TV|Cazé\s*TV)\b/i },
  { name: 'SBT', regex: /\b(SBT|pelo\s*SBT|no\s*SBT)\b/i },
  { name: 'Record', regex: /\b(TV\s*Record|Rede\s*Record|na\s*Record|pela\s*Record|Record\s*News)\b/i },
  { name: 'Band', regex: /\b(Band|Rede\s*Band|BandSports|Band\s*Sports)\b/i },
  { name: 'TNT Sports', regex: /\b(TNT\s*Sports|TNT)\b/i },
  { name: 'Max', regex: /\b(HBO\s*Max|streaming\s*Max|plataforma\s*Max|na\s*Max|pela\s*Max)\b/i },
  { name: 'DAZN', regex: /\bDAZN\b/i },
  { name: 'Canal GOAT', regex: /\b(Canal\s*GOAT|GOAT)\b/i }
];

/**
 * Busca canais de transmissão usando múltiplos mecanismos e fallback inteligente
 * @param {string} homeTeam - Time mandante
 * @param {string} awayTeam - Time visitante
 * @param {string} date - Data do jogo
 * @param {string} competition - Competição (liga)
 * @param {string} country - País (padrão: Brasil)
 * @returns {Promise<Object>}
 */
export async function findBroadcastChannels(homeTeam, awayTeam, date, competition = '', country = 'Brasil') {
  const query = `"${homeTeam}" "${awayTeam}" onde assistir canal transmissão`;
  const searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(query)}&setlang=pt-br`;
  
  try {
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'pt-BR,pt;q=0.9'
      }
    });
    
    let foundChannels = new Set();
    
    if (response.ok) {
      const html = await response.text();
      const $ = cheerio.load(html);
      
      // Remove scripts, styles e tags que contêm código/CSS (como Math.max)
      $('script, style, noscript, svg, nav, header, footer, head').remove();
      
      // Extrai texto dos títulos e descrições dos resultados
      let snippetText = '';
      $('li.b_algo, .b_algoText, .b_caption, p, h2, h3').each((i, el) => {
        snippetText += ' ' + $(el).text();
      });
      
      snippetText = snippetText.replace(/\s+/g, ' ');
      
      // Procura com expressões regulares contextuais
      CHANNEL_DEFINITIONS.forEach(def => {
        if (def.regex.test(snippetText)) {
          foundChannels.add(def.name);
        }
      });
    }
    
    // Obter detentores oficiais dos direitos da competição como referência
    const compLower = (competition || '').toLowerCase().trim();
    let competitionOfficialChannels = [];
    for (const [compKey, channels] of Object.entries(COMPETITION_RIGHTS_BR)) {
      if (compLower.includes(compKey) || compKey.includes(compLower)) {
        competitionOfficialChannels = channels;
        break;
      }
    }
    
    const channelsList = Array.from(foundChannels);
    
    return {
      channels: channelsList.length > 0 ? channelsList : competitionOfficialChannels,
      detalheTransmissao: channelsList.length > 0 
        ? 'Identificado em matérias recentes de transmissão' 
        : (competitionOfficialChannels.length > 0 
            ? 'Detentores oficiais dos direitos de transmissão deste torneio no Brasil' 
            : 'Consulte o link da busca para a grade do dia'),
      direitosOficiaisCompeticao: competitionOfficialChannels,
      source: channelsList.length > 0 ? 'Bing Search Snippet Parser' : 'Detentores Oficiais da Competição (Brasil)',
      query: query,
      searchUrl: `https://www.google.com/search?q=${encodeURIComponent(`${homeTeam} vs ${awayTeam} ${date} onde assistir canal ${competition}`)}&hl=pt-BR`
    };
  } catch (error) {
    console.error('Erro ao buscar canais de TV:', error.message);
    return fallbackTvData(homeTeam, awayTeam, date, competition);
  }
}

/**
 * Retorna dados de fallback caso a busca web falhe
 */
export function fallbackTvData(homeTeam, awayTeam, date, competition) {
  const compLower = (competition || '').toLowerCase().trim();
  let competitionOfficialChannels = [];
  for (const [compKey, channels] of Object.entries(COMPETITION_RIGHTS_BR)) {
    if (compLower.includes(compKey) || compKey.includes(compLower)) {
      competitionOfficialChannels = channels;
      break;
    }
  }

  const query = `${homeTeam} vs ${awayTeam} ${date} onde assistir canal ${competition}`;
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&hl=pt-BR`;
  
  return {
    channels: competitionOfficialChannels,
    detalheTransmissao: 'Detentores oficiais dos direitos de transmissão deste torneio no Brasil',
    direitosOficiaisCompeticao: competitionOfficialChannels,
    source: 'Detentores Oficiais da Competição (Brasil)',
    query: query,
    searchUrl: searchUrl
  };
}
