import { useEffect, useState } from "react";
import { snakeCase, noop } from "lodash";

export const Input = ({ name, type, value = "", onChange = noop, ...rest }) => {
  const [innerValue, setInnerValue] = useState(value);
  const snakedName = snakeCase(name);

  useEffect(() => {
    setInnerValue(value);
  }, [value]);

  return (
    <div className="field">
      <label htmlFor={snakedName}>{name.toUpperCase()}</label>
      <input
        type={type}
        id={snakedName}
        name={snakedName}
        value={innerValue}
        onChange={(e) => {
          setInnerValue(e.target.value);
          onChange({ [snakedName]: e.target.value });
        }}
        {...rest}
      />
    </div>
  );
};
