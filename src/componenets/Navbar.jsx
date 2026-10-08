import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">
          Fitness Management System
        </Link>
      </div>

      <div className="navbar-right">
        {user && (
          <>
            <span className="navbar-user">
              {user.email}
            </span>

            <button
              type="button"
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;