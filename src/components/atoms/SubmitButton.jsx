import { updateData } from "../../utils/updateData";
import { useState } from "react";
import { noop } from "lodash";

export const SubmitButton = ({ name, data, date, onSuccess = noop, onError = noop }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  return (
    <button
      disabled={isLoading}
      onClick={async () => {
        setIsLoading(true);
        const { success } = await updateData(name, data, date);
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
  )
}