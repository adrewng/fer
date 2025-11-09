export const formatMinute = (s) => {
  const tmp = Number(s);
  if (!isFinite(tmp)) return "";
  const m = Math.floor(tmp / 60);
  return `${m.toLocaleString("en-US")} minutes`;
};
