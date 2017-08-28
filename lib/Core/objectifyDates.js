import uniq from 'lodash.uniq';

function getOneYear(year, dates){
  // al data from a given year
  return dates.filter(d => d.getUTCFullYear() === year);
}

function getOneMonth(yearData, monthIndex){
  // all data from certain month of that year
  return yearData.filter(y => y.getUTCMonth() === monthIndex);
}

function getOneDay(monthData, dayIndex){
  return monthData.filter(m => m.getUTCDate() === dayIndex);
}

function getMonthForYear(yearData){
  // get available months for a given year
  return uniq(yearData.map(d => d.getUTCMonth()));
}

function getDaysForMonth(monthData){
  // get all available days given a month in a year
  // start from 1, so we need to change to 0 based
  return uniq(monthData.map(m => m.getUTCDate()));
}

/**
 * Process an array of dates into layered objects of years, months and days.
 * @param  {Date[]} An array of dates.
 * @return {Object} Returns an object whose keys are years, whose values are objects whose keys are months (0=Jan),
 *   whose values are objects whose keys are days, whose values are arrays of all the datetimes on that day.
 */
export default function objectifyDates(dates){
  const years = uniq(dates.map(d => d.getUTCFullYear()));
  const result = {};

  years.forEach(y => {
    const yearData = getOneYear(y, dates);
    const monthInYear = {};
    getMonthForYear(yearData).forEach(monthIndex => {
      const monthData = getOneMonth(yearData, monthIndex);
      const daysInMonth = {};

      getDaysForMonth(monthData).forEach(dayIndex => {
        daysInMonth[dayIndex] = getOneDay(monthData, dayIndex);
      });
      monthInYear[monthIndex] = daysInMonth;
    });
    result[y] = monthInYear;
  });
  return result;
}