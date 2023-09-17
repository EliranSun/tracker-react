import { Input } from "./Input";

export const EnergyInput = ({ values, date, refetch }) => {
  return (
    <Input
      type="range"
      name="energy"
      min={1}
      max={10}
      isTimeBasedValue
      values={values}
      refetch={refetch}
      date={date}
    />
  );
};
