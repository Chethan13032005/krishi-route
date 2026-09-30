// Mandi Profit Ranking Engine
function calculateNetProfit({ modalPricePerQuintal, quantityQuintals, distanceKm, ratePerKm, mandiCessPercent = 1.5 }) {
  const grossRevenue = modalPricePerQuintal * quantityQuintals;
  const transportCost = distanceKm * ratePerKm;
  const cessCost = (grossRevenue * mandiCessPercent) / 100;
  const netProfit = grossRevenue - transportCost - cessCost;
  return {
    grossRevenue,
    transportCost,
    cessCost,
    netProfit: parseFloat(netProfit.toFixed(2))
  };
}

module.exports = { calculateNetProfit };
