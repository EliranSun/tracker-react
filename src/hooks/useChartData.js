import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import Row from "../models/row";
import { nearestFifteen } from "../utils/time";

export const useChartData = ({ date, type }) => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  
  useEffect(() => {
    setIsLoading(true);
    supabase
      .from("tracker")
      .select("*")
      .then(({ data, error }) => {
        if (error || !data) {
          console.log({ error, data });
          setError(error || new Error("No data found"));
          return;
        }
        
        let labels = [];
        const energyData = [];
        const lastCoffee = [];
        const productivityData = [];
        const creativityData = [];
        const socialData = [];
        let totalSleepData = {};
        const dates = [];
        
        data
          .filter(item => {
            if (!date) {
              return true;
            }
            
            return item.date === date;
          })
          .map(item => ({ ...item, timestamp: new Date(item.date) }))
          .sort((a, b) => a.timestamp - b.timestamp)
          .forEach(item => {
            const row = new Row(item);
            
            energyData.push(row.energy);
            labels.push(row.date);
            creativityData.push(row.creative);
            productivityData.push(row.productivity);
            socialData.push(row.social);
            
            const wentToBedHour = Number(row.wentToBed?.split(":")[0]);
            const wentToBedMinute = nearestFifteen(row.wentToBed?.split(":")[1]);
            const wokeUpHour = Number(row.wokeUp?.split(":")[0]);
            const wokeUpMinute = nearestFifteen(row.wokeUp?.split(":")[1]);
            
            const wokeUpDate = new Date(2023, 1, 1, wokeUpHour, wokeUpMinute);
            const wentToBedDate = new Date(2023, 1, 1, wentToBedHour, wentToBedMinute);
            let foo;
            
            if (row.wentToBed && row.wokeUp) {
              if (wokeUpDate.getTime() < wentToBedDate.getTime()) {
                foo = [
                  '0:00',
                  `${wokeUpHour}:${wokeUpMinute}`,
                  `${wentToBedHour}:${wentToBedMinute}`,
                  '23:45'
                ];
              } else {
                foo = [
                  `${wentToBedHour}:${wentToBedMinute}`,
                  `${wokeUpHour}:${wokeUpMinute}`,
                ];
              }
              
              totalSleepData = {
                ...totalSleepData,
                [row.date]: (totalSleepData[row.date] || []).concat(foo)
              }
            }
            
            if (type === 'days') {
              dates.forEach(date => {
                totalSleepData[date] = totalSleepData[date][totalSleepData[date].length - 1]
              })
            }
            
            const hour = row.lastCoffee?.split(":")[0];
            const minute = nearestFifteen(row.lastCoffee?.split(":")[1]);
            lastCoffee.push(hour ? `${hour}:${minute}` : null);
          });
        
        labels = labels
          .map(label => new Date(label).getTime())
          .sort()
          .map(label => new Date(label).toLocaleString('en-GB', {
            day: 'numeric',
            month: 'short',
          }));
        
        setData({
          labels: ['13 Sept'],
          // labels,
          data: {
            energy: energyData,
            coffee: lastCoffee,
            productivity: productivityData,
            creative: creativityData,
            social: socialData,
            sleep: totalSleepData,
          }
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
