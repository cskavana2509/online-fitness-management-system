import { NavLink } from "react-router-dom";

function Sidebar() {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: "📊",
    },
    {
      name: "Members",
      path: "/members",
      icon: "👥",
    },
    {
      name: "Trainers",
      path: "/trainers",
      icon: "🏋️",
    },
    {
      name: "Schedules",
      path: "/schedules",
      icon: "📅",
    },
    {
      name: "Workout Plans",
      path: "/workout-plans",
      icon: "💪",
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-title">
        <span>FITNESS</span>
        <small>Management</small>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;