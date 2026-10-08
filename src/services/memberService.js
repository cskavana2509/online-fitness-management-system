import { supabase } from "../supabase";

export const getMembers = async () => {
  return await supabase
    .from("members")
    .select("*")
    .order("created_at", { ascending: false });
};

export const getMemberById = async (id) => {
  return await supabase
    .from("members")
    .select("*")
    .eq("id", id)
    .single();
};

export const createMember = async (member) => {
  return await supabase
    .from("members")
    .insert([member])
    .select()
    .single();
};

export const updateMember = async (id, member) => {
  return await supabase
    .from("members")
    .update(member)
    .eq("id", id)
    .select()
    .single();
};

export const deleteMember = async (id) => {
  return await supabase
    .from("members")
    .delete()
    .eq("id", id);
};