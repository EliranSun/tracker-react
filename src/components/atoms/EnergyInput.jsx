import { getEnergy } from "../../utils/updateData";
import { Input } from "./Input";
import { useCallback, useEffect, useState } from "react";

export const EnergyInput = ({ date, refetch }) => {
  const [energy, setEnergy] = useState(0);
  const fetch = useCallback(async () => {
    const response = await getEnergy(date);
    if (!response.results.length) {
      return;
    }

    setEnergy(response.results.at(-1).level);
  }, [date]);

  useEffect(() => {
    fetch();
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "stretch" }}>
      <Input
        type="range"
        name="energy"
        min={1}
        max={10}
        value={energy}
        refetch={refetch}
        date={date}
      />
    </div>
  );
};
