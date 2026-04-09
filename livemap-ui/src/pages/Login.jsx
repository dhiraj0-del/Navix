/*import { useState } from "react";
import { API } from "../services/api";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async () => {
    try {
      const res = await fetch(
        `${API}/login?email=${email}&password=${password}`
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Login failed");
        return;
      }

      localStorage.setItem("navix_user", JSON.stringify(data));
      onLogin(data);
    } catch {
      setError("Server error");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login to Navix</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p className="error">{error}</p>}

      <button onClick={submit}>Login</button>
    </div>
  );
}

*/


/*
import { useState } from "react";
import "./auth.css";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");

  const login = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/login?email=${email}&password=${password}`
      );
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("session", JSON.stringify(data));
        onLogin(data);
      } else {
        setError("Invalid credentials");
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
        <p className="subtitle">Sign in to your dashboard</p>

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

        <div className="forgot">Forgot password?</div>

        {error && <div className="error">{error}</div>}

        <button onClick={login} disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>
      </div>
    </div>
  );
}
*/

import { useState } from "react";
import { login } from "../services/auth";

export default function Login({ onLogin, goRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin() {
    try {
      const data = await login(email, password);
      localStorage.setItem("user", JSON.stringify(data));
      onLogin(data);
    } catch {
      setError("Invalid credentials");
    }
  }

  return (
    <div className="auth-page">
  <div className="auth-card">
    <h1>Navix</h1>
    <p>AI Fleet Intelligence Platform</p>

    <input
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />

    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />

    {error && <p className="error">{error}</p>}

    <button onClick={handleLogin}>Login</button>

    <span onClick={goRegister} className="link">
      Create company account →
    </span>
  </div>
</div>
  );
}