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

module.exports = { KARNATAKA_BOUNDING_BOX, isWithinKarnataka };
