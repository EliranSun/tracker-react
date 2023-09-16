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
  const [isDayView, setIsDayView] = useState(false);
  const data = useChartData({
    date: isDayView && getLocaleDate(date ? new Date(date) : undefined),
  });

  return (
    <div style={{ height: "50vh" }}>
      <button onClick={() => setIsDayView(true)}>DAY</button>
      <button onClick={() => setIsDayView(false)}>WEEK</button>
      <Line
        data={data}
        options={{
          interaction: {
            mode: "index",
            intersect: false,
          },
          cubicInterpolationMode: "monotone",
          scales: {
            y: {
              stacked: false,
            },
            y1: {
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
              beginAtZero: false,
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
    </div>
  );
};
