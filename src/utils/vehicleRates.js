// Agricultural Transport Vehicle Rate Configurations
const VEHICLE_PROFILES = {
  tata_ace: {
    name: 'Tata Ace (Chhota Hathi)',
    maxPayloadKg: 850,
    baseRateRsPerKm: 18,
    minimumFareRs: 350
  },
  pickup_bolero: {
    name: 'Mahindra Bolero Maxi Truck',
    maxPayloadKg: 1300,
    baseRateRsPerKm: 24,
    minimumFareRs: 500
  },
  truck_14ft: {
    name: '14ft Canter Intermediate Truck',
    maxPayloadKg: 4000,
    baseRateRsPerKm: 38,
    minimumFareRs: 1200
  },
  truck_multi_axle: {
    name: '10-Wheel Heavy Commercial Truck',
    maxPayloadKg: 16000,
    baseRateRsPerKm: 72,
    minimumFareRs: 3500
  }
};

function calculateFuelSurcharge(baseDieselPrice = 90.0, currentDieselPrice = 96.5) {
  const diff = currentDieselPrice - baseDieselPrice;
  if (diff <= 0) return 1.0;
  return 1.0 + (diff / baseDieselPrice) * 0.35; // 35% fuel operating sensitivity
}

module.exports = { VEHICLE_PROFILES, calculateFuelSurcharge };
