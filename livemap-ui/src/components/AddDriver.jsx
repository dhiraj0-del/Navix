import { useState, useEffect } from "react";
import { API } from "../services/api";

export default function AddDriver({ company }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
  fetch(`${API}/gps/${company}`)
    .then((res) => res.json())
    .then((data) => {
      if (Array.isArray(data)) {
        setVehicles(data);
      } else {
        setVehicles([]);
      }
    })
    .catch(() => setVehicles([]));
}, [company]);

  async function handleAdd() {
    try {
      await fetch(
        `${API}/create_driver?email=${email}&password=${password}&vehicle_name=${vehicle}&company=${company}`
      );
      setMsg("Driver created successfully");
    } catch {
      setMsg("Error creating driver");
    }
  }

  return (
    <div>
      <h3>Add Driver</h3>

      <input
        placeholder="Driver Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* ✅ DROPDOWN */}
      <select onChange={(e) => setVehicle(e.target.value)}>
        <option>Select Vehicle</option>
        {vehicles.map((v) => (
          <option key={v.id} value={v.id}>
            {v.id}
          </option>
        ))}
      </select>

      <button onClick={handleAdd}>Create Driver</button>

      {msg && <p>{msg}</p>}
    </div>
  );
}