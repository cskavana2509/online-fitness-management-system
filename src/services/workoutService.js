import { supabase } from "../supabase";

export async function getWorkoutPlans() {
  const {
    data,
    error
  } = await supabase
    .from("workout_plans")
    .select(`
      *,
      members (
        id,
        name,
        email
      ),
      trainers (
        id,
        name
      ),
      workout_exercises (
        id,
        workout_plan_id,
        exercise_name,
        sets,
        reps,
        duration_minutes,
        notes
      )
    `)
    .order("id", {
      ascending: false
    });

  if (error) {
    throw error;
  }

  return data || [];
}

export async function addWorkoutPlan(
  plan
) {
  const {
    data,
    error
  } = await supabase
    .from("workout_plans")
    .insert([plan])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateWorkoutPlan(
  id,
  plan
) {
  const {
    data,
    error
  } = await supabase
    .from("workout_plans")
    .update(plan)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteWorkoutPlan(
  id
) {
  const { error } = await supabase
    .from("workout_plans")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}

export async function addExercise(
  exercise
) {
  const {
    data,
    error
  } = await supabase
    .from("workout_exercises")
    .insert([exercise])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateExercise(
  id,
  exercise
) {
  const {
    data,
    error
  } = await supabase
    .from("workout_exercises")
    .update(exercise)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteExercise(id) {
  const { error } = await supabase
    .from("workout_exercises")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}