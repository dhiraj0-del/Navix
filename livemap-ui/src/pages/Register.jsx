/*
import { useState } from "react";
import "./auth.css";

export default function Register({ onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");

  const register = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/register?email=${email}&password=${password}&company=${company}`
      );
      const data = await res.json();

      if (res.ok) {
        onRegister();
      } else {
        setError(data.detail || "Registration failed");
      }
    } catch {
      setError("Server not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="brand">Navix</h1>
        <p className="subtitle">Create your fleet account</p>

        <input
          placeholder="Company name"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />

        <input
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="password-box">
          <input
            type={showPwd ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span onClick={() => setShowPwd(!showPwd)}>👁️</span>
        </div>

        {error && <div className="error">{error}</div>}

        <button onClick={register} disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>
      </div>
    </div>
  );
}
*/


import { useState } from "react";
import { register } from "../services/auth";

export default function Register({ goLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("admin");
  const [vehicle, setVehicle] = useState("");
  const [msg, setMsg] = useState("");

  async function handleRegister() {
    await register(email, password, company, role, vehicle);
    setMsg("Account created. Please login.");
  }

  return (
    <div className="auth-container">
      <h1>Create Navix Account</h1>

      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        placeholder="Company Name"
        onChange={(e) => setCompany(e.target.value)}
      />

      <select onChange={(e) => setRole(e.target.value)}>
        <option value="admin">Company Admin</option>
        <option value="driver">Driver</option>
      </select>

      {role === "driver" && (
        <input
          placeholder="Assigned Vehicle (e.g. Truck1)"
          onChange={(e) => setVehicle(e.target.value)}
        />
      )}

      <button onClick={handleRegister}>Create Account</button>

      {msg && <p className="success">{msg}</p>}

      <span onClick={goLogin} className="link">
        ← Back to login
      </span>
    </div>
  );
}