import express from "express";

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 10000;

const API_BASE = "https://v3.football.api-sports.io";

app.use((req, res, next) => {

  res.setHeader("Access-Control-Allow-Origin", "*");

  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");

  if (req.method === "OPTIONS") {

    return res.sendStatus(204);

  }

  next();

});

async function apiFootball(endpoint, params = {}) {

  const key = process.env.API_FOOTBALL_KEY;

  if (!key) {

    throw new Error("API_FOOTBALL_KEY is not configured");

  }

  const url = new URL(`${API_BASE}/${endpoint}`);

  for (const [name, value] of Object.entries(params)) {

    if (value !== undefined && value !== null && value !== "") {

      url.searchParams.set(name, String(value));

    }

  }

  const response = await fetch(url, {

    headers: {

      "x-apisports-key": key

    }

  });

  const data = await response.json();

  return {

    httpStatus: response.status,

    data

  };

}

app.get("/", (req, res) => {

  res.json({

    ok: true,

    service: "AI Football Data Core",

    version: "render-v1",

    apiKeyConfigured: Boolean(process.env.API_FOOTBALL_KEY)

  });

});

app.get("/health", (req, res) => {

  res.json({

    ok: true,

    service: "AI Football Data Core",

    version: "render-v1",

    apiKeyConfigured: Boolean(process.env.API_FOOTBALL_KEY)

  });

});

app.get("/fixtures", async (req, res) => {

  try {

    const result = await apiFootball("fixtures", req.query);

    res.status(result.httpStatus).json({

      ok: !result.data?.errors ||

        Object.keys(result.data.errors).length === 0,

      ...result.data

    });

  } catch (error) {

    res.status(500).json({

      ok: false,

      error: error.message

    });

  }

});

app.get("/standings", async (req, res) => {

  try {

    const result = await apiFootball("standings", req.query);

    res.status(result.httpStatus).json({

      ok: true,

      ...result.data

    });

  } catch (error) {

    res.status(500).json({ ok: false, error: error.message });

  }

});

app.get("/injuries", async (req, res) => {

  try {

    const result = await apiFootball("injuries", req.query);

    res.status(result.httpStatus).json({

      ok: true,

      ...result.data

    });

  } catch (error) {

    res.status(500).json({ ok: false, error: error.message });

  }

});

app.get("/lineups", async (req, res) => {

  try {

    const result = await apiFootball("fixtures/lineups", req.query);

    res.status(result.httpStatus).json({

      ok: true,

      ...result.data

    });

  } catch (error) {

    res.status(500).json({ ok: false, error: error.message });

  }

});
app.get("/test-j1", async (req, res) => {
  try {
    const result = await apiFootball("fixtures", {
      league: 98,
      season: 2024
      
    });

    res.status(result.httpStatus).json({
      ok: !result.data?.errors ||
        Object.keys(result.data.errors).length === 0,
      ...result.data
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message
    });
  }
});
app.get("/test-j1-standings", async (req, res) => {

  try {

    const result = await apiFootball("standings", {

      league: 98,

      season: 2024

    });

    res.status(result.httpStatus).json({

      ok: !result.data?.errors ||

        Object.keys(result.data.errors).length === 0,

      ...result.data

    });

  } catch (error) {

    res.status(500).json({

      ok: false,

      error: error.message

    });

  }

});
app.get("/fixtures/statistics", async (req, res) => {
  try {
    const result = await apiFootball("fixtures/statistics", req.query);

    res.status(result.httpStatus).json({
      ok:
        !result.data?.errors ||
        Object.keys(result.data.errors).length === 0,
      ...result.data
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message
    });
  }
});
app.get("/teams/statistics", async (req, res) => {

  try {

    const result = await apiFootball("teams/statistics", req.query);

    res.status(result.httpStatus).json({

      ok: !result.data?.errors ||

        Object.keys(result.data.errors).length === 0,

      ...result.data

    });

  } catch (error) {

    res.status(500).json({

      ok: false,

      error: error.message

    });

  }

});
app.get("/odds", async (req, res) => {

  try {

    const params = {};

    if (req.query.fixture) params.fixture = req.query.fixture;

    if (req.query.league) params.league = req.query.league;

    if (req.query.season) params.season = req.query.season;

    if (req.query.date) params.date = req.query.date;

    if (req.query.bookmaker) params.bookmaker = req.query.bookmaker;

    if (req.query.bet) params.bet = req.query.bet;

    if (req.query.page) params.page = req.query.page;

    if (!params.fixture && !(params.league && params.season)) {

      return res.status(400).json({

        ok: false,

        error: "fixture or league+season is required"

      });

    }

    const result = await apiFootball("/odds", params);

    res.status(result.httpStatus).json({

      ok:

        !result.data?.errors ||

        Object.keys(result.data.errors).length === 0,

      ...result.data

    });

  } catch (error) {

    res.status(500).json({

      ok: false,

      error: error.message

    });

  }

});
app.get("/odds2/sports", async (req, res) => {

  try {

    const apiKey = process.env.THE_ODDS_API_KEY;

    if (!apiKey) {

      return res.status(500).json({

        ok: false,

        error: "THE_ODDS_API_KEY is not configured"

      });

    }

    const url =

      "https://api.the-odds-api.com/v4/sports/?apiKey=" +

      encodeURIComponent(apiKey);

    const response = await fetch(url);

    const data = await response.json();

    res.status(response.status).json({

      ok: response.ok,

      httpStatus: response.status,

      sports: Array.isArray(data) ? data : undefined,

      error: Array.isArray(data) ? undefined : data

    });

  } catch (error) {

    res.status(500).json({

      ok: false,

      error: error.message

    });

  }

});
app.get("/odds2/odds", async (req, res) => {

  try {

    const apiKey = process.env.THE_ODDS_API_KEY;

    if (!apiKey) {

      return res.status(500).json({

        ok: false,

        error: "THE_ODDS_API_KEY is not configured"

      });

    }

    const sport = req.query.sport;

    if (!sport) {

      return res.status(400).json({

        ok: false,

        error: "sport is required"

      });

    }

    const regions = req.query.regions || "eu";

    const markets = req.query.markets || "h2h";

    const oddsFormat = req.query.oddsFormat || "decimal";

    const url =

      `https://api.the-odds-api.com/v4/sports/${encodeURIComponent(sport)}/odds/` +

      `?apiKey=${encodeURIComponent(apiKey)}` +

      `&regions=${encodeURIComponent(regions)}` +

      `&markets=${encodeURIComponent(markets)}` +

      `&oddsFormat=${encodeURIComponent(oddsFormat)}`;

    const response = await fetch(url);

    const data = await response.json();

    res.status(response.status).json({

      ok: response.ok,

      httpStatus: response.status,

      sport,

      events: Array.isArray(data) ? data : undefined,

      error: Array.isArray(data) ? undefined : data

    });

  } catch (error) {

    res.status(500).json({

      ok: false,

      error: error.message

    });

  }

});
app.listen(PORT, "0.0.0.0", () => {

  console.log(`AI Football Data Core running on port ${PORT}`);

});
