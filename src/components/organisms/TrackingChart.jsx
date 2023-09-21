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
import { DateTime } from "luxon";
import { getEnergyData } from "../../utils/chart/energyData";

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

const getTimeWithMinutesInterval = (interval = 15) => {
  const gap = 60 / interval;
  const hours = Array.from({ length: 24 }).map((_, i) => {
    return DateTime.fromObject({ hour: 0 }).plus({ hour: i }).toFormat("H");
  });

  const minutes = Array.from({ length: gap }).map((_, i) => {
    return DateTime.fromObject({ minute: 0 }).plus({ minute: i * interval }).toFormat(":mm");
  });
  // .concat("0:00");
  return hours.map(hour => minutes.map(minute => hour + minute)).flat()
}

export const TrackingChart = ({ date }) => {
  const [isDayView, setIsDayView] = useState(true);
  const chartDate = isDayView && getLocaleDate(date ? new Date(date) : undefined);
  const { data, refetch } = useChartData({ date: chartDate });

  // let additionalOptions = {};
  // if (!isDayView) {
  //   additionalOptions = {
  //     x1: {
  //       beginAtZero: true,
  //       labels: data.dayLabels,
  //       hidden: true
  //     },
  //   }
  // }
  const timeLabels = getTimeWithMinutesInterval(15);

  const lineData = {
    labels: isDayView ? timeLabels : getSleepLabels(data.entries, isDayView),
    datasets: [
      getEnergyData(data.entries, isDayView),
      getSleepDataset(data.entries, isDayView),
    ]
  };

  console.log(lineData.datasets[1].data);


  return (
    <div className="md:w-2/3">
      <Line
        data={lineData}
        width={window.innerWidth}
        height={window.innerHeight / 2}
        options={{
          interaction: {
            mode: "index",
            intersect: false,
          },
          cubicInterpolationMode: "monotone",
          scales: {
            // ...additionalOptions,
            y: {
              beginAtZero: false,
              stacked: false,
            },
            y1: {
              beginAtZero: false,
              adapter: "luxon",
              type: "category",
              labels: timeLabels,
              stack: true,
              time: {
                unit: "hour",
              },
              display: !isDayView,
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
                  const data = isDayView ? context.raw?.x : context.raw?.y;
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
      <div>
        <Button className="mx-2 my-4" onClick={() => setIsDayView(true)}>DAY</Button>
        <Button className="mx-2 my-4" onClick={() => setIsDayView(false)}>WEEK</Button>
        <Button onClick={refetch}>
          Refresh Chart
        </Button>
      </div>
    </div>
  );
};
