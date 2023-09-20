import { useCallback, useEffect, useState } from "react";
import Row from "../models/row";
import { nearestFifteen } from "../utils/time";
import { getTrackingData } from "../utils/firebase";
import { getLocaleDate } from "../utils/date";
import { DateTime } from "luxon";

let timeBasedCounterY = 11;
const extractTimeBasedData = (data = [], date, isDayView = false) => {
  return data
    .map((item) => {
      try {
        const hour = item?.split(":")[0];
        const minute = nearestFifteen(item?.split(":")[1]);
        
        if (hour && minute) {
          if (isDayView) {
            if (timeBasedCounterY < 5) timeBasedCounterY = 11;
            timeBasedCounterY--;
            return { y: timeBasedCounterY, x: `${hour}:00` };
          }
          
          return { y: hour ? `${hour}:${minute}` : null, x: date };
        }
        
        return null;
      } catch (error) {
        console.log(date, item, error);
        return null;
      }
    })
    .filter(Boolean);
};

const extractValueBasedData = (data = [], date, isDayView) => {
  return data
    .map((item) => {
      const key = Object.keys(item)[0];
      const value = Object.values(item)[0];
      const hour = key?.split(":")[0];
      const minute = key?.split(":")[1];
      
      if (value && key) {
        let dt = DateTime.fromObject({ hour, minute });
        const roundedDt = dt.startOf("hour");
        
        return { y: value, x: isDayView ? roundedDt.toFormat("HH:mm") : date };
      }
      
      return null;
    })
    .filter(Boolean);
};

const extractSleepHoursData = (data = [], nextDayData, isDayView = false) => {
  const wentToBedHour = Number(data.wentToBed?.split(":")[0]);
  const wentToBedMinute = nearestFifteen(data.wentToBed?.split(":")[1]);
  const wokeUpHour = data.wokeUp?.split(":")[0];
  const wokeUpMinute = nearestFifteen(data.wokeUp?.split(":")[1]);
  
  const thisDaySleep = [];
  const previousDaySleep = [];
  
  if (isDayView) {
    const foo = [{
      x: ['06:00', `${wokeUpHour}:00`],
      y: 10
    }];
    if (nextDayData && nextDayData.wentToBed) {
      const nextWentToBedHour = Number(nextDayData.wentToBed?.split(":")[0]);
      if (nextWentToBedHour > 6) foo.push({ x: [`${nextWentToBedHour}:00`, "0:00"], y: 0 });
    }
    
    return foo;
  }
  
  if (data.wentToBed && data.wokeUp) {
    if (Number(wentToBedHour) >= 0 && Number(wentToBedHour) <= 12) {
      thisDaySleep.push(
        `${wentToBedHour}:${wentToBedMinute}`,
        `${wokeUpHour}:${wokeUpMinute}`
      );
      
      return [{ x: data.date, y: thisDaySleep }];
    }
    
    previousDaySleep.push(`${wentToBedHour}:${wentToBedMinute}`, "23:59");
    thisDaySleep.push("0:00", `${wokeUpHour}:${wokeUpMinute}`);
    
    const date = new Date(new Date(data.date).getTime() - 24 * 60 * 60 * 1000);
    const previousDay = getLocaleDate(date);
    
    return [
      { x: previousDay, y: previousDaySleep },
      { x: data.date, y: thisDaySleep },
    ];
  }
  
  return [];
};

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const useChartData = ({ date }) => {
  const isDayView = Boolean(date);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    labels: [],
    datasets: [],
  });
  const fetchTrackingData = useCallback(() => {
    setIsLoading(true);
    getTrackingData()
      .then((data) => {
        if (!data) {
          setError(new Error("No data found"));
          return;
        }
        
        const formattedData = {};
        Object.keys(new Row()).forEach((key) => {
          formattedData[key] = [];
        });
        formattedData.sleep = [];
        let averages = {};
        data
          .filter((item) => item.date === date)
          .filter((item) => {
            const split = item.date.split("-");
            const year = split[0];
            const month = split[1];
            const day = split[2];
            const itemDate = DateTime.fromObject({ year, month, day });
            // itemDate > today - 7 days
            return itemDate > DateTime.local().minus({ days: 7 });
          })
          .map((item) => ({ ...item, timestamp: new Date(item.date) }))
          .sort((a, b) => a.timestamp - b.timestamp)
          .forEach((row) => {
            const rowDate = row.date;
            const x = isDayView ? "12:00" : row.date;
            
            row.energy.forEach((energy) => {
              const energyLevel = Object.values(energy)[0];
              averages[rowDate] = {
                sum: (averages[rowDate]?.sum || 0) + Number(energyLevel),
                count: (averages[rowDate]?.count || 0) + 1,
              };
            });
            
            if (isDayView) {
              formattedData.energy.push(...extractValueBasedData(row.energy, rowDate, true));
            }
            formattedData.coffee.push(...extractTimeBasedData(row.coffee, rowDate, isDayView));
            formattedData.eating.push(...extractTimeBasedData(row.eating, rowDate, isDayView));
            formattedData.sugar.push(...extractTimeBasedData(row.sugar, rowDate, isDayView));
            formattedData.shower.push(...extractTimeBasedData(row.shower, rowDate, isDayView));
            formattedData.water.push(...extractTimeBasedData(row.water, rowDate, isDayView));
            
            
            const year = rowDate.split("-")[0];
            const month = rowDate.split("-")[1];
            const day = rowDate.split("-")[2];
            const nextDayDate = DateTime.fromObject({ year, month, day }).plus({ days: 1 }).toFormat("yyyy-MM-dd");
            const nextDayData = data.find((item) => {
              return item.date === nextDayDate;
            });
            formattedData.sleep.push(...extractSleepHoursData(row, nextDayData, isDayView));
            
            formattedData.creative.push({ y: row.creative, x });
            formattedData.social.push({ y: row.social, x });
            formattedData.youtube.push({ y: row.youtube, x });
            formattedData.productivity.push({ y: row.productivity, x });
            
            const napOverTime = DateTime.fromObject({ hour: 15, minute: 0 })
              .plus({ minutes: row.nap })
              .toFormat("HH:mm");
            row.wokeUpMidNight && formattedData.wokeUpMidNight.push({ y: "4:00", x });
            row.snooze && formattedData.snooze.push({ y: "7:00", x });
            row.nap && formattedData.nap.push({ y: ["15:00", napOverTime], x });
          });
        
        if (!isDayView) {
          Object.entries(averages).forEach(([date, item]) => {
            const average = item.sum / item.count;
            formattedData.energy.push({ x: date, y: average });
          });
        }
        
        const AwakeHours = Array.from({ length: 18 }).map((_, i) => {
          const value = i + 6;
          const hour = value < 10 ? `0${value}` : value;
          return `${hour}:00`;
        });
        
        const labels = Array.from({ length: 7 })
          .map((_, i) => {
            const today = new Date().getTime();
            const day = new Date(today - i * DAY_IN_MS);
            return getLocaleDate(day);
          })
          .reverse();
        
        setData({
          labels: isDayView ? AwakeHours : labels,
          dayLabels: labels.map((item) => DateTime.fromObject({
            year: item.split("-")[0],
            month: item.split("-")[1],
            day: item.split("-")[2],
          }).toFormat("cccc")),
          datasets: [
            {
              type: "line",
              label: "Energy levels",
              data: formattedData.energy,
              tension: 0,
              fill: false,
              borderWidth: 3,
              yAxisID: "y",
              borderColor: "rgb(235,205,53)",
              backgroundColor: "rgba(235,220,53,0.5)",
            },
            {
              type: "bar",
              label: "Coffee",
              stacked: true,
              stack: true,
              data: formattedData.coffee,
              borderWidth: 3,
              yAxisID: "y",
              borderColor: "rgb(225,203,189)",
              backgroundColor: "rgba(110,81,53,0.5)",
              hidden: false,
            },
            {
              type: "bar",
              label: "Sugar",
              stacked: true,
              stack: true,
              data: formattedData.sugar,
              borderWidth: 3,
              yAxisID: "y",
              borderColor: "white",
              backgroundColor: "white",
              hidden: false,
            },
            {
              type: "bar",
              label: "Shower",
              stack: true,
              data: formattedData.shower,
              borderWidth: 3,
              stacked: true,
              yAxisID: "y",
              borderColor: "rgb(182,255,254)",
              backgroundColor: "rgb(182,255,254)",
              hidden: false,
            },
            {
              type: "bar",
              label: "Eating",
              stack: true,
              stacked: true,
              data: formattedData.eating,
              borderWidth: 3,
              yAxisID: "y",
              borderColor: "purple",
              backgroundColor: "purple",
              hidden: false,
            },
            {
              type: "bar",
              label: "Sleep",
              data: formattedData.sleep,
              borderWidth: 3,
              yAxisID: "y",
              indexAxis: isDayView ? 'y' : 'x',
              borderColor: "rgb(66,161,143)",
              backgroundColor: "rgb(79,180,161)",
              hidden: false
            },
            {
              type: "bar",
              stack: true,
              label: "Productivity",
              data: formattedData.productivity,
              borderWidth: 3,
              yAxisID: "y2",
              borderColor: "rgb(235,53,53)",
              backgroundColor: "rgba(122,40,40,0.5)",
              hidden: true,
            },
            {
              type: "bar",
              stack: true,
              label: "Creativity",
              data: formattedData.creative,
              borderWidth: 3,
              yAxisID: "y2",
              borderColor: "rgb(196,53,235)",
              backgroundColor: "rgba(183,53,235,0.5)",
              hidden: true,
            },
            {
              type: "bar",
              stack: true,
              label: "Social",
              data: formattedData.social,
              borderWidth: 3,
              yAxisID: "y2",
              borderColor: "rgb(53, 162, 235)",
              backgroundColor: "rgba(53, 162, 235, 0.5)",
              hidden: true,
            },
            {
              type: "scatter",
              label: "Woke mid night",
              data: formattedData.wokeUpMidNight,
              borderColor: "blue",
              yAxisID: "y1",
              stepped: true,
              hidden: true,
            },
            {
              type: "scatter",
              label: "Snooze",
              yAxisID: "y1",
              data: formattedData.snooze,
              borderColor: "yellow",
              stepped: true,
              hidden: true,
            },
            {
              type: "bar",
              label: "Nap",
              data: formattedData.nap,
              borderWidth: 3,
              yAxisID: "y1",
              borderColor: "green",
              backgroundColor: "green",
              hidden: true,
            },
            {
              type: "bar",
              stack: true,
              label: "YouTube",
              data: formattedData.youtube,
              borderWidth: 3,
              yAxisID: "y2",
              borderColor: "red",
              backgroundColor: "red",
              hidden: true,
            },
          ],
        });
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [date, isDayView]);
  
  useEffect(() => {
    fetchTrackingData();
  }, [date, fetchTrackingData, isDayView]);
  
  return {
    data: {
      error,
      isLoading,
      date,
      ...data,
    },
    refetch: fetchTrackingData
  };
};
