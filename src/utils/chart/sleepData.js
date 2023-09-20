import { DateTime } from "luxon";
import { DatasetTypes } from "../../constants";

export const getSleepLabels = (data = []) => {
  return data.map((entry) => {
    return entry.date;
  });
};

const roundToNearestQuarterHour = (timeStr) => {
  let dt = DateTime.fromFormat(timeStr, "H:mm");
  let minutes = dt.minute;
  let roundedMinutes = Math.floor(minutes / 15) * 15;
  return dt.set({ minute: roundedMinutes }).toFormat("H:mm");
};

export const getSleepData = (data) => {
  let wentToBedNextDayTime = "";
  const sleepData = [];
  
  data.forEach(({ date, wokeUp, wentToBed }) => {
    const roundedWoke = wokeUp && roundToNearestQuarterHour(wokeUp);
    const roundedInBed = wentToBed && roundToNearestQuarterHour(wentToBed);
    const wentToBedHour = wentToBed && DateTime.fromFormat(wentToBed, "H:mm").hour;
    const isWentToBedNextDay = wentToBedHour >= 0 && wentToBedHour <= 18;
    
    roundedWoke && sleepData.push({
      x: date,
      y: [wentToBedNextDayTime || "0:00", roundedWoke]
    });
    
    if (wentToBedNextDayTime) {
      wentToBedNextDayTime = "";
    }
    
    if (isWentToBedNextDay) {
      wentToBedNextDayTime = roundedInBed;
    } else {
      roundedInBed && sleepData.push({
        x: date,
        y: [roundedInBed, "23:59"]
      });
    }
  });
  
  if (wentToBedNextDayTime) {
    const nextDay = DateTime.fromISO(data[data.length - 1].date)
      .plus({ days: 1 })
      .toISODate();
    sleepData.push({
      x: nextDay,
      y: [wentToBedNextDayTime, ""]
    });
  }
  
  return sleepData;
}

export const getSleepDataset = (data = [], isDayView = true) => {
  return {
    label: "Sleep",
    yAxisID: "y1",
    borderWidth: 3,
    type: DatasetTypes.BAR,
    indexAxis: isDayView ? 'y' : 'x',
    borderColor: "rgb(66,161,143)",
    backgroundColor: "rgb(79,180,161)",
    data: getSleepData(data),
  };
};