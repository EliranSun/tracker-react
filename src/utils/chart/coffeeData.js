import { getHour, roundToNearestQuarterHour } from "../time";

export const getCoffeeData = (data = [], date = '', isTotalView = false) => {
  const isHourView = Boolean(date);
  const coffeeData = [];
  data
    .filter((entry) => {
      if (date) return entry.date === date;
      return true;
    })
    .forEach((entry) => {
      let coffeCount = 0;
      entry.coffee.forEach((coffeeTime) => {
        const coffeeHour = getHour(coffeeTime);
        const rounded = roundToNearestQuarterHour(coffeeTime);
        if (isTotalView) {
          coffeCount++;
        } else {
          coffeeData.push({
            x: isHourView ? [rounded, `${coffeeHour + 1}:00`] : entry.date,
            y: isHourView ? 10 : 1
          });
        }
      });
      
      if (isTotalView) {
        coffeeData.push({
          x: entry.date,
          y: coffeCount
        });
      }
    });
  
  console.log({ coffeeData });
  
  return {
    type: "bar",
    label: "Coffee",
    data: coffeeData,
    yAxisID: "y",
    indexAxis: date ? 'y' : 'x',
    backgroundColor: "rgb(96,71,47)",
    stepped: true,
    hidden: false,
  };
}