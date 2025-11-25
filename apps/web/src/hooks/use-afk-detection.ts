import { useState, useEffect, useCallback } from 'react';

interface UseAfkDetectionOptions {
  /** Time in milliseconds before user is considered AFK (default: 30000 = 30 seconds) */
  timeout?: number;
  /** Events to listen for to detect user activity */
  events?: string[];
}

/**
 * Hook to detect if user is away from keyboard (AFK)
 * @param options - Configuration options
 * @returns isAfk - Boolean indicating if user is AFK
 */
export function useAfkDetection(options: UseAfkDetectionOptions = {}) {
  const {
    timeout = 30000, // 30 seconds default
    events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'],
  } = options;

  const [isAfk, setIsAfk] = useState(false);

  const resetTimer = useCallback(() => {
    setIsAfk(false);
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleActivity = () => {
      // Clear existing timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Set user as active
      setIsAfk(false);

      // Set new timeout
      timeoutId = setTimeout(() => {
        setIsAfk(true);
      }, timeout);
    };

    // Set initial timeout
    timeoutId = setTimeout(() => {
      setIsAfk(true);
    }, timeout);

    // Add event listeners
    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    // Cleanup
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [timeout, events]);

  return { isAfk, resetTimer };
}
