import { Fieldset } from "./components/molecules/Fieldset";
import { Input } from "./components/atoms/Input";
import { useData } from "./hooks/useData";
import { useState } from "react";

export const TrackerForm = () => {
  const { todayData, date } = useData();
  const [dataToInsert, setDataToInsert] = useState(todayData);
  console.log(dataToInsert);

  const update = (value) => {
    setDataToInsert({ ...dataToInsert, ...value });
  };

  return (
    <div>
      <Input type="date" name="Date" value={date} />
      <Input type="range" name="Energy" />
      <div className="">
        <Fieldset legend="Sleep">
          <Input type="time" name="Went to bed" value={todayData.wentToBed} />
          <Input type="time" name="Woke up" value={todayData.wokeUp} />
          <Input type="checkbox" name="Snooze" checked={todayData.snooze} />
          <Input
            type="checkbox"
            name="Woke up mid night"
            checked={todayData.wokeMidNight}
          />
          <Input
            type="checkbox"
            name="Nap 30 minutes"
            checked={todayData.nap === 30}
          />
          <Input
            type="checkbox"
            name="Nap 45 minutes"
            checked={todayData.nap === 45}
          />
          <Input
            type="checkbox"
            name="Nap 90 minutes"
            checked={todayData.nap === 90}
          />
        </Fieldset>
        <Fieldset legend="Consumption">
          <Input type="time" name="Eat" value={todayData.eat} />
          <Input type="time" name="Coffee" value={todayData.coffee} />
          <Input type="time" name="Water" value={todayData.water} />
          <Input type="time" name="Sugar" value={todayData.sugar} />
          <Input type="checkbox" name="Alcohol" checked={todayData.alcohol} />
          <Input type="checkbox" name="Keto" checked={todayData.keto} />
          <Input type="checkbox" name="Stuffed" checked={todayData.stuffed} />
        </Fieldset>
        <Fieldset legend="Activities (Hours)">
          <Input
            type="number"
            name="Productivity"
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
          <Input type="checkbox" name="Shower" checked={todayData.shower} />
          <Input
            type="checkbox"
            name="Work late"
            checked={todayData.workLate}
          />
          <Input type="checkbox" name="Workout" checked={todayData.workout} />
          <Input type="checkbox" name="Sick" checked={todayData.sick} />
          <Input type="checkbox" name="Porn" checked={todayData.porn} />
        </Fieldset>
      </div>
    </div>
  );
};
