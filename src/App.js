import { TrackerForm } from "./components/organisms/TrackerForm";
import { TrackingChart } from "./components/organisms/TrackingChart";
import { useLogin } from "./utils/supabase";

function App() {
  const { isLoggedIn, login } = useLogin();
  
  if (!isLoggedIn) {
    return (
      <section className="App">
        <h1>Please login</h1>
        <button onClick={login}>MAGIC LOGIN</button>
      </section>
    );
  }
  
  return (
    <section className="App">
      <TrackingChart/>
      <TrackerForm/>
    </section>
  );
}

export default App;
