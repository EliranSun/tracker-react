import {
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  RadialLinearScale,
  ScatterController,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useChartData } from "../../hooks/useChartData";
import { useState } from "react";
import { getLocaleDate } from "../../utils/date";
import { Button } from "../atoms/Button";
import { getSleepDataset, getSleepLabels } from "../../utils/chart/sleepData";
import { getEnergyData } from "../../utils/chart/energyData";
import { getSnoozeDataset } from "../../utils/chart/snoozeData";
import { getOptions } from "../../utils/chart/options";
import { getTimeWithMinutesInterval } from "../../utils/time";
import { getCoffeeData } from "../../utils/chart/coffeeData";
import { ArrowClockwise, CalendarBlank, Clock } from "@phosphor-icons/react";

ChartJS.register(
  LineElement,
  BarElement,
  PointElement,
  Tooltip,
  Legend,
  LinearScale,
  CategoryScale,
  RadialLinearScale,
  ScatterController,
  BarController
);

const ICON_SIZE = 20;

export const TrackingChart = ({ date }) => {
  const [isDayView, setIsDayView] = useState(true);
  const [isTotalSleepView, setIsTotalSleepView] = useState(true);
  const chartDate = isDayView && getLocaleDate(date ? new Date(date) : undefined);
  const { data, refetch } = useChartData({ date: chartDate });
  const timeLabels = getTimeWithMinutesInterval(15);
  const lineData = {
    labels: isDayView ? timeLabels : getSleepLabels(data.entries),
    datasets: [
      getEnergyData(data.entries, isDayView, date),
      getSleepDataset(data.entries, isDayView ? date : '', !isDayView && isTotalSleepView),
      getSnoozeDataset(data.entries, isDayView ? date : ''),
      getCoffeeData(data.entries, isDayView ? date : '', !isDayView && isTotalSleepView)
    ]
  };
  
  return (
    <div className="md:w-1/2">
      <div className="flex items-start gap-4">
        <Button onClick={refetch}>
          <ArrowClockwise size={ICON_SIZE} color="white"/>
        </Button>
        <Button onClick={() => setIsDayView(true)}>
          <Clock size={ICON_SIZE} color="white"/>
        </Button>
        <Button onClick={() => setIsDayView(false)}>
          <CalendarBlank size={ICON_SIZE} color="white"/>
        </Button>
      </div>
      <div className="flex items-center">
        <input
          id="totalSleepView"
          type="checkbox"
          checked={isTotalSleepView}
          onChange={() => {
            setIsTotalSleepView(!isTotalSleepView);
          }}/>
        <label className="mx-2 my-4" htmlFor="totalSleepView">Stack data view</label>
      </div>
      <Line
        data={lineData}
        width={window.innerWidth * 0.8}
        height={window.innerHeight / 2}
        options={getOptions(isDayView, isTotalSleepView, timeLabels)}/>
    </div>
  );
};
