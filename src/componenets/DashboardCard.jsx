function DashboardCard({
  title,
  value,
  description,
  icon
}) {
  return (
    <div className="dashboard-card">

      <div className="dashboard-card-header">

        <div>

          <p className="card-title">
            {title}
          </p>

          <h2 className="card-value">
            {value}
          </h2>

        </div>

        <div className="card-icon">
          {icon}
        </div>

      </div>

      <p className="card-description">
        {description}
      </p>

    </div>
  );
}

export default DashboardCard;