import { Button } from "../atoms/Button";
import { getTime } from "../../utils/time";
import { DateTime } from "luxon";
import { updateTrackingData } from "../../utils/firebase";
import { useState } from "react";
import { Cake, Coffee, ForkKnife, Bed, Bathtub, Drop } from "@phosphor-icons/react";

const ICON_SIZE = 21;

const Fields = {
  wokeUp: { key: "woke_up", label: <Bed size={ICON_SIZE}/> },
  coffee: { key: "coffee", label: <Coffee size={ICON_SIZE}/> },
  eating: { key: "eating", label: <ForkKnife size={ICON_SIZE}/> },
  water: { key: "water", label: <Drop size={ICON_SIZE}/> },
  sugar: { key: "sugar", label: <Cake size={ICON_SIZE}/> },
  shower: { key: "shower", label: <Bathtub size={ICON_SIZE}/> },
};

const ActionButton = ({ action, data, date, label }) => {
  const [state, setState] = useState("");

  return (
    <Button
      color="white"
      type="box"
      onClick={async () => {
        const time = DateTime.local().toFormat("HH:mm");
        const value = { [action]: [...data[action], time] };
        setState("loading");
        try {
          await updateTrackingData(date, value);
          setState("success");
        } catch (error) {
          console.error(error);
          setState("error");
        }
      }}>
      <div className="flex flex-col items-center justify-center">
        <span className="">{label}</span>
        <span className="">{action}</span>
      </div>
      {state === "success" && <span>✅</span>}
      {state === "loading" && <span>⏳</span>}
      {state === "error" && <span>❌</span>}
    </Button>
  );
}
export const TrackerQuickActions = ({ userName = "", data = {}, date }) => {
  const hour = new Date().getHours();
  const timeOfDayGreeting = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";

  const actions = [];

  if (hour < 9 && !data.wokeUp) actions.push(Fields.wokeUp, Fields.coffee, Fields.sugar, Fields.shower);
  else if (hour > 23) actions.push(Fields.water, Fields.sugar, Fields.shower);
  else actions.push(Fields.eating, Fields.coffee, Fields.sugar, Fields.shower, Fields.water);

  return (
    <section className="flex flex-col box-border md:w-5/6 mb-12">
      <div>
        <h1 className="text-2xl">Good {timeOfDayGreeting} {userName.split(' ')[0]}!</h1>
        <h2><b>It's {getTime()}.</b> Want to quickly log something?</h2>
        <h3 className="text-xs">Clicking will add the activity automatically with current time</h3>
      </div>
      <div className="flex gap-4 mt-4">
        {actions
          .filter(({ key }) => !(data.wokeUp && key === Fields.wokeUp))
          .map(({ key, label }) => {
            return (
              <ActionButton
                date={date}
                action={key}
                data={data}
                label={label}
                key={key}/>
            );
          })}
      </div>
    </section>
  );
};