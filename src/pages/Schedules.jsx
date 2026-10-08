import { useEffect, useState } from "react";
import {
  getSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from "../services/scheduleService";
import { getTrainers } from "../services/trainerService";

function Schedules() {
  const [schedules, setSchedules] = useState([]);
  const [trainers, setTrainers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    schedule_date: "",
    start_time: "",
    end_time: "",
    trainer_id: "",
    capacity: 20,
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const [scheduleData, trainerData] = await Promise.all([
        getSchedules(),
        getTrainers(),
      ]);

      setSchedules(Array.isArray(scheduleData) ? scheduleData : []);
      setTrainers(Array.isArray(trainerData) ? trainerData : []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load schedules.");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function resetForm() {
    setForm({
      title: "",
      schedule_date: "",
      start_time: "",
      end_time: "",
      trainer_id: "",
      capacity: 20,
    });

    setEditingId(null);
    setShowForm(false);
  }

  function handleAddClick() {
    setError("");

    setForm({
      title: "",
      schedule_date: "",
      start_time: "",
      end_time: "",
      trainer_id: "",
      capacity: 20,
    });

    setEditingId(null);
    setShowForm(true);
  }

  function handleEdit(schedule) {
    setError("");

    setForm({
      title: schedule.title || "",
      schedule_date: schedule.schedule_date || "",
      start_time: schedule.start_time
        ? schedule.start_time.slice(0, 5)
        : "",
      end_time: schedule.end_time
        ? schedule.end_time.slice(0, 5)
        : "",
      trainer_id: schedule.trainer_id
        ? String(schedule.trainer_id)
        : "",
      capacity: schedule.capacity ?? 20,
    });

    setEditingId(schedule.id);
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    if (!form.title.trim()) {
      setError("Please enter a schedule title.");
      return;
    }

    if (!form.schedule_date) {
      setError("Please select a date.");
      return;
    }

    if (!form.start_time) {
      setError("Please select a start time.");
      return;
    }

    if (!form.end_time) {
      setError("Please select an end time.");
      return;
    }

    if (form.end_time <= form.start_time) {
      setError("End time must be later than start time.");
      return;
    }

    try {
      const payload = {
        title: form.title.trim(),
        schedule_date: form.schedule_date,
        start_time: form.start_time,
        end_time: form.end_time,
        trainer_id: form.trainer_id
          ? Number(form.trainer_id)
          : null,
        capacity: Number(form.capacity) || 20,
      };

      if (editingId) {
        await updateSchedule(editingId, payload);
      } else {
        await createSchedule(payload);
      }

      resetForm();
      await loadData();
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save schedule.");
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this schedule?"
    );

    if (!confirmed) return;

    setError("");

    try {
      await deleteSchedule(id);
      await loadData();
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to delete schedule.");
    }
  }

  function getTrainerName(trainerId) {
    const trainer = trainers.find(
      (item) => String(item.id) === String(trainerId)
    );

    return trainer?.name || "Unassigned";
  }

  function formatDate(date) {
    if (!date) return "-";

    const value = new Date(`${date}T00:00:00`);

    return value.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function formatTime(time) {
    if (!time) return "-";

    const [hour, minute] = time.split(":");

    const date = new Date();

    date.setHours(Number(hour));
    date.setMinutes(Number(minute));
    date.setSeconds(0);

    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Schedules</h1>

          <p>
            Manage fitness training schedules.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={handleAddClick}
        >
          + Add Schedule
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {showForm && (
        <div className="form-card">
          <div className="card-header">
            <div>
              <h2>
                {editingId
                  ? "Edit Schedule"
                  : "Add Schedule"}
              </h2>

              <p>
                Create a training session and assign a trainer.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">
                Title
              </label>

              <input
                id="title"
                name="title"
                type="text"
                value={form.title}
                onChange={handleChange}
                placeholder="Example: Morning Strength Training"
              />
            </div>

            <div className="form-group">
              <label htmlFor="schedule_date">
                Date
              </label>

              <input
                id="schedule_date"
                name="schedule_date"
                type="date"
                value={form.schedule_date}
                onChange={handleChange}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "15px",
              }}
            >
              <div className="form-group">
                <label htmlFor="start_time">
                  Start Time
                </label>

                <input
                  id="start_time"
                  name="start_time"
                  type="time"
                  value={form.start_time}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="end_time">
                  End Time
                </label>

                <input
                  id="end_time"
                  name="end_time"
                  type="time"
                  value={form.end_time}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="trainer_id">
                Trainer
              </label>

              <select
                id="trainer_id"
                name="trainer_id"
                value={form.trainer_id}
                onChange={handleChange}
              >
                <option value="">
                  Select Trainer
                </option>

                {trainers.map((trainer) => (
                  <option
                    key={trainer.id}
                    value={trainer.id}
                  >
                    {trainer.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="capacity">
                Capacity
              </label>

              <input
                id="capacity"
                name="capacity"
                type="number"
                min="1"
                value={form.capacity}
                onChange={handleChange}
              />
            </div>

            <div
              style={{
                display: "flex",
                gap: "8px",
              }}
            >
              <button type="submit">
                {editingId
                  ? "Update Schedule"
                  : "Add Schedule"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                style={{
                  background: "#f1f3f5",
                  color: "#555",
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="content-card">
        <div className="section-header">
          <div>
            <h2>All Schedules</h2>

            <p>
              {schedules.length}{" "}
              {schedules.length === 1
                ? "schedule"
                : "schedules"}
            </p>
          </div>

          <button
            type="button"
            onClick={loadData}
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : schedules.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              📅
            </div>

            <h3>
              No schedules yet
            </h3>

            <p>
              Add your first training schedule.
            </p>

            <button
              className="primary-btn"
              onClick={handleAddClick}
            >
              + Add Schedule
            </button>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Trainer</th>
                  <th>Capacity</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {schedules.map((schedule) => (
                  <tr key={schedule.id}>
                    <td>
                      <strong>
                        {schedule.title}
                      </strong>
                    </td>

                    <td>
                      {formatDate(
                        schedule.schedule_date
                      )}
                    </td>

                    <td>
                      {formatTime(
                        schedule.start_time
                      )}
                      {" - "}
                      {formatTime(
                        schedule.end_time
                      )}
                    </td>

                    <td>
                      {getTrainerName(
                        schedule.trainer_id
                      )}
                    </td>

                    <td>
                      {schedule.capacity ?? 20}
                    </td>

                    <td>
                      <div className="actions">
                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(schedule)
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="delete"
                          onClick={() =>
                            handleDelete(
                              schedule.id
                            )
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Schedules;