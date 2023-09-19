import { camelCase } from "lodash";
import { Fieldset } from "../molecules/Fieldset";
import { Input } from "../atoms/Input";
import { EnergyInput } from "../atoms/EnergyInput";
import { TimeBasedInput } from "../atoms/TimeBasedInput";

export const TrackerForm = ({ date, data, refetch }) => {
  const TimeInput = ({ name }) => {
    return (
      <Input
        type="time"
        name={name}
        date={date}
        refetch={refetch}
        value={data[camelCase(name)]}
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
        value={Boolean(data[camelCase(name)])}
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
        value={data[camelCase(name)]}
      />
    );
  };

  return (
    <div className="w-full p-4 border border-white">
      <EnergyInput
        date={date}
        refetch={refetch}
        values={data.energy}/>
      <div className="w-full">
        <Fieldset legend="Sleep">
          <TimeInput name="went_to_bed"/>
          <TimeInput name="woke_up"/>
          <CheckboxInput name="snooze"/>
          <CheckboxInput name="woke_up_mid_night"/>
          <NumberInput name="nap"/>
        </Fieldset>
        <Fieldset legend="Consumption">
          <TimeBasedInput values={data.eating} name="eating" refetch={refetch} date={date}/>
          <TimeBasedInput values={data.coffee} name="coffee" refetch={refetch} date={date}/>
          <TimeBasedInput values={data.water} name="water" refetch={refetch} date={date}/>
          <TimeBasedInput values={data.sugar} name="sugar" refetch={refetch} date={date}/>
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
          <NumberInput name="media"/>
        </Fieldset>
        <Fieldset legend="Well Being">
          <TimeBasedInput values={data.shower} name="shower" refetch={refetch} date={date}/>
          <CheckboxInput name="work_late"/>
          <CheckboxInput name="workout"/>
          <CheckboxInput name="sick"/>
          <CheckboxInput name="boohoo"/>
          <CheckboxInput name="whoohoo"/>
        </Fieldset>
      </div>
    </div>
  );
};
