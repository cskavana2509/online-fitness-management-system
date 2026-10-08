import { supabase } from "../supabase";

export async function getTrainers() {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { data, error } = await supabase
    .from("trainers")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return Array.isArray(data) ? data : [];
}

export async function createTrainer(trainer) {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { data, error } = await supabase
    .from("trainers")
    .insert([trainer])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function addTrainer(trainer) {
  return createTrainer(trainer);
}

export async function updateTrainer(id, trainer) {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { data, error } = await supabase
    .from("trainers")
    .update(trainer)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteTrainer(id) {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { error } = await supabase
    .from("trainers")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }

  return true;
}