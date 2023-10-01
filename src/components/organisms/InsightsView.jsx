import { useInsightsData } from "../../hooks/useInsightsData";
import { DateTime } from "luxon";
import { useMemo } from "react";

const getSleepHours = data => {
  const sleepHours = {};
  
  for (const [index, entry] of data.entries()) {
    if (index === 0) continue;
    
    const { wentToBed, date: prevDate } = data[index - 1];
    const { wokeUp, date, energy } = entry;
    const wentToBedHour = parseInt(wentToBed.split(":")[0]);
    const isWentToBedNextDay = wentToBedHour >= 0 && wentToBedHour <= 18;
    
    const prevDay = isWentToBedNextDay ? `${date} ${wentToBed}` : `${prevDate} ${wentToBed}`;
    const currDay = `${date} ${wokeUp}`;
    
    const d1 = DateTime.fromFormat(prevDay, "yyyy-MM-dd H:mm");
    const d2 = DateTime.fromFormat(currDay, "yyyy-MM-dd H:mm");
    
    const dateTimeDiff = d2.diff(d1, "hours");
    let averageEnergy = 0;
    energy.forEach(entry => {
      Object.values(entry).forEach(value => {
        averageEnergy += Number(value);
      })
    })
    
    sleepHours[date] = {
      hours: dateTimeDiff.hours,
      energyAverage: Math.round(averageEnergy / energy.length)
    };
  }
  
  const total = Object.values(sleepHours).reduce((acc, curr) => {
    if (curr.hours) return acc + Math.abs(curr.hours);
    return acc;
  }, 0);
  
  return { average: Math.round(total / Object.values(sleepHours).length), sleepHours };
}

export const InsightsView = () => {
  const { data, trackedDaysCount } = useInsightsData();
  const sleepHours = useMemo(() =>
    getSleepHours(data), [data]);
  
  console.log({ sleepHours });
  
  return (
    <section>
      <h1 className="text-3xl my-4">Insights</h1>
      <p>
        Over the last <b className="text-xl">{trackedDaysCount} days</b>,
        you slept an average of <b className="text-xl">{sleepHours.average} hours </b>
      </p>
      <table cellPadding={4}>
        <thead>
        <tr>
          <th>Date</th>
          <th>Sleep</th>
          <th>Energy</th>
        </tr>
        </thead>
        <tbody>
        {Object.entries(sleepHours.sleepHours).map(([date, { hours, energyAverage }]) => (
          <tr key={date}>
            <td>{date}</td>
            <td>{Math.round(hours)}</td>
            <td>{energyAverage}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </section>
  )
};