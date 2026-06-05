# Krishi-Route

Krishi-Route is a profit and logistics optimizer for farmers. It compares nearby mandis, estimates transport cost, and ranks markets by net profit so the user can choose the most profitable selling location instead of the nearest one.

## What It Does

- Accepts crop, quantity, vehicle type, location, and optional handling costs.
- Fetches mandi locations from local JSON data.
- Loads crop prices from local JSON data or an optional live JSON feed.
- Calculates route distance using OSRM when available, with haversine fallback.
- Sorts markets by net profit and highlights the best option.
- Shows a route map, market cards, and a cost breakdown for the winning mandi.

## Current Architecture

This repository runs as a single Node.js + Express app.

- Backend: [server.js](server.js)
- Served frontend: [public/index.html](public/index.html)
- Market data: [data/mandis.json](data/mandis.json)
- Price snapshot: [data/prices.json](data/prices.json)

Important: the live app is served from `public/index.html`. The `src/` folder exists in the repo, but it is not the active runtime entry for the current setup.

## Tech Stack

- Node.js
- Express
- CORS
- Native `fetch` and `fs/promises`
- Leaflet for maps
- React and Babel via CDN in the served HTML
- OSRM public routing service for free route distance and geometry

## API

### `POST /calculate-profit`

Request body:

```json
{
  "crop": "onion",
  "quantity": 10,
  "quantity_unit": "ton",
  "vehicle_type": "tractor",
  "user_lat": 28.61,
  "user_lon": 77.21,
  "loading_cost": 0,
  "unloading_cost": 0,
  "handling_cost": 0
}
```

Response:

- Ranked list of mandis by net profit
- Distance, revenue, transport cost, total cost, profit margin
- Route geometry for the winning mandi when OSRM succeeds

### `GET /api/crops`

Returns the crop names available in the current price snapshot.

### `GET /api/markets`

Returns the loaded mandis and their coordinates.

### `GET /health`

Simple health check.

## How Profit Is Calculated

The backend uses:

```text
Revenue = Market Price × Quantity
Transport Cost = Distance × Vehicle Rate
Total Cost = Transport Cost + Loading + Unloading + Handling
Net Profit = Revenue - Total Cost
```

Quantity is normalized to tons before calculation. If the user enters quintals, the server converts them to tons.

## Data Source Details

### Mock / Local Data

These are local project files, not live external feeds:

- [data/mandis.json](data/mandis.json) stores mandi IDs, names, and coordinates.
- [data/prices.json](data/prices.json) stores crop prices per mandi.
- Vehicle rates are defined in [server.js](server.js).

### Dynamic / Live Behavior

- Mandi and crop lists are loaded at request time from the JSON files.
- If `MARKET_PRICE_FEED_URL` is set, the backend tries that URL first for prices.
- Route distance uses the free OSRM public service.
- If OSRM fails, the backend falls back to haversine distance.

## Running the Project

### 1. Install dependencies

```bash
npm install
```

### 2. Start the server

```bash
npm start
```

### 3. Open the app

Go to:

```text
http://localhost:5000
```

## Environment Variables

- `PORT` - server port. Defaults to `5000`.
- `MARKET_PRICE_FEED_URL` - optional JSON endpoint for live price data.

## Notes

- This is an MVP, not a production agricultural market integration.
- Real mandi pricing depends on the external feed you connect through `MARKET_PRICE_FEED_URL`.
- The current default data set is intentionally small for demonstration and testing.
