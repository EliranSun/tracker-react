import { useEffect, useMemo, useState } from "react";
import { noop, snakeCase } from "lodash";
import { SubmitButton } from "./SubmitButton";
import { getTime } from "../../utils/time";
import classNames from "classnames";

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
  const [innerValue, setInnerValue] = useState(currentValue);
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
    if ((type === 'range' && currentValue) || type === 'text' || type === 'textarea' || type === "time") {
      setInnerValue(currentValue);
    }
  }, [currentValue, type]);
  
  const getDisplayValue = () => {
    if (type === 'text' || type === 'textarea' || type === 'checkbox') return '';
    // if (type === 'checkbox') {
    //   return currentValue ? 'Yes' : 'No';
    // }
    
    return currentValue;
  }
  
  console.log({ currentValue, innerValue, type, values });
  return (
    <div className="w-full text-black items-center flex text-left gap-4 bg-white/50 mb-2 p-4 rounded">
      <div className={classNames("flex justify-between w-full", {
        'flex-col': type !== 'checkbox',
      })}>
        <label htmlFor={snakedName} className="flex justify-between text-xl w-full">
          <span className="font-black">{name.replaceAll("_", " ").toUpperCase()}</span>
          <span>{showValue ? ` - ${innerValue}` : ""}</span>
          <div className="w-1/3">
            <SubmitButton
              date={date}
              name={name}
              isDisabled={
                (innerValue === "" && type !== "text" && type !== 'textarea') ||
                String(innerValue) === String(value)
              }
              data={submitData}
              onSuccess={() => setTimeout(refetch, 2500)}
            />
          </div>
        </label>
        {/*<h2 className="text-3xl text-center">{getDisplayValue()}</h2>*/}
        {type === 'textarea' ? (
            <textarea
              id={snakedName}
              name={snakedName}
              value={innerValue}
              className="text-black w-full"
              onChange={(e) => {
                setInnerValue(e.target.value);
              }}
            />)
          : <input
            type={type}
            className="text-2xl p-4 text-black font-black w-full"
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
          />}
      </div>
    </div>
  );
};
