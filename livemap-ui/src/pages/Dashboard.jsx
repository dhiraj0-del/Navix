/*
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import LiveMap from "../LiveMap";

export default function Dashboard() {
  const [focusVehicle, setFocusVehicle] = useState(null);

  const vehicles = ["Truck1", "Truck2", "Truck3", "user2"];

  return (
    <div className="app-shell">
      <Sidebar vehicles={vehicles} onSelect={setFocusVehicle} />

      <div className="main-area">
        <Topbar />

        <div className="content">
          <LiveMap focusVehicle={focusVehicle} />
        </div>
      </div>
    </div>
  );
}
*/

/*
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import LiveMap from "../LiveMap";

export default function Dashboard({ user = null }) {
  const [focusVehicle, setFocusVehicle] = useState(null);

  // fallback vehicles (same as before)
  const vehicles = ["Truck1", "Truck2", "Truck3", "user2"];

  // fallback company name (keeps old behavior)
  const companyName = user?.company || "Navix";

  return (
    <div className="app-shell">
      <Sidebar
        vehicles={vehicles}
        onSelect={setFocusVehicle}
        company={companyName}
      />

      <div className="main-area">
        <Topbar company={companyName} />

        <div className="content">
          <LiveMap focusVehicle={focusVehicle} />
        </div>
      </div>
    </div>
  );
}

*/

/*
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
//console.log("USER:", user);
const API = "http://127.0.0.1:8000";

export default function Dashboard({ user }) {
  const [vehicles, setVehicles] = useState([]);

  // 🛑 SAFETY GUARD
  if (!user) {
    return <div style={{ padding: 20 }}>Loading dashboard...</div>;
  }

  useEffect(() => {
    fetch(`${API}/gps/${user.company}`)
      .then((res) => res.json())
      .then((data) => {
        if (user.role === "driver") {
          setVehicles(data.filter(v => v.id === user.vehicle));
        } else {
          setVehicles(data);
        }
      })
      .catch(console.error);
  }, [user]);

  return (
    <div className="layout">
      <Sidebar user={user} />
      <div className="main">
        <Topbar />
        <div className="content">
          <h2>Live Vehicles</h2>

          {vehicles.length === 0 && <p>No vehicles available</p>}

          {vehicles.map(v => (
            <div key={v.id} className="vehicle-card">
              <strong>{v.id}</strong>
              <p>Lat: {v.lat}</p>
              <p>Lng: {v.lng}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
*/

/*


import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import LiveMap from "../LiveMap";

const API = "http://127.0.0.1:8000";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [vehicles, setVehicles] = useState([]);

  // ✅ Load user safely
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // 🛑 HARD SAFETY GUARD (prevents white screen)
  if (!user) {
    return <div style={{ padding: 20 }}>Loading dashboard...</div>;
  }

  // ✅ Fetch vehicles ONLY after user exists
  useEffect(() => {
    fetch(`${API}/gps/${user.company}`)
      .then((res) => {
        if (!res.ok) throw new Error("GPS fetch failed");
        return res.json();
      })
      .then((data) => {
        if (user.role === "driver") {
          setVehicles(data.filter(v => v.id === user.vehicle));
        } else {
          setVehicles(data);
        }
      })
      .catch((err) => {
        console.error("GPS error:", err);
        setVehicles([]);
      });
  }, [user]);

  return (
    <div className="layout">
      <Sidebar user={user} />

      <div className="main">
        <Topbar />

        <div className="content">
          <h2>Live Vehicles</h2>

          {vehicles.length === 0 && <p>No vehicles available</p>}

          {vehicles.map(v => (
            <div key={v.id} className="vehicle-card">
              <strong>{v.id}</strong>
              <p>Lat: {v.lat}</p>
              <p>Lng: {v.lng}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
*/
/*
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import LiveMap from "../LiveMap";

const API = "http://127.0.0.1:8000";

export default function Dashboard({ user }) {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🛡️ SAFETY GUARD (prevents white/black screen)
  if (!user) {
    return <div style={{ padding: 20 }}>Loading dashboard...</div>;
  }

  useEffect(() => {
    setLoading(true);

    // Admin & driver both work with this endpoint
    fetch(`${API}/gps_secure?email=${user.email}`)
      .then(res => {
        if (!res.ok) throw new Error("GPS fetch failed");
        return res.json();
      })
      .then(data => {
        setVehicles(data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("GPS ERROR:", err);
        setVehicles([]);
        setLoading(false);
      });
  }, [user.email]);

  return (
    <div className="layout">
      <Sidebar user={user} />

      <div className="main">
        <Topbar />

        <div className="content">
          <h2>Live Vehicles</h2>

          {loading && <p>Loading live data...</p>}

          {!loading && vehicles.length === 0 && (
            <p>No vehicles available</p>
          )}

          {// 🗺️ MAP RENDERING (FIXED & CONNECTED) //}
          {!loading && vehicles.length > 0 && (
            <LiveMap vehicles={vehicles} />
          )}
        </div>
      </div>
    </div>
  );
}

*/

import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import LiveMap from "../LiveMap";
import AddVehicle from "../components/AddVehicle";
import AddDriver from "../components/AddDriver";

const API = "https://navix-backend-p35u.onrender.com";

export default function Dashboard({ user, onLogout }) {
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [focusVehicle, setFocusVehicle] = useState(null);

  if (!user) {
    return <div style={{ padding: 20 }}>Loading dashboard...</div>;
  }

  // Fetch vehicles
  useEffect(() => {
    fetch(`${API}/gps_secure?email=${user.email}`)
      .then((res) => res.json())
      .then(setVehicles)
      .catch(console.error);
  }, [user]);

  // Fetch drivers
  useEffect(() => {
    fetch(`${API}/drivers/${user.company}`)
      .then((res) => res.json())
      .then(setDrivers)
      .catch(console.error);
  }, [user]);

  return (
    <div className="layout">
      <Sidebar user={user} onLogout={onLogout} />

      <div className="main">
        <Topbar onLogout={onLogout} />

        {/* ADMIN PANEL */}
        {user.role === "admin" && (
          <div className="admin-panel">
            <AddVehicle company={user.company} />
            <AddDriver company={user.company} />

            {/* VEHICLE LIST */}
            <div>
              <h4>Vehicles</h4>
              {vehicles.map((v) => (
                <div key={v.id}>🚗 {v.id}</div>
              ))}
            </div>

            {/* DRIVER LIST */}
            <div>
              <h4>Drivers</h4>
              {drivers.map((d, i) => (
                <div key={i}>
                  👤 {d.email} → 🚗 {d.vehicle_id}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MAIN CONTENT */}
        <div className="content">
          {/* LEFT PANEL */}
          <div className="vehicle-panel">
            <h3>Live Vehicles</h3>

            {vehicles.map((v) => (
              <div
                key={v.id}
                onClick={() => setFocusVehicle(v.id)}
                className={`vehicle-item ${
                  focusVehicle === v.id ? "active" : ""
                }`}
              >
                <strong>{v.id}</strong>
                <div>Lat: {v.lat?.toFixed?.(4) || "N/A"}</div>
                <div>Lng: {v.lng?.toFixed?.(4) || "N/A"}</div>
              </div>
            ))}
          </div>

          {/* MAP */}
          <div className="map-panel">
            <LiveMap focusVehicle={focusVehicle} />
          </div>
        </div>
      </div>
    </div>
  );
}