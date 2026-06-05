import React, { useMemo, useState } from "react";
import axios from "axios";
import ProfitForm from "./components/ProfitForm";
import MarketResults from "./components/MarketResults";
import WinnerChart from "./components/WinnerChart";
import MarketMap from "./components/MarketMap";

const API_URL = "http://localhost:5000/calculate-profit";

const App = () => {
  const [formValues, setFormValues] = useState({
    crop: "wheat",
    quantity: "",
    quantity_unit: "ton",
    vehicle_type: "tractor",
    user_lat: "",
    user_lon: "",
    loading_cost: "",
    unloading_cost: "",
    handling_cost: "",
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const winner = useMemo(() => (results.length ? results[0] : null), [results]);

  const userLocation = useMemo(
    () => ({
      lat: Number(formValues.user_lat),
      lon: Number(formValues.user_lon),
    }),
    [formValues.user_lat, formValues.user_lon]
  );

  const handleChange = (name, value) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResults([]);

    try {
      const payload = {
        crop: formValues.crop,
        quantity: Number(formValues.quantity),
        quantity_unit: formValues.quantity_unit,
        vehicle_type: formValues.vehicle_type,
        user_lat: Number(formValues.user_lat),
        user_lon: Number(formValues.user_lon),
        loading_cost: Number(formValues.loading_cost) || 0,
        unloading_cost: Number(formValues.unloading_cost) || 0,
        handling_cost: Number(formValues.handling_cost) || 0,
      };

      const response = await axios.post(API_URL, payload);
      setResults(response.data.results || []);
    } catch (err) {
      const message = err?.response?.data?.error || "Request failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <header className="mb-8">
          <p className="text-sm uppercase tracking-widest text-emerald-600">
            Krishi-Route
          </p>
          <h1 className="text-3xl font-bold sm:text-4xl">
            Profit Calculator Dashboard
          </h1>
          <p className="mt-2 text-slate-600">
            Compare market returns based on crop price, transport distance, and
            vehicle costs.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr),minmax(0,1fr)]">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <ProfitForm
              values={formValues}
              onChange={handleChange}
              onSubmit={handleSubmit}
              loading={loading}
              error={error}
            />
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <WinnerChart winner={winner} />
          </div>
        </div>

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Route Map</h2>
            <p className="text-sm text-slate-500">
              View your location, mandi markers, and the winning route.
            </p>
          </div>
          <MarketMap results={results} userLocation={userLocation} />
        </div>

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <MarketResults results={results} />
        </div>
      </div>
    </div>
  );
};

export default App;
