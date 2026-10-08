import { useEffect, useState } from "react";

import {
  getTrainers,
  createTrainer,
  updateTrainer,
  deleteTrainer,
} from "../services/trainerService";

function Trainers() {
  const [trainers, setTrainers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
  });

  useEffect(() => {
    loadTrainers();
  }, []);

  async function loadTrainers() {
    setLoading(true);
    setError("");

    try {
      const data = await getTrainers();

      setTrainers(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(
        "Error loading trainers:",
        err
      );

      setTrainers([]);

      setError(
        err?.message ||
          "Unable to load trainers."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value } =
      event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function openAddForm() {
    setEditingId(null);

    setForm({
      name: "",
      email: "",
      phone: "",
      specialization: "",
    });

    setError("");
    setShowForm(true);
  }

  function openEditForm(trainer) {
    setEditingId(trainer.id);

    setForm({
      name: trainer.name || "",
      email: trainer.email || "",
      phone: trainer.phone || "",
      specialization:
        trainer.specialization || "",
    });

    setError("");
    setShowForm(true);
  }

  function closeForm() {
    if (saving) {
      return;
    }

    setShowForm(false);
    setEditingId(null);

    setForm({
      name: "",
      email: "",
      phone: "",
      specialization: "",
    });

    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    const name = form.name.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();
    const specialization =
      form.specialization.trim();

    if (!name) {
      setError(
        "Please enter the trainer name."
      );
      return;
    }

    if (!email) {
      setError(
        "Please enter the trainer email."
      );
      return;
    }

    setSaving(true);

    try {
      const trainerData = {
        name,
        email,
        phone,
        specialization,
      };

      if (editingId) {
        await updateTrainer(
          editingId,
          trainerData
        );
      } else {
        await createTrainer(
          trainerData
        );
      }

      await loadTrainers();

      closeForm();
    } catch (err) {
      console.error(
        "Error saving trainer:",
        err
      );

      setError(
        err?.message ||
          "Unable to save trainer."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this trainer?"
      );

    if (!confirmed) {
      return;
    }

    setError("");

    try {
      await deleteTrainer(id);

      setTrainers((current) =>
        current.filter(
          (trainer) =>
            trainer.id !== id
        )
      );
    } catch (err) {
      console.error(
        "Error deleting trainer:",
        err
      );

      setError(
        err?.message ||
          "Unable to delete trainer."
      );
    }
  }

  const searchText =
    search.trim().toLowerCase();

  const filteredTrainers =
    Array.isArray(trainers)
      ? trainers.filter((trainer) => {
          const name = String(
            trainer.name || ""
          ).toLowerCase();

          const email = String(
            trainer.email || ""
          ).toLowerCase();

          const phone = String(
            trainer.phone || ""
          ).toLowerCase();

          const specialization =
            String(
              trainer.specialization ||
                ""
            ).toLowerCase();

          return (
            name.includes(searchText) ||
            email.includes(searchText) ||
            phone.includes(searchText) ||
            specialization.includes(
              searchText
            )
          );
        })
      : [];

  function formatDate(date) {
    if (!date) {
      return "-";
    }

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "-";
    }

    return parsed.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  }

  return (
    <div className="page">

      <div className="page-header">
        <div>
          <h1>Trainers</h1>

          <p>
            Manage your fitness trainers.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={openAddForm}
        >
          + Add Trainer
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="content-card">
        <div className="search-row">

          <input
            type="text"
            className="search-input"
            placeholder="Search trainers..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
          />

          <button
            type="button"
            className="secondary-button"
            onClick={loadTrainers}
            disabled={loading}
          >
            {loading
              ? "Loading..."
              : "Refresh"}
          </button>

        </div>
      </div>

      {showForm && (
        <div className="content-card">

          <div className="section-header">
            <div>
              <h2>
                {editingId
                  ? "Edit Trainer"
                  : "Add Trainer"}
              </h2>

              <p>
                Enter trainer information.
              </p>
            </div>
          </div>

          <form
            className="form-grid"
            onSubmit={handleSubmit}
          >

            <div className="form-group">
              <label>
                Name
              </label>

              <input
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Trainer name"
                required
              />
            </div>

            <div className="form-group">
              <label>
                Email
              </label>

              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Trainer email"
                required
              />
            </div>

            <div className="form-group">
              <label>
                Phone
              </label>

              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone number"
              />
            </div>

            <div className="form-group">
              <label>
                Specialization
              </label>

              <input
                name="specialization"
                type="text"
                value={
                  form.specialization
                }
                onChange={handleChange}
                placeholder="e.g. Strength Training"
              />
            </div>

            <div className="form-actions">

              <button
                type="button"
                className="secondary-button"
                onClick={closeForm}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Trainer"
                  : "Add Trainer"}
              </button>

            </div>

          </form>
        </div>
      )}

      <div className="content-card">

        <div className="section-header">
          <div>
            <h2>
              All Trainers
            </h2>

            <p>
              {filteredTrainers.length}{" "}
              trainer
              {filteredTrainers.length !==
              1
                ? "s"
                : ""}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="empty-state">
            Loading trainers...
          </div>
        ) : filteredTrainers.length ===
          0 ? (
          <div className="empty-state">

            <div className="empty-icon">
              🏋️
            </div>

            <h3>
              {search
                ? "No trainers found"
                : "No trainers yet"}
            </h3>

            <p>
              {search
                ? "Try another search."
                : "Add your first trainer to get started."}
            </p>

            {!search && (
              <button
                type="button"
                className="primary-button"
                onClick={openAddForm}
              >
                + Add Trainer
              </button>
            )}

          </div>
        ) : (
          <div className="table-container">

            <table className="data-table">

              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Specialization</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredTrainers.map(
                  (trainer) => (
                    <tr
                      key={trainer.id}
                    >

                      <td>
                        <div className="member-name">

                          <span className="member-avatar">
                            {(
                              trainer.name ||
                              "T"
                            )
                              .charAt(0)
                              .toUpperCase()}
                          </span>

                          <strong>
                            {trainer.name ||
                              "-"}
                          </strong>

                        </div>
                      </td>

                      <td>
                        {trainer.email ||
                          "-"}
                      </td>

                      <td>
                        {trainer.phone ||
                          "-"}
                      </td>

                      <td>
                        {trainer.specialization ||
                          "-"}
                      </td>

                      <td>
                        {formatDate(
                          trainer.created_at
                        )}
                      </td>

                      <td>
                        <div className="table-actions">

                          <button
                            type="button"
                            className="edit-button"
                            onClick={() =>
                              openEditForm(
                                trainer
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="delete-button"
                            onClick={() =>
                              handleDelete(
                                trainer.id
                              )
                            }
                          >
                            Delete
                          </button>

                        </div>
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

export default Trainers;