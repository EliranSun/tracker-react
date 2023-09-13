import { TrackerForm } from "./components/organisms/TrackerForm";
import { TrackingChart } from "./components/organisms/TrackingChart";
import { useLogin } from "./utils/supabase";
import { useState } from "react";

function App() {
  const { isLoggedIn, login } = useLogin();
  const [email, setEmail] = useState("");
  
  if (!isLoggedIn) {
    return (
      <section className="App">
        <h1>Please login</h1>
        <button onClick={login}>LOGIN WITH GOOGLE</button>
      </section>
    );
  }
  
  return (
    <section className="App">
      <TrackerForm/>
      <TrackingChart/>
    </section>
  );
}

export default App;
