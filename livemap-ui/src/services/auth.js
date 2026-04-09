const API = "http://127.0.0.1:8000";

export async function login(email, password) {
  const res = await fetch(
    `${API}/login?email=${email}&password=${password}`
  );
  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

export async function register(email, password, company, role, vehicle_name) {
  if (role === "admin") {
    const res = await fetch(
      `${API}/register_company?email=${email}&password=${password}&company=${company}`
    );
    if (!res.ok) throw new Error("Register failed");
    return res.json();
  }

  if (role === "driver") {
    const res = await fetch(
      `${API}/create_driver?email=${email}&password=${password}&vehicle_name=${vehicle_name}&company=${company}`
    );
    if (!res.ok) throw new Error("Register failed");
    return res.json();
  }
}