import { Link } from "react-router-dom";

function DashboardCard({ title, value, icon, link }) {
  return (
    <Link to={link} className="dashboard-card">
      <div className="dashboard-card-icon">
        {icon}
      </div>

      <div className="dashboard-card-content">
        <p>{title}</p>
        <h2>{value}</h2>
      </div>

      <div className="dashboard-card-arrow">
        →
      </div>
    </Link>
  );
}

export default DashboardCard;