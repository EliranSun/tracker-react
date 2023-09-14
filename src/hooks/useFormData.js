import { useEffect, useState } from "react";
import { getTrackingData } from "../utils/firebase";
import Row from "../models/row";

export const useFormData = (date) => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [dateData, setDateData] = useState({});
  const fetch = async () => {
    getTrackingData(date)
      .then((data) => {
        if (!data) {
          setError(new Error("No data found"));
          return;
        }
        
        const today = data.find((row) => row.date === date);
        
        setRows(data);
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
    todayData: dateData[date] || new Row(),
    refetch: fetch,
  };
};
