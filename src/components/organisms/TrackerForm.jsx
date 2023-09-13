import { Fieldset } from "../molecules/Fieldset";
import { Input } from "../atoms/Input";
import { useFormData } from "../../hooks/useFormData";
import { useState } from "react";
import { getIsoDate } from "../../utils/date";
import { SubmitButton } from "../atoms/SubmitButton";
import { EnergyInput } from "../atoms/EnergyInput";
import { TimeBasedInput } from "../atoms/TimeBasedInput";

export const TrackerForm = () => {
  const [date, setDate] = useState(getIsoDate());
  const { todayData, refetch } = useFormData(date);
  const [dataToInsert, setDataToInsert] = useState(todayData);
  const TimeInput = ({ name }) => {
    return (
      <Input
        type="time"
        name={name}
        date={date}
        refetch={refetch}
        value={todayData[name]}/>
    )
  };
  
  const CheckboxInput = ({ name }) => {
    return (
      <Input
        type="checkbox"
        name={name}
        date={date}
        refetch={refetch}
        value={Boolean(todayData[name])}/>
    )
  };
  
  const NumberInput = ({ name }) => {
    return (
      <Input
        type="number"
        name={name}
        date={date}
        refetch={refetch}
        value={todayData[name]}/>
    )
  };
  
  return (
    <div>
      <Input
        type="date"
        name="Date"
        value={date}
        onChange={setDate}/>
      <EnergyInput date={date} onSuccess={refetch}/>
      <div className="">
        <Fieldset legend="Sleep">
          <TimeInput name="wentToBed"/>
          <TimeInput name="wokeUp"/>
          <CheckboxInput name="snooze"/>
          <CheckboxInput name="wokeMidNight"/>
          <NumberInput name="nap"/>
        </Fieldset>
        <Fieldset legend="Consumption">
          <TimeBasedInput name="eating" date={date}/>
          <TimeBasedInput name="coffee" date={date}/>
          <TimeBasedInput name="water" date={date}/>
          <TimeBasedInput name="sugar" date={date}/>
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
          <TimeBasedInput name="shower" date={date}/>
          <CheckboxInput name="workLate"/>
          <CheckboxInput name="workout"/>
          <CheckboxInput name="sick"/>
          <CheckboxInput name="porn"/>
        </Fieldset>
      </div>
    </div>
  );
};
