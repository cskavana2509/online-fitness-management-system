import {
  useEffect,
  useState
} from "react";

import {
  getWorkoutPlans,
  addWorkoutPlan,
  updateWorkoutPlan,
  deleteWorkoutPlan,
  addExercise,
  updateExercise,
  deleteExercise
} from "../services/workoutService";

import {
  getMembers
} from "../services/memberService";

import {
  getTrainers
} from "../services/trainerService";

function WorkoutPlans() {

  const emptyPlan = {
    member_id: "",
    trainer_id: "",
    plan_name: "",
    goal: "",
    duration_weeks: ""
  };

  const emptyExercise = {
    exercise_name: "",
    sets: "",
    reps: "",
    duration_minutes: "",
    notes: ""
  };

  const [plans, setPlans] =
    useState([]);

  const [members, setMembers] =
    useState([]);

  const [trainers, setTrainers] =
    useState([]);

  const [planForm, setPlanForm] =
    useState(emptyPlan);

  const [exerciseForm, setExerciseForm] =
    useState(emptyExercise);

  const [editingPlanId, setEditingPlanId] =
    useState(null);

  const [selectedPlanId, setSelectedPlanId] =
    useState(null);

  const [editingExerciseId, setEditingExerciseId] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  async function loadData() {

    try {

      const [
        planData,
        memberData,
        trainerData
      ] = await Promise.all([
        getWorkoutPlans(),
        getMembers(),
        getTrainers()
      ]);

      setPlans(planData);
      setMembers(memberData);
      setTrainers(trainerData);

    } catch (error) {

      alert(error.message);

    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function handlePlanChange(e) {

    setPlanForm({
      ...planForm,
      [e.target.name]:
        e.target.value
    });
  }

  function handleExerciseChange(e) {

    setExerciseForm({
      ...exerciseForm,
      [e.target.name]:
        e.target.value
    });
  }

  async function handlePlanSubmit(e) {

    e.preventDefault();

    if (
      !planForm.plan_name.trim() ||
      !planForm.goal.trim()
    ) {

      alert(
        "Plan name and goal are required."
      );

      return;
    }

    try {

      setLoading(true);

      const plan = {

        member_id:
          planForm.member_id
            ? Number(
                planForm.member_id
              )
            : null,

        trainer_id:
          planForm.trainer_id
            ? Number(
                planForm.trainer_id
              )
            : null,

        plan_name:
          planForm.plan_name.trim(),

        goal:
          planForm.goal.trim(),

        duration_weeks:
          planForm.duration_weeks
            ? Number(
                planForm.duration_weeks
              )
            : null

      };

      if (editingPlanId) {

        await updateWorkoutPlan(
          editingPlanId,
          plan
        );

        alert(
          "Workout plan updated successfully."
        );

      } else {

        await addWorkoutPlan(
          plan
        );

        alert(
          "Workout plan created successfully."
        );
      }

      setPlanForm(emptyPlan);
      setEditingPlanId(null);

      await loadData();

    } catch (error) {

      alert(error.message);

    } finally {

      setLoading(false);

    }
  }

  function editPlan(plan) {

    setEditingPlanId(plan.id);

    setPlanForm({

      member_id:
        plan.member_id || "",

      trainer_id:
        plan.trainer_id || "",

      plan_name:
        plan.plan_name || "",

      goal:
        plan.goal || "",

      duration_weeks:
        plan.duration_weeks || ""

    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  async function handleDeletePlan(id) {

    if (
      !window.confirm(
        "Delete this workout plan? All exercises belonging to this plan will also be deleted."
      )
    ) {
      return;
    }

    try {

      await deleteWorkoutPlan(id);

      if (selectedPlanId === id) {
        setSelectedPlanId(null);
      }

      await loadData();

    } catch (error) {

      alert(error.message);

    }
  }

  function cancelPlanEdit() {

    setEditingPlanId(null);
    setPlanForm(emptyPlan);

  }

  function openExercises(planId) {

    if (
      selectedPlanId === planId
    ) {

      setSelectedPlanId(null);

      setEditingExerciseId(null);

      setExerciseForm(
        emptyExercise
      );

    } else {

      setSelectedPlanId(planId);

      setEditingExerciseId(null);

      setExerciseForm(
        emptyExercise
      );

    }
  }

  async function handleExerciseSubmit(e) {

    e.preventDefault();

    if (!selectedPlanId) {

      alert(
        "Please select a workout plan."
      );

      return;
    }

    if (
      !exerciseForm.exercise_name.trim()
    ) {

      alert(
        "Exercise name is required."
      );

      return;
    }

    try {

      const exercise = {

        workout_plan_id:
          selectedPlanId,

        exercise_name:
          exerciseForm.exercise_name.trim(),

        sets:
          exerciseForm.sets
            ? Number(
                exerciseForm.sets
              )
            : null,

        reps:
          exerciseForm.reps
            ? Number(
                exerciseForm.reps
              )
            : null,

        duration_minutes:
          exerciseForm.duration_minutes
            ? Number(
                exerciseForm.duration_minutes
              )
            : null,

        notes:
          exerciseForm.notes.trim() ||
          null

      };

      if (editingExerciseId) {

        await updateExercise(
          editingExerciseId,
          exercise
        );

      } else {

        await addExercise(
          exercise
        );

      }

      setExerciseForm(
        emptyExercise
      );

      setEditingExerciseId(null);

      await loadData();

    } catch (error) {

      alert(error.message);

    }
  }

  function editExercise(
    exercise
  ) {

    setEditingExerciseId(
      exercise.id
    );

    setExerciseForm({

      exercise_name:
        exercise.exercise_name ||
        "",

      sets:
        exercise.sets || "",

      reps:
        exercise.reps || "",

      duration_minutes:
        exercise.duration_minutes ||
        "",

      notes:
        exercise.notes || ""

    });
  }

  async function handleDeleteExercise(
    id
  ) {

    if (
      !window.confirm(
        "Delete this exercise?"
      )
    ) {
      return;
    }

    try {

      await deleteExercise(id);

      await loadData();

    } catch (error) {

      alert(error.message);

    }
  }

  function cancelExerciseEdit() {

    setEditingExerciseId(null);

    setExerciseForm(
      emptyExercise
    );

  }

  return (
    <div className="page">

      <div className="page-header">

        <div>

          <h1>
            Workout Plans
          </h1>

          <p>
            Create personalized workout programs.
          </p>

        </div>

        <span className="record-count">
          {plans.length} Plans
        </span>

      </div>

      <div className="form-card">

        <h2>

          {editingPlanId
            ? "Edit Workout Plan"
            : "Create Workout Plan"}

        </h2>

        <form
          className="management-form"
          onSubmit={handlePlanSubmit}
        >

          <div className="input-group">

            <label>
              Member
            </label>

            <select
              name="member_id"
              value={
                planForm.member_id
              }
              onChange={
                handlePlanChange
              }
            >

              <option value="">
                Select member
              </option>

              {members.map(
                (member) => (

                  <option
                    key={member.id}
                    value={member.id}
                  >
                    {member.name}
                  </option>

                )
              )}

            </select>

          </div>

          <div className="input-group">

            <label>
              Trainer
            </label>

            <select
              name="trainer_id"
              value={
                planForm.trainer_id
              }
              onChange={
                handlePlanChange
              }
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
              Plan Name *
            </label>

            <input
              name="plan_name"
              placeholder="Weight Loss Program"
              value={
                planForm.plan_name
              }
              onChange={
                handlePlanChange
              }
            />

          </div>

          <div className="input-group">

            <label>
              Goal *
            </label>

            <input
              name="goal"
              placeholder="Fat Loss"
              value={
                planForm.goal
              }
              onChange={
                handlePlanChange
              }
            />

          </div>

          <div className="input-group">

            <label>
              Duration
            </label>

            <input
              name="duration_weeks"
              type="number"
              min="1"
              placeholder="Weeks"
              value={
                planForm.duration_weeks
              }
              onChange={
                handlePlanChange
              }
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
                : editingPlanId
                ? "Update Plan"
                : "Create Plan"}
            </button>

            {editingPlanId && (

              <button
                type="button"
                className="secondary-button"
                onClick={
                  cancelPlanEdit
                }
              >
                Cancel
              </button>

            )}

          </div>

        </form>

      </div>

      <div className="plans-container">

        {plans.map(
          (plan) => (

            <div
              className="plan-card"
              key={plan.id}
            >

              <div className="plan-header">

                <div>

                  <h2>
                    {plan.plan_name}
                  </h2>

                  <p>
                    {plan.goal}
                  </p>

                </div>

                <span className="duration-badge">

                  {plan.duration_weeks
                    ? `${plan.duration_weeks} weeks`
                    : "No duration"}

                </span>

              </div>

              <div className="plan-meta">

                <div>

                  <span>
                    Member
                  </span>

                  <strong>
                    {plan.members?.name ||
                      "Not assigned"}
                  </strong>

                </div>

                <div>

                  <span>
                    Trainer
                  </span>

                  <strong>
                    {plan.trainers?.name ||
                      "Not assigned"}
                  </strong>

                </div>

              </div>

              <div className="plan-actions">

                <button
                  className="small-button"
                  onClick={() =>
                    editPlan(plan)
                  }
                >
                  Edit
                </button>

                <button
                  className="small-button delete-button"
                  onClick={() =>
                    handleDeletePlan(
                      plan.id
                    )
                  }
                >
                  Delete
                </button>

                <button
                  className="small-button exercise-button"
                  onClick={() =>
                    openExercises(
                      plan.id
                    )
                  }
                >
                  {selectedPlanId === plan.id
                    ? "Hide Exercises"
                    : "Exercises"}
                </button>

              </div>

              {selectedPlanId ===
                plan.id && (

                <div className="exercise-section">

                  <h3>
                    Workout Exercises
                  </h3>

                  <form
                    className="exercise-form"
                    onSubmit={
                      handleExerciseSubmit
                    }
                  >

                    <input
                      name="exercise_name"
                      placeholder="Exercise name"
                      value={
                        exerciseForm.exercise_name
                      }
                      onChange={
                        handleExerciseChange
                      }
                    />

                    <input
                      name="sets"
                      type="number"
                      min="1"
                      placeholder="Sets"
                      value={
                        exerciseForm.sets
                      }
                      onChange={
                        handleExerciseChange
                      }
                    />

                    <input
                      name="reps"
                      type="number"
                      min="1"
                      placeholder="Reps"
                      value={
                        exerciseForm.reps
                      }
                      onChange={
                        handleExerciseChange
                      }
                    />

                    <input
                      name="duration_minutes"
                      type="number"
                      min="1"
                      placeholder="Minutes"
                      value={
                        exerciseForm.duration_minutes
                      }
                      onChange={
                        handleExerciseChange
                      }
                    />

                    <input
                      name="notes"
                      placeholder="Notes"
                      value={
                        exerciseForm.notes
                      }
                      onChange={
                        handleExerciseChange
                      }
                    />

                    <div className="exercise-buttons">

                      <button
                        type="submit"
                        className="primary-button"
                      >
                        {editingExerciseId
                          ? "Update Exercise"
                          : "Add Exercise"}
                      </button>

                      {editingExerciseId && (

                        <button
                          type="button"
                          className="secondary-button"
                          onClick={
                            cancelExerciseEdit
                          }
                        >
                          Cancel
                        </button>

                      )}

                    </div>

                  </form>

                  <div className="exercise-list">

                    {plan.workout_exercises
                      ?.length > 0 ? (

                      plan.workout_exercises.map(
                        (exercise) => (

                          <div
                            className="exercise-item"
                            key={
                              exercise.id
                            }
                          >

                            <div className="exercise-info">

                              <strong>
                                {
                                  exercise.exercise_name
                                }
                              </strong>

                              <div className="exercise-stats">

                                {exercise.sets && (
                                  <span>
                                    {exercise.sets}
                                    {" "}
                                    sets
                                  </span>
                                )}

                                {exercise.reps && (
                                  <span>
                                    {exercise.reps}
                                    {" "}
                                    reps
                                  </span>
                                )}

                                {exercise.duration_minutes && (
                                  <span>
                                    {
                                      exercise.duration_minutes
                                    }
                                    {" "}
                                    min
                                  </span>
                                )}

                              </div>

                              {exercise.notes && (
                                <small>
                                  {exercise.notes}
                                </small>
                              )}

                            </div>

                            <div>

                              <button
                                className="small-button"
                                onClick={() =>
                                  editExercise(
                                    exercise
                                  )
                                }
                              >
                                Edit
                              </button>

                              <button
                                className="small-button delete-button"
                                onClick={() =>
                                  handleDeleteExercise(
                                    exercise.id
                                  )
                                }
                              >
                                Delete
                              </button>

                            </div>

                          </div>

                        )
                      )

                    ) : (

                      <div className="empty-exercises">
                        No exercises added yet.
                      </div>

                    )}

                  </div>

                </div>

              )}

            </div>

          )
        )}

      </div>

      {plans.length === 0 && (

        <div className="empty-dashboard">
          No workout plans found.
        </div>

      )}

    </div>
  );
}

export default WorkoutPlans;