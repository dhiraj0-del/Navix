/*
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});
const DESTINATION =[17.385, 78.4867];
<Marker position={DESTINATION}>
  <Popup>Destination</Popup>
</Marker>

const CENTER = [17.385, 78.4867];
const FETCH_INTERVAL = 3000; // backend update
const ANIM_INTERVAL = 50;    // animation frame
const STEPS = FETCH_INTERVAL / ANIM_INTERVAL;
const MAX_TRAIL = 30;


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});


const lerp = (a, b, t) => a + (b - a) * t;


function HeatLayer({ points }) {
  const map = useMap();

  useEffect(() => {
    if (!points.length) return;

    const layer = L.heatLayer(points, {
      radius: 28,
      blur: 20,
      maxZoom: 12,
    }).addTo(map);

    return () => map.removeLayer(layer);
  }, [points, map]);

  return null;
}


function FocusController({ focusVehicle }) {
  const map = useMap();
  const lastRef = useRef(null);

  useEffect(() => {
    if (!focusVehicle) return;
    if (lastRef.current === focusVehicle) return;

    const target = window.__LATEST_TARGETS?.[focusVehicle];
    if (!target) return;

    lastRef.current = focusVehicle;

    map.flyTo([target.lat, target.lng], 16, {
      animate: true,
      duration: 1.5,
      easeLinearity: 0.3,
    });
  }, [focusVehicle, map]);

  return null;
}


export default function LiveMap({ focusVehicle }) {
  const [vehicles, setVehicles] = useState([]);
  const [route, setRoute] = useState(null);

  const targetsRef = useRef({});
  const trailsRef = useRef({});
  const etaRef = useRef({});
  const stepRef = useRef(0);


  useEffect(() => {
    const fetchGPS = async () => {
      try {
        const gpsRes = await fetch("http://127.0.0.1:8000/gps/Acme");
        const gpsData = await gpsRes.json();

        const nextTargets = {};

        for (const v of gpsData) {
  const name = v.id;

  nextTargets[name] = {
    lat: v.lat,
    lng: v.lng,
  };

  const etaRes = await fetch(`http://127.0.0.1:8000/eta/${name}`);
  const etaData = await etaRes.json();
  etaRef.current[name] = etaData?.eta_minutes ?? "--";
}

        targetsRef.current = nextTargets;
        window.__LATEST_TARGETS = nextTargets;
        stepRef.current = 0;

        setVehicles((prev) => {
          if (prev.length === 0) {
            return Object.entries(nextTargets).map(([name, p]) => ({
              name: v.id,
              lat: p.lat,
              lng: p.lng,
              eta: etaRef.current[v.id],
            }));
          }

          return prev.map((v) => ({
            ...v,
            eta: etaRef.current[v.name],
          }));
        });
      } catch (err) {
        console.error("GPS fetch failed:", err);
      }
    };

    fetchGPS();
    const id = setInterval(fetchGPS, FETCH_INTERVAL);
    return () => clearInterval(id);
  }, []);


  useEffect(() => {
    const id = setInterval(() => {
      stepRef.current += 1;
      const t = Math.min(stepRef.current / STEPS, 1);

      setVehicles((prev) =>
        prev.map((v) => {
          const target = targetsRef.current[v.name];
          if (!target) return v;

          const next = {
            ...v,
            lat: lerp(v.lat, target.lat, t),
            lng: lerp(v.lng, target.lng, t),
          };

          const trail = [...(trailsRef.current[v.name] || [])];
          trail.push([next.lat, next.lng]);
          if (trail.length > MAX_TRAIL) trail.shift();
          trailsRef.current[v.name] = trail;

          return next;
        })
      );
    }, ANIM_INTERVAL);

    return () => clearInterval(id);
  }, []);


  const fetchRoute = async (vehicle, type = "fastest") => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/route/${vehicle}?type=${type}`
      );
      const data = await res.json();

      if (data?.route?.geometry) {
        const coords = data.route.geometry.map(
          ([lng, lat]) => [lat, lng]
        );
        setRoute(coords);
      }
    } catch (err) {
      console.error("Route fetch failed:", err);
    }
  };


  const heatPoints = vehicles.map((v) => [v.lat, v.lng, 0.6]);


  return (
    <MapContainer
      center={CENTER}
      zoom={11}
      scrollWheelZoom={true}
      dragging={true}
      zoomControl={true}
      style={{ height: "100%", width: "100%" }}
    >
    
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <FocusController focusVehicle={focusVehicle} />

      <HeatLayer points={heatPoints} />

      {// Optimized Route //}
      {route && (
        <Polyline
          positions={route}
          pathOptions={{
            color: "orange",
            weight: 6,
            opacity: 0.9,
          }}
        />
      )}

      {// Trails //}
      {Object.entries(trailsRef.current).map(([name, pts]) => (
        <Polyline
          key={name}
          positions={pts}
          pathOptions={{
            color: "#22d3ee",
            weight: 3,
            opacity: 0.85,
          }}
        />
      ))}

      {// Vehicles //}
      {vehicles.map((v) => (
        <Marker
          key={v.name}
          position={[v.lat, v.lng]}
          eventHandlers={{
            click: () => fetchRoute(v.name, "fastest"),
          }}
        >
          <Popup>
            <b>{v.name}</b>
            <br />
            ETA: {v.eta} min
            <br />
            <button onClick={() => fetchRoute(v.name, "fastest")}>
              Fastest Route
            </button>
            <br />
            <button onClick={() => fetchRoute(v.name, "shortest")}>
              Shortest Route
            </button>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}


*/


import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

/* ---------------- FIX LEAFLET ICON ---------------- */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

/* ---------------- CONFIG ---------------- */
const CENTER = [17.385, 78.4867];
const DESTINATION = [17.385, 78.4867];
const FETCH_INTERVAL = 3000;
const ANIM_INTERVAL = 50;
const STEPS = FETCH_INTERVAL / ANIM_INTERVAL;
const MAX_TRAIL = 30;

/* ---------------- HELPERS ---------------- */
const lerp = (a, b, t) => a + (b - a) * t;

/* ---------------- HEATMAP ---------------- */
function HeatLayer({ points }) {
  const map = useMap();

  useEffect(() => {
    if (!points.length) return;

    const layer = L.heatLayer(points, {
      radius: 28,
      blur: 20,
      maxZoom: 12,
    }).addTo(map);

    return () => map.removeLayer(layer);
  }, [points, map]);

  return null;
}

/* ---------------- FOCUS ---------------- */
function FocusController({ focusVehicle }) {
  const map = useMap();
  const lastRef = useRef(null);

  useEffect(() => {
    if (!focusVehicle) return;
    if (lastRef.current === focusVehicle) return;

    const target = window.__LATEST_TARGETS?.[focusVehicle];
    if (!target) return;

    lastRef.current = focusVehicle;

    map.flyTo([target.lat, target.lng], 16, {
      animate: true,
      duration: 1.5,
    });
  }, [focusVehicle, map]);

  return null;
}

/* ---------------- MAIN ---------------- */
export default function LiveMap({ focusVehicle }) {
  const [vehicles, setVehicles] = useState([]);
  const [routes, setRoutes] = useState({});

  const targetsRef = useRef({});
  const startRef = useRef({});
  const trailsRef = useRef({});
  const etaRef = useRef({});
  const stepRef = useRef(0);

  /* -------- FETCH GPS + ETA + ROUTES -------- */
  useEffect(() => {
    const fetchGPS = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/gps/Acme");
        const gpsData = await res.json();

        if (!Array.isArray(gpsData)) {
          console.error("Invalid GPS data:", gpsData);
          return;
        }

        const nextTargets = {};
        const newRoutes = {};

        // 🔥 store start positions
        startRef.current = {};
        vehicles.forEach((v) => {
          startRef.current[v.name] = { lat: v.lat, lng: v.lng };
        });

        for (const v of gpsData) {
          const name = v.id;

          nextTargets[name] = {
            lat: v.lat,
            lng: v.lng,
          };

          /* ETA */
          try {
            const etaRes = await fetch(
              `http://127.0.0.1:8000/eta/${name}`
            );
            const etaData = await etaRes.json();
            etaRef.current[name] = etaData?.eta_minutes ?? "--";
          } catch {
            etaRef.current[name] = "--";
          }

          /* OSRM ROUTE */
          try {
            const url = `https://router.project-osrm.org/route/v1/driving/${v.lng},${v.lat};78.4867,17.385?overview=full&geometries=geojson`;
            const routeRes = await fetch(url);
            const routeData = await routeRes.json();

            const coords = routeData.routes[0].geometry.coordinates;
            newRoutes[name] = coords.map(([lng, lat]) => [lat, lng]);
          } catch (e) {
            console.error("OSRM error:", e);
          }
        }

        setRoutes(newRoutes);

        targetsRef.current = nextTargets;
        window.__LATEST_TARGETS = nextTargets;
        stepRef.current = 0;

        setVehicles((prev) => {
          if (prev.length === 0) {
            return Object.entries(nextTargets).map(([name, p]) => ({
              name,
              lat: p.lat,
              lng: p.lng,
              eta: etaRef.current[name],
            }));
          }

          return prev.map((v) => ({
            ...v,
            eta: etaRef.current[v.name],
          }));
        });
      } catch (err) {
        console.error("GPS fetch failed:", err);
      }
    };

    fetchGPS();
    const id = setInterval(fetchGPS, FETCH_INTERVAL);
    return () => clearInterval(id);
  }, [vehicles]);

  /* -------- SMOOTH ANIMATION -------- */
  useEffect(() => {
    const id = setInterval(() => {
      stepRef.current += 1;
      const t = Math.min(stepRef.current / STEPS, 1);

      setVehicles((prev) =>
        prev.map((v) => {
          const target = targetsRef.current[v.name];
          const start = startRef.current[v.name];

          if (!target || !start) return v;

          const next = {
            ...v,
            lat: lerp(start.lat, target.lat, t),
            lng: lerp(start.lng, target.lng, t),
          };

          const trail = [...(trailsRef.current[v.name] || [])];
          trail.push([next.lat, next.lng]);
          if (trail.length > MAX_TRAIL) trail.shift();
          trailsRef.current[v.name] = trail;

          return next;
        })
      );
    }, ANIM_INTERVAL);

    return () => clearInterval(id);
  }, []);

  /* ---------------- RENDER ---------------- */
  return (
    <MapContainer center={CENTER} zoom={11} style={{ height: "100%", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <FocusController focusVehicle={focusVehicle} />

      <HeatLayer points={vehicles.map((v) => [v.lat, v.lng, 0.6])} />

      {/* DESTINATION */}
      <Marker position={DESTINATION}>
        <Popup>Destination</Popup>
      </Marker>

      {/* TRAILS */}
      {Object.entries(trailsRef.current).map(([name, pts]) => (
        <Polyline key={name} positions={pts} />
      ))}

      {/* OSRM ROUTES */}
      {Object.entries(routes).map(([id, route]) => (
        <Polyline
          key={id}
          positions={route}
          pathOptions={{ color: "cyan", weight: 3 }}
        />
      ))}

      {/* VEHICLES */}
      {vehicles.map((v) => (
        <Marker key={v.name} position={[v.lat, v.lng]}>
          <Popup>
            <b>{v.name}</b>
            <br />
            ETA: {v.eta} min
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}