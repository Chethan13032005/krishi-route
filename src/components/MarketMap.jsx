import React, { useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const winnerIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const FitBounds = ({ points }) => {
  const map = useMap();

  useEffect(() => {
    if (!points.length) {
      return;
    }

    const bounds = L.latLngBounds(points.map((point) => [point.lat, point.lon]));
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [map, points]);

  return null;
};

const MarketMap = ({ results, userLocation }) => {
  const isValidPoint = (lat, lon) =>
    Number.isFinite(lat) && Number.isFinite(lon);

  const points = useMemo(() => {
    const list = [];

    if (isValidPoint(userLocation?.lat, userLocation?.lon)) {
      list.push({ lat: userLocation.lat, lon: userLocation.lon });
    }

    results.forEach((market) => {
      if (isValidPoint(market.market_lat, market.market_lon)) {
        list.push({ lat: market.market_lat, lon: market.market_lon });
      }
    });

    if (results.length && Array.isArray(results[0]?.route_geojson)) {
      results[0].route_geojson.forEach(([lat, lon]) => {
        if (isValidPoint(lat, lon)) {
          list.push({ lat, lon });
        }
      });
    }

    return list;
  }, [results, userLocation]);

  const winner = results.length ? results[0] : null;
  const hasUser = isValidPoint(userLocation?.lat, userLocation?.lon);
  const winnerRoute = Array.isArray(winner?.route_geojson)
    ? winner.route_geojson
    : [];

  return (
    <div className="h-80 w-full overflow-hidden rounded-2xl border border-slate-200">
      <MapContainer
        center={[28.6139, 77.209]}
        zoom={6}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {hasUser ? (
          <Marker position={[userLocation.lat, userLocation.lon]} icon={markerIcon}>
            <Popup>Your location</Popup>
          </Marker>
        ) : null}

        {results
          .filter((market) => isValidPoint(market.market_lat, market.market_lon))
          .map((market, index) => (
            <Marker
              key={market.market_id}
              position={[market.market_lat, market.market_lon]}
              icon={index === 0 ? winnerIcon : markerIcon}
            >
              <Popup>
                <div>
                  <p className="font-semibold">{market.market_name}</p>
                  <p>Net Profit: ₹{market.net_profit}</p>
                </div>
              </Popup>
            </Marker>
          ))}

        {winnerRoute.length ? (
          <Polyline
            positions={winnerRoute}
            pathOptions={{ color: "#10B981", weight: 3 }}
          />
        ) : hasUser && winner ? (
          <Polyline
            positions={[
              [userLocation.lat, userLocation.lon],
              [winner.market_lat, winner.market_lon],
            ]}
            pathOptions={{ color: "#10B981", weight: 3 }}
          />
        ) : null}

        <FitBounds points={points} />
      </MapContainer>
    </div>
  );
};

export default MarketMap;
