// Profit Summary Helper
function isProfitableHaul(netProfit, minMargin = 1000) {
  return netProfit >= minMargin;
}

module.exports = { isProfitableHaul };
