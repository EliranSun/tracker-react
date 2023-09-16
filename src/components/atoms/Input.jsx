import { useMemo, useState } from "react";
import { snakeCase, noop } from "lodash";
import { SubmitButton } from "./SubmitButton";
import { getTime } from "../../utils/time";

export const Input = ({
  name,
  type,
  date,
  value = "",
  values,
  min,
  max,
  refetch = noop,
  isTimeBasedValue = false
}) => {
  const snakedName = snakeCase(name);
  const [innerValue, setInnerValue] = useState("");
  const submitData = useMemo(() => {
    if (isTimeBasedValue) {
      return [...values, { [getTime()]: innerValue }];
    }

    if (values) {
      return [...values, innerValue];
    }
    
    if (type === "checkbox") {
      return Boolean(innerValue);
    }
    
    return innerValue;
  }, [innerValue, type, values]);
  const currentValue = useMemo(() => {
    if (value) return value;
    if (!values) return "";

    if (isTimeBasedValue) {
      return values.map(item => {
        const key = Object.keys(item)[0];
        return Object.values(item)[0];
      }).at(-1);
    }

    return values.at(-1);
  },[value, values]);

  return (
    <div className="field">
      <label htmlFor={snakedName}>{name.toUpperCase()}</label>
      <span className="text-xl"><b>{currentValue}</b> →</span>
      <input
        type={type}
        id={snakedName}
        name={snakedName}
        value={innerValue}
        defaultChecked={Boolean(value)}
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
        <SubmitButton
          date={date}
          name={name}
          data={submitData}
          isDisabled={innerValue === "" || innerValue == value}
          onSuccess={() => setTimeout(refetch, 2500)}
        />
    </div>
  );
};
