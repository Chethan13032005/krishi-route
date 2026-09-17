const express = require("express");
const https = require("https");
const path = require("path");
const fs = require("fs/promises");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

const DATA_DIR = path.join(__dirname, "data");
const MARKETS_FILE = path.join(DATA_DIR, "mandis.json");
const PRICES_FILE = path.join(DATA_DIR, "prices.json");
const PRICE_FEED_URL = process.env.MARKET_PRICE_FEED_URL || "";

const vehicleRates = {
  tata_ace: 40,
  tractor: 35,
  truck: 60,
  mini_truck: 45,
};

const toRadians = (deg) => (deg * Math.PI) / 180;
const haversineDistanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

const requestJson = (url) => new Promise((resolve, reject) => {
  https.get(url, (res) => {
    let data = "";
    res.on("data", (chunk) => data += chunk);
    res.on("end", () => {
      try { resolve(JSON.parse(data)); } catch (error) { reject(error); }
    });
  }).on("error", reject);
});

const getRouteFromOSRM = async (start, end) => {
  const url = `https://router.project-osrm.org/route/v1/driving/${start.lon},${start.lat};${end.lon},${end.lat}?overview=full&geometries=geojson`;
  const response = await requestJson(url);
  const route = response?.routes?.[0];
  if (!route) return null;
  return {
    distanceKm: route.distance / 1000,
    durationMinutes: route.duration / 60,
    geometry: route.geometry?.coordinates || [],
  };
};

const normalizeQuantity = (quantity, unit) => (unit === "quintal" ? quantity / 10 : quantity);

const readJsonFile = async (filePath, fallbackValue) => {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8"));
  } catch {
    return fallbackValue;
  }
};

const fetchJson = async (url) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error(`Price feed request failed with status ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
};

const loadMandis = async () => {
  const mandis = await readJsonFile(MARKETS_FILE, []);
  return Array.isArray(mandis) ? mandis : [];
};

const loadPriceSnapshot = async () => {
  if (PRICE_FEED_URL) {
    try { return await fetchJson(PRICE_FEED_URL); } catch {}
  }
  return readJsonFile(PRICES_FILE, { updated_at: null, markets: {} });
};

const mergeMarketPrices = (mandis, priceSnapshot) => {
  const marketPriceMap = priceSnapshot?.markets || {};
  return mandis.map((market) => ({
    ...market,
    prices: marketPriceMap[market.id] || {},
    price_updated_at: priceSnapshot?.updated_at || null,
  }));
};

const getDynamicMarkets = async () => {
  const [mandis, priceSnapshot] = await Promise.all([loadMandis(), loadPriceSnapshot()]);
  return mergeMarketPrices(mandis, priceSnapshot);
};

app.post("/calculate-profit", async (req, res) => {
  const {
    crop,
    quantity,
    quantity_unit,
    vehicle_type,
    user_lat,
    user_lon,
    loading_cost = 0,
    unloading_cost = 0,
    handling_cost = 0,
  } = req.body;

  if (!crop || quantity === undefined || !quantity_unit || !vehicle_type || user_lat === undefined || user_lon === undefined) {
    return res.status(400).json({ error: "Missing required fields. Required: crop, quantity, quantity_unit, vehicle_type, user_lat, user_lon" });
  }

  const quantityValue = Number(quantity);
  const lat = Number(user_lat);
  const lon = Number(user_lon);
  const rate = vehicleRates[vehicle_type];
  const loadCost = Number(loading_cost) || 0;
  const unloadCost = Number(unloading_cost) || 0;
  const handleCost = Number(handling_cost) || 0;

  if (!Number.isFinite(quantityValue) || quantityValue <= 0) {
    return res.status(400).json({ error: "quantity must be a positive number" });
  }
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return res.status(400).json({ error: "user_lat and user_lon must be valid numbers" });
  }
  if (!rate) {
    return res.status(400).json({ error: "Unsupported vehicle_type" });
  }

  const normalizedQuantityTons = normalizeQuantity(quantityValue, quantity_unit);
  const otherCosts = loadCost + unloadCost + handleCost;
  const markets = await getDynamicMarkets();

  const results = await Promise.all(markets.map(async (market) => {
    const price = market.prices[crop];
    if (!price) return null;

    let distanceKm = haversineDistanceKm(lat, lon, market.lat, market.lon);
    let durationMinutes = null;
    let routeGeoJson = [];

    try {
      const route = await getRouteFromOSRM({ lat, lon }, { lat: market.lat, lon: market.lon });
      if (route) {
        distanceKm = route.distanceKm;
        durationMinutes = route.durationMinutes;
        routeGeoJson = route.geometry.map(([lng, latValue]) => [latValue, lng]);
      }
    } catch {}

    const revenue = price * normalizedQuantityTons;
    const transportCost = distanceKm * rate;
    const totalCost = transportCost + otherCosts;
    const netProfit = revenue - totalCost;
    const profitMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0;

    return {
      market_id: market.id,
      market_name: market.name,
      market_lat: market.lat,
      market_lon: market.lon,
      crop,
      price_per_ton: price,
      input_quantity: quantityValue,
      quantity_unit,
      quantity_tons: Number(normalizedQuantityTons.toFixed(2)),
      distance_km: Number(distanceKm.toFixed(2)),
      duration_minutes: durationMinutes ? Number(durationMinutes.toFixed(1)) : null,
      vehicle_rate_per_km: rate,
      loading_cost: loadCost,
      unloading_cost: unloadCost,
      handling_cost: handleCost,
      revenue: Number(revenue.toFixed(2)),
      transport_cost: Number(transportCost.toFixed(2)),
      other_costs: Number(otherCosts.toFixed(2)),
      total_cost: Number(totalCost.toFixed(2)),
      net_profit: Number(netProfit.toFixed(2)),
      profit_margin_percent: Number(profitMargin.toFixed(2)),
      route_geojson: routeGeoJson,
    };
  }));

  const filteredResults = results.filter(Boolean).sort((a, b) => b.net_profit - a.net_profit);
  if (!filteredResults.length) return res.status(400).json({ error: "Unsupported crop" });

  return res.json({
    input: {
      crop,
      quantity: quantityValue,
      quantity_unit,
      vehicle_type,
      user_lat: lat,
      user_lon: lon,
      loading_cost: loadCost,
      unloading_cost: unloadCost,
      handling_cost: handleCost,
    },
    markets_compared: filteredResults.length,
    price_source: PRICE_FEED_URL || "local-file",
    results: filteredResults,
  });
});

app.get("/api/markets", async (req, res) => {
  const markets = await getDynamicMarkets();
  return res.json({ count: markets.length, results: markets });
});

app.get("/api/crops", async (req, res) => {
  const markets = await getDynamicMarkets();
  const crops = [...new Set(markets.flatMap((market) => Object.keys(market.prices || {})))].sort();
  return res.json({ crops });
});

app.get("/health", (req, res) => res.json({ status: "ok" }));
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

app.listen(PORT, () => {
  console.log(`Krishi-Route server running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser`);
});

// Route validation and vehicle rate utilities integrated
const { VEHICLE_PROFILES } = require('./src/utils/vehicleRates');
const { isWithinKarnataka } = require('./src/utils/routeValidator');
