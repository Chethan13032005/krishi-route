// Terminal & Web Output Formatter for Profit Summaries
function formatTerminalSummary(res) {
  return [
    '================ MANDI HAUL BREAKDOWN ================',
    `Gross Revenue:      Rs ${res.grossRevenue}`,
    `Transport Overhead: Rs ${res.transportCost}`,
    `Statutory APMC Cess:Rs ${res.cessCost}`,
    '------------------------------------------------------',
    `NET PROFIT:         Rs ${res.netProfit}`,
    '======================================================'
  ].join('\n');
}

module.exports = { formatTerminalSummary };
