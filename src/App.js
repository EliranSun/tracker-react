import { TrackerForm } from "./components/organisms/TrackerForm";
import { TrackingChart } from "./components/organisms/TrackingChart";

import { useLogin } from "./hooks/useLogin";
import { useState } from "react";
import { getIsoDate } from "./utils/date";
import { TrackerQuickActions } from "./components/organisms/TrackerQuickActions";
import { useFormData } from "./hooks/useFormData";
import { DateTime } from "luxon";
import { Button } from "./components/atoms/Button";

function App() {
  const { isLoggedIn, login, userName } = useLogin();
  const [date, setDate] = useState(getIsoDate());
  const { todayData, refetch } = useFormData(date);
  
  if (!isLoggedIn) {
    return (
      <section className="App">
        <h1>Please login</h1>
        <button onClick={login}>
          GOOGLE LOGIN
        </button>
      </section>
    );
  }
  
  return (
    <>
      <input
        type="date"
        name="Date"
        className="text-black text-xl"
        value={date}
        onChange={event => setDate(event.target.value)}/>
      <div className="flex w-full justify-center gap-4">
        <Button onClick={() => {
          setDate(
            DateTime.fromFormat(date, "yyyy-MM-dd")
              .minus({ days: 1 })
              .toFormat("yyyy-MM-dd")
          );
        }}>Previous Day
        </Button>
        <Button onClick={() => {
          setDate(
            DateTime.fromFormat(date, "yyyy-MM-dd")
              .plus({ days: 1 })
              .toFormat("yyyy-MM-dd")
          );
        }}>Next Day
        </Button>
        <Button onClick={() => window.location.reload()}>Refresh page</Button>
      </div>
      <section className="flex flex-col md:flex-row md:flex-row gap-4 justify-center">
        <TrackingChart date={date}/>
        <div className="flex flex-col gap-4">
          <TrackerQuickActions date={date} userName={userName} data={todayData}/>
          <TrackerForm date={date} data={todayData} refetch={refetch}/>
        </div>
      </section>
    </>
  );
}

export default App;
