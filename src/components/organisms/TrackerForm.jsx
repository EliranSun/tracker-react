import { useState } from "react";
import { camelCase } from "lodash";
import { Fieldset } from "../molecules/Fieldset";
import { Input } from "../atoms/Input";
import { useFormData } from "../../hooks/useFormData";
import { getIsoDate } from "../../utils/date";
import { EnergyInput } from "../atoms/EnergyInput";
import { TimeBasedInput } from "../atoms/TimeBasedInput";

export const TrackerForm = () => {
  const [date, setDate] = useState(getIsoDate());
  const { todayData, refetch } = useFormData(date);
  const TimeInput = ({ name }) => {
    return (
      <Input
        type="time"
        name={name}
        date={date}
        refetch={refetch}
        value={todayData[camelCase(name)]}
      />
    );
  };
  
  const CheckboxInput = ({ name }) => {
    return (
      <Input
        type="checkbox"
        name={name}
        date={date}
        refetch={refetch}
        value={Boolean(todayData[camelCase(name)])}
      />
    );
  };
  
  const NumberInput = ({ name }) => {
    return (
      <Input
        type="number"
        name={name}
        date={date}
        refetch={refetch}
        value={todayData[camelCase(name)]}
      />
    );
  };
  
  return (
    <div>
      <input
        type="date"
        name="Date"
        value={date}
        onChange={event => setDate(event.target.value)}/>
      <EnergyInput
        date={date}
        refetch={refetch}
        values={todayData.energy}/>
      <div className="">
        <Fieldset legend="Sleep">
          <TimeInput name="went_to_bed"/>
          <TimeInput name="woke_up"/>
          <CheckboxInput name="snooze"/>
          <CheckboxInput name="woke_up_mid_night"/>
          <NumberInput name="nap"/>
        </Fieldset>
        <Fieldset legend="Consumption">
          <TimeBasedInput values={todayData.eating} name="eating" refetch={refetch} date={date}/>
          <TimeBasedInput values={todayData.coffee} name="coffee" refetch={refetch} date={date}/>
          <TimeBasedInput values={todayData.water} name="water" refetch={refetch} date={date}/>
          <TimeBasedInput values={todayData.sugar} name="sugar" refetch={refetch} date={date}/>
          <CheckboxInput name="alcohol"/>
          <CheckboxInput name="keto"/>
          <CheckboxInput name="stuffed"/>
        </Fieldset>
        <Fieldset legend="Activities (Hours)">
          <NumberInput name="productivity"/>
          <NumberInput name="family"/>
          <NumberInput name="social"/>
          <NumberInput name="creative"/>
          <NumberInput name="outside"/>
          <NumberInput name="youtube"/>
        </Fieldset>
        <Fieldset legend="Well Being">
          <TimeBasedInput values={todayData.shower} name="shower" refetch={refetch} date={date}/>
          <CheckboxInput name="work_late"/>
          <CheckboxInput name="workout"/>
          <CheckboxInput name="sick"/>
          <CheckboxInput name="porn"/>
        </Fieldset>
      </div>
    </div>
  );
};
