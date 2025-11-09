export const formatMinute = (s) => {
  const tmp = Number(s);
  if (!isFinite(s)) return "";
  const miniutes = Math.floor(tmp / 60);
  return `${miniutes.toLocaleString("en-US")} minutes`;
};
