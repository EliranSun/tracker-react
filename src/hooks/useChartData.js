import { useEffect, useState } from "react";
import Row from "../models/row";
import { nearestFifteen } from "../utils/time";
import { getTrackingData } from "../utils/firebase";
import { getLocaleDate } from "../utils/date";

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
    thisDaySleep.push("0:00", `${wokeUpHour}:${wokeUpMinute}`);
    previousDaySleep.push(`${wentToBedHour}:${wentToBedMinute}`, "24:00");
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
          console.log({ data });
          setError(new Error("No data found"));
          return;
        }
        
        const lastCoffee = [];
        const productivityData = [];
        const creativityData = [];
        const socialData = [];
        const totalSleepData = [];
        const wakingUpMidNight = [];
        const energyData = [];
        
        data
          .map((item) => ({ ...item, timestamp: new Date(item.date) }))
          .sort((a, b) => a.timestamp - b.timestamp)
          .forEach((row) => {
            const date = row.date;
            creativityData.push({ y: row.creative, x: row.date });
            productivityData.push({ y: row.productivity, x: row.date });
            socialData.push({ y: row.social, x: row.date });
            row.wokeUpMidNight && wakingUpMidNight.push({ y: 5, x: row.date });
            totalSleepData.push(...extractSleepHoursData(row));
            lastCoffee.push(...extractTimeBasedData(row.coffee, date));
            energyData.push(...extractValueBasedData(row.energy, date));
          });
        
        setData({
          labels: Array.from({ length: 7 }).map((_, i) => {
            const today = new Date().getTime();
            const day = new Date(today - i * 24 * 60 * 60 * 1000);
            return getLocaleDate(day);
          }).reverse(),
          data: {
            energy: energyData,
            coffee: lastCoffee,
            productivity: productivityData,
            creative: creativityData,
            social: socialData,
            sleep: totalSleepData,
            wokeUpMidNight: wakingUpMidNight,
          },
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
