// Profit Ranking Unit Tests
const { calculateNetProfit, rankMandisByNetProfit, applyPerishableDegradationFactor } = require('../src/utils/profitRanking');

describe('Profit Ranking Engine', () => {
  test('calculates net margin deducting transport and cess correctly', () => {
    const res = calculateNetProfit({
      modalPricePerQuintal: 2500,
      quantityQuintals: 10,
      distanceKm: 50,
      ratePerKm: 20,
      mandiCessPercent: 1.5
    });
    expect(res.grossRevenue).toBe(25000);
    expect(res.transportCost).toBe(1000);
    expect(res.cessCost).toBe(375);
    expect(res.netProfit).toBe(23625);
  });

  test('ranks distant high-price mandi higher when profit exceeds transport overhead', () => {
    const mandis = [
      { name: 'Local Mandi', price: 2000, distanceKm: 10 },
      { name: 'Distant APMC', price: 2600, distanceKm: 80 }
    ];
    const ranked = rankMandisByNetProfit(mandis, { quantityQuintals: 20, ratePerKm: 20 });
    expect(ranked[0].name).toBe('Distant APMC');
  });

  test('applies perishable transit time degradation penalty', () => {
    const adjusted = applyPerishableDegradationFactor(20000, 10, 0.02); // 10h * 2% = 20% degradation
    expect(adjusted).toBe(16000);
  });
});
