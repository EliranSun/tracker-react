import { TrackerForm } from "./components/organisms/TrackerForm";
import { TrackingChart } from "./components/organisms/TrackingChart";

import { useLogin } from "./hooks/useLogin";
import { useState } from "react";
import { getIsoDate } from "./utils/date";
import { TrackerQuickActions } from "./components/organisms/TrackerQuickActions";
import { useFormData } from "./hooks/useFormData";

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
      <div className="flex w-full justify-center">
        <input
          type="date"
          name="Date"
          className="text-black"
          value={date}
          onChange={event => setDate(event.target.value)}/>
      </div>
      <section className="">
        <div className="">
          <TrackerQuickActions date={date} userName={userName} data={todayData}/>
          <TrackerForm date={date} data={todayData} refetch={refetch}/>
        </div>
        <TrackingChart date={date}/>
      </section>
    </>
  );
}

export default App;
