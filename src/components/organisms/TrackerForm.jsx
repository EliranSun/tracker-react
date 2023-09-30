import { camelCase } from "lodash";
import { Fieldset } from "../molecules/Fieldset";
import { Input } from "../atoms/Input";
import { EnergyInput } from "../atoms/EnergyInput";
import { TimeBasedInput } from "../atoms/TimeBasedInput";
import {
  BellSimpleZ,
  Couch,
  Moon,
  Note,
  SmileyXEyes,
  SunHorizon,
  ForkKnife,
  Coffee,
  Cake,
  Bathtub,
  Drop,
  Balloon,
  Fish,
  MathOperations,
  Tree,
  ChatsCircle,
  PaintBrush,
  Mountains,
  GameController,
  Barbell,
  Heart,
  HeartBreak,
  Laptop,
  ThermometerCold,
  BeerBottle
} from "@phosphor-icons/react";

const iconProps = {
  size: 25,
  weight: "fill",
}

export const TrackerForm = ({ date, data, refetch }) => {
  const TimeInput = ({ name, icon }) => {
    return (
      <Input
        type="time"
        name={name}
        date={date}
        refetch={refetch}
        icon={icon}
        value={data[camelCase(name)]}
      />
    );
  };

  const CheckboxInput = ({ name, icon }) => {
    return (
      <Input
        type="checkbox"
        name={name}
        icon={icon}
        date={date}
        refetch={refetch}
        value={Boolean(data[camelCase(name)])}
      />
    );
  };

  const NumberInput = ({ name, icon }) => {
    return (
      <Input
        type="number"
        name={name}
        date={date}
        icon={icon}
        refetch={refetch}
        value={data[camelCase(name)]}
      />
    );
  };

  return (
    <div className="w-full pb-24">
      <EnergyInput
        date={date}
        refetch={refetch}
        values={data.energy}/>
      <div className="w-full">
        <Input icon={<Note {...iconProps}/>} name="note" type="textarea" date={date} value={data.note}/>
        <Fieldset legend="Consumption">
          <TimeBasedInput
            icon={<ForkKnife {...iconProps}/>}
            values={data.eating}
            name="eating"
            refetch={refetch}
            date={date}/>
          <TimeBasedInput
            icon={<Coffee {...iconProps}/>}
            values={data.coffee}
            name="coffee"
            refetch={refetch}
            date={date}/>
          <TimeBasedInput
            icon={<Cake {...iconProps}/>}
            values={data.sugar}
            name="sugar"
            refetch={refetch}
            date={date}/>
          <TimeBasedInput
            icon={<Balloon {...iconProps}/>}
            values={data.stuffed}
            name="stuffed"
            refetch={refetch}
            date={date}/>
          <TimeBasedInput
            icon={<BeerBottle {...iconProps}/>}
            values={data.alcohol}
            name="alcohol"
            refetch={refetch}
            date={date}/>
          <TimeBasedInput
            icon={<Drop {...iconProps}/>}
            values={data.water}
            name="water"
            refetch={refetch}
            date={date}/>
          <CheckboxInput icon={<Fish {...iconProps}/>} name="keto"/>
        </Fieldset>
        <Fieldset legend="Activities (Hours)">
          <NumberInput icon={<MathOperations {...iconProps}/>} name="productivity"/>
          <NumberInput icon={<PaintBrush {...iconProps}/>} name="creative"/>
          <NumberInput icon={<GameController {...iconProps}/>} name="media"/>
          <NumberInput icon={<ChatsCircle {...iconProps}/>} name="social"/>
          <NumberInput icon={<Tree {...iconProps}/>} name="family"/>
          <NumberInput icon={<Mountains {...iconProps}/>} name="outside"/>
        </Fieldset>
        <Fieldset legend="Well Being">
          <TimeBasedInput
            icon={<Bathtub {...iconProps}/>}
            values={data.shower}
            name="shower"
            refetch={refetch}
            date={date}/>
          <TimeBasedInput
            icon={<Barbell {...iconProps}/>}
            values={data.workout}
            name="workout"
            refetch={refetch}
            date={date}/>
          <TimeBasedInput
            icon={<Heart {...iconProps}/>}
            values={data.whoohoo}
            name="whoohoo"
            refetch={refetch}
            date={date}/>
          <TimeBasedInput
            icon={<HeartBreak {...iconProps}/>}
            values={data.boohoo}
            name="boohoo"
            refetch={refetch}
            date={date}/>
          <CheckboxInput icon={<Laptop {...iconProps}/>} name="work_late"/>
          <CheckboxInput icon={<ThermometerCold {...iconProps}/>} name="sick"/>
        </Fieldset>
        <Fieldset legend="Sleep">
          <TimeInput icon={<SunHorizon {...iconProps}/>} name="woke_up"/>
          <TimeInput icon={<Moon {...iconProps}/>} name="went_to_bed"/>
          <CheckboxInput icon={<BellSimpleZ {...iconProps}/>} name="snooze"/>
          <CheckboxInput icon={<SmileyXEyes {...iconProps}/>} name="woke_up_mid_night"/>
          <NumberInput icon={<Couch {...iconProps}/>} name="nap"/>
        </Fieldset>
      </div>
    </div>
  );
};
