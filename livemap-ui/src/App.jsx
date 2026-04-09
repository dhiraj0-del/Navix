/*import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("navix_user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  if (!user) {
    return showRegister ? (
      <>
        <Register onRegister={() => setShowRegister(false)} />
        <p onClick={() => setShowRegister(false)}>Already have an account?</p>
      </>
    ) : (
      <>
        <Login onLogin={setUser} />
        <p onClick={() => setShowRegister(true)}>Create account</p>
      </>
    );
  }

  return <Dashboard user={user} />;
}
*/
/*
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [session, setSession] = useState(null);
  const [mode, setMode] = useState("login");

  useEffect(() => {
    const saved = localStorage.getItem("session");
    if (saved) setSession(JSON.parse(saved));
  }, []);

  if (!session) {
    return mode === "login" ? (
      <Login onLogin={setSession} />
    ) : (
      <Register onRegister={() => setMode("login")} />
    );
  }

  return <Dashboard />;
}
*/


import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";


import { useState, useEffect } from "react";

export default function App() {
  const [view, setView] = useState("login");
  const [user, setUser] = useState(null);

  // ✅ MUST be inside component
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  if (view === "register") {
    return <Register goLogin={() => setView("login")} />;
  }

  if (!user) {
    return (
      <Login
        onLogin={setUser}
        goRegister={() => setView("register")}
      />
    );
  }
function handleLogout() {
  localStorage.removeItem("user");
  setUser(null);
}
  return <Dashboard user={user} onLogout={handleLogout} />;
}