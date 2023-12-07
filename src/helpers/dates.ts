function getAmountOfDaysInMonth(date:Date): number {
  const year = date.getFullYear();
  const month = date.getMonth();
  return new Date(year, month + 1, 0).getDate();
}
function setDateToLastDayOfMonth(date:Date): string {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = getAmountOfDaysInMonth(date);
  return new Date(year, month, day).toISOString();
}
export {setDateToLastDayOfMonth, getAmountOfDaysInMonth};