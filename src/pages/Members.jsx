import {
  useEffect,
  useState
} from "react";

import {
  getMembers,
  addMember,
  updateMember,
  deleteMember
} from "../services/memberService";

function Members() {

  const emptyForm = {
    name: "",
    email: "",
    phone: "",
    gender: "",
    age: "",
    membership_type: "",
    membership_start: "",
    membership_end: ""
  };

  const [members, setMembers] =
    useState([]);

  const [form, setForm] =
    useState(emptyForm);

  const [editingId, setEditingId] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function loadMembers() {

    try {

      const data =
        await getMembers();

      setMembers(data);

    } catch (error) {

      alert(error.message);

    }
  }

  useEffect(() => {
    loadMembers();
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
      !form.name.trim() ||
      !form.email.trim()
    ) {

      alert(
        "Name and email are required."
      );

      return;
    }

    try {

      setLoading(true);

      const member = {

        name:
          form.name.trim(),

        email:
          form.email.trim(),

        phone:
          form.phone.trim() || null,

        gender:
          form.gender || null,

        age:
          form.age
            ? Number(form.age)
            : null,

        membership_type:
          form.membership_type ||
          null,

        membership_start:
          form.membership_start ||
          null,

        membership_end:
          form.membership_end ||
          null

      };

      if (editingId) {

        await updateMember(
          editingId,
          member
        );

        alert(
          "Member updated successfully."
        );

      } else {

        await addMember(member);

        alert(
          "Member added successfully."
        );
      }

      setForm(emptyForm);
      setEditingId(null);

      await loadMembers();

    } catch (error) {

      alert(error.message);

    } finally {

      setLoading(false);

    }
  }

  function handleEdit(member) {

    setEditingId(member.id);

    setForm({

      name:
        member.name || "",

      email:
        member.email || "",

      phone:
        member.phone || "",

      gender:
        member.gender || "",

      age:
        member.age || "",

      membership_type:
        member.membership_type || "",

      membership_start:
        member.membership_start || "",

      membership_end:
        member.membership_end || ""

    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  async function handleDelete(id) {

    if (
      !window.confirm(
        "Delete this member?"
      )
    ) {
      return;
    }

    try {

      await deleteMember(id);

      await loadMembers();

    } catch (error) {

      alert(error.message);

    }
  }

  function cancelEdit() {

    setEditingId(null);
    setForm(emptyForm);

  }

  const filteredMembers =
    members.filter(
      (member) => {

        const value =
          search
            .toLowerCase()
            .trim();

        if (!value) {
          return true;
        }

        return (
          member.name
            ?.toLowerCase()
            .includes(value) ||

          member.email
            ?.toLowerCase()
            .includes(value) ||

          member.phone
            ?.toLowerCase()
            .includes(value) ||

          member.membership_type
            ?.toLowerCase()
            .includes(value)
        );
      }
    );

  return (
    <div className="page">

      <div className="page-header">

        <div>

          <h1>
            Members
          </h1>

          <p>
            Manage fitness center members.
          </p>

        </div>

        <span className="record-count">
          {members.length} Members
        </span>

      </div>

      <div className="form-card">

        <h2>
          {editingId
            ? "Edit Member"
            : "Add New Member"}
        </h2>

        <form
          className="management-form"
          onSubmit={handleSubmit}
        >

          <div className="input-group">

            <label>
              Full Name *
            </label>

            <input
              name="name"
              placeholder="Full name"
              value={form.name}
              onChange={handleChange}
            />

          </div>

          <div className="input-group">

            <label>
              Email *
            </label>

            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />

          </div>

          <div className="input-group">

            <label>
              Phone
            </label>

            <input
              name="phone"
              placeholder="Phone number"
              value={form.phone}
              onChange={handleChange}
            />

          </div>

          <div className="input-group">

            <label>
              Gender
            </label>

            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
            >

              <option value="">
                Select gender
              </option>

              <option value="Male">
                Male
              </option>

              <option value="Female">
                Female
              </option>

              <option value="Other">
                Other
              </option>

            </select>

          </div>

          <div className="input-group">

            <label>
              Age
            </label>

            <input
              name="age"
              type="number"
              min="1"
              placeholder="Age"
              value={form.age}
              onChange={handleChange}
            />

          </div>

          <div className="input-group">

            <label>
              Membership
            </label>

            <select
              name="membership_type"
              value={
                form.membership_type
              }
              onChange={handleChange}
            >

              <option value="">
                Select membership
              </option>

              <option value="Monthly">
                Monthly
              </option>

              <option value="Quarterly">
                Quarterly
              </option>

              <option value="Half Yearly">
                Half Yearly
              </option>

              <option value="Yearly">
                Yearly
              </option>

            </select>

          </div>

          <div className="input-group">

            <label>
              Membership Start
            </label>

            <input
              name="membership_start"
              type="date"
              value={
                form.membership_start
              }
              onChange={handleChange}
            />

          </div>

          <div className="input-group">

            <label>
              Membership End
            </label>

            <input
              name="membership_end"
              type="date"
              value={
                form.membership_end
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
                ? "Update Member"
                : "Add Member"}
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
              Member List
            </h2>

            <p>
              All registered members.
            </p>

          </div>

          <input
            className="search-input"
            placeholder="Search members..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>

        <div className="table-container">

          <table>

            <thead>

              <tr>

                <th>
                  Member
                </th>

                <th>
                  Contact
                </th>

                <th>
                  Membership
                </th>

                <th>
                  Start
                </th>

                <th>
                  End
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

                      <div className="person-cell">

                        <div className="person-avatar">
                          {member.name
                            ?.charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>

                          <strong>
                            {member.name}
                          </strong>

                          <small>
                            {member.age
                              ? `${member.age} years`
                              : ""}
                          </small>

                        </div>

                      </div>

                    </td>

                    <td>

                      <div className="contact-cell">

                        <span>
                          {member.email}
                        </span>

                        <small>
                          {member.phone ||
                            "No phone"}
                        </small>

                      </div>

                    </td>

                    <td>

                      <span className="status-badge">
                        {member.membership_type ||
                          "Not Set"}
                      </span>

                    </td>

                    <td>
                      {member.membership_start ||
                        "—"}
                    </td>

                    <td>
                      {member.membership_end ||
                        "—"}
                    </td>

                    <td>

                      <button
                        className="small-button"
                        onClick={() =>
                          handleEdit(
                            member
                          )
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="small-button delete-button"
                        onClick={() =>
                          handleDelete(
                            member.id
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

          {filteredMembers.length === 0 && (

            <div className="empty-message">
              No members found.
            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default Members;