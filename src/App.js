import { TrackerForm } from "./components/organisms/TrackerForm";
import { TrackingChart } from "./components/organisms/TrackingChart";

import { useLogin } from "./hooks/useLogin";
import { useState } from "react";
import { getIsoDate } from "./utils/date";
import { TrackerQuickActions } from "./components/organisms/TrackerQuickActions";
import { useFormData } from "./hooks/useFormData";
import ErrorBoundary from "./components/molecules/ErrorBoundary";
import { DateControls } from "./components/molecules/DateControls";
import { MenuBar } from "./components/molecules/MenuBar";
import { InsightsView } from "./components/organisms/InsightsView";

const Pages = {
  CHART: "chart",
  FORM: "form",
  INSIGHTS: "insights",
};

function App() {
  const { isLoggedIn, login, userName } = useLogin();
  const [date, setDate] = useState(getIsoDate());
  const [page, setPage] = useState(Pages.FORM);
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
      <DateControls date={date} setDate={setDate}/>
      <MenuBar
        onInsightsButtonClick={() => setPage(Pages.INSIGHTS)}
        onChartButtonClick={() => setPage(Pages.CHART)}
        onFormButtonClick={() => setPage(Pages.FORM)}/>
      <div className="flex flex-col gap-4 p-4 my-24 w-full">
        {page === Pages.INSIGHTS &&
          <ErrorBoundary message="insight view">
            <InsightsView/>
          </ErrorBoundary>}
        {page === Pages.CHART &&
          <ErrorBoundary message="chart data">
            <TrackingChart date={date}/>
          </ErrorBoundary>}
        {page === Pages.FORM &&
          <div>
            <TrackerQuickActions date={date} userName={userName} data={todayData}/>
            <ErrorBoundary message="tracker form">
              <TrackerForm date={date} data={todayData} refetch={refetch}/>
            </ErrorBoundary>
          </div>}
      </div>
    </>
  );
}

export default App;
