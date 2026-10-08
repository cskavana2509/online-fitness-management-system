import { supabase } from "../supabase";

export async function getMembers() {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { data, error } = await supabase
    .from("members")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return Array.isArray(data) ? data : [];
}

export async function addMember(member) {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { data, error } = await supabase
    .from("members")
    .insert([member])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateMember(id, member) {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { data, error } = await supabase
    .from("members")
    .update(member)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteMember(id) {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { error } = await supabase
    .from("members")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }

  return true;
}