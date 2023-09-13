import { supabase } from "./supabase";

export const insertRowData = async (data) => {
  try {
    const { data: results, error } = await supabase
      .from("tracker")
      .insert([data]);

    if (error) {
      console.error(error);
      alert("Error!");
      return;
    }

    console.info("Success!", results);
    alert("Success!");
  } catch (error) {
    console.error(error);
    alert("Error!");
  }
};
