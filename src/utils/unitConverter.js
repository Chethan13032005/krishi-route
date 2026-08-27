// Agricultural Unit Conversion Utilities
const WEIGHT_CONVERSIONS = {
  QUINTAL_TO_KG: 100,
  TONNE_TO_KG: 1000,
  TONNE_TO_QUINTAL: 10,
  STANDARD_JUTE_BAG_KG: 50,
  CRATE_TOMATO_KG: 15
};

function quintalToKg(quintals) {
  if (quintals < 0) throw new Error('Quantity cannot be negative');
  return quintals * WEIGHT_CONVERSIONS.QUINTAL_TO_KG;
}

function quintalToTonne(quintals) {
  if (quintals < 0) throw new Error('Quantity cannot be negative');
  return quintals / WEIGHT_CONVERSIONS.TONNE_TO_QUINTAL;
}

function bagsToQuintals(bagsCount, bagWeightKg = WEIGHT_CONVERSIONS.STANDARD_JUTE_BAG_KG) {
  return (bagsCount * bagWeightKg) / WEIGHT_CONVERSIONS.QUINTAL_TO_KG;
}

function cratesToQuintals(crateCount, crateWeightKg = WEIGHT_CONVERSIONS.CRATE_TOMATO_KG) {
  return (crateCount * crateWeightKg) / WEIGHT_CONVERSIONS.QUINTAL_TO_KG;
}

module.exports = {
  WEIGHT_CONVERSIONS,
  quintalToKg,
  quintalToTonne,
  bagsToQuintals,
  cratesToQuintals
};
