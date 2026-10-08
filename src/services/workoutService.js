import { supabase } from "../supabase";

/* =========================================================
   WORKOUT PLANS
   ========================================================= */

export async function getWorkoutPlans() {
  const { data, error } = await supabase
    .from("workout_plans")
    .select(`
      id,
      member_id,
      trainer_id,
      plan_name,
      goal,
      duration_weeks,
      created_at,
      members (
        id,
        name
      ),
      trainers (
        id,
        name
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getWorkoutPlans error:", error);
    throw error;
  }

  return data || [];
}

export async function getWorkoutPlan(id) {
  const { data, error } = await supabase
    .from("workout_plans")
    .select(`
      id,
      member_id,
      trainer_id,
      plan_name,
      goal,
      duration_weeks,
      created_at,
      members (
        id,
        name
      ),
      trainers (
        id,
        name
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("getWorkoutPlan error:", error);
    throw error;
  }

  return data;
}

export async function createWorkoutPlan(plan) {
  const { data, error } = await supabase
    .from("workout_plans")
    .insert([
      {
        member_id: plan.member_id || null,
        trainer_id: plan.trainer_id || null,
        plan_name: plan.plan_name,
        goal: plan.goal || null,
        duration_weeks:
          plan.duration_weeks === "" ||
          plan.duration_weeks === null ||
          plan.duration_weeks === undefined
            ? null
            : Number(plan.duration_weeks),
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("createWorkoutPlan error:", error);
    throw error;
  }

  return data;
}

export async function updateWorkoutPlan(id, plan) {
  const { data, error } = await supabase
    .from("workout_plans")
    .update({
      member_id: plan.member_id || null,
      trainer_id: plan.trainer_id || null,
      plan_name: plan.plan_name,
      goal: plan.goal || null,
      duration_weeks:
        plan.duration_weeks === "" ||
        plan.duration_weeks === null ||
        plan.duration_weeks === undefined
          ? null
          : Number(plan.duration_weeks),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("updateWorkoutPlan error:", error);
    throw error;
  }

  return data;
}

export async function deleteWorkoutPlan(id) {
  const { error } = await supabase
    .from("workout_plans")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("deleteWorkoutPlan error:", error);
    throw error;
  }

  return true;
}


/* =========================================================
   WORKOUT EXERCISES
   ========================================================= */

export async function getWorkoutExercises(workoutPlanId) {
  const { data, error } = await supabase
    .from("workout_exercises")
    .select(`
      id,
      workout_plan_id,
      exercise_name,
      sets,
      reps,
      duration_minutes,
      notes
    `)
    .eq("workout_plan_id", workoutPlanId)
    .order("id", { ascending: true });

  if (error) {
    console.error("getWorkoutExercises error:", error);
    throw error;
  }

  return data || [];
}

export async function createWorkoutExercise(exercise) {
  const { data, error } = await supabase
    .from("workout_exercises")
    .insert([
      {
        workout_plan_id: exercise.workout_plan_id,
        exercise_name: exercise.exercise_name,
        sets:
          exercise.sets === "" ||
          exercise.sets === null ||
          exercise.sets === undefined
            ? null
            : Number(exercise.sets),
        reps:
          exercise.reps === "" ||
          exercise.reps === null ||
          exercise.reps === undefined
            ? null
            : Number(exercise.reps),
        duration_minutes:
          exercise.duration_minutes === "" ||
          exercise.duration_minutes === null ||
          exercise.duration_minutes === undefined
            ? null
            : Number(exercise.duration_minutes),
        notes: exercise.notes || null,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("createWorkoutExercise error:", error);
    throw error;
  }

  return data;
}

export async function updateWorkoutExercise(id, exercise) {
  const { data, error } = await supabase
    .from("workout_exercises")
    .update({
      exercise_name: exercise.exercise_name,
      sets:
        exercise.sets === "" ||
        exercise.sets === null ||
        exercise.sets === undefined
          ? null
          : Number(exercise.sets),
      reps:
        exercise.reps === "" ||
        exercise.reps === null ||
        exercise.reps === undefined
          ? null
          : Number(exercise.reps),
      duration_minutes:
        exercise.duration_minutes === "" ||
        exercise.duration_minutes === null ||
        exercise.duration_minutes === undefined
          ? null
          : Number(exercise.duration_minutes),
      notes: exercise.notes || null,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("updateWorkoutExercise error:", error);
    throw error;
  }

  return data;
}

export async function deleteWorkoutExercise(id) {
  const { error } = await supabase
    .from("workout_exercises")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("deleteWorkoutExercise error:", error);
    throw error;
  }

  return true;
}