import { supabase } from "../supabase";

export async function getSchedules() {
  const {
    data,
    error
  } = await supabase
    .from("schedules")
    .select(`
      *,
      trainers (
        id,
        name
      )
    `)
    .order("schedule_date", {
      ascending: true
    })
    .order("start_time", {
      ascending: true
    });

  if (error) {
    throw error;
  }

  return data || [];
}

export async function addSchedule(
  schedule
) {
  const {
    data,
    error
  } = await supabase
    .from("schedules")
    .insert([schedule])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateSchedule(
  id,
  schedule
) {
  const {
    data,
    error
  } = await supabase
    .from("schedules")
    .update(schedule)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteSchedule(id) {
  const { error } = await supabase
    .from("schedules")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}