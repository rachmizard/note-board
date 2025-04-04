import confetti from "canvas-confetti";
import { useCallback, useEffect, useRef } from "react";

/**
 * Hook for providing haptic feedback
 */
export function useHapticFeedback() {
  const trigger = useCallback((duration = 40) => {
    if (navigator && "vibrate" in navigator) {
      navigator.vibrate(duration);
    }
  }, []);

  return { trigger };
}

/**
 * Hook for providing confetti animations
 */
export function useConfetti() {
  // Standard confetti burst
  const trigger = useCallback((options = {}) => {
    const defaultOptions = {
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#ff5757", "#ffbd59", "#4daf7c", "#5271ff"],
      zIndex: 1000
    };

    confetti({
      ...defaultOptions,
      ...options
    });
  }, []);

  // More celebratory burst for significant achievements
  const celebration = useCallback(() => {
    // First burst
    trigger();

    // Second burst with delay
    setTimeout(() => {
      confetti({
        particleCount: 200,
        spread: 120,
        origin: { y: 0.7 },
        colors: ["#ff5757", "#ffbd59", "#4daf7c", "#5271ff"],
        zIndex: 1000
      });
    }, 300);

    // Third burst with longer delay
    setTimeout(() => {
      confetti({
        particleCount: 150,
        angle: 60,
        spread: 80,
        origin: { x: 0, y: 0.8 },
        colors: ["#ff5757", "#ffbd59", "#4daf7c", "#5271ff"],
        zIndex: 1000
      });
    }, 600);

    // Fourth burst from other side
    setTimeout(() => {
      confetti({
        particleCount: 150,
        angle: 120,
        spread: 80,
        origin: { x: 1, y: 0.8 },
        colors: ["#ff5757", "#ffbd59", "#4daf7c", "#5271ff"],
        zIndex: 1000
      });
    }, 900);
  }, [trigger]);

  return { trigger, celebration };
}

/**
 * Hook for audio feedback
 */
export function useSoundEffects() {
  const audioContext = useRef<AudioContext | null>(null);

  // Initialize AudioContext on first user interaction
  useEffect(() => {
    const handleInitialize = () => {
      if (!audioContext.current) {
        audioContext.current = new AudioContext();
      }

      // Remove listeners after initialization
      window.removeEventListener("click", handleInitialize);
      window.removeEventListener("touchstart", handleInitialize);
    };

    window.addEventListener("click", handleInitialize);
    window.addEventListener("touchstart", handleInitialize);

    return () => {
      window.removeEventListener("click", handleInitialize);
      window.removeEventListener("touchstart", handleInitialize);
    };
  }, []);

  // Button click sound
  const playClickSound = useCallback(() => {
    if (!audioContext.current) return;

    const oscillator = audioContext.current.createOscillator();
    const gainNode = audioContext.current.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(1800, audioContext.current.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.current.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.2, audioContext.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.current.currentTime + 0.1);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.current.destination);

    oscillator.start();
    oscillator.stop(audioContext.current.currentTime + 0.1);
  }, []);

  // Session complete sound
  const playCompleteSound = useCallback(() => {
    if (!audioContext.current) return;

    const oscillator = audioContext.current.createOscillator();
    const gainNode = audioContext.current.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(600, audioContext.current.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      1200,
      audioContext.current.currentTime + 0.05
    );
    oscillator.frequency.exponentialRampToValueAtTime(900, audioContext.current.currentTime + 0.15);

    gainNode.gain.setValueAtTime(0, audioContext.current.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.current.currentTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.current.currentTime + 0.3);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.current.destination);

    oscillator.start();
    oscillator.stop(audioContext.current.currentTime + 0.3);

    // Add a second tone after a short delay
    setTimeout(() => {
      if (!audioContext.current) return;

      const oscillator2 = audioContext.current.createOscillator();
      const gainNode2 = audioContext.current.createGain();

      oscillator2.type = "sine";
      oscillator2.frequency.setValueAtTime(1200, audioContext.current.currentTime);
      oscillator2.frequency.exponentialRampToValueAtTime(
        1800,
        audioContext.current.currentTime + 0.1
      );

      gainNode2.gain.setValueAtTime(0, audioContext.current.currentTime);
      gainNode2.gain.linearRampToValueAtTime(0.3, audioContext.current.currentTime + 0.02);
      gainNode2.gain.exponentialRampToValueAtTime(0.001, audioContext.current.currentTime + 0.3);

      oscillator2.connect(gainNode2);
      gainNode2.connect(audioContext.current.destination);

      oscillator2.start();
      oscillator2.stop(audioContext.current.currentTime + 0.3);
    }, 150);
  }, []);

  return { playClickSound, playCompleteSound };
}
