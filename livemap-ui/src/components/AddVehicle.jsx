import { useState } from "react";
import { API } from "../services/api";

export default function AddVehicle({ company }) {
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");

  async function handleAdd() {
    try {
      const res = await fetch(
        `${API}/add_vehicle?name=${name}&company=${company}`
      );
      const data = await res.json();
      setMsg("Vehicle added successfully");
      setName("");
    } catch {
      setMsg("Error adding vehicle");
    }
  }

  return (
    <div>
      <h3>Add Vehicle</h3>

      <input
        placeholder="Vehicle Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button onClick={handleAdd}>Add</button>

      {msg && <p>{msg}</p>}
    </div>
  );
}