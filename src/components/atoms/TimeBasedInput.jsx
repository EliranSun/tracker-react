import { Input } from "./Input";
import { isArray } from "lodash";

export const TimeBasedInput = ({ name, date, refetch, values, icon }) => {
  const data = values
    ? isArray(values) ? values : [values]
    : [];

  return (
    <div style={{ display: "flex", justifyContent: "stretch" }}>
      <Input
        type="time"
        name={name}
        values={data}
        date={date}
        icon={icon}
        refetch={refetch}
        isTimeInput
      />
    </div>
  );
};
