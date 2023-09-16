import { useEffect, useMemo, useState } from "react";
import { snakeCase, noop } from "lodash";
import { SubmitButton } from "./SubmitButton";
import { getTime } from "../../utils/time";
import { DateTime } from "luxon";

export const Input = ({
  name,
  type,
  date,
  value = "",
  values,
  min,
  max,
  refetch = noop,
  submitSameValues = false,
  isTimeInput = false,
}) => {
  const inputValue = useMemo(() => {
    if (value) return value;
    
    if (values && values.length > 0) {
      const lastValue = values.at(-1);
      return Object.values(lastValue)[0];
    }
    
    if (isTimeInput) {
      return DateTime.now().toFormat("HH:mm");
    }
    
    return "";
  }, [values, value]);
  const [innerValue, setInnerValue] = useState(inputValue);
  const snakedName = snakeCase(name);
  
  useEffect(() => {
    setInnerValue(inputValue);
  }, [inputValue]);
  
  const submitData = useMemo(() => {
    if (values) {
      const time = getTime();
      return [...values, { [time]: innerValue }];
    }
    
    if (type === "checkbox") {
      return Boolean(innerValue);
    }
    
    return innerValue;
  }, [innerValue, type, values]);
  
  return (
    <div className="field">
      <label htmlFor={snakedName}>{name.toUpperCase()}</label>
      <input
        type={type}
        id={snakedName}
        name={snakedName}
        value={innerValue}
        defaultChecked={inputValue}
        min={min}
        max={max}
        onChange={(e) => {
          if (type === "checkbox") {
            setInnerValue(e.target.checked);
            return;
          }
          setInnerValue(e.target.value);
        }}
      />
      {type === 'range' && innerValue}
      {(submitSameValues || innerValue != inputValue) && (
        <SubmitButton
          date={date}
          name={name}
          data={submitData}
          onSuccess={() => setTimeout(refetch, 2500)}
        />
      )}
    </div>
  );
};
