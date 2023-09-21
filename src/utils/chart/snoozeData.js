import { getHour, roundToNearestQuarterHour } from "../time";

export const getSnoozeDataset = (data = [], date = '') => {
  const snoozeData = data
    .filter((entry) => {
      if (date) {
        return entry.date === date;
      }
      
      return entry.snooze;
    })
    .map((entry) => {
      if (!entry.snooze) return null;
      
      const wokeUp = roundToNearestQuarterHour(entry.wokeUp);
      const wokeUpHour = getHour(entry.wokeUp);
      const value = [wokeUp, `${wokeUpHour + 1}:00`];
      return {
        x: date ? value : entry.date,
        y: date ? 10 : 1
      };
    });
  
  return {
    type: "bar",
    label: "Snooze",
    data: snoozeData,
    yAxisID: "y",
    indexAxis: date ? 'y' : 'x',
    backgroundColor: "rgb(255,107,8)",
    stepped: true,
    hidden: false,
  };
}