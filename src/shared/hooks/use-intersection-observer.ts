import * as React from "react";

/**
 * Options for the Intersection Observer API
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
 */
export interface UseIntersectionObserverOptions
  extends IntersectionObserverInit {
  /**
   * Whether to freeze the hook when the element is not intersecting
   * @default false
   */
  freezeOnceVisible?: boolean;

  /**
   * Whether to skip creating the observer
   * @default false
   */
  skip?: boolean;

  /**
   * Callback function to be called when the element is intersecting
   */
  onIntersect?: (entry: IntersectionObserverEntry) => void;
}

/**
 * A custom hook that uses the Intersection Observer API to observe when an element enters or exits the viewport.
 *
 * @param elementRef - A React ref object for the element to observe
 * @param options - Configuration options for the Intersection Observer
 * @returns An object containing the entry state and a boolean indicating if the element is intersecting
 *
 * @example
 * ```tsx
 * // Basic usage
 * const elementRef = useRef<HTMLDivElement>(null);
 * const { isIntersecting } = useIntersectionObserver(elementRef);
 *
 * // With options
 * const { isIntersecting, entry } = useIntersectionObserver(elementRef, {
 *   rootMargin: '100px',
 *   threshold: 0.5,
 *   freezeOnceVisible: true,
 * });
 *
 * // With callback
 * useIntersectionObserver(elementRef, {
 *   onIntersect: (entry) => {
 *     if (entry.isIntersecting) {
 *       console.log('Element is visible');
 *     }
 *   },
 * });
 * ```
 */
export function useIntersectionObserver<T extends Element>(
  elementRef: React.RefObject<T | null>,
  {
    threshold = 0,
    root = null,
    rootMargin = "0px",
    freezeOnceVisible = false,
    skip = false,
    onIntersect,
  }: UseIntersectionObserverOptions = {}
) {
  const [entry, setEntry] = React.useState<IntersectionObserverEntry | null>(
    null
  );

  const frozen = React.useMemo(
    () => entry?.isIntersecting && freezeOnceVisible,
    [entry, freezeOnceVisible]
  );

  const updateEntry = React.useCallback(
    ([entry]: IntersectionObserverEntry[]) => {
      setEntry(entry);
      if (onIntersect && entry.isIntersecting) {
        onIntersect(entry);
      }
    },
    [onIntersect]
  );

  React.useEffect(() => {
    // Don't observe if the element doesn't exist, we're frozen, or we've been told to skip
    const element = elementRef.current;

    if (skip || frozen || !element) {
      return;
    }

    const observerParams = { threshold, root, rootMargin };
    const observer = new IntersectionObserver(updateEntry, observerParams);

    observer.observe(element);

    return () => observer.disconnect();
  }, [elementRef, threshold, root, rootMargin, frozen, updateEntry, skip]);

  return {
    entry,
    isIntersecting: !!entry?.isIntersecting,
  };
}
