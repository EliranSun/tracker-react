import { DateTime } from "luxon";
import { DatasetTypes } from "../../constants";
import { getHour, getPreviousDay, isHourNextDay, roundToNearestQuarterHour } from "../time";

export const getSleepLabels = (data = []) => {
  return data.map((entry) => {
    return entry.date;
  });
};

const getDaySleepData = (data = [], date = '') => {
  const sleepData = [];

  const thisDaySleepData = data.find(entry => entry.date === date);
  const previousDaySleepData = data.find(entry => entry.date === getPreviousDay(date));
  const prevWentToBed = roundToNearestQuarterHour(previousDaySleepData?.wentToBed);
  const prevWentToBedHour = getHour(previousDaySleepData.wentToBed);
  const wentToBedHour = getHour(thisDaySleepData?.wentToBed);
  const wokeUp = roundToNearestQuarterHour(thisDaySleepData?.wokeUp);
  const wentToBed = roundToNearestQuarterHour(thisDaySleepData?.wentToBed);
  const isPrevWentToBedToday = isHourNextDay(prevWentToBedHour);
  const isWentToBedTomorrow = isHourNextDay(wentToBedHour);

  sleepData.push({ x: [isPrevWentToBedToday ? prevWentToBed : "0:00", wokeUp], y: 10 });
  !isWentToBedTomorrow && wentToBed && sleepData.push({ x: [wentToBed, "23:59"], y: 10 });

  return sleepData;
};

export const getWeeklySleepData = (data = []) => {
  let wentToBedNextDayTime = "";
  const sleepData = [];

  data.forEach(({ date, wokeUp, wentToBed }) => {
    const roundedWoke = wokeUp && roundToNearestQuarterHour(wokeUp);
    const roundedInBed = wentToBed && roundToNearestQuarterHour(wentToBed);
    const wentToBedHour = wentToBed && DateTime.fromFormat(wentToBed, "H:mm").hour;
    const isWentToBedNextDay = wentToBedHour >= 0 && wentToBedHour <= 18;

    roundedWoke && sleepData.push({ x: date, y: [wentToBedNextDayTime || "0:00", roundedWoke] });

    if (wentToBedNextDayTime) wentToBedNextDayTime = "";

    if (isWentToBedNextDay) wentToBedNextDayTime = roundedInBed;
    else roundedInBed && sleepData.push({ x: date, y: [roundedInBed, "23:59"] });
  });

  if (wentToBedNextDayTime) {
    const nextDay = DateTime.fromISO(data[data.length - 1].date).plus({ days: 1 }).toISODate();
    sleepData.push({ x: nextDay, y: [wentToBedNextDayTime, ""] });
  }

  return sleepData;
};

export const getTotalSleepData = (data = []) => {
  return data.map(entry => {
    const isWentToBedNextDay = isHourNextDay(getHour(entry.wentToBed));
    const nextDay = DateTime.fromISO(entry.date).plus({ days: 1 }).toFormat("yyyy-MM-dd");
    const nextDayEntry = data.find(entry => entry.date === nextDay);
    const wentToBed = (isWentToBedNextDay && nextDayEntry)
      ? `${nextDayEntry.date} ${entry.wentToBed}`
      : `${entry.date} ${entry.wentToBed}`;
    const wokeUp = nextDayEntry && `${nextDayEntry.date} ${nextDayEntry.wokeUp}`;

    const diffInHours = wokeUp ? DateTime
      .fromFormat(wentToBed, "yyyy-MM-dd H:mm")
      .diff(DateTime.fromFormat(wokeUp, "yyyy-MM-dd H:mm"), "hours") : 0;

    return { x: entry.date, y: Math.abs(Math.round(diffInHours.hours)) || 0 };
  })
};

export const getSleepData = (data = [], date = '', isTotalSleepView) => {
  if (data.length === 0) return [];

  if (isTotalSleepView) {
    return getTotalSleepData(data);
  }

  if (date) {
    return getDaySleepData(data, date);
  }

  return getWeeklySleepData(data);
}

export const getSleepDataset = (data = [], date, isTotalSleepView = false) => {
  return {
    label: "Sleep",
    type: DatasetTypes.BAR,
    yAxisID: (date || isTotalSleepView) ? "y" : "y1",
    indexAxis: date ? 'y' : 'x',
    backgroundColor: "rgb(79,145,180)",
    data: getSleepData(data, date, isTotalSleepView),
  };
};