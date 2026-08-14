// Perishable Crop Storage and Holding Cost Optimizer
const coldStorages = require('../../data/coldStorages.json');

function findNearestColdStorage(district) {
  return coldStorages.filter(cs => cs.district.toLowerCase() === district.toLowerCase());
}

module.exports = { findNearestColdStorage };
