import {
  useEffect,
  useState
} from "react";

import { supabase } from "../supabase";

import DashboardCard
  from "../components/DashboardCard";

function Dashboard() {

  const [stats, setStats] =
    useState({
      members: 0,
      trainers: 0,
      schedules: 0,
      workoutPlans: 0
    });

  const [schedules, setSchedules] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  async function loadDashboard() {

    try {

      setLoading(true);

      const [
        members,
        trainers,
        schedulesCount,
        plans
      ] = await Promise.all([

        supabase
          .from("members")
          .select("*", {
            count: "exact",
            head: true
          }),

        supabase
          .from("trainers")
          .select("*", {
            count: "exact",
            head: true
          }),

        supabase
          .from("schedules")
          .select("*", {
            count: "exact",
            head: true
          }),

        supabase
          .from("workout_plans")
          .select("*", {
            count: "exact",
            head: true
          })

      ]);

      if (members.error) {
        throw members.error;
      }

      if (trainers.error) {
        throw trainers.error;
      }

      if (schedulesCount.error) {
        throw schedulesCount.error;
      }

      if (plans.error) {
        throw plans.error;
      }

      setStats({

        members:
          members.count || 0,

        trainers:
          trainers.count || 0,

        schedules:
          schedulesCount.count || 0,

        workoutPlans:
          plans.count || 0

      });

      const today =
        new Date()
          .toISOString()
          .split("T")[0];

      const {
        data,
        error
      } = await supabase
        .from("schedules")
        .select(`
          *,
          trainers (
            name
          )
        `)
        .gte(
          "schedule_date",
          today
        )
        .order(
          "schedule_date",
          {
            ascending: true
          }
        )
        .order(
          "start_time",
          {
            ascending: true
          }
        )
        .limit(5);

      if (error) {
        throw error;
      }

      setSchedules(data || []);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <div className="page">

      <div className="page-header">

        <div>

          <h1>
            Dashboard
          </h1>

          <p>
            Overview of your fitness center.
          </p>

        </div>

      </div>

      <div className="dashboard-grid">

        <DashboardCard
          title="Members"
          value={
            loading
              ? "..."
              : stats.members
          }
          description="Registered members"
          icon="♙"
        />

        <DashboardCard
          title="Trainers"
          value={
            loading
              ? "..."
              : stats.trainers
          }
          description="Available trainers"
          icon="♟"
        />

        <DashboardCard
          title="Schedules"
          value={
            loading
              ? "..."
              : stats.schedules
          }
          description="Training schedules"
          icon="◫"
        />

        <DashboardCard
          title="Workout Plans"
          value={
            loading
              ? "..."
              : stats.workoutPlans
          }
          description="Created workout plans"
          icon="◈"
        />

      </div>

      <div className="dashboard-section">

        <div className="section-header">

          <div>

            <h2>
              Upcoming Schedules
            </h2>

            <p>
              Your next training sessions
            </p>

          </div>

        </div>

        {schedules.length === 0 ? (

          <div className="empty-dashboard">
            No upcoming schedules.
          </div>

        ) : (

          <div className="schedule-list">

            {schedules.map(
              (schedule) => (

                <div
                  className="schedule-item"
                  key={schedule.id}
                >

                  <div className="schedule-date">

                    <strong>
                      {new Date(
                        schedule.schedule_date
                      ).getDate()}
                    </strong>

                    <span>
                      {new Date(
                        schedule.schedule_date
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          month: "short"
                        }
                      )}
                    </span>

                  </div>

                  <div className="schedule-info">

                    <h3>
                      {schedule.title}
                    </h3>

                    <p>
                      Trainer:{" "}
                      {schedule.trainers?.name ||
                        "Not assigned"}
                    </p>

                  </div>

                  <div className="schedule-time">

                    {schedule.start_time}
                    {" - "}
                    {schedule.end_time}

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </div>
  );
}

export default Dashboard;