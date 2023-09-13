import { supabase } from "./supabase";

export const updateData = async (name, data, date) => {
  try {
    // const { data: initData } = await supabase
    //   .from("tracker")
    //   .select("*")
    //   .eq("date", date);
    const initData = [1];
    let results, error;
    console.log({ initData, name, data, date });
    if (initData.length > 0) {
      const response = await supabase
        .from("tracker")
        .update({ [name]: data })
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
      alert("Error!");
      return;
    }
    
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
      alert("Error!");
      return;
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
      alert("Error!");
      return;
    }
    
    return { success: true, results };
  } catch (error) {
    console.error(error);
    return { success: false, error };
  }
}

export const updateTimeBasedValue = async (name, date, time) => {
  try {
    const { data: results, error } = await supabase
      .from(name)
      .insert({ date, time });
    
    if (error) {
      console.error(error);
      alert("Error!");
      return;
    }
    
    return { success: true, results };
  } catch (error) {
    console.error(error);
    return { success: false, error };
  }
}
