import { getTimeBasedValue } from "../../utils/updateData";
import { Input } from "./Input";
import { useCallback, useEffect, useState } from "react";
import { isArray } from "lodash";

export const TimeBasedInput = ({ name, date, refetch, values }) => {
  const data = isArray(values) ? values : [values];
    return (
        <div style={{ display: "flex", justifyContent: "stretch" }}>
          <Input
            type="time"
            name={name}
            values={values}
            date={date}
            refetch={refetch}
            isTimeInput
          />
        </div>
      );
};
