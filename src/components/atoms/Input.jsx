import { useEffect, useMemo, useState } from "react";
import { snakeCase } from "lodash";
import { getTime } from "../../utils/time";
import classNames from "classnames";
import { useDebounce } from "react-use";
import { useUpdateForm } from "../../hooks/useUpdateForm";

export const Input = ({
  name,
  type,
  value = "",
  values,
  min,
  max,
  date,
  icon = null,
  isTimeBasedValue = false,
  showValue = false,
}) => {
  const snakedName = snakeCase(name);
  const { submit, isLoading, error, success } = useUpdateForm({ name, date });
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
  const [debouncedValue, setDebouncedValue] = useState(null);
  useDebounce(() => {
    setDebouncedValue(innerValue);
  }, 2000, [innerValue]);
  
  useEffect(() => {
    if ((type === 'range' && currentValue) || type === 'text' || type === 'textarea' || type === "time") {
      setInnerValue(currentValue);
    }
  }, [currentValue, type]);
  
  useEffect(() => {
    if ([null, '', undefined].includes(debouncedValue) || debouncedValue === currentValue)
      return;
    
    let data;
    if (isTimeBasedValue) data = [...values, { [getTime()]: innerValue }];
    else if (values) data = [...values, innerValue];
    else if (type === "checkbox") data = Boolean(innerValue);
    else data = innerValue;
    
    submit(data);
  }, [debouncedValue]); // eslint-disable-line react-hooks/exhaustive-deps
  
  return (
    <>
      <div className={classNames("w-full text-black justify-between items-center flex text-left gap-4 bg-white/20 mb-4 p-4 rounded-2xl", {
        'flex-col': type !== 'checkbox' && type !== 'number' && type !== 'time',
      })}>
        <label htmlFor={snakedName} className="flex justify-between text-md">
          <span className="font-black text-white my-2 flex items-center gap-2">
            {icon}
            {name.replaceAll("_", " ").toUpperCase()}
          </span>
          <span className="text-white">{showValue ? ` - ${innerValue}` : ""}</span>
        </label>
        {type === 'textarea' ? (
            <textarea
              id={snakedName}
              name={snakedName}
              value={String(innerValue)}
              className="text-black w-full p-4"
              onChange={(e) => {
                setInnerValue(e.target.value);
              }}
            />)
          : <input
            type={type}
            className="flex p-4 text-black font-black text-center w-full max-w-[40%]"
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
      <div
        role="status"
        className={classNames("fixed bottom-28 right-4 z-10 border-4 border-black p-8 bg-white animate-spin rounded-full transition-all", {
          "opacity-0": !isLoading && !error && !success,
          "opacity-100": isLoading || error || success,
        })}>
        {isLoading && '⏳'}
        {error && '❌'}
        {success && '✅'}
      </div>
    </>
  );
};
