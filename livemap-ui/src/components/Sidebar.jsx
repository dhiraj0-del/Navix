/*export default function Sidebar({ vehicles, onSelect }) {
  return (
    <div className="sidebar">
        <img
            src="/navix-logo.png"
            alt="Navix Logo"
            style={{ height: "250px", objectFit: "contain" }}
        />
      
      
        

      <div className="section">
        <h3>Vehicles</h3>

        {vehicles.map((v) => (
          <div
            key={v}
            className="vehicle-item"
            onClick={() => onSelect(v)}
          >
            🚚 {v}
          </div>
        ))}
      </div>
    </div>
  );
}*/


export default function Sidebar({ user, onLogout }) {
  return (
    <div className="sidebar">
      <img
        src="/navix-logo.png"
        alt="Company Logo"
        style={{
          width: "140px",
          marginBottom: "20px",
        }}
      />

      <h3>{user.company}</h3>

      <p className="role">
        {user.role === "admin" ? "Admin Panel" : "Driver View"}
      </p>

      <ul>
        <li>Dashboard</li>

        {user.role === "admin" && (
          <>
            <li>All Vehicles</li>
            <li>Drivers</li>
            <li>Analytics</li>
          </>
        )}

        {user.role === "driver" && (
          <li>My Vehicle</li>
        )}

        {/* ✅ FIXED LOGOUT */}
        <li onClick={onLogout} className="logout">
          Logout
        </li>
      </ul>
    </div>
  );
}