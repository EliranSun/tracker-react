export const getOptions = (isDayView, isTotalSleepView, timeLabels) => {
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
  
  return {
    interaction: {
      mode: "index",
      intersect: false,
    },
    cubicInterpolationMode: "monotone",
    scales: {
      x: {
        stacked: !isDayView,
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
      },
      y2: {
        beginAtZero: false,
        display: false,
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