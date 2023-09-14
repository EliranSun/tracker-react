import { useEffect, useState } from "react";
import Row from "../models/row";
import { nearestFifteen } from "../utils/time";
import { getTrackingData } from "../utils/firebase";
import { getLocaleDate } from "../utils/date";
import { DateTime } from 'luxon';

const extractTimeBasedData = (data = [], date) => {
  return data.map(item => {
    const value = Object.values(item)[0];
    const hour = value?.split(":")[0];
    const minute = nearestFifteen(value?.split(":")[1]);
    
    if (hour && minute) {
      return { y: hour ? `${hour}:${minute}` : null, x: date };
    }
    
    return null;
  }).filter(Boolean);
};

const extractValueBasedData = (data = [], date) => {
  return data.map(item => {
    const key = Object.keys(item)[0];
    const value = Object.values(item)[0];
    if (value && key) {
      return ({ y: value, x: date });
    }
    
    return null;
  }).filter(Boolean);
};

const extractSleepHoursData = (data = []) => {
  const wentToBedHour = Number(data.wentToBed?.split(":")[0]);
  const wentToBedMinute = nearestFifteen(data.wentToBed?.split(":")[1]);
  const wokeUpHour = Number(data.wokeUp?.split(":")[0]);
  const wokeUpMinute = nearestFifteen(data.wokeUp?.split(":")[1]);
  
  const thisDaySleep = [];
  const previousDaySleep = [];
  
  if (data.wentToBed && data.wokeUp) {
    if (Number(wentToBedHour) >= 0 && Number(wentToBedHour) <= 12) {
      thisDaySleep.push(`${wentToBedHour}:${wentToBedMinute}`, `${wokeUpHour}:${wokeUpMinute}`);
      return [{ x: data.date, y: thisDaySleep }];
    }
    
    previousDaySleep.push(`${wentToBedHour}:${wentToBedMinute}`, "23:59");
    thisDaySleep.push("0:00", `${wokeUpHour}:${wokeUpMinute}`);
    
    const date = new Date(new Date(data.date).getTime() - 24 * 60 * 60 * 1000);
    const previousDay = getLocaleDate(date);
    
    return [
      { x: previousDay, y: previousDaySleep },
      { x: data.date, y: thisDaySleep }
    ];
  }
  
  return [];
};

export const useChartData = ({ date, type }) => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  
  useEffect(() => {
    setIsLoading(true);
    getTrackingData(date)
      .then(data => {
        if (!data) {
          setError(new Error("No data found"));
          return;
        }
        
        const foo = {};
        Object.keys(new Row()).forEach(key => {foo[key] = []});
        foo.sleep = [];
        
        data
          .map((item) => ({ ...item, timestamp: new Date(item.date) }))
          .sort((a, b) => a.timestamp - b.timestamp)
          .forEach((row) => {
            const date = row.date;
            foo.creative.push({ y: row.creative, x: row.date });
            foo.productivity.push({ y: row.productivity, x: row.date });
            foo.social.push({ y: row.social, x: row.date });
            
            foo.sleep.push(...extractSleepHoursData(row));
            foo.coffee.push(...extractTimeBasedData(row.coffee, date));
            foo.energy.push(...extractValueBasedData(row.energy, date));
            
            const napOverTime = DateTime
              .fromObject({ hour: 15, minute: 0 })
              .plus({ minutes: row.nap })
              .toFormat('HH:mm');
            row.wokeUpMidNight && foo.wokeUpMidNight.push({ y: '4:00', x: row.date });
            row.snooze && foo.snooze.push({ y: '7:00', x: row.date });
            row.nap && foo.nap.push({ y: ['15:00', napOverTime], x: row.date });
          });
        
        setData({
          data: foo,
          labels: Array.from({ length: 7 }).map((_, i) => {
            const today = new Date().getTime();
            const day = new Date(today - i * 24 * 60 * 60 * 1000);
            return getLocaleDate(day);
          }).reverse(),
        });
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [date]);
  
  return {
    error,
    isLoading,
    date,
    ...data,
  };
};
