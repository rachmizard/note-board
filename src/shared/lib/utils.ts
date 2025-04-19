import { clsx, type ClassValue } from "clsx";
import { intervalToDuration } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
/**
 * Formats a total number of seconds into a human-readable string (e.g., "10 hr 38 min")
 * @param totalSeconds - The total number of seconds to format
 * @returns A formatted string representing the duration
 */
export function formatTimeFromSeconds(totalSeconds: number): string {
  // Convert seconds to duration object
  const duration = intervalToDuration({
    start: 0,
    end: totalSeconds * 1000, // intervalToDuration expects milliseconds
  });

  const parts: string[] = [];

  const days = duration?.days ?? 0;
  const hours = duration?.hours ?? 0;
  const minutes = duration?.minutes ?? 0;
  const seconds = duration?.seconds ?? 0;

  if (days > 0) {
    parts.push(`${days} day${days !== 1 ? "s" : ""}`);
  }

  if (hours > 0) {
    parts.push(`${hours} hr`);
  }

  if (minutes > 0) {
    parts.push(`${minutes} min`);
  }

  // Only show seconds if all larger units are zero, or if you want to always show seconds
  if ((days === 0 && hours === 0 && minutes === 0) || seconds > 0) {
    parts.push(`${seconds} sec`);
  }

  return parts.join(" ");
}
