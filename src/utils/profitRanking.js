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

function applyPerishableDegradationFactor(netProfit, transitHours, degradationRatePerHour = 0.015) {
  const factor = Math.max(0.6, 1 - (transitHours * degradationRatePerHour));
  return parseFloat((netProfit * factor).toFixed(2));
}

module.exports = {
  calculateNetProfit,
  rankMandisByNetProfit,
  applyPerishableDegradationFactor
};
