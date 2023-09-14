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
    <section className="App">
      <button onClick={() => window.location.reload()}>
        Refresh Page
      </button>
      <input
        type="date"
        name="Date"
        value={date}
        onChange={event => setDate(event.target.value)}/>
      <TrackingChart date={date}/>
      <TrackerForm date={date}/>
    </section>
  );
}

export default App;
