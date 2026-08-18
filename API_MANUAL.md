# 📖 Manual de Uso da Sports Broadcast API

Guia completo e prático com exemplos de chamadas para todos os endpoints da **Sports Broadcast API** (Node.js / Express).

---

> [!NOTE]
> ### ⚖️ Atribuição e Isenção de Responsabilidade (Disclaimer)
> - **Fonte de Dados Esportivos:** Esta API utiliza dados esportivos públicos fornecidos de forma independente por [TheSportsDB.com](https://www.thesportsdb.com).
> - **Descoberta de Transmissão:** O enriquecimento de dados de canais de TV e streaming no Brasil é realizado através de algoritmo próprio de busca web e mapeamento de direitos de transmissão.
> - **Independência:** Este projeto é independente e **não** possui vínculo, patrocínio ou afiliação oficial com TheSportsDB ou com qualquer uma das emissoras e serviços de streaming citados.

---

## 🚀 Como Iniciar o Servidor

```bash
cd /home/carlos/thesportsdb

# Instalar dependências (caso ainda não tenha instalado)
npm install

# Modo Desenvolvimento (com nodemon)
npm run dev

# Modo Produção
npm start
```

* **URL Base Padrão:** `http://localhost:3000`
* **Porta Configurável:** Via variável de ambiente `PORT` (ex: `PORT=8080 npm start`)
* **Chave TheSportsDB Customizada:** Via variável de ambiente `TSDB_API_KEY` (padrão gratuito: `3`)

---

## 📑 Sumário dos Endpoints

1. [🏆 Destaque: Transmissão de TV (Brasil)](#1--destaque-transmissão-de-tv-brasil)
2. [👥 Times (Teams)](#2--times-teams)
3. [🏅 Ligas e Competições (Leagues)](#3--ligas-e-competições-leagues)
4. [⚽ Eventos e Partidas (Events)](#4--eventos-e-partidas-events)
5. [🏃 Jogadores (Players)](#5--jogadores-players)
6. [🌍 Esportes e Países (Sports & Countries)](#6--esportes-e-países-sports--countries)

---

## 1. 🏆 Destaque: Transmissão de TV (Brasil)

Estes endpoints combinam dados de eventos com o motor de descoberta de canais para trazer onde assistir no Brasil (Globo, SporTV, Premiere, ESPN, Disney+, Paramount+, Max, CazéTV, etc.).

### 1.1 Detalhes de Transmissão de um Jogo Específico
Retorna dados da partida, canais internacionais cadastrados e canais do Brasil identificados.

* **Método:** `GET`
* **Rota:** `/api/tv/match/:eventId`

#### Exemplo cURL:
```bash
curl -s http://localhost:3000/api/tv/match/2478540 | jq
```

#### Exemplo JavaScript (fetch):
```javascript
const res = await fetch('http://localhost:3000/api/tv/match/2478540');
const data = await res.json();
console.log('Canais BR:', data.tvBrasil.channels);
```

#### Exemplo de Resposta:
```json
{
  "event": {
    "idEvent": "2478540",
    "strEvent": "Independiente Rivadavia vs Fluminense",
    "strHomeTeam": "Independiente Rivadavia",
    "strAwayTeam": "Fluminense",
    "dateEvent": "2026-08-18",
    "strTime": "22:00:00",
    "strLeague": "Copa Libertadores",
    "strThumb": "https://r2.thesportsdb.com/images/media/event/thumb/z8om7o1784729761.jpg"
  },
  "internationalTv": [],
  "tvBrasil": {
    "channels": [
      "ESPN"
    ],
    "detalheTransmissao": "Identificado em matérias recentes de transmissão",
    "direitosOficiaisCompeticao": [
      "ESPN",
      "Disney+",
      "Paramount+",
      "Globo"
    ],
    "source": "Bing Search Snippet Parser",
    "query": "\"Independiente Rivadavia\" \"Fluminense\" onde assistir canal transmissão",
    "searchUrl": "https://www.google.com/search?q=Independiente%20Rivadavia%20vs%20Fluminense%202026-08-18%20onde%20assistir%20canal%20Copa%20Libertadores&hl=pt-BR"
  }
}
```

---

### 1.2 Grade de Programação de TV Esportiva
* **Método:** `GET`
* **Rota:** `/api/tv/schedule?date=AAAA-MM-DD&sport=X&country=Y&channel=Z`

#### Exemplo cURL:
```bash
curl -s "http://localhost:3000/api/tv/schedule?date=2026-08-18" | jq
```

---

## 2. 👥 Times (Teams)

### 2.1 Buscar Time por Nome
* **Método:** `GET`
* **Rota:** `/api/teams/search?name={nome}`

```bash
curl -s "http://localhost:3000/api/teams/search?name=Fluminense" | jq
```

---

### 2.2 Próximos Jogos do Time (com Canais BR)
> ✨ **Enriquecido automaticamente:** Cada jogo retornado inclui o campo `tvBrasil` com os canais previstos para o Brasil.

* **Método:** `GET`
* **Rota:** `/api/teams/:id/events/next`

```bash
# ID 134296 = Fluminense
curl -s http://localhost:3000/api/teams/134296/events/next | jq
```

---

### 2.3 Últimos Jogos Disputados pelo Time
* **Método:** `GET`
* **Rota:** `/api/teams/:id/events/last`

```bash
curl -s http://localhost:3000/api/teams/134296/events/last | jq
```

---

### 2.4 Detalhes do Time por ID
* **Método:** `GET`
* **Rota:** `/api/teams/:id`

```bash
curl -s http://localhost:3000/api/teams/134296 | jq
```

---

### 2.5 Elenco / Jogadores do Time
* **Método:** `GET`
* **Rota:** `/api/teams/:id/players`

```bash
curl -s http://localhost:3000/api/teams/134296/players | jq
```

---

### 2.6 Equipamentos / Uniformes do Time
* **Método:** `GET`
* **Rota:** `/api/teams/:id/equipment`

```bash
curl -s http://localhost:3000/api/teams/134296/equipment | jq
```

---

## 3. 🏅 Ligas e Competições (Leagues)

### 3.1 Listar Todas as Ligas
* **Método:** `GET`
* **Rota:** `/api/leagues`

```bash
curl -s http://localhost:3000/api/leagues | jq
```

---

### 3.2 Filtrar Ligas por País e Esporte
* **Método:** `GET`
* **Rota:** `/api/leagues/search?country={país}&sport={esporte}`

```bash
curl -s "http://localhost:3000/api/leagues/search?country=Brazil&sport=Soccer" | jq
```

---

### 3.3 Tabela de Classificação
* **Método:** `GET`
* **Rota:** `/api/leagues/:id/table?season={temporada}`

```bash
# ID 4351 = Brasileirão Série A
curl -s "http://localhost:3000/api/leagues/4351/table?season=2026" | jq
```

---

### 3.4 Times Participantes de uma Liga
* **Método:** `GET`
* **Rota:** `/api/leagues/:id/teams`

```bash
# ID 4501 = Copa Libertadores
curl -s http://localhost:3000/api/leagues/4501/teams | jq
```

---

### 3.5 Próximos e Últimos Jogos da Liga
* **Próximos:** `GET /api/leagues/:id/events/next`
* **Últimos:** `GET /api/leagues/:id/events/last`
* **Temporada Completa:** `GET /api/leagues/:id/events/season/:season`

```bash
# Próximos jogos da Libertadores (ID 4501)
curl -s http://localhost:3000/api/leagues/4501/events/next | jq
```

---

## 4. ⚽ Eventos e Partidas (Events)

### 4.1 Detalhes de um Evento
* **Método:** `GET`
* **Rota:** `/api/events/:id`

```bash
curl -s http://localhost:3000/api/events/2478540 | jq
```

---

### 4.2 Escalação da Partida (Lineup)
* **Método:** `GET`
* **Rota:** `/api/events/:id/lineup`

```bash
curl -s http://localhost:3000/api/events/2478540/lineup | jq
```

---

### 4.3 Linha do Tempo / Timeline (Gols, Cartões, Substituições)
* **Método:** `GET`
* **Rota:** `/api/events/:id/timeline`

```bash
curl -s http://localhost:3000/api/events/2478540/timeline | jq
```

---

### 4.4 Estatísticas da Partida (Posse de bola, Finalizações)
* **Método:** `GET`
* **Rota:** `/api/events/:id/stats`

```bash
curl -s http://localhost:3000/api/events/2478540/stats | jq
```

---

### 4.5 Jogos de uma Data Específica
* **Método:** `GET`
* **Rota:** `/api/events/day/:date?sport=X&league=Y`

```bash
curl -s "http://localhost:3000/api/events/day/2026-08-18?sport=Soccer" | jq
```

---

## 5. 🏃 Jogadores (Players)

| Endpoint | Rota | Descrição |
|---|---|---|
| **Buscar por Nome** | `GET /api/players/search?name={nome}` | Busca perfil pelo nome |
| **Detalhes do Jogador** | `GET /api/players/:id` | Informações biográficas e fotos |
| **Títulos e Conquistas** | `GET /api/players/:id/honours` | Troféus e prêmios |
| **Times Anteriores** | `GET /api/players/:id/former-teams` | Histórico de transferências |
| **Contratos** | `GET /api/players/:id/contracts` | Contratos vigentes e passados |
| **Estatísticas** | `GET /api/players/:id/stats` | Desempenho por temporada |

#### Exemplo cURL:
```bash
curl -s "http://localhost:3000/api/players/search?name=Ganso" | jq
```

---

## 6. 🌍 Esportes e Países (Sports & Countries)

* `GET /api/sports` — Lista todos os esportes suportados.
* `GET /api/sports/countries` — Lista todos os países cadastrados.

```bash
curl -s http://localhost:3000/api/sports | jq
curl -s http://localhost:3000/api/sports/countries | jq
```

---

## 🛠️ Exemplo de Consumo em Python

```python
import requests

BASE_URL = "http://localhost:3000/api"

# 1. Buscar o Fluminense
res_team = requests.get(f"{BASE_URL}/teams/search", params={"name": "Fluminense"}).json()
team = res_team["teams"][0]
team_id = team["idTeam"]
print(f"Time: {team['strTeam']} (ID: {team_id})")

# 2. Obter próximos jogos com onde assistir
res_next = requests.get(f"{BASE_URL}/teams/{team_id}/events/next").json()
for ev in res_next.get("events", []):
    print(f"\nPartida: {ev['strEvent']}")
    print(f"Competição: {ev['strLeague']}")
    print(f"Data: {ev['dateEvent']} às {ev.get('strTimeLocal', ev['strTime'])}")
    
    tv = ev.get("tvBrasil", {})
    channels = ", ".join(tv.get("channels", [])) or "A confirmar"
    print(f"Onde Assistir no Brasil: {channels}")
```
