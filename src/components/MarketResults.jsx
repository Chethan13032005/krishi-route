import React from "react";

const MarketResults = ({ results }) => {
  if (!results.length) {
    return (
      <div>
        <h2 className="text-xl font-semibold">Market Results</h2>
        <p className="mt-2 text-sm text-slate-500">
          Submit your inputs to see the top markets sorted by profit.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Market Results</h2>
        <span className="text-sm text-slate-500">
          Sorted by highest net profit
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {results.map((market, index) => {
          const isWinner = index === 0;

          return (
            <div
              key={market.market_id}
              className={`rounded-2xl border p-4 shadow-sm transition ${
                isWinner
                  ? "border-emerald-300 bg-emerald-50"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {market.market_name}
                  </h3>
                  <p className="text-xs text-slate-500">{market.market_id}</p>
                </div>
                {isWinner ? (
                  <span className="rounded-full bg-emerald-600 px-2 py-1 text-xs font-semibold text-white">
                    Winner
                  </span>
                ) : null}
              </div>

              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Price / ton</span>
                  <span className="font-medium text-slate-900">
                    ₹{market.price_per_ton}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Revenue</span>
                  <span className="font-medium text-slate-900">
                    ₹{market.revenue}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Distance</span>
                  <span className="font-medium text-slate-900">
                    {market.distance_km} km
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Vehicle rate</span>
                  <span className="font-medium text-slate-900">
                    ₹{market.vehicle_rate_per_km}/km
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Transport cost</span>
                  <span className="font-medium text-slate-900">
                    ₹{market.transport_cost}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Other costs</span>
                  <span className="font-medium text-slate-900">
                    ₹{market.other_costs}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total cost</span>
                  <span className="font-medium text-slate-900">
                    ₹{market.total_cost}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Net Profit</span>
                  <span className="font-semibold text-emerald-700">
                    ₹{market.net_profit}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Profit margin</span>
                  <span className="font-semibold text-slate-900">
                    {market.profit_margin_percent}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MarketResults;
