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