import { updateTimeBasedValue, getTimeBasedValue } from "../../utils/updateData";
import { Input } from "./Input";
import { useCallback, useEffect, useState } from "react";
import { noop } from "lodash";

export const TimeBasedInput = ({ name, date, onSuccess = noop }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState("");
  const [initValue, setInitValue] = useState("");
  const fetch = useCallback(() => {
    getTimeBasedValue(name, date).then((response) => {
      if (!response.results.length)
        return;
      
      const time = response.results.at(-1).time;
      setInitValue(time);
    });
  }, [name, date]);
  
  useEffect(() => {
    fetch();
  }, []);
  
  return (
    <div style={{ display: 'flex', justifyContent: 'stretch' }}>
      <Input
        type="time"
        name={name.toUpperCase()}
        value={value}
        onChange={setValue}/>
      {value !== initValue &&
        <button onClick={async () => {
          const time = new Date().toLocaleTimeString('he-IL', {
            hour: '2-digit',
            minute: '2-digit'
          });
          
          setIsLoading(true);
          await updateTimeBasedValue(name, date, time);
          setIsLoading(false);
          fetch();
        }}>
          {isLoading ? 'Updating...' : `Update ${name.toUpperCase()}`}
        </button>}
    </div>
  )
}