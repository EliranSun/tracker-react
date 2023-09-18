import { Button } from "../atoms/Button";
import { getTime } from "../../utils/time";
import { DateTime } from "luxon";
import { updateTrackingData } from "../../utils/firebase";
import { useState } from "react";

const Fields = {
  wokeUp: { key: "woke_up", label: "🥱" },
  coffee: { key: "coffee", label: "☕️" },
  eating: { key: "eating", label: "🍽️" },
  water: { key: "water", label: "🥛" },
  sugar: { key: "sugar", label: "🍞" },
  shower: { key: "shower", label: "🚿" },
};

const ActionButton = ({ action, data, date, label }) => {
  const [state, setState] = useState("");

  return (
    <Button
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
      <div>
        <span>{label}</span>
        <span className="text-xs">{action}</span>
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
    <section className="flex flex-col border border-white p-4 box-border md:w-5/6">
      <div>
        <h1 className="text-xl">Good {timeOfDayGreeting} {userName.split(' ')[0]}!</h1>
        <h2><b>It's {getTime()}.</b> Want to quickly log something?</h2>
        <h3 className="text-xs">Clicking will add the activity automatically with current time</h3>
      </div>
      <div className="flex gap-4 mt-4 flex-wrap">
        {actions
          .filter(({ key }) => {
            if (data.wokeUp && key === Fields.wokeUp) {
              return false;
            }

            return true;
          }).map(({ key, label }) => {
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