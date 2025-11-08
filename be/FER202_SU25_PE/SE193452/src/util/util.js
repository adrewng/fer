export const formatMinute = (seconds) => {
  const n = Number(seconds);
  if (!Number.isFinite(n)) return "";
  const min = Math.floor(n / 60);
  return `${min.toLocaleString("en-US")} minutes`;
};
