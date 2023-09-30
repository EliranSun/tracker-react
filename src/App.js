import { TrackerForm } from "./components/organisms/TrackerForm";
import { TrackingChart } from "./components/organisms/TrackingChart";

import { useLogin } from "./hooks/useLogin";
import { useState } from "react";
import { getIsoDate } from "./utils/date";
import { TrackerQuickActions } from "./components/organisms/TrackerQuickActions";
import { useFormData } from "./hooks/useFormData";
import { DateTime } from "luxon";
import { Button } from "./components/atoms/Button";
import ErrorBoundary from "./components/molecules/ErrorBoundary";
import { ArrowCircleLeft, ArrowCircleRight, ArrowsClockwise, ChartBar, ClipboardText } from "@phosphor-icons/react";

const ICON_SIZE = 25;

const DateControls = ({ date, setDate }) => {
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
          <ArrowCircleLeft color="white" size={ICON_SIZE}/>
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
          <ArrowCircleRight color="white" size={ICON_SIZE}/>
        </Button>
      </div>
    </section>
  );
};

const Menu = ({ onChartButtonClick, onFormButtonClick }) => {
  return (
    <section className="fixed bottom-0 z-10 bg-gray-800 border-t border-white w-screen h-20 flex flex-row gap-4 items-center justify-evenly">
      <Button onClick={onFormButtonClick}>
        <ClipboardText color="white" size={ICON_SIZE}/>
      </Button>
      <Button onClick={onChartButtonClick}>
        <ChartBar color="white" size={ICON_SIZE}/>
      </Button>
      <Button onClick={() => window.location.reload()}>
        <ArrowsClockwise color="white" size={ICON_SIZE}/>
      </Button>
    </section>
  );
}

const Pages = {
  CHART: "chart",
  FORM: "form"
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
      <Menu
        onChartButtonClick={() => setPage(Pages.CHART)}
        onFormButtonClick={() => setPage(Pages.FORM)}/>
      <div className="flex flex-col gap-4 p-4 my-24">
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
