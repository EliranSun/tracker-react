import { useState } from "react";
import { noop } from "lodash";
import { updateTrackingData } from "../../utils/firebase";
import classNames from "classnames";

const TimeBasedInput = ["eating", "water", "shower", "sugar", "coffee"];

export const SubmitButton = ({
  name,
  data,
  date,
  onSuccess = noop,
  onError = noop,
  isDisabled = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const loweredName = name.toLowerCase();
  
  return (
    <button
      className={classNames("w-full bg-white rounded", {
        "opacity-30": isDisabled || isLoading,
      })}
      disabled={isDisabled || isLoading}
      onClick={async () => {
        setIsLoading(true);
        try {
          const value = { [loweredName]: data };
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
      {success && "✅"}
      {error && error}
      {!success && !error
        ? isLoading
          ? "⏳"
          : '💾'
        : null}
    </button>
  );
};
