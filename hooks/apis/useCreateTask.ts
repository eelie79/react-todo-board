"use client";

import { supabase } from "@/utils/supabase";

function useCreateTask() {
  const createTask = async () => {
    try {
      const { data, status, error } = await supabase;
    } catch (error) {
      console.log(error);
    }
  };
}
