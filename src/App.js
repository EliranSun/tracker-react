import { TrackerForm } from "./components/organisms/TrackerForm";
import { TrackingChart } from "./components/organisms/TrackingChart";

import { useLogin } from "./hooks/useLogin";

function App() {
  const { isLoggedIn, login } = useLogin();
  
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
      <TrackingChart/>
      <TrackerForm/>
    </section>
  );
}

export default App;
