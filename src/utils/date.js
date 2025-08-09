import dayjs from "dayjs";

export function toYMD(date) {
  return dayjs(date).format("YYYY-MM-DD");
}
