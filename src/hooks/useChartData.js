import { useEffect, useState } from "react";
import Row from "../models/row";
import { nearestFifteen } from "../utils/time";
import { getTrackingData } from "../utils/firebase";
import { getLocaleDate, getLocaleTime } from "../utils/date";
import { DateTime } from "luxon";

const extractTimeBasedData = (data = [], date, isDayView = false) => {
  return data
    .map((item) => {
      const value = Object.values(item)[0];
      const hour = value?.split(":")[0];
      const minute = nearestFifteen(value?.split(":")[1]);

      if (hour && minute) {
        const time = `${hour}:${minute}`;
        if (isDayView) {
          return { y: "12:00", x: `${hour}:${minute}` };
        }

        return { y: hour ? `${hour}:${minute}` : null, x: date };
      }

      return null;
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
        let roundedDt;
        if (dt.minute >= 30) {
          roundedDt = dt.plus({ hour: 1 }).startOf("hour");
        } else {
          roundedDt = dt.startOf("hour");
        }

        return { y: value, x: isDayView ? roundedDt.toFormat("HH:mm") : date };
      }

      return null;
    })
    .filter(Boolean);
};

const extractSleepHoursData = (data = [], isDayView = false) => {
  const wentToBedHour = Number(data.wentToBed?.split(":")[0]);
  const wentToBedMinute = nearestFifteen(data.wentToBed?.split(":")[1]);
  const wokeUpHour = Number(data.wokeUp?.split(":")[0]);
  const wokeUpMinute = nearestFifteen(data.wokeUp?.split(":")[1]);

  const thisDaySleep = [];
  const previousDaySleep = [];

  if (data.wentToBed && data.wokeUp) {
    if (Number(wentToBedHour) >= 0 && Number(wentToBedHour) <= 12) {
      thisDaySleep.push(
        `${wentToBedHour}:${wentToBedMinute}`,
        `${wokeUpHour}:${wokeUpMinute}`
      );

      if (isDayView) {
        return [{ x: ['07:15', '08:30'], y: '10:00' }];
      }
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

export const useChartData = ({ date }) => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    setIsLoading(true);
    getTrackingData(date)
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

        data
          .map((item) => ({ ...item, timestamp: new Date(item.date) }))
          .sort((a, b) => a.timestamp - b.timestamp)
          .forEach((row) => {
            const rowDate = row.date;
            const x = date ? "12:00" : row.date;

            formattedData.creative.push({ y: row.creative, x });
            formattedData.social.push({ y: row.social, x });
            formattedData.youtube.push({ y: row.youtube, x });
            formattedData.productivity.push({ y: row.productivity, x });
            formattedData.sleep.push(...extractSleepHoursData(row, Boolean(date)));
            formattedData.coffee.push(...extractTimeBasedData(row.coffee, rowDate, Boolean(date)));
            formattedData.energy.push(...extractValueBasedData(row.energy, x, Boolean(date)));

            const napOverTime = DateTime.fromObject({ hour: 15, minute: 0 })
              .plus({ minutes: row.nap })
              .toFormat("HH:mm");
            row.wokeUpMidNight && formattedData.wokeUpMidNight.push({ y: "4:00", x });
            row.snooze && formattedData.snooze.push({ y: "7:00", x });
            row.nap && formattedData.nap.push({ y: ["15:00", napOverTime], x });
          });

        const labels = Array.from({ length: date ? 12 * 4 : 7 })
          .map((_, i) => {
            const today = new Date().getTime();
            const DAY_IN_MS = 1000 * 60 * 60 * 24;
            const HOUR_IN_MS = 1000 * 60 * 60;
            const FIFTEEN_MINUTES_IN_MS = 1000 * 60 * 15;

            if (date) {
              const roundedMinutes = nearestFifteen(new Date().getMinutes());
              const foo = new Date(today).setMinutes(roundedMinutes);
              const day = foo - (i * FIFTEEN_MINUTES_IN_MS);
              return getLocaleTime(new Date(day));
            }

            const day = new Date(today - i * DAY_IN_MS);
            return getLocaleDate(day);
          })
          .reverse();

        const labels2 = formattedData.energy.map((item) => item.x);
        const isDayView = Boolean(date);

        setData({
          labels,
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
              type: "scatter",
              label: "Coffee",
              data: formattedData.coffee,
              borderWidth: 3,
              yAxisID: "y1",
              borderColor: "rgb(225,203,189)",
              backgroundColor: "rgba(110,81,53,0.5)",
              hidden: true,
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
              label: "Sleep",
              data: formattedData.sleep,
              borderWidth: 3,
              yAxisID: "y1",
              indexAxis: isDayView ? 'y' : 'x',
              borderColor: "rgb(66,161,143)",
              backgroundColor: "rgb(79,180,161)",
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
  }, [date]);

  return {
    error,
    isLoading,
    date,
    ...data,
  };
};
