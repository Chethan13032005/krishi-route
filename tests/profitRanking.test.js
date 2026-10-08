// Profit Ranking Unit Tests
const { calculateNetProfit, rankMandisByNetProfit } = require('../src/utils/profitRanking');

describe('Profit Ranking Engine', () => {
  test('calculates net margin deducting transport and cess correctly', () => {
    const res = calculateNetProfit({
      modalPricePerQuintal: 2500,
      quantityQuintals: 10,
      distanceKm: 50,
      ratePerKm: 20,
      mandiCessPercent: 1.5
    });
    // Gross: 25000 | Transport: 1000 | Cess: 375 | Net: 23625
    expect(res.grossRevenue).toBe(25000);
    expect(res.transportCost).toBe(1000);
    expect(res.cessCost).toBe(375);
    expect(res.netProfit).toBe(23625);
  });
});
