import { Fieldset } from "../molecules/Fieldset";
import { Input } from "../atoms/Input";
import { useFormData } from "../../hooks/useFormData";
import { useState } from "react";
import { getIsoDate } from "../../utils/date";
import { SubmitButton } from "../atoms/SubmitButton";
import { updateEnergy } from "../../utils/updateData";
import { EnergyInput } from "../atoms/EnergyInput";

const arrayFields = [
  'energy',
  'coffee',
  'sugar',
  'eating',
  'water',
  'shower',
];

export const TrackerForm = () => {
  const [date, setDate] = useState(getIsoDate());
  const { todayData, refetch } = useFormData(date);
  const [dataToInsert, setDataToInsert] = useState(todayData);
  
  const update = (value) => {
    const key = Object.keys(value)[0];
    
    // TODO: case string to number
    if (todayData[key] == value[key]) { // eslint-disable-line eqeqeq
      const { [key]: _, ...rest } = dataToInsert;
      setDataToInsert(rest);
      return;
    }
    
    setDataToInsert({
      ...dataToInsert,
      ...value
    });
  };
  
  return (
    <div>
      <Input
        type="date"
        name="Date"
        value={date}
        onChange={({ date: newDate }) => {
          setDate(newDate);
        }}/>
      <EnergyInput date={date} onSuccess={refetch}/>
      <div className="">
        <Fieldset legend="Sleep">
          <Input
            type="time"
            name="Went to bed"
            onChange={update}
            value={todayData.wentToBed}/>
          <Input
            type="time"
            name="Woke up"
            onChange={update}
            value={todayData.wokeUp}/>
          <Input
            type="checkbox"
            name="Snooze"
            onChange={update}
            checked={todayData.snooze}/>
          <Input
            type="checkbox"
            name="Woke up mid night"
            checked={todayData.wokeMidNight}
            onChange={update}
          />
          <Input
            type="number"
            name="Nap"
            value={todayData.nap}
            onChange={update}
          />
        </Fieldset>
        <Fieldset legend="Consumption">
          <Input
            type="time"
            name="Eat"
            onChange={update}
            value={todayData.eating?.at(-1)}/>
          <Input
            type="time"
            name="Coffee"
            onChange={update}
            value={todayData.coffee?.at(-1)}/>
          <Input
            type="time"
            name="Water"
            onChange={update}
            value={todayData.water?.at(-1)}/>
          <Input
            type="time"
            name="Sugar"
            onChange={update}
            value={todayData.sugar?.at(-1)}/>
          <Input
            type="checkbox"
            name="Alcohol"
            onChange={update}
            checked={todayData.alcohol}/>
          <Input
            type="checkbox"
            name="Keto"
            onChange={update}
            checked={todayData.keto}/>
          <Input
            type="checkbox"
            name="Stuffed"
            onChange={update}
            checked={todayData.stuffed}/>
        </Fieldset>
        <Fieldset legend="Activities (Hours)">
          <Input
            type="number"
            name="Productivity"
            onChange={update}
            value={todayData.productivity}
          />
          <Input
            type="number"
            name="Family"
            value={todayData.family}
            onChange={update}
          />
          <Input
            type="number"
            name="Social"
            value={todayData.social}
            onChange={update}
          />
          <Input
            type="number"
            name="Creative"
            value={todayData.creative}
            onChange={update}
          />
          <Input
            type="number"
            name="Outside"
            value={todayData.outside}
            onChange={update}
          />
          <Input
            type="number"
            name="YouTube"
            value={todayData.youtube}
            onChange={update}
          />
        </Fieldset>
        <Fieldset legend="Well Being">
          <Input
            type="time"
            name="Shower"
            onChange={update}
            value={todayData.shower?.at(-1)}/>
          <Input
            type="checkbox"
            name="Work late"
            onChange={update}
            checked={todayData.workLate}
          />
          <Input
            type="checkbox"
            name="Workout"
            onChange={update}
            checked={todayData.workout}/>
          <Input
            type="checkbox"
            name="Sick"
            onChange={update}
            checked={todayData.sick}/>
          <Input
            type="checkbox"
            name="Porn"
            onChange={update}
            checked={todayData.porn}/>
        </Fieldset>
      </div>
      <SubmitButton
        date={date}
        data={dataToInsert}
        onSuccess={() => {
          setTimeout(() => {
            setDataToInsert({});
            refetch();
          }, 4000);
        }}/>
    </div>
  );
};
