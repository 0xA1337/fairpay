import { format, formatDistanceToNow, isAfter, subMonths } from "date-fns";

/**
 * Formats a Unix timestamp as a relative date string.
 *
 * @param unixTimestamp The Unix timestamp to format.
 * @returns The formatted relative date string.
 */
export function formatRelativeDate(unixTimestamp: number): string {
  const date = new Date(unixTimestamp * 1000); // Convert to milliseconds
  const threeMonthsAgo = subMonths(new Date(), 3);

  if (isAfter(date, threeMonthsAgo)) {
    return formatDistanceToNow(date, { addSuffix: true });
  } else {
    return format(date, "MMMM d, yyyy");
  }
}

/**
 * Formats a date as a string that says "Ends in X".
 *
 * @param date The date to format.
 * @returns The formatted string.
 */
export function getEndsInString(date: Date): string {
  return `Ends in ${formatDistanceToNow(date, { addSuffix: false })}`;
}
