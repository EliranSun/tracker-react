import { useCallback, useEffect, useState } from "react";
import Row from "../models/row";
import { supabase } from "../utils/supabase";
import { getIsoDate } from "../utils/date";


export const useFormData = (date) => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [dateData, setDateData] = useState({});
  const fetch = async () => {
    supabase
      .from("tracker")
      .select("*")
      .eq("date", date)
      .then(({ data, error }) => {
        if (error || !data) {
          setError(error || new Error("No data found"));
          return;
        }
        
        const rowData = data.map((row) => new Row(row));
        const today = {
          energy: rowData.findLast((row) => row.energy)?.energy,
          coffee: rowData.findLast((row) => row.coffee)?.coffee,
          productivity: rowData.findLast((row) => row.productivity)?.productivity,
          creative: rowData.findLast((row) => row.creative)?.creative,
          social: rowData.findLast((row) => row.social)?.social,
          wentToBed: rowData.findLast((row) => row.wentToBed)?.wentToBed,
          wokeUp: rowData.findLast((row) => row.wokeUp)?.wokeUp,
          snooze: rowData.find((row) => row.snooze)?.snooze,
          wokeUpMidNight: rowData.find((row) => row.wokeUpMidNight)?.wokeUpMidNight,
          workLate: rowData.find((row) => row.workLate)?.workLate,
          stuffed: rowData.find((row) => row.stuffed)?.stuffed,
          workout: rowData.find((row) => row.workout)?.workout,
          youtube: rowData.find((row) => row.youtube)?.youtube,
          outside: rowData.find((row) => row.outside)?.outside,
          sugar: rowData.findLast((row) => row.sugar)?.sugar,
          nap: rowData.find((row) => row.nap)?.nap,
          family: rowData.find((row) => row.family)?.family,
          eat: rowData.findLast((row) => row.eating)?.eating,
          water: rowData.findLast((row) => row.water)?.water,
          porn: rowData.find((row) => row.porn)?.porn,
          shower: rowData.findLast((row) => row.shower)?.shower,
          sick: rowData.find((row) => row.sick)?.sick,
          alcohol: rowData.find((row) => row.alcohol)?.alcohol,
          keto: rowData.find((row) => row.keto)?.keto,
        };
        
        setRows(rowData);
        setDateData({
          ...dateData,
          [date]: today,
        });
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  
  useEffect(() => {
    setIsLoading(true);
    fetch();
  }, [date]);
  
  return {
    error,
    isLoading,
    rows,
    dateData,
    date,
    todayData: dateData[date] || {},
    refetch: fetch
  };
};
