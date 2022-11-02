import moment from "moment";
import "moment/min/locales";
moment.locale("ko");

export const kmoment = moment;

export function createdAtText(createdAt) {
  if (createdAt) {
    const calendar = kmoment(createdAt).calendar();
    const calendarArr = calendar.split(" ");
    if (calendarArr[0] == "오늘") {
      return calendarArr[1] + " " + calendarArr[2];
    }
    if (calendarArr[0] == "어제") {
      return calendarArr[0];
    }
    if (calendarArr[0] == "지난주") {
      return calendarArr[1];
    }
    return calendarArr[0];
  }
  return null;
}

export function getCalendarDay(time) {
  if (!time) return null;
  return kmoment(time).calendar();
}

export function getDate(time, format = "YYYY.MM.DD HH:mm:ss") {
  if (!time) return null;
  return kmoment(time).format(format);
}
