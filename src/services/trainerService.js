import { supabase } from "../supabase";

export const getTrainers = async () => {
  return await supabase
    .from("trainers")
    .select("*")
    .order("created_at", { ascending: false });
};

export const getTrainerById = async (id) => {
  return await supabase
    .from("trainers")
    .select("*")
    .eq("id", id)
    .single();
};

export const createTrainer = async (trainer) => {
  return await supabase
    .from("trainers")
    .insert([trainer])
    .select()
    .single();
};

export const updateTrainer = async (id, trainer) => {
  return await supabase
    .from("trainers")
    .update(trainer)
    .eq("id", id)
    .select()
    .single();
};

export const deleteTrainer = async (id) => {
  return await supabase
    .from("trainers")
    .delete()
    .eq("id", id);
};