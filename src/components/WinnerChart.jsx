import React from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

const WinnerChart = ({ winner }) => {
  if (!winner) {
    return (
      <div>
        <h2 className="text-xl font-semibold">Winning Market Breakdown</h2>
        <p className="mt-2 text-sm text-slate-500">
          The chart will appear once results are available.
        </p>
      </div>
    );
  }

  const data = [
    { name: "Revenue", value: Number(winner.revenue.toFixed(2)) },
    { name: "Transport", value: Number(winner.transport_cost.toFixed(2)) },
    { name: "Other Costs", value: Number(winner.other_costs.toFixed(2)) },
    { name: "Total Cost", value: Number(winner.total_cost.toFixed(2)) },
  ];

  return (
    <div className="h-full">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Winning Market Breakdown</h2>
        <p className="text-sm text-slate-500">
          {winner.market_name} has the highest net profit.
        </p>
        <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
          <div className="rounded-lg bg-slate-50 px-3 py-2">
            Net Profit: ₹{winner.net_profit}
          </div>
          <div className="rounded-lg bg-slate-50 px-3 py-2">
            Profit Margin: {winner.profit_margin_percent}%
          </div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={40}>
            <CartesianGrid strokeDasharray="4 4" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => `₹${value}`} />
            <Bar dataKey="value" fill="#10B981" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WinnerChart;
