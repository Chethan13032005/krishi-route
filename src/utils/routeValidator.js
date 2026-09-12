// Mandi Route Boundary and Input Validator
const KARNATAKA_BOUNDING_BOX = {
  minLat: 11.5,
  maxLat: 18.5,
  minLon: 74.0,
  maxLon: 78.6
};

function isWithinKarnataka(lat, lon) {
  return (
    lat >= KARNATAKA_BOUNDING_BOX.minLat &&
    lat <= KARNATAKA_BOUNDING_BOX.maxLat &&
    lon >= KARNATAKA_BOUNDING_BOX.minLon &&
    lon <= KARNATAKA_BOUNDING_BOX.maxLon
  );
}

function validateVehiclePayloadCapacity(vehicleType, weightKg, vehicleProfiles) {
  const profile = vehicleProfiles[vehicleType];
  if (!profile) return { valid: false, reason: 'Unknown vehicle classification' };
  if (weightKg > profile.maxPayloadKg) {
    return {
      valid: false,
      reason: `Payload ${weightKg}kg exceeds maximum capacity of ${profile.maxPayloadKg}kg for ${profile.name}`
    };
  }
  return { valid: true, utilizationPercent: Math.round((weightKg / profile.maxPayloadKg) * 100) };
}

function checkAgriTransportPermit(farmerId, state = 'KA') {
  if (!farmerId || typeof farmerId !== 'string') return false;
  return farmerId.startsWith(`FID-${state}-`);
}

module.exports = {
  KARNATAKA_BOUNDING_BOX,
  isWithinKarnataka,
  validateVehiclePayloadCapacity,
  checkAgriTransportPermit
};
