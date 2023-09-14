import {
  updateData,
  updateEnergy,
  updateTimeBasedValue,
} from "../../utils/updateData";
import { useState } from "react";
import { noop } from "lodash";
import { updateTrackingData } from "../../utils/firebase";

const TimeBasedInput = ["eating", "water", "shower", "sugar", "coffee"];

export const SubmitButton = ({
  name,
  data,
  date,
  onSuccess = noop,
  onError = noop,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const loweredName = name.toLowerCase();
  
  return (
    <button
      disabled={isLoading}
      onClick={async () => {
        setIsLoading(true);
        try {
          const value = { [loweredName]: data };
          // console.log({ date, value });
          await updateTrackingData(date, value);
          setIsLoading(false);
          setSuccess(true);
          onSuccess();
        } catch (error) {
          console.error(error);
          setError("Something went wrong");
          onError();
        }
      }}>
      {success && "SUCCESS!"}
      {error && error}
      {!success && !error
        ? isLoading
          ? "Submitting..."
          : `SUBMIT ${name}`
        : null}
    </button>
  );
};
