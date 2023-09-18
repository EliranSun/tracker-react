import { useEffect, useMemo, useState } from "react";
import { noop, snakeCase } from "lodash";
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
  isTimeBasedValue = false,
  showValue = false,
}) => {
  const snakedName = snakeCase(name);
  const currentValue = useMemo(() => {
    if (value) return value;
    if (!values) return "";

    if (isTimeBasedValue) {
      return values.map(item => {
        return Object.values(item)[0];
      }).at(-1);
    }

    return values.at(-1);
  }, [isTimeBasedValue, value, values]);
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
  }, [innerValue, isTimeBasedValue, type, values]);

  useEffect(() => {
    if (type === 'range') {
      setInnerValue(currentValue);
    }
  }, [currentValue, type]);

  return (
    <div className="w-full items-center flex text-left gap-4 border border-white">
      <div className="w-32 text-2xl border-x-2 border-white block flex items-center justify-center h-12 font-black">
        {type === "checkbox" ?
          currentValue ? "Yes" : "No"
          : currentValue}
      </div>
      <div className="flex justify-between w-full items-center">
        <label htmlFor={snakedName}>
          {name.replaceAll("_", " ").toUpperCase()}
          {showValue ? ` - ${innerValue}` : ""}
        </label>
        <input
          type={type}
          className="text-black max-w-[200px]"
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
      </div>
      <div className="px-4">
        <SubmitButton
          date={date}
          name={name}
          isDisabled={innerValue === "" || innerValue == value}
          data={submitData}
          onSuccess={() => setTimeout(refetch, 2500)}
        />
      </div>
    </div>
  );
};
