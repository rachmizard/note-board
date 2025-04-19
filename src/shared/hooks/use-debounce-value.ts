import { useState, useEffect, useRef } from "react";

/**
 * A custom hook that returns a debounced version of the provided value.
 * The debounced value will only update after the specified delay has passed
 * without any new changes to the input value.
 *
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds (default: 500ms)
 * @returns The debounced value
 *
 * @example
 * // Basic usage
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounceValue(searchTerm, 300);
 *
 * // Use debouncedSearchTerm for API calls
 * useEffect(() => {
 *   if (debouncedSearchTerm) {
 *     fetchSearchResults(debouncedSearchTerm);
 *   }
 * }, [debouncedSearchTerm]);
 */
export function useDebounceValue<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const previousValueRef = useRef<T>(value);

  useEffect(() => {
    // Skip the debounce delay on first render or when delay changes
    if (delay < 0) {
      setDebouncedValue(value);
      return;
    }

    // Only set up the timer if the value has changed
    if (value !== previousValueRef.current) {
      previousValueRef.current = value;

      const timer = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // Clean up timer if value changes before delay completes
      // or if component unmounts
      return () => {
        clearTimeout(timer);
      };
    }
  }, [value, delay]);

  return debouncedValue;
}
