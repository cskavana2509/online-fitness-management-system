import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <header className="navbar">

      <div className="mobile-brand">
        FitManage
      </div>

      <div className="navbar-right">

        {user && (
          <>
            <div className="user-info">

              <div className="user-avatar">
                {user.email
                  ?.charAt(0)
                  .toUpperCase()}
              </div>

              <div className="user-text">

                <strong>
                  Admin
                </strong>

                <span>
                  {user.email}
                </span>

              </div>

            </div>

            <button
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