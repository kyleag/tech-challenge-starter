/**
 * Determines the first day of the month of the current date, or a provided date
 * @param date optiona date to get the result from. defaults to current date
 * @returns {Date} first day of the month of the provided date
 */
export const getFirstDayOfMonth = (date: Date = new Date()): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

/**
 * Determines the last day of the month of the current date, or a provided date
 * @param date optiona date to get the result from. defaults to current date
 * @returns {Date} last day of the month of the provided date
 */
export const getLastDayOfMonth = (date: Date = new Date()): Date => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};
