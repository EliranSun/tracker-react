import { DateTime } from "luxon";

export const nearestFifteen = (minutesString) => {
  const minutes = parseInt(minutesString);
  const nearest = Math.round(minutes / 15) * 15;
  
  if (nearest === 60) return '00';
  if (nearest === 0) return '00';
  return nearest;
};

export const getTime = (hour, minute) => {
  if (hour && minute) {
    return new Date(2023, 1, 1, hour, minute).toLocaleTimeString("he-IL", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  
  return new Date().toLocaleTimeString("he-IL", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
export const roundToNearestQuarterHour = (timeStr) => {
  if (!timeStr) return null;
  const dt = DateTime.fromFormat(timeStr, "H:mm");
  const roundedMinutes = Math.floor(dt.minute / 15) * 15;
  return dt.set({ minute: roundedMinutes }).toFormat("H:mm");
};
export const getPreviousDay = (date) => {
  return DateTime.fromISO(date).minus({ days: 1 }).toISODate();
};
export const isHourNextDay = (hour) => {
  return hour >= 0 && hour <= 18;
};
export const getHour = date => {
  if (!date) return null;
  return DateTime.fromFormat(date, "H:mm").hour;
};
export const getTimeWithMinutesInterval = (interval = 15) => {
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