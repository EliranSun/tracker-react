import { supabase } from "./supabase";

export const updateData = async (data, date) => {
  console.log({ data, date });
  try {
    const { data: results, error } = await supabase
      .from("tracker")
      .upsert({ date, ...data })
      .eq("date", date);
    
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

export const updateEnergy = async (energy, date, time) => {
  try {
    const { data: results, error } = await supabase
      .from("energy")
      .insert({ level: energy, date, time });
    
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

export const getEnergy = async (date) => {
  try {
    console.log({ date });
    const { data: results, error } = await supabase
      .from("energy")
      .select("*");
    
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
}