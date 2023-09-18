import { TrackerForm } from "./components/organisms/TrackerForm";
import { TrackingChart } from "./components/organisms/TrackingChart";

import { useLogin } from "./hooks/useLogin";
import { useState } from "react";
import { getIsoDate } from "./utils/date";

function App() {
  const { isLoggedIn, login } = useLogin();
  const [date, setDate] = useState(getIsoDate());

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
      <section className="max-w-6xl m-auto flex items-start justify-center">
        <TrackingChart date={date}/>
        <TrackerForm date={date}/>
      </section>
    </>
  );
}

export default App;
