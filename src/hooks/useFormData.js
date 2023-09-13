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
        const today = rowData.find((row) => row.date === date);

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
    refetch: fetch,
  };
};
