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
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useChartData } from "../../hooks/useChartData";
import { useMemo } from "react";

ChartJS.register(
  LineElement,
  BarElement,
  PointElement,
  Tooltip,
  Legend,
  LinearScale,
  CategoryScale,
  RadialLinearScale
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
    borderColor: "rgb(53, 162, 235)",
    backgroundColor: "rgba(53, 162, 235, 0.5)",
  };
  const coffeeData = {
    type: "line",
    label: "Last coffee",
    data: data.coffee,
    borderWidth: 3,
    yAxisID: "y1",
    borderColor: "rgb(255, 99, 132)",
    backgroundColor: "rgba(255, 99, 132, 0.5)",
  };
  const productivityData = {
    type: "bar",
    stack: true,
    label: "Productivity",
    data: data.productivity,
    borderWidth: 3,
    yAxisID: "y2",
    borderColor: "rgb(53, 162, 235)",
    backgroundColor: "rgba(53, 162, 235, 0.5)",
  };
  const creativeData = {
    type: "bar",
    stack: true,
    label: "Creativity",
    data: data.creative,
    borderWidth: 3,
    yAxisID: "y2",
    borderColor: "rgb(53, 162, 235)",
    backgroundColor: "rgba(53, 162, 235, 0.5)",
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
        label: "Waking up mid night",
        data: data.wokeUpMidNight,
        borderColor: "tomato",
        stepped: true,
      },
      {
        type: "bar",
        label: "Sleep",
        data: data.sleep,
        borderWidth: 3,
        yAxisID: "y1",
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
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

export const TrackingChart = () => {
  const type = "day";
  const { labels, data } = useChartData({ type });
  const formattedData = useMemo(() => {
    return getData({
      labels,
      data,
    });
  }, [labels, data]);
  
  return (
    <div>
      <Line options={options} data={formattedData}/>
    </div>
  );
};
