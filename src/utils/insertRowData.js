import { supabase } from "./supabase";

export const insertRowData = async (data, date) => {
  try {
    const { data: results, error } = await supabase
      .from("tracker")
      .insert([{ date, ...data }]);
    
    if (error) {
      console.error(error);
      alert("Error!");
      return;
    }
    
    console.info("Success!", results);
    return { success: true, results };
  } catch (error) {
    console.error(error);
    return { success: false, error };
  }
};
