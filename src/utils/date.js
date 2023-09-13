export const getIsoDate = () => {
  return new Date().toISOString().slice(0, 10)
};
