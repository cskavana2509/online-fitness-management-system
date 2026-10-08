import { useEffect, useState } from "react";
import {
  getTrainers,
  createTrainer,
  updateTrainer,
  deleteTrainer,
} from "../services/trainerService";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  specialization: "",
  experience_years: "",
  bio: "",
};

function Trainers() {
  const [trainers, setTrainers] = useState([]);
  const [filteredTrainers, setFilteredTrainers] = useState([]);

  const [formData, setFormData] = useState(emptyForm);

  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadTrainers();
  }, []);

  useEffect(() => {
    filterTrainers();
  }, [search, trainers]);

  const loadTrainers = async () => {
    setLoading(true);
    setError("");

    const { data, error } = await getTrainers();

    if (error) {
      setError(error.message || "Unable to load trainers.");
    } else {
      setTrainers(data || []);
    }

    setLoading(false);
  };

  const filterTrainers = () => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) {
      setFilteredTrainers(trainers);
      return;
    }

    const filtered = trainers.filter((trainer) => {
      return (
        trainer.name?.toLowerCase().includes(searchValue) ||
        trainer.email?.toLowerCase().includes(searchValue) ||
        trainer.phone?.toLowerCase().includes(searchValue) ||
        trainer.specialization?.toLowerCase().includes(searchValue)
      );
    });

    setFilteredTrainers(filtered);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.name.trim()) {
      setError("Trainer name is required.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Email is required.");
      return;
    }

    setSaving(true);

    try {
      const trainerData = {
        ...formData,
        experience_years: formData.experience_years
          ? Number(formData.experience_years)
          : null,
      };

      let response;

      if (editingId) {
        response = await updateTrainer(editingId, trainerData);
      } else {
        response = await createTrainer(trainerData);
      }

      if (response.error) {
        setError(response.error.message || "Unable to save trainer.");
        return;
      }

      setSuccess(
        editingId
          ? "Trainer updated successfully."
          : "Trainer added successfully."
      );

      resetForm();

      await loadTrainers();
    } catch (error) {
      console.error(error);
      setError("Something went wrong while saving the trainer.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (trainer) => {
    setEditingId(trainer.id);

    setFormData({
      name: trainer.name || "",
      email: trainer.email || "",
      phone: trainer.phone || "",
      specialization: trainer.specialization || "",
      experience_years:
        trainer.experience_years !== null &&
        trainer.experience_years !== undefined
          ? trainer.experience_years
          : "",
      bio: trainer.bio || "",
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this trainer?"
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");

    const { error } = await deleteTrainer(id);

    if (error) {
      setError(error.message || "Unable to delete trainer.");
      return;
    }

    setSuccess("Trainer deleted successfully.");

    if (editingId === id) {
      resetForm();
    }

    await loadTrainers();
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Trainers</h1>
          <p>Manage fitness trainers and their professional information.</p>
        </div>
      </div>

      {error && <div className="alert error-alert">{error}</div>}

      {success && <div className="alert success-alert">{success}</div>}

      <div className="content-grid">
        <div className="form-card">
          <div className="card-header">
            <div>
              <h2>{editingId ? "Edit Trainer" : "Add Trainer"}</h2>

              <p>
                {editingId
                  ? "Update trainer information."
                  : "Create a new trainer profile."}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="trainer-name">Full Name *</label>

              <input
                id="trainer-name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter trainer name"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="trainer-email">Email *</label>

                <input
                  id="trainer-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="trainer@example.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="trainer-phone">Phone</label>

                <input
                  id="trainer-phone"
                  name="phone"
                  type="text"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone number"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="specialization">Specialization</label>

                <input
                  id="specialization"
                  name="specialization"
                  type="text"
                  value={formData.specialization}
                  onChange={handleChange}
                  placeholder="e.g. Strength Training"
                />
              </div>

              <div className="form-group">
                <label htmlFor="experience_years">
                  Experience (Years)
                </label>

                <input
                  id="experience_years"
                  name="experience_years"
                  type="number"
                  min="0"
                  value={formData.experience_years}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="bio">Bio</label>

              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Enter trainer biography"
                rows="5"
              />
            </div>

            <div className="form-actions">
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

              {editingId && (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="table-card">
          <div className="card-header members-list-header">
            <div>
              <h2>Trainer List</h2>
              <p>{filteredTrainers.length} trainer(s) found.</p>
            </div>

            <div className="search-box">
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search trainers..."
              />
            </div>
          </div>

          {loading ? (
            <div className="loading-box">Loading trainers...</div>
          ) : filteredTrainers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏋️</div>

              <h3>No trainers found</h3>

              <p>
                {search
                  ? "Try changing your search."
                  : "Add your first trainer using the form."}
              </p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Specialization</th>
                    <th>Experience</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTrainers.map((trainer) => (
                    <tr key={trainer.id}>
                      <td>
                        <strong>{trainer.name}</strong>
                      </td>

                      <td>{trainer.email || "-"}</td>

                      <td>{trainer.phone || "-"}</td>

                      <td>
                        {trainer.specialization || "General Trainer"}
                      </td>

                      <td>
                        {trainer.experience_years !== null &&
                        trainer.experience_years !== undefined
                          ? `${trainer.experience_years} years`
                          : "-"}
                      </td>

                      <td>
                        <div className="table-actions">
                          <button
                            type="button"
                            className="edit-button"
                            onClick={() => handleEdit(trainer)}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="delete-button"
                            onClick={() => handleDelete(trainer.id)}
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
    </div>
  );
}

export default Trainers;