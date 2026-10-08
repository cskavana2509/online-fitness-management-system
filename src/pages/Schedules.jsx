import {
  useEffect,
  useState
} from "react";

import {
  getSchedules,
  addSchedule,
  updateSchedule,
  deleteSchedule
} from "../services/scheduleService";

import {
  getTrainers
} from "../services/trainerService";

function Schedules() {

  const emptyForm = {
    title: "",
    trainer_id: "",
    schedule_date: "",
    start_time: "",
    end_time: "",
    capacity: 20
  };

  const [schedules, setSchedules] =
    useState([]);

  const [trainers, setTrainers] =
    useState([]);

  const [form, setForm] =
    useState(emptyForm);

  const [editingId, setEditingId] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  async function loadData() {

    try {

      const [
        scheduleData,
        trainerData
      ] = await Promise.all([
        getSchedules(),
        getTrainers()
      ]);

      setSchedules(scheduleData);
      setTrainers(trainerData);

    } catch (error) {

      alert(error.message);

    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleChange(e) {

    setForm({
      ...form,
      [e.target.name]:
        e.target.value
    });
  }

  async function handleSubmit(e) {

    e.preventDefault();

    if (
      !form.title.trim() ||
      !form.schedule_date ||
      !form.start_time ||
      !form.end_time
    ) {

      alert(
        "Please fill all required fields."
      );

      return;
    }

    try {

      setLoading(true);

      const schedule = {

        title:
          form.title.trim(),

        trainer_id:
          form.trainer_id
            ? Number(
                form.trainer_id
              )
            : null,

        schedule_date:
          form.schedule_date,

        start_time:
          form.start_time,

        end_time:
          form.end_time,

        capacity:
          form.capacity
            ? Number(form.capacity)
            : 20
      };

      if (editingId) {

        await updateSchedule(
          editingId,
          schedule
        );

        alert(
          "Schedule updated successfully."
        );

      } else {

        await addSchedule(
          schedule
        );

        alert(
          "Schedule added successfully."
        );

      }

      setForm(emptyForm);
      setEditingId(null);

      await loadData();

    } catch (error) {

      alert(error.message);

    } finally {

      setLoading(false);

    }
  }

  function handleEdit(schedule) {

    setEditingId(schedule.id);

    setForm({

      title:
        schedule.title || "",

      trainer_id:
        schedule.trainer_id || "",

      schedule_date:
        schedule.schedule_date || "",

      start_time:
        schedule.start_time || "",

      end_time:
        schedule.end_time || "",

      capacity:
        schedule.capacity || 20

    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  async function handleDelete(id) {

    if (
      !window.confirm(
        "Delete this schedule?"
      )
    ) {
      return;
    }

    try {

      await deleteSchedule(id);

      await loadData();

    } catch (error) {

      alert(error.message);

    }
  }

  function cancelEdit() {

    setEditingId(null);
    setForm(emptyForm);

  }

  return (
    <div className="page">

      <div className="page-header">

        <div>

          <h1>
            Schedules
          </h1>

          <p>
            Manage classes and training sessions.
          </p>

        </div>

        <span className="record-count">
          {schedules.length} Sessions
        </span>

      </div>

      <div className="form-card">

        <h2>
          {editingId
            ? "Edit Schedule"
            : "Create Schedule"}
        </h2>

        <form
          className="management-form"
          onSubmit={handleSubmit}
        >

          <div className="input-group">

            <label>
              Session Name *
            </label>

            <input
              name="title"
              placeholder="Morning Strength Training"
              value={form.title}
              onChange={handleChange}
            />

          </div>

          <div className="input-group">

            <label>
              Trainer
            </label>

            <select
              name="trainer_id"
              value={
                form.trainer_id
              }
              onChange={handleChange}
            >

              <option value="">
                Select trainer
              </option>

              {trainers.map(
                (trainer) => (

                  <option
                    key={trainer.id}
                    value={trainer.id}
                  >
                    {trainer.name}
                  </option>

                )
              )}

            </select>

          </div>

          <div className="input-group">

            <label>
              Date *
            </label>

            <input
              name="schedule_date"
              type="date"
              value={
                form.schedule_date
              }
              onChange={handleChange}
            />

          </div>

          <div className="input-group">

            <label>
              Start Time *
            </label>

            <input
              name="start_time"
              type="time"
              value={
                form.start_time
              }
              onChange={handleChange}
            />

          </div>

          <div className="input-group">

            <label>
              End Time *
            </label>

            <input
              name="end_time"
              type="time"
              value={
                form.end_time
              }
              onChange={handleChange}
            />

          </div>

          <div className="input-group">

            <label>
              Capacity
            </label>

            <input
              name="capacity"
              type="number"
              min="1"
              value={
                form.capacity
              }
              onChange={handleChange}
            />

          </div>

          <div className="form-buttons">

            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : editingId
                ? "Update Schedule"
                : "Add Schedule"}
            </button>

            {editingId && (

              <button
                type="button"
                className="secondary-button"
                onClick={cancelEdit}
              >
                Cancel
              </button>

            )}

          </div>

        </form>

      </div>

      <div className="table-card">

        <div className="table-header">

          <div>

            <h2>
              Training Schedule
            </h2>

            <p>
              All scheduled training sessions.
            </p>

          </div>

        </div>

        <div className="table-container">

          <table>

            <thead>

              <tr>

                <th>
                  Session
                </th>

                <th>
                  Trainer
                </th>

                <th>
                  Date
                </th>

                <th>
                  Time
                </th>

                <th>
                  Capacity
                </th>

                <th>
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {schedules.map(
                (schedule) => (

                  <tr
                    key={schedule.id}
                  >

                    <td>

                      <strong>
                        {schedule.title}
                      </strong>

                    </td>

                    <td>
                      {schedule.trainers?.name ||
                        "Not assigned"}
                    </td>

                    <td>
                      {schedule.schedule_date}
                    </td>

                    <td>

                      {schedule.start_time}
                      {" - "}
                      {schedule.end_time}

                    </td>

                    <td>

                      <span className="capacity-badge">
                        {schedule.capacity}
                      </span>

                    </td>

                    <td>

                      <button
                        className="small-button"
                        onClick={() =>
                          handleEdit(
                            schedule
                          )
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="small-button delete-button"
                        onClick={() =>
                          handleDelete(
                            schedule.id
                          )
                        }
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

          {schedules.length === 0 && (

            <div className="empty-message">
              No schedules found.
            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default Schedules;