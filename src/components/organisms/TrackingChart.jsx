import {
  Chart as ChartJS,
  LineElement,
  Tooltip,
  Legend,
  LinearScale,
  CategoryScale,
  PointElement,
  BarElement,
  RadialLinearScale,
  ScatterController,
  BarController,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useChartData } from "../../hooks/useChartData";
import { useMemo, useState } from "react";
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

const getData = ({ labels, data }) => {
  if (!labels || !data) {
    return {
      labels: [],
      datasets: [],
    };
  }
  
  const energyData = {
    type: "line",
    label: "Energy levels",
    data: data.energy,
    tension: 0,
    fill: false,
    borderWidth: 3,
    yAxisID: "y",
    borderColor: "rgb(235,205,53)",
    backgroundColor: "rgba(235,220,53,0.5)",
  };
  const coffeeData = {
    type: "line",
    label: "Last coffee",
    data: data.coffee,
    borderWidth: 3,
    yAxisID: "y1",
    borderColor: "rgb(38,28,22)",
    backgroundColor: "rgba(66,48,30,0.5)",
  };
  const productivityData = {
    type: "bar",
    stack: true,
    label: "Productivity",
    data: data.productivity,
    borderWidth: 3,
    yAxisID: "y2",
    borderColor: "rgb(235,53,53)",
    backgroundColor: "rgba(122,40,40,0.5)",
  };
  const creativeData = {
    type: "bar",
    stack: true,
    label: "Creativity",
    data: data.creative,
    borderWidth: 3,
    yAxisID: "y2",
    borderColor: "rgb(196,53,235)",
    backgroundColor: "rgba(183,53,235,0.5)",
  };
  const socialData = {
    type: "bar",
    stack: true,
    label: "Social",
    data: data.social,
    borderWidth: 3,
    yAxisID: "y2",
    borderColor: "rgb(53, 162, 235)",
    backgroundColor: "rgba(53, 162, 235, 0.5)",
  };
  
  const datasets = [];
  
  data.energy && datasets.push(energyData);
  data.coffee && datasets.push(coffeeData);
  data.productivity && datasets.push(productivityData);
  data.creative && datasets.push(creativeData);
  data.social && datasets.push(socialData);
  
  return {
    labels,
    datasets: [
      ...datasets,
      {
        type: "scatter",
        label: "Woke mid night",
        data: data.wokeUpMidNight,
        borderColor: "blue",
        yAxisID: "y1",
        stepped: true,
      },
      {
        type: "scatter",
        label: "Snooze",
        yAxisID: "y1",
        data: data.snooze,
        borderColor: "yellow",
        stepped: true,
      },
      {
        type: "bar",
        label: "Sleep",
        data: data.sleep,
        borderWidth: 3,
        yAxisID: "y1",
        borderColor: "rgb(18,33,61)",
        backgroundColor: "rgba(16,22,44,0.5)",
      },
      {
        type: "bar",
        label: "Nap",
        data: data.nap,
        borderWidth: 3,
        yAxisID: "y1",
        borderColor: "green",
        backgroundColor: "green",
      },
      {
        type: "bar",
        stack: true,
        label: "YouTube",
        data: data.youtube,
        borderWidth: 3,
        yAxisID: "y2",
        borderColor: "red",
        backgroundColor: "red",
      }
    ],
  };
};

const TwentyFourHoursFifteenMinutesIntervals = Array.from(
  Array(24 * 4).keys()
).map((i) => {
  const hour = Math.floor(i / 4);
  const minute = (i % 4) * 15;
  return `${hour}:${minute === 0 ? "00" : minute}`;
});

const options = {
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
    }
  },
  plugins: {
    tooltip: {
      callbacks: {
        label: function (context) {
          if (context.dataset.label.toLowerCase() !== 'sleep') {
            return `${context.dataset.label}: ${context.formattedValue}`;
          }
          
          let label = 'Sleep:';
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
};

export const TrackingChart = ({ date }) => {
  const [isDayView, setIsDayView] = useState(false);
  const { labels, data } = useChartData({
    date: isDayView && getLocaleDate(date ? new Date(date) : undefined)
  });
  const formattedData = useMemo(() => {
    return getData({
      labels,
      data,
    });
  }, [labels, data]);
  
  return (
    <div>
      <button onClick={() => setIsDayView(true)}>DAY</button>
      <button onClick={() => setIsDayView(false)}>WEEK</button>
      <Line options={options} data={formattedData}/>
    </div>
  );
};
