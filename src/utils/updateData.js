import { supabase } from "./supabase";

export const updateData = async (name, data, date) => {
  try {
    const initData = [1];
    let results, error;
    if (initData.length > 0) {
      const response = await supabase
        .from("tracker")
        .update({ [name]: data }) // TODO: Check upsert, it was permission issue before
        .eq("date", date);
      
      results = response.data;
      error = response.error;
    } else {
      const response = await supabase
        .from("tracker")
        .insert({ date, [name]: data });
      
      results = response.data;
      error = response.error;
    }
    
    console.log({ results, error });
    
    if (error) {
      console.error(error);
      return { success: false, error };
    }
    
    return { success: true, results };
  } catch (error) {
    console.error(error);
    return { success: false, error };
  }
};

export const updateEnergy = async (energy, date) => {
  try {
    const time = new Date().toLocaleTimeString("he-IL", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const { data: results, error } = await supabase
      .from("energy")
      .insert({ level: energy, date, time });
    
    if (error) {
      console.error(error);
      return { success: false, error };
    }
    
    return { success: true, results };
  } catch (error) {
    console.error(error);
    return { success: false, error };
  }
};

export const getEnergy = async (date) => {
  try {
    const { data: results, error } = await supabase
      .from("energy")
      .select("*")
      .eq("date", date);
    
    if (error) {
      console.error(error);
      return { success: false, error };
    }
    
    return { success: true, results };
  } catch (error) {
    console.error(error);
    return { success: false, error };
  }
};

export const getTimeBasedValue = async (name, date) => {
  try {
    const { data: results, error } = await supabase
      .from(name)
      .select("*")
      .eq("date", date);
    
    if (error) {
      console.error(error);
      return { success: false, error };
    }
    
    return { success: true, results };
  } catch (error) {
    console.error(error);
    return { success: false, error };
  }
};

export const updateTimeBasedValue = async (name, date) => {
  try {
    const time = new Date().toLocaleTimeString("he-IL", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const { data: results, error } = await supabase
      .from(name)
      .insert({ date, time });
    
    if (error) {
      console.error(error);
      return { success: false, error };
    }
    
    return { success: true, results };
  } catch (error) {
    console.error(error);
    return { success: false, error };
  }
};
