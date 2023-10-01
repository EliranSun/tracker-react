import { useCallback, useEffect, useState } from "react";
import { getTrackingData } from "../utils/firebase";

export const useInsightsData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [trackedDaysCount, setTrackedDaysCount] = useState(0);
  
  const fetchTrackingData = useCallback(() => {
    setIsLoading(true);
    getTrackingData()
      .then((entries) => {
        if (!entries) {
          setError(new Error("No data found"));
          return;
        }
        
        setData(entries);
        setTrackedDaysCount(entries.length);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);
  
  useEffect(() => {
    fetchTrackingData();
  }, []);
  
  return {
    isLoading,
    error,
    data,
    fetch: fetchTrackingData,
    trackedDaysCount
  }
}