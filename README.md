# ⚽ Sports Broadcast API

API REST construída em **Node.js (Express)** para consulta unificada de eventos esportivos, times, ligas, jogadores e descoberta de **canais de transmissão de TV e streaming no Brasil**.

---

## ⚖️ Atribuição e Isenção de Responsabilidade (Disclaimer)

- **Dados Esportivos:** Esta aplicação consome dados esportivos públicos fornecidos pelo serviço independente [TheSportsDB.com](https://www.thesportsdb.com).
- **Transmissão no Brasil:** O enriquecimento com canais de TV e streaming (Globo, SporTV, Premiere, ESPN, Disney+, Paramount+, Max, CazéTV, etc.) utiliza algoritmo próprio de descoberta web e mapeamento de direitos de exibição no Brasil.
- **Aviso Legal:** A **Sports Broadcast API** é um projeto independente de código aberto e **não possui afiliação, parceria, patrocínio ou endosso oficial** de TheSportsDB ou de qualquer emissora/serviço de streaming mencionado.

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- Node.js 18+

### Instalação e Execução
```bash
# 1. Instalar dependências
npm install

# 2. Executar em desenvolvimento
npm run dev

# 3. Executar em produção
npm start
```

Acesse em: `http://localhost:3000`

---

## 📡 Principais Endpoints

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/` | Catálogo de rotas e metadados |
| `GET` | `/api/tv/match/:eventId` | Transmissão de um jogo específico (Canais BR e Globais) |
| `GET` | `/api/teams/:id/events/next` | Próximos jogos do time com canais de transmissão |
| `GET` | `/api/teams/search?name={nome}` | Busca de times |
| `GET` | `/api/leagues/:id/table?season={ano}` | Classificação da liga |
| `GET` | `/api/events/:id/lineup` | Escalações da partida |
| `GET` | `/api/players/search?name={nome}` | Busca de jogadores |

Consulte o [**API_MANUAL.md**](./API_MANUAL.md) para a documentação detalhada com exemplos em cURL, JavaScript e Python.

---

## 🐳 Docker

```bash
# Construir imagem
docker build -t sports-broadcast-api .

# Rodar container
docker run -d -p 3000:3000 --name sports-api sports-broadcast-api
```

---

## 📄 Licença

MIT License.
