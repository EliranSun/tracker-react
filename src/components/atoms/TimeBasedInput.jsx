import { getTimeBasedValue } from "../../utils/updateData";
import { Input } from "./Input";
import { useCallback, useEffect, useState } from "react";
import { isArray } from "lodash";

export const TimeBasedInput = ({ name, date, refetch, values }) => {
  const data = values ?
     isArray(values) ? 
        values : 
        [values] : 
        [];
        
        alert(JSON.stringify(data));
        
    return (
        <div style={{ display: "flex", justifyContent: "stretch" }}>
          <Input
            type="time"
            name={name}
            values={data}
            date={date}
            refetch={refetch}
            isTimeInput
          />
        </div>
      );
};
