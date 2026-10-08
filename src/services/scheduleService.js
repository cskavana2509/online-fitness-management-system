import { supabase } from "../supabase";

export async function getSchedules() {
  const { data, error } = await supabase
    .from("schedules")
    .select(`
      *,
      trainers (
        id,
        name
      )
    `)
    .order("schedule_date", {
      ascending: true,
    })
    .order("start_time", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return data || [];
}

export async function createSchedule(schedule) {
  const { data, error } = await supabase
    .from("schedules")
    .insert([
      {
        title: schedule.title,
        trainer_id: schedule.trainer_id ?? null,
        schedule_date: schedule.schedule_date,
        start_time: schedule.start_time,
        end_time: schedule.end_time,
        capacity: schedule.capacity ?? 20,
      },
    ])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function addSchedule(schedule) {
  return createSchedule(schedule);
}

export async function updateSchedule(id, schedule) {
  const { data, error } = await supabase
    .from("schedules")
    .update({
      title: schedule.title,
      trainer_id: schedule.trainer_id ?? null,
      schedule_date: schedule.schedule_date,
      start_time: schedule.start_time,
      end_time: schedule.end_time,
      capacity: schedule.capacity ?? 20,
    })
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

  return true;
}
