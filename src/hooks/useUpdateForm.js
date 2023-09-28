import { updateTrackingData } from "../utils/firebase";
import { useCallback, useEffect, useState } from "react";
import { noop } from "lodash";

export const useUpdateForm = ({ name, date, onSuccess = noop, onError = noop }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  const submit = useCallback(async (data) => {
    setIsLoading(true);
    try {
      const value = { [name]: data };
      await updateTrackingData(date, value);
      setIsLoading(false);
      setSuccess(true);
      onSuccess();
      setTimeout(() => {
        setSuccess(false);
      }, 2000);
    } catch (error) {
      console.error(error);
      setError("Something went wrong");
      onError();
      
      setTimeout(() => {
        setError(false);
      }, 2000);
    }
  }, []);
  
  return {
    isLoading,
    success,
    error,
    submit
  };
}