import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabase";

function Dashboard() {
  const [members, setMembers] = useState(0);
  const [trainers, setTrainers] = useState(0);
  const [schedules, setSchedules] = useState(0);
  const [workoutPlans, setWorkoutPlans] = useState(0);

  const [upcomingSchedules, setUpcomingSchedules] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const membersResult = await supabase
        .from("members")
        .select("*", { count: "exact", head: true });

      const trainersResult = await supabase
        .from("trainers")
        .select("*", { count: "exact", head: true });

      const schedulesResult = await supabase
        .from("schedules")
        .select("*")
        .order("schedule_date", {
          ascending: true,
        })
        .order("start_time", {
          ascending: true,
        });

      const workoutPlansResult = await supabase
        .from("workout_plans")
        .select("*", {
          count: "exact",
          head: true,
        });

      if (membersResult.error) {
        throw membersResult.error;
      }

      if (trainersResult.error) {
        throw trainersResult.error;
      }

      if (schedulesResult.error) {
        throw schedulesResult.error;
      }

      if (workoutPlansResult.error) {
        throw workoutPlansResult.error;
      }

      setMembers(membersResult.count || 0);
      setTrainers(trainersResult.count || 0);
      setSchedules(
        schedulesResult.data?.length || 0
      );
      setWorkoutPlans(
        workoutPlansResult.count || 0
      );

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const upcoming = (schedulesResult.data || [])
        .filter((schedule) => {
          if (!schedule.schedule_date) {
            return false;
          }

          const scheduleDate = new Date(
            `${schedule.schedule_date}T00:00:00`
          );

          return scheduleDate >= today;
        })
        .slice(0, 5);

      setUpcomingSchedules(upcoming);
    } catch (err) {
      console.error("Dashboard error:", err);

      setError(
        err.message ||
          "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="page">
        <div className="loading-box">
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>

          <p>
            Overview of your fitness management
            system.
          </p>
        </div>
      </div>

      {error && (
        <div className="alert error-alert">
          {error}
        </div>
      )}

      <div className="dashboard-grid">

        <Link
          to="/members"
          className="dashboard-card"
        >
          <div className="dashboard-card-icon">
            👥
          </div>

          <div className="dashboard-card-content">
            <p>Total Members</p>
            <h2>{members}</h2>
          </div>

          <div className="dashboard-card-arrow">
            →
          </div>
        </Link>

        <Link
          to="/trainers"
          className="dashboard-card"
        >
          <div className="dashboard-card-icon">
            🏋️
          </div>

          <div className="dashboard-card-content">
            <p>Total Trainers</p>
            <h2>{trainers}</h2>
          </div>

          <div className="dashboard-card-arrow">
            →
          </div>
        </Link>

        <Link
          to="/schedules"
          className="dashboard-card"
        >
          <div className="dashboard-card-icon">
            📅
          </div>

          <div className="dashboard-card-content">
            <p>Total Schedules</p>
            <h2>{schedules}</h2>
          </div>

          <div className="dashboard-card-arrow">
            →
          </div>
        </Link>

        <Link
          to="/workout-plans"
          className="dashboard-card"
        >
          <div className="dashboard-card-icon">
            💪
          </div>

          <div className="dashboard-card-content">
            <p>Workout Plans</p>
            <h2>{workoutPlans}</h2>
          </div>

          <div className="dashboard-card-arrow">
            →
          </div>
        </Link>

      </div>

      <div className="dashboard-section">

        <div className="section-header">
          <div>
            <h2>Upcoming Schedules</h2>

            <p>
              Your upcoming fitness sessions.
            </p>
          </div>

          <Link
            to="/schedules"
            className="secondary-button"
          >
            View All
          </Link>
        </div>

        {upcomingSchedules.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              📅
            </div>

            <h3>No upcoming schedules</h3>

            <p>
              There are no upcoming training
              sessions.
            </p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Title</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {upcomingSchedules.map(
                  (schedule) => (
                    <tr key={schedule.id}>
                      <td>
                        {formatDate(
                          schedule.schedule_date
                        )}
                      </td>

                      <td>
                        {schedule.title ||
                          schedule.activity ||
                          schedule.type ||
                          "Training"}
                      </td>

                      <td>
                        {schedule.start_time || "-"}
                      </td>

                      <td>
                        {schedule.end_time || "-"}
                      </td>

                      <td>
                        <span className="status-badge">
                          {schedule.status ||
                            "Scheduled"}
                        </span>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}

export default Dashboard;

