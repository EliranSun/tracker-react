import { useDebounce } from "react-use";
import { useEffect, useState } from "react";
import classNames from "classnames";
import { getTime } from "../../utils/time";
import { useUpdateForm } from "../../hooks/useUpdateForm";
import { BatteryCharging } from "@phosphor-icons/react";

export const EnergyInput = ({ values = [], date }) => {
  const [selectedValue, setSelectedValue] = useState(null);
  const [debouncedValue, setDebouncedValue] = useState(null);
  const [isPristine, setIsPristine] = useState(true);
  const lastEnergyValue = Number(values.map(item => Object.values(item)[0]).at(-1));
  const { submit, isLoading, error, success } = useUpdateForm({
    name: 'energy',
    date
  });

  useDebounce(() => {
    setDebouncedValue(selectedValue);
  }, 2000, [selectedValue]);

  useEffect(() => {
    if (lastEnergyValue) {
      setSelectedValue(Number(lastEnergyValue));
    }
  }, [lastEnergyValue]);

  useEffect(() => {
    if (!debouncedValue || isPristine) return;

    submit([...values, { [getTime()]: selectedValue }]);
  }, [debouncedValue]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="my-4 bg-white/20 rounded-2xl p-4">
      <h1 className="mb-4 text-xl font-black flex gap-2 items-center justify-center">
        <BatteryCharging size={25} weight="fill"/> Energy
      </h1>
      <div className="flex items-stretch rounded-2xl overflow-hidden gap-0 justify-center">
        {Array.from({ length: 10 }).map((_, index) => {
          const value = index + 1;
          return (
            <button
              className={classNames("w-full h-24 text-black", {
                "bg-blue-500 text-blue-500": value < selectedValue,
                "bg-blue-500 text-white": value === selectedValue,
                "bg-white text-white": value > selectedValue,
              })}
              onClick={() => {
                setSelectedValue(value);
                setIsPristine(false);
              }}>
              <span className={classNames({
                "border-r border-white": value !== selectedValue,
                "border-r border-blue-500": value > selectedValue && value !== 10,
              })}>
                {value * 10}%
              </span>
            </button>
          );
        })}
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
    </div>
  );
  // return (
  //   <Input
  //     type="range"
  //     name="energy"
  //     min={1}
  //     max={10}
  //     showValue
  //     isTimeBasedValue
  //     values={values || []}
  //     refetch={refetch}
  //     date={date}
  //   />
  // );
};
