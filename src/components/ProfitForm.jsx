import React from "react";

const cropOptions = [
  { value: "onion", label: "Onion" },
  { value: "wheat", label: "Wheat" },
  { value: "tomato", label: "Tomato" },
  { value: "rice", label: "Rice" },
  { value: "maize", label: "Maize" },
];

const vehicleOptions = [
  { value: "tata_ace", label: "Tata Ace" },
  { value: "tractor", label: "Tractor" },
  { value: "mini_truck", label: "Mini Truck" },
  { value: "truck", label: "Truck" },
];

const unitOptions = [
  { value: "ton", label: "Ton" },
  { value: "quintal", label: "Quintal" },
];

const ProfitForm = ({ values, onChange, onSubmit, loading, error }) => {
  const handleGeoLocation = () => {
    if (!navigator.geolocation) {
      onChange("user_lat", "");
      onChange("user_lon", "");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        onChange("user_lat", position.coords.latitude.toFixed(6));
        onChange("user_lon", position.coords.longitude.toFixed(6));
      },
      () => {
        onChange("user_lat", "");
        onChange("user_lon", "");
      }
    );
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold">Input Details</h2>
        <p className="text-sm text-slate-500">
          Enter crop and transport details to estimate profits.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-medium">
          Crop Type
          <select
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-700 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            value={values.crop}
            onChange={(e) => onChange("crop", e.target.value)}
          >
            {cropOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium">
          Quantity
          <input
            type="number"
            min="0"
            step="0.1"
            required
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-700 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            value={values.quantity}
            onChange={(e) => onChange("quantity", e.target.value)}
            placeholder="e.g. 10"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium">
          Unit
          <select
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-700 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            value={values.quantity_unit}
            onChange={(e) => onChange("quantity_unit", e.target.value)}
          >
            {unitOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium">
          Vehicle Type
          <select
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-700 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            value={values.vehicle_type}
            onChange={(e) => onChange("vehicle_type", e.target.value)}
          >
            {vehicleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium">
          Loading Cost (₹)
          <input
            type="number"
            min="0"
            step="1"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-700 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            value={values.loading_cost}
            onChange={(e) => onChange("loading_cost", e.target.value)}
            placeholder="e.g. 800"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium">
          Unloading Cost (₹)
          <input
            type="number"
            min="0"
            step="1"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-700 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            value={values.unloading_cost}
            onChange={(e) => onChange("unloading_cost", e.target.value)}
            placeholder="e.g. 600"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium">
          Handling Cost (₹)
          <input
            type="number"
            min="0"
            step="1"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-700 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            value={values.handling_cost}
            onChange={(e) => onChange("handling_cost", e.target.value)}
            placeholder="e.g. 400"
          />
        </label>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Get Location</span>
          <button
            type="button"
            onClick={handleGeoLocation}
            className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100"
          >
            Fetch GPS
          </button>
          <p className="text-xs text-slate-500">
            Uses browser permissions to fill latitude and longitude.
          </p>
        </div>

        <label className="flex flex-col gap-2 text-sm font-medium">
          Latitude
          <input
            type="number"
            step="0.000001"
            required
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-700 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            value={values.user_lat}
            onChange={(e) => onChange("user_lat", e.target.value)}
            placeholder="28.6139"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium">
          Longitude
          <input
            type="number"
            step="0.000001"
            required
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-700 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            value={values.user_lon}
            onChange={(e) => onChange("user_lon", e.target.value)}
            placeholder="77.2090"
          />
        </label>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
      >
        {loading ? "Calculating..." : "Calculate Profit"}
      </button>
    </form>
  );
};

export default ProfitForm;
