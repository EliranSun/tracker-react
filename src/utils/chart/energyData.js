import { DatasetTypes } from "../../constants";

import { roundToNearestQuarterHour } from "../time";

export const getEnergyData = (data = [], isDayView = true, date) => {
  const averages = {};
  const energyData = [];
  const averageData = [];
  
  data.filter(entry => {
    if (isDayView) {
      return entry.date === date;
    }
    
    return true;
  }).forEach(entry => {
    entry.energy.forEach((item) => {
      const value = Object.values(item)[0];
      const time = roundToNearestQuarterHour(Object.keys(item)[0]);
      
      averages[entry.date] = {
        sum: (averages[entry.date]?.sum || 0) + Number(value),
        count: (averages[entry.date]?.count || 0) + 1,
      };
      
      energyData.push({ x: isDayView ? time : entry.date, y: value });
    });
  });
  
  Object.entries(averages).forEach(([date, item]) => {
    const average = item.sum / item.count;
    averageData.push({ x: date, y: average });
  });
  
  return {
    label: "Energy",
    yAxisID: "y",
    borderWidth: 3,
    type: DatasetTypes.LINE,
    borderColor: "rgb(235,205,53)",
    backgroundColor: "rgba(235,220,53,0.5)",
    data: isDayView ? energyData : averageData,
  };
};