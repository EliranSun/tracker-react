import { Button } from "../atoms/Button";
import { DateTime } from "luxon";
import { ArrowCircleLeft, ArrowCircleRight } from "@phosphor-icons/react";
import { MENU_ICON_SIZE } from "../../constants";

export const DateControls = ({ date, setDate }) => {
  return (
    <section>
      <div className="fixed top-0 z-10 bg-gray-800 p-4 flex w-full justify-center items-center gap-4">
        <Button onClick={() => {
          setDate(
            DateTime.fromFormat(date, "yyyy-MM-dd")
              .minus({ days: 1 })
              .toFormat("yyyy-MM-dd")
          );
        }}>
          <ArrowCircleLeft color="white" size={MENU_ICON_SIZE}/>
        </Button>
        <input
          type="date"
          name="Date"
          style={{ width: window.innerWidth }}
          className="text-black text-xl h-12"
          value={date}
          onChange={event => setDate(event.target.value)}/>
        <Button onClick={() => {
          setDate(
            DateTime.fromFormat(date, "yyyy-MM-dd")
              .plus({ days: 1 })
              .toFormat("yyyy-MM-dd")
          );
        }}>
          <ArrowCircleRight color="white" size={MENU_ICON_SIZE}/>
        </Button>
      </div>
    </section>
  );
};