"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type PomodoroState = {
  isActive: boolean;
  time: number;
  mode: "work" | "shortBreak" | "longBreak";
  cycles: number;
  totalPomodoros: number;
};

type PomodoroContextType = {
  state: PomodoroState;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  skipToNext: () => void;
};

const DEFAULT_TIMES = {
  work: 25 * 60, // 25 minutes in seconds
  shortBreak: 5 * 60, // 5 minutes in seconds
  longBreak: 15 * 60 // 15 minutes in seconds
};

const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined);

export function PomodoroProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PomodoroState>({
    isActive: false,
    time: DEFAULT_TIMES.work,
    mode: "work",
    cycles: 0,
    totalPomodoros: 0
  });

  useEffect(() => {
    let interval: ReturnType<typeof setTimeout> | null = null;

    if (state.isActive && state.time > 0) {
      interval = setInterval(() => {
        setState((prevState: PomodoroState) => ({
          ...prevState,
          time: prevState.time - 1
        }));
      }, 1000);
    } else if (state.isActive && state.time === 0) {
      handleCycleComplete();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.isActive, state.time]);

  const handleCycleComplete = () => {
    let newMode: "work" | "shortBreak" | "longBreak";
    let newCycles = state.cycles;
    let newTotalPomodoros = state.totalPomodoros;

    if (state.mode === "work") {
      newTotalPomodoros += 1;
      newCycles = (state.cycles + 1) % 4;
      newMode = newCycles === 0 ? "longBreak" : "shortBreak";
    } else {
      newMode = "work";
    }

    setState({
      isActive: true,
      time: DEFAULT_TIMES[newMode],
      mode: newMode,
      cycles: newCycles,
      totalPomodoros: newTotalPomodoros
    });

    // Play notification sound (in a real app)
    // new Audio('/notification.mp3').play().catch(e => console.error('Failed to play sound', e));
  };

  const startTimer = () => {
    setState((prevState: PomodoroState) => ({
      ...prevState,
      isActive: true
    }));
  };

  const pauseTimer = () => {
    setState((prevState: PomodoroState) => ({
      ...prevState,
      isActive: false
    }));
  };

  const resetTimer = () => {
    setState((prevState: PomodoroState) => ({
      ...prevState,
      isActive: false,
      time: DEFAULT_TIMES[prevState.mode]
    }));
  };

  const skipToNext = () => {
    pauseTimer();
    handleCycleComplete();
  };

  return (
    <PomodoroContext.Provider
      value={{
        state,
        startTimer,
        pauseTimer,
        resetTimer,
        skipToNext
      }}
    >
      {children}
    </PomodoroContext.Provider>
  );
}

export function usePomodoroContext() {
  const context = useContext(PomodoroContext);
  if (context === undefined) {
    throw new Error("usePomodoroContext must be used within a PomodoroProvider");
  }
  return context;
}
