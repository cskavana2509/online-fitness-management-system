import { useEffect, useState } from "react";

import {
  getWorkoutPlans,
  createWorkoutPlan,
  updateWorkoutPlan,
  deleteWorkoutPlan,
  getWorkoutExercises,
  createWorkoutExercise,
  updateWorkoutExercise,
  deleteWorkoutExercise,
} from "../services/workoutService";

import { getMembers } from "../services/memberService";
import { getTrainers } from "../services/trainerService";

function WorkoutPlans() {
  const [plans, setPlans] = useState([]);
  const [members, setMembers] = useState([]);
  const [trainers, setTrainers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [expandedPlan, setExpandedPlan] = useState(null);

  const [form, setForm] = useState({
    plan_name: "",
    member_id: "",
    trainer_id: "",
    goal: "",
    duration_weeks: "",
  });

  const [exerciseForm, setExerciseForm] = useState({
    exercise_name: "",
    sets: "",
    reps: "",
    duration_minutes: "",
    notes: "",
  });

  const [exercises, setExercises] = useState({});
  const [editingExerciseId, setEditingExerciseId] = useState(null);

  /* =========================================================
     LOAD DATA
     ========================================================= */

  useEffect(() => {
    loadEverything();
  }, []);

  async function loadEverything() {
    try {
      setLoading(true);
      setError("");

      const [plansData, membersData, trainersData] = await Promise.all([
        getWorkoutPlans(),
        getMembers(),
        getTrainers(),
      ]);

      setPlans(Array.isArray(plansData) ? plansData : []);
      setMembers(Array.isArray(membersData) ? membersData : []);
      setTrainers(Array.isArray(trainersData) ? trainersData : []);
    } catch (err) {
      console.error(err);
      setError(
        err?.message || "Unable to load workout plans."
      );
    } finally {
      setLoading(false);
    }
  }

  /* =========================================================
     FORM
     ========================================================= */

  function openCreateForm() {
    setEditingId(null);

    setForm({
      plan_name: "",
      member_id: "",
      trainer_id: "",
      goal: "",
      duration_weeks: "",
    });

    setError("");
    setShowForm(true);
  }

  function openEditForm(plan) {
    setEditingId(plan.id);

    setForm({
      plan_name: plan.plan_name || "",
      member_id: plan.member_id ? String(plan.member_id) : "",
      trainer_id: plan.trainer_id ? String(plan.trainer_id) : "",
      goal: plan.goal || "",
      duration_weeks:
        plan.duration_weeks !== null &&
        plan.duration_weeks !== undefined
          ? String(plan.duration_weeks)
          : "",
    });

    setError("");
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);

    setForm({
      plan_name: "",
      member_id: "",
      trainer_id: "",
      goal: "",
      duration_weeks: "",
    });
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.plan_name.trim()) {
      setError("Please enter a workout plan name.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        plan_name: form.plan_name.trim(),
        member_id: form.member_id || null,
        trainer_id: form.trainer_id || null,
        goal: form.goal.trim() || null,
        duration_weeks: form.duration_weeks || null,
      };

      if (editingId) {
        await updateWorkoutPlan(editingId, payload);
      } else {
        await createWorkoutPlan(payload);
      }

      closeForm();
      await loadEverything();
    } catch (err) {
      console.error(err);
      setError(
        err?.message || "Unable to save workout plan."
      );
    } finally {
      setSaving(false);
    }
  }

  /* =========================================================
     DELETE PLAN
     ========================================================= */

  async function handleDelete(plan) {
    const confirmed = window.confirm(
      `Delete workout plan "${plan.plan_name}"?`
    );

    if (!confirmed) return;

    try {
      setError("");

      await deleteWorkoutPlan(plan.id);

      if (expandedPlan === plan.id) {
        setExpandedPlan(null);
      }

      await loadEverything();
    } catch (err) {
      console.error(err);

      setError(
        err?.message || "Unable to delete workout plan."
      );
    }
  }

  /* =========================================================
     EXERCISES
     ========================================================= */

  async function toggleExercises(planId) {
    if (expandedPlan === planId) {
      setExpandedPlan(null);
      return;
    }

    try {
      setError("");

      const data = await getWorkoutExercises(planId);

      setExercises((previous) => ({
        ...previous,
        [planId]: Array.isArray(data) ? data : [],
      }));

      setExpandedPlan(planId);
    } catch (err) {
      console.error(err);

      setError(
        err?.message || "Unable to load exercises."
      );
    }
  }

  function handleExerciseChange(event) {
    const { name, value } = event.target;

    setExerciseForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function resetExerciseForm() {
    setExerciseForm({
      exercise_name: "",
      sets: "",
      reps: "",
      duration_minutes: "",
      notes: "",
    });

    setEditingExerciseId(null);
  }

  function startEditExercise(exercise) {
    setEditingExerciseId(exercise.id);

    setExerciseForm({
      exercise_name: exercise.exercise_name || "",
      sets:
        exercise.sets !== null &&
        exercise.sets !== undefined
          ? String(exercise.sets)
          : "",
      reps:
        exercise.reps !== null &&
        exercise.reps !== undefined
          ? String(exercise.reps)
          : "",
      duration_minutes:
        exercise.duration_minutes !== null &&
        exercise.duration_minutes !== undefined
          ? String(exercise.duration_minutes)
          : "",
      notes: exercise.notes || "",
    });
  }

  async function saveExercise(planId) {
    if (!exerciseForm.exercise_name.trim()) {
      setError("Please enter an exercise name.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      if (editingExerciseId) {
        await updateWorkoutExercise(
          editingExerciseId,
          exerciseForm
        );
      } else {
        await createWorkoutExercise({
          ...exerciseForm,
          workout_plan_id: planId,
        });
      }

      const refreshedExercises =
        await getWorkoutExercises(planId);

      setExercises((previous) => ({
        ...previous,
        [planId]: refreshedExercises,
      }));

      resetExerciseForm();
    } catch (err) {
      console.error(err);

      setError(
        err?.message || "Unable to save exercise."
      );
    } finally {
      setSaving(false);
    }
  }

  async function removeExercise(exercise, planId) {
    const confirmed = window.confirm(
      `Delete "${exercise.exercise_name}"?`
    );

    if (!confirmed) return;

    try {
      setError("");

      await deleteWorkoutExercise(exercise.id);

      const refreshedExercises =
        await getWorkoutExercises(planId);

      setExercises((previous) => ({
        ...previous,
        [planId]: refreshedExercises,
      }));
    } catch (err) {
      console.error(err);

      setError(
        err?.message || "Unable to delete exercise."
      );
    }
  }

  /* =========================================================
     HELPERS
     ========================================================= */

  function getMemberName(memberId, plan) {
    if (plan?.members?.name) {
      return plan.members.name;
    }

    const member = members.find(
      (item) => String(item.id) === String(memberId)
    );

    return member?.name || "Not assigned";
  }

  function getTrainerName(trainerId, plan) {
    if (plan?.trainers?.name) {
      return plan.trainers.name;
    }

    const trainer = trainers.find(
      (item) => String(item.id) === String(trainerId)
    );

    return trainer?.name || "Not assigned";
  }

  /* =========================================================
     LOADING
     ========================================================= */

  if (loading) {
    return (
      <div className="page">
        <div className="page-header">
          <div>
            <h1>Workout Plans</h1>
            <p>Manage workout plans for your members.</p>
          </div>
        </div>

        <div className="loading-card">
          <div className="spinner"></div>
          <p>Loading workout plans...</p>
        </div>
      </div>
    );
  }

  /* =========================================================
     UI
     ========================================================= */

  return (
    <div className="page">
      {/* HEADER */}

      <div className="page-header">
        <div>
          <h1>Workout Plans</h1>

          <p>
            Create and manage personalized workout plans.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={openCreateForm}
        >
          + Create Workout Plan
        </button>
      </div>

      {/* ERROR */}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* FORM */}

      {showForm && (
        <div className="form-card">
          <div className="form-card-header">
            <div>
              <h2>
                {editingId
                  ? "Edit Workout Plan"
                  : "Create Workout Plan"}
              </h2>

              <p>
                Assign the plan to a member and trainer.
              </p>
            </div>

            <button
              className="close-btn"
              onClick={closeForm}
              type="button"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Plan Name *</label>

                <input
                  type="text"
                  name="plan_name"
                  value={form.plan_name}
                  onChange={handleChange}
                  placeholder="Example: Weight Loss Program"
                  required
                />
              </div>

              <div className="form-group">
                <label>Member</label>

                <select
                  name="member_id"
                  value={form.member_id}
                  onChange={handleChange}
                >
                  <option value="">
                    Select Member
                  </option>

                  {members.map((member) => (
                    <option
                      key={member.id}
                      value={member.id}
                    >
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Trainer</label>

                <select
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
                <label>Goal</label>

                <input
                  type="text"
                  name="goal"
                  value={form.goal}
                  onChange={handleChange}
                  placeholder="Weight loss, muscle gain..."
                />
              </div>

              <div className="form-group">
                <label>Duration (Weeks)</label>

                <input
                  type="number"
                  min="1"
                  name="duration_weeks"
                  value={form.duration_weeks}
                  onChange={handleChange}
                  placeholder="12"
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="secondary-btn"
                onClick={closeForm}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-btn"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Plan"
                  : "Create Plan"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* PLANS */}

      <div className="content-card">
        <div className="content-card-header">
          <div>
            <h2>All Workout Plans</h2>

            <p>
              {plans.length}{" "}
              {plans.length === 1 ? "plan" : "plans"}
            </p>
          </div>

          <button
            className="secondary-btn"
            onClick={loadEverything}
          >
            Refresh
          </button>
        </div>

        {plans.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💪</div>

            <h3>No workout plans yet</h3>

            <p>
              Create your first workout plan to get started.
            </p>

            <button
              className="primary-btn"
              onClick={openCreateForm}
            >
              + Create Workout Plan
            </button>
          </div>
        ) : (
          <div className="plans-list">
            {plans.map((plan) => {
              const planExercises =
                exercises[plan.id] || [];

              const isExpanded =
                expandedPlan === plan.id;

              return (
                <div
                  className="workout-plan-card"
                  key={plan.id}
                >
                  {/* PLAN TOP */}

                  <div className="plan-top">
                    <div className="plan-icon">
                      💪
                    </div>

                    <div className="plan-main">
                      <h3>{plan.plan_name}</h3>

                      <div className="plan-meta">
                        <span>
                          👤{" "}
                          {getMemberName(
                            plan.member_id,
                            plan
                          )}
                        </span>

                        <span>
                          🏋️{" "}
                          {getTrainerName(
                            plan.trainer_id,
                            plan
                          )}
                        </span>

                        {plan.duration_weeks && (
                          <span>
                            📅 {plan.duration_weeks} weeks
                          </span>
                        )}
                      </div>

                      {plan.goal && (
                        <p className="plan-goal">
                          <strong>Goal:</strong>{" "}
                          {plan.goal}
                        </p>
                      )}
                    </div>

                    <div className="plan-actions">
                      <button
                        className="small-btn"
                        onClick={() =>
                          toggleExercises(plan.id)
                        }
                      >
                        {isExpanded
                          ? "Hide Exercises"
                          : "Exercises"}
                      </button>

                      <button
                        className="small-btn"
                        onClick={() =>
                          openEditForm(plan)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="small-btn danger-btn"
                        onClick={() =>
                          handleDelete(plan)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* EXERCISES */}

                  {isExpanded && (
                    <div className="exercise-section">
                      <div className="exercise-header">
                        <div>
                          <h3>Workout Exercises</h3>

                          <p>
                            Add exercises to this workout
                            plan.
                          </p>
                        </div>
                      </div>

                      {/* EXERCISE FORM */}

                      <div className="exercise-form">
                        <div className="form-group">
                          <label>
                            Exercise Name *
                          </label>

                          <input
                            type="text"
                            name="exercise_name"
                            value={
                              exerciseForm.exercise_name
                            }
                            onChange={
                              handleExerciseChange
                            }
                            placeholder="Bench Press"
                          />
                        </div>

                        <div className="exercise-input-grid">
                          <div className="form-group">
                            <label>Sets</label>

                            <input
                              type="number"
                              min="0"
                              name="sets"
                              value={
                                exerciseForm.sets
                              }
                              onChange={
                                handleExerciseChange
                              }
                              placeholder="3"
                            />
                          </div>

                          <div className="form-group">
                            <label>Reps</label>

                            <input
                              type="number"
                              min="0"
                              name="reps"
                              value={
                                exerciseForm.reps
                              }
                              onChange={
                                handleExerciseChange
                              }
                              placeholder="12"
                            />
                          </div>

                          <div className="form-group">
                            <label>
                              Duration (min)
                            </label>

                            <input
                              type="number"
                              min="0"
                              name="duration_minutes"
                              value={
                                exerciseForm.duration_minutes
                              }
                              onChange={
                                handleExerciseChange
                              }
                              placeholder="20"
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label>Notes</label>

                          <textarea
                            name="notes"
                            value={
                              exerciseForm.notes
                            }
                            onChange={
                              handleExerciseChange
                            }
                            placeholder="Optional exercise instructions..."
                            rows="3"
                          />
                        </div>

                        <div className="form-actions">
                          {editingExerciseId && (
                            <button
                              type="button"
                              className="secondary-btn"
                              onClick={
                                resetExerciseForm
                              }
                            >
                              Cancel Edit
                            </button>
                          )}

                          <button
                            type="button"
                            className="primary-btn"
                            onClick={() =>
                              saveExercise(plan.id)
                            }
                            disabled={saving}
                          >
                            {editingExerciseId
                              ? "Update Exercise"
                              : "Add Exercise"}
                          </button>
                        </div>
                      </div>

                      {/* EXERCISE LIST */}

                      {planExercises.length === 0 ? (
                        <div className="exercise-empty">
                          <span>🏃</span>

                          <p>
                            No exercises added yet.
                          </p>
                        </div>
                      ) : (
                        <div className="exercise-list">
                          {planExercises.map(
                            (exercise, index) => (
                              <div
                                className="exercise-row"
                                key={exercise.id}
                              >
                                <div className="exercise-number">
                                  {index + 1}
                                </div>

                                <div className="exercise-info">
                                  <h4>
                                    {
                                      exercise.exercise_name
                                    }
                                  </h4>

                                  <div className="exercise-details">
                                    {exercise.sets !==
                                      null &&
                                      exercise.sets !==
                                        undefined && (
                                        <span>
                                          {exercise.sets}{" "}
                                          sets
                                        </span>
                                      )}

                                    {exercise.reps !==
                                      null &&
                                      exercise.reps !==
                                        undefined && (
                                        <span>
                                          {exercise.reps}{" "}
                                          reps
                                        </span>
                                      )}

                                    {exercise.duration_minutes !==
                                      null &&
                                      exercise.duration_minutes !==
                                        undefined && (
                                        <span>
                                          {
                                            exercise.duration_minutes
                                          }{" "}
                                          min
                                        </span>
                                      )}
                                  </div>

                                  {exercise.notes && (
                                    <p className="exercise-notes">
                                      {
                                        exercise.notes
                                      }
                                    </p>
                                  )}
                                </div>

                                <div className="exercise-actions">
                                  <button
                                    className="small-btn"
                                    onClick={() =>
                                      startEditExercise(
                                        exercise
                                      )
                                    }
                                  >
                                    Edit
                                  </button>

                                  <button
                                    className="small-btn danger-btn"
                                    onClick={() =>
                                      removeExercise(
                                        exercise,
                                        plan.id
                                      )
                                    }
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default WorkoutPlans;