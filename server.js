niimport express from "express";

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
app.listen(PORT, "0.0.0.0", () => {

  console.log(`AI Football Data Core running on port ${PORT}`);

});
