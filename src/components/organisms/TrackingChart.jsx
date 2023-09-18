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

const TwentyFourHoursFifteenMinutesIntervals = Array.from(
  Array(24 * 4).keys()
).map((i) => {
  const hour = Math.floor(i / 4);
  const minute = (i % 4) * 15;
  return `${hour}:${minute === 0 ? "00" : minute}`;
});

export const TrackingChart = ({ date }) => {
  const [isDayView, setIsDayView] = useState(true);
  const data = useChartData({
    date: isDayView && getLocaleDate(date ? new Date(date) : undefined),
  });

  return (
    <div className="md:w-2/3">
      <Line
        data={data}
        width={window.innerWidth}
        height={window.innerHeight/2}
        options={{
          interaction: {
            mode: "index",
            intersect: false,
          },
          cubicInterpolationMode: "monotone",
          scales: {
            y: {
              beginAtZero: true,
              stacked: false,
            },
            y1: {
              beginAtZero: false,
              adapter: "luxon",
              type: "category",
              labels: TwentyFourHoursFifteenMinutesIntervals,
              stack: true,
              time: {
                unit: "hour",
              },
              display: true,
              position: "right",
              grid: {
                drawOnChartArea: false, // only want the grid lines for one axis to show up
              },
            },
            y2: {
              beginAtZero: true,
            },
          },
          legend: {
            hidden: true
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function (context) {
                  if (context.dataset.label.toLowerCase() !== "sleep") {
                    return `${context.dataset.label}: ${context.formattedValue}`;
                  }

                  let label = "Sleep:";
                  const data = context.raw?.y;
                  if (data.length === 2) {
                    label += `${data[0]} - ${data[1]}`;
                  }

                  if (data.length === 4) {
                    label += `${data[2]} - ${data[1]}`;
                  }

                  return label;
                },
              },
            },
          },
        }}/>

      <Button className="mx-2 my-4" onClick={() => setIsDayView(true)}>DAY</Button>
      <Button className="mx-2 my-4" onClick={() => setIsDayView(false)}>WEEK</Button>
      <Button onClick={() => window.location.reload()}>
        Refresh Page
      </Button>
    </div>
  );
};
