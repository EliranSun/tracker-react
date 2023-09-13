import { updateData } from "../../utils/updateData";
import { useState } from "react";
import { noop } from "lodash";

export const SubmitButton = ({ data, date, onSuccess = noop, onError = noop }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const changesCount = Object.keys(data).length;
  
  if (changesCount === 0) {
    return null;
  }
  
  return (
    <button
      disabled={isLoading}
      onClick={async () => {
        setIsLoading(true);
        const { success } = await updateData(data, date);
        setIsLoading(false);
        if (success) {
          setSuccess(true);
          onSuccess();
          return;
        }
        
        setError("Something went wrong");
        onError();
      }}
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        padding: '10px 20px',
        fontSize: '1.2rem',
      }}>
      {success && "SUCCESS!"}
      {error && error}
      {!success && !error ? isLoading
        ? "Submitting..."
        : `SUBMIT ${changesCount} CHANGE${changesCount > 1 ? 'S' : ''}` : ''}
    </button>
  )
}