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

function rankMandisByNetProfit(mandisWithPrices, userParams) {
  return mandisWithPrices
    .map(entry => {
      const breakdown = calculateNetProfit({
        modalPricePerQuintal: entry.price,
        quantityQuintals: userParams.quantityQuintals,
        distanceKm: entry.distanceKm,
        ratePerKm: userParams.ratePerKm,
        mandiCessPercent: entry.cessPercent || 1.5
      });
      return { ...entry, ...breakdown };
    })
    .sort((a, b) => b.netProfit - a.netProfit);
}

module.exports = { calculateNetProfit, rankMandisByNetProfit };
