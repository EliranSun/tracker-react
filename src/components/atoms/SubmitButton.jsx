import {
  updateData,
  updateEnergy,
  updateTimeBasedValue,
} from "../../utils/updateData";
import { useState } from "react";
import { noop } from "lodash";

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
        let success;
        setIsLoading(true);
        if (TimeBasedInput.includes(loweredName)) {
          const results = await updateTimeBasedValue(loweredName, date);
          success = results.success;
        } else if (loweredName === "energy") {
          const results = await updateEnergy(data, date);
          success = results.success;
        } else {
          const results = await updateData(loweredName, data, date);
          success = results.success;
        }

        setIsLoading(false);
        if (success) {
          setSuccess(true);
          onSuccess();
          return;
        }

        setError("Something went wrong");
        onError();
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
