import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="brand">

        <div className="brand-logo">
          F
        </div>

        <div>
          <h2>FitManage</h2>
          <span>Fitness Center</span>
        </div>

      </div>

      <div className="menu-title">
        MANAGEMENT
      </div>

      <nav>

        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive
              ? "sidebar-link active"
              : "sidebar-link"
          }
        >
          <span>▣</span>
          Dashboard
        </NavLink>

        <NavLink
          to="/members"
          className={({ isActive }) =>
            isActive
              ? "sidebar-link active"
              : "sidebar-link"
          }
        >
          <span>♙</span>
          Members
        </NavLink>

        <NavLink
          to="/trainers"
          className={({ isActive }) =>
            isActive
              ? "sidebar-link active"
              : "sidebar-link"
          }
        >
          <span>♟</span>
          Trainers
        </NavLink>

        <NavLink
          to="/schedules"
          className={({ isActive }) =>
            isActive
              ? "sidebar-link active"
              : "sidebar-link"
          }
        >
          <span>◫</span>
          Schedules
        </NavLink>

        <NavLink
          to="/workout-plans"
          className={({ isActive }) =>
            isActive
              ? "sidebar-link active"
              : "sidebar-link"
          }
        >
          <span>◈</span>
          Workout Plans
        </NavLink>

      </nav>

    </aside>
  );
}

export default Sidebar;