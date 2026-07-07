// Karnataka Agricultural Seasonal Trend Analytics
const SEASONAL_MULTIPLIERS = {
  KHARIF: { ragi: 1.05, maize: 0.95, paddy: 1.10, cotton: 1.15 },
  RABI: { jowar: 1.12, wheat: 1.08, gram: 1.20 },
  SUMMER: { groundnut: 1.18, vegetables: 1.30 }
};

function estimateFuturePrice(crop, currentModalPrice, currentSeason) {
  const season = SEASONAL_MULTIPLIERS[currentSeason.toUpperCase()];
  if (!season || !season[crop.toLowerCase()]) return currentModalPrice;
  return Math.round(currentModalPrice * season[crop.toLowerCase()]);
}

module.exports = { SEASONAL_MULTIPLIERS, estimateFuturePrice };
