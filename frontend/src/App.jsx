import { useState } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

export default function App() {
  // This is the ONE piece of state that decides which screen shows.
  // There's no routing library here on purpose — for a two-screen app,
  // a simple `user` state (null = logged out) is the honest, simplest
  // solution. Reach for react-router only once you have real multiple
  // routes/URLs to manage.
  const [user, setUser] = useState(null);

  return (
    <div className="app-shell">
      {user && (
        <header className="topbar">
          <span className="brand">PayFlow</span>
          <button className="logout-btn" onClick={() => setUser(null)}>
            Log out
          </button>
        </header>
      )}

      {user ? <Dashboard /> : <Login onLogin={setUser} />}
    </div>
  );
}
