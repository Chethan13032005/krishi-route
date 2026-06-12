// Multi-Market Route & Profit Optimization Engine
const { haversineDistance } = require('./haversine');
const { calculateNetProfit } = require('./profitRanking');

function compareMandiDestinations(originCoord, targetMandis, cropDetails, vehicleRate) {
  return targetMandis.map(mandi => {
    const dist = haversineDistance(
      originCoord.latitude, originCoord.longitude,
      mandi.coordinates.latitude, mandi.coordinates.longitude
    );
    const profitData = calculateNetProfit({
      modalPricePerQuintal: cropDetails.pricePerQuintal,
      quantityQuintals: cropDetails.quantityQuintals,
      distanceKm: dist,
      ratePerKm: vehicleRate
    });
    return {
      mandiId: mandi.id,
      mandiName: mandi.name,
      district: mandi.district,
      distanceKm: dist,
      ...profitData
    };
  }).sort((a, b) => b.netProfit - a.netProfit);
}

module.exports = { compareMandiDestinations };
