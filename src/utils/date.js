export const getIsoDate = () => {
  return new Date().toISOString().slice(0, 10)
};

export const getLocaleDate = (date = new Date()) => {
  return date.toLocaleString("sv-SE", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).replaceAll("/", "-")
};

export const getLocaleTime = (date = new Date()) => {
  return date.toLocaleString("sv-SE", {
    hour: "numeric",
    minute: "numeric",
  });
}