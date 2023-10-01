export const getOptions = (isDayView, isTotalSleepView, timeLabels) => {
  return {
    interaction: {
      mode: "index",
      intersect: false,
    },
    cubicInterpolationMode: "monotone",
    scales: {
      x: {
        stacked: !isDayView,
        ticks: {
          color: "white"
        }
      },
      y: {
        beginAtZero: true,
        type: "linear",
        min: 0,
        max: 10,
        display: !isDayView,
        stacked: true,
        ticks: {
          stepSize: 1,  // A smaller step size increases the density
          color: "white"
        },
      },
      y1: {
        beginAtZero: false,
        adapter: "luxon",
        type: "category",
        labels: timeLabels,
        stacked: true,
        time: {
          unit: "hour",
        },
        display: isDayView,
        position: "right",
        grid: {
          drawOnChartArea: false, // only want the grid lines for one axis to show up
        },
        ticks: {
          color: "white"
        }
      },
      y2: {
        beginAtZero: false,
        display: false,
        ticks: {
          color: "white"
        }
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            if (context.dataset.label.toLowerCase() !== "sleep") {
              return `${context.dataset.label}: ${context.formattedValue}`;
            }
            
            let label = "Sleep:";
            if (isTotalSleepView) {
              label += `${context.formattedValue}`;
            }
            
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
  }
}