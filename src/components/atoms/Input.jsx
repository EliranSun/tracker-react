import { useMemo, useState } from "react";
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
  }, [value, values]);

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
          className="text-black max-w-[80px]"
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
      <SubmitButton
        date={date}
        name={name}
        isDisabled={innerValue === "" || innerValue == value}
        data={submitData}
        onSuccess={() => setTimeout(refetch, 2500)}
      />
    </div>
  );
};
