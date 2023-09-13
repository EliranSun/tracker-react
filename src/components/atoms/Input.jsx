import { useEffect, useState } from "react";
import { snakeCase, noop } from "lodash";
import { SubmitButton } from "./SubmitButton";

export const Input = ({ name, type, date, value = "", refetch = noop }) => {
  const [innerValue, setInnerValue] = useState(value);
  const snakedName = snakeCase(name);
  
  return (
    <div className="field">
      <label htmlFor={snakedName}>{name.toUpperCase()}</label>
      <input
        type={type}
        id={snakedName}
        name={snakedName}
        value={innerValue}
        defaultChecked={value}
        onChange={(e) => {
          if (type === "checkbox") {
            setInnerValue(e.target.checked);
            return;
          }
          setInnerValue(e.target.value);
        }}
      />
      {innerValue !== value &&
        <SubmitButton
          date={date}
          name={name}
          data={type === 'checkbox' ? String(innerValue) : innerValue}
          onSuccess={() => {
            setTimeout(() => {
              refetch();
            }, 4000);
          }}/>}
    </div>
  );
};
