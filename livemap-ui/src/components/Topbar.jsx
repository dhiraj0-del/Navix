/*
export default function Topbar() {
  return (
    <div className="topbar">
      <h1><strong>Fleet Intelligence Dashboard</strong></h1>
    </div>
  );
}
*/
/*
export default function Topbar() {
  return (
    <div className="topbar">
      <div className="logo-wrap">
        <img src="/navix-logo.png" alt="Navix" className="navix-logo" />
        <span className="brand-name">NAVIX</span>
      </div>
    </div>
  );
}*/


export default function Topbar({ onLogout }) {
  const session = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="topbar" style={styles.topbar}>
      <h1 style={styles.title}>
        <strong>Fleet Intelligence Dashboard</strong>
      </h1>

      <div style={styles.right}>
        <span style={styles.company}>
          {session?.company || "Navix"}
        </span>

        {/* ✅ FIXED LOGOUT */}
        <button onClick={onLogout} style={styles.logout}>
          Logout
        </button>
      </div>
    </div>
  );
}

/* ---------- inline styles ---------- */
const styles = {
  topbar: {
    height: "80px",
    padding: "0 20px",
    background: "#020617",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid #1e293b",
  },
  title: {
    margin: 0,
    fontSize: "30px",
    color: "#e5e7eb",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  company: {
    color: "#60a5fa",
    fontWeight: 600,
  },
  logout: {
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    color: "white",
    cursor: "pointer",
    fontWeight: 600,
  },
};