import { getTimeBasedValue } from "../../utils/updateData";
import { Input } from "./Input";
import { useCallback, useEffect, useState } from "react";

export const TimeBasedInput = ({ name, date, refetch }) => {
  const [value, setValue] = useState("");

  const fetch = useCallback(() => {
    getTimeBasedValue(name, date).then((response) => {
      console.log({ name, date, response });
      if (!response.results.length) return;

      const time = response.results.at(-1).time;
      setValue(time);
    });
  }, [name, date]);

  useEffect(() => {
    fetch();
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "stretch" }}>
      <Input
        type="time"
        name={name}
        value={value}
        date={date}
        refetch={refetch}
      />
    </div>
  );
};
