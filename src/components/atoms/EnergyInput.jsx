import { getEnergy } from "../../utils/updateData";
import { Input } from "./Input";
import { useCallback, useEffect, useState } from "react";

export const EnergyInput = ({ values, date, refetch }) => {
  return (
    <div style={{ display: "flex", justifyContent: "stretch" }}>
      <Input
        type="range"
        name="energy"
        min={1}
        max={10}
        submitSameValues
        values={values}
        refetch={refetch}
        date={date}
      />
    </div>
  );
};
