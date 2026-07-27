// Highway Toll Estimation & Agricultural Permit Check
function estimateHighwayTolls(distanceKm, isAgriPermitVerified = true) {
  if (isAgriPermitVerified) {
    return { tollCostRs: 0, exempt: true, message: 'Farmer gate-pass verified: 100% toll exemption applied.' };
  }
  const toll = Math.round(distanceKm * 1.85);
  return { tollCostRs: toll, exempt: false, message: 'Commercial rate applied.' };
}

module.exports = { estimateHighwayTolls };
