import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

export const formatToDate = (s) => {
  if (!s) return "";
  const d = dayjs(s, "DD/MM/YYYY", true);
  return d.isValid() ? d.format("YYYY-MM-DD") : "";
};
