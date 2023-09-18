import { Input } from "./Input";

export const EnergyInput = ({ values, date, refetch }) => {
  return (
    <Input
      type="range"
      name="energy"
      min={1}
      max={10}
      showValue
      isTimeBasedValue
      values={values}
      refetch={refetch}
      date={date}
    />
  );
};
