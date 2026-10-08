import { useEffect, useState } from "react";

import {
  getMembers,
  addMember,
  updateMember,
  deleteMember,
} from "../services/memberService";

function Members() {
  const [members, setMembers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  /* =====================================================
     LOAD MEMBERS
  ===================================================== */

  useEffect(() => {
    loadMembers();
  }, []);

  async function loadMembers() {
    setLoading(true);
    setError("");

    try {
      const data = await getMembers();

      setMembers(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(
        "Error loading members:",
        err
      );

      setMembers([]);

      setError(
        err?.message ||
          "Unable to load members."
      );
    } finally {
      setLoading(false);
    }
  }

  /* =====================================================
     FORM CHANGE
  ===================================================== */

  function handleChange(event) {
    const { name, value } =
      event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  /* =====================================================
     OPEN ADD FORM
  ===================================================== */

  function openAddForm() {
    setEditingId(null);

    setForm({
      name: "",
      email: "",
      phone: "",
    });

    setError("");

    setShowForm(true);
  }

  /* =====================================================
     OPEN EDIT FORM
  ===================================================== */

  function openEditForm(member) {
    setEditingId(member.id);

    setForm({
      name: member.name || "",
      email: member.email || "",
      phone: member.phone || "",
    });

    setError("");

    setShowForm(true);
  }

  /* =====================================================
     CLOSE FORM
  ===================================================== */

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
    });

    setError("");
  }

  /* =====================================================
     SAVE MEMBER
  ===================================================== */

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    const name =
      form.name.trim();

    const email =
      form.email.trim();

    const phone =
      form.phone.trim();

    if (!name) {
      setError(
        "Please enter the member name."
      );
      return;
    }

    if (!email) {
      setError(
        "Please enter the member email."
      );
      return;
    }

    setSaving(true);

    try {
      const memberData = {
        name,
        email,
        phone,
      };

      if (editingId) {
        await updateMember(
          editingId,
          memberData
        );
      } else {
        await addMember(memberData);
      }

      await loadMembers();

      closeForm();
    } catch (err) {
      console.error(
        "Error saving member:",
        err
      );

      setError(
        err?.message ||
          "Unable to save member."
      );
    } finally {
      setSaving(false);
    }
  }

  /* =====================================================
     DELETE MEMBER
  ===================================================== */

  async function handleDelete(id) {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this member?"
      );

    if (!confirmed) {
      return;
    }

    setError("");

    try {
      await deleteMember(id);

      setMembers((current) =>
        current.filter(
          (member) =>
            member.id !== id
        )
      );
    } catch (err) {
      console.error(
        "Error deleting member:",
        err
      );

      setError(
        err?.message ||
          "Unable to delete member."
      );
    }
  }

  /* =====================================================
     SEARCH
  ===================================================== */

  const searchText =
    search.trim().toLowerCase();

  const filteredMembers =
    Array.isArray(members)
      ? members.filter((member) => {
          const name =
            String(
              member.name || ""
            ).toLowerCase();

          const email =
            String(
              member.email || ""
            ).toLowerCase();

          const phone =
            String(
              member.phone || ""
            ).toLowerCase();

          return (
            name.includes(searchText) ||
            email.includes(searchText) ||
            phone.includes(searchText)
          );
        })
      : [];

  /* =====================================================
     FORMAT DATE
  ===================================================== */

  function formatDate(date) {
    if (!date) {
      return "-";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  }

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div className="page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="page-header">

        <div>
          <h1>Members</h1>

          <p>
            Manage your fitness center
            members.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={openAddForm}
        >
          + Add Member
        </button>

      </div>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}


      {/* =================================================
          SEARCH
      ================================================= */}

      <div className="content-card">

        <div className="search-row">

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search members by name, email or phone..."
            className="search-input"
          />

          <button
            type="button"
            className="secondary-button"
            onClick={loadMembers}
            disabled={loading}
          >
            {loading
              ? "Loading..."
              : "Refresh"}
          </button>

        </div>

      </div>


      {/* =================================================
          MEMBER FORM
      ================================================= */}

      {showForm && (
        <div className="content-card">

          <div className="section-header">

            <div>
              <h2>
                {editingId
                  ? "Edit Member"
                  : "Add Member"}
              </h2>

              <p>
                Enter the member
                information below.
              </p>
            </div>

          </div>


          <form
            onSubmit={handleSubmit}
            className="form-grid"
          >

            <div className="form-group">

              <label htmlFor="member-name">
                Name
              </label>

              <input
                id="member-name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter member name"
                required
              />

            </div>


            <div className="form-group">

              <label htmlFor="member-email">
                Email
              </label>

              <input
                id="member-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter email address"
                required
              />

            </div>


            <div className="form-group">

              <label htmlFor="member-phone">
                Phone
              </label>

              <input
                id="member-phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
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
                  ? "Update Member"
                  : "Add Member"}
              </button>

            </div>

          </form>

        </div>
      )}


      {/* =================================================
          MEMBERS TABLE
      ================================================= */}

      <div className="content-card">

        <div className="section-header">

          <div>
            <h2>
              All Members
            </h2>

            <p>
              {filteredMembers.length}{" "}
              member
              {filteredMembers.length !==
              1
                ? "s"
                : ""}
            </p>
          </div>

        </div>


        {loading ? (
          <div className="empty-state">
            <div className="loading-spinner">
              Loading members...
            </div>
          </div>
        ) : filteredMembers.length ===
          0 ? (
          <div className="empty-state">

            <div className="empty-icon">
              👥
            </div>

            <h3>
              {search
                ? "No members found"
                : "No members yet"}
            </h3>

            <p>
              {search
                ? "Try a different search."
                : "Add your first member to get started."}
            </p>

            {!search && (
              <button
                type="button"
                className="primary-button"
                onClick={openAddForm}
              >
                + Add Member
              </button>
            )}

          </div>
        ) : (
          <div className="table-container">

            <table className="data-table">

              <thead>
                <tr>

                  <th>
                    Name
                  </th>

                  <th>
                    Email
                  </th>

                  <th>
                    Phone
                  </th>

                  <th>
                    Joined
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>
              </thead>


              <tbody>

                {filteredMembers.map(
                  (member) => (
                    <tr
                      key={member.id}
                    >

                      <td>
                        <div className="member-name">
                          <span className="member-avatar">
                            {(
                              member.name ||
                              "M"
                            )
                              .charAt(0)
                              .toUpperCase()}
                          </span>

                          <strong>
                            {member.name ||
                              "-"}
                          </strong>
                        </div>
                      </td>


                      <td>
                        {member.email ||
                          "-"}
                      </td>


                      <td>
                        {member.phone ||
                          "-"}
                      </td>


                      <td>
                        {formatDate(
                          member.created_at
                        )}
                      </td>


                      <td>

                        <div className="table-actions">

                          <button
                            type="button"
                            className="edit-button"
                            onClick={() =>
                              openEditForm(
                                member
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
                                member.id
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

export default Members;