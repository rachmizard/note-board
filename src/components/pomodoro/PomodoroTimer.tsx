"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { usePomodoroContext } from "./PomodoroContext";

export function PomodoroTimer() {
  const { state, startTimer, pauseTimer, resetTimer, skipToNext } = usePomodoroContext();
  const [progress, setProgress] = useState(0);
  const [animate, setAnimate] = useState(false);

  // Calculate progress percentage for the current session
  useEffect(() => {
    const calculateProgress = () => {
      const totalTime =
        state.mode === "work" ? 25 * 60 : state.mode === "shortBreak" ? 5 * 60 : 15 * 60;

      const elapsed = totalTime - state.time;
      return (elapsed / totalTime) * 100;
    };

    setProgress(calculateProgress());
  }, [state.time, state.mode]);

  // Add animation effect when timer is active
  useEffect(() => {
    if (state.isActive) {
      setAnimate(true);
    } else {
      setAnimate(false);
    }
  }, [state.isActive]);

  // Format time in minutes and seconds
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Generate circle stroke dash array for progress indicator
  const getCircleStyle = () => {
    const circumference = 2 * Math.PI * 120; // Increased radius from 85 to 120
    const dashArray = circumference;
    const dashOffset = circumference - (progress / 100) * circumference;

    return {
      strokeDasharray: `${dashArray}`,
      strokeDashoffset: `${dashOffset}`
    };
  };

  // Get mode color
  const getModeColor = () => {
    switch (state.mode) {
      case "work":
        return "rose";
      case "shortBreak":
        return "emerald";
      case "longBreak":
        return "blue";
      default:
        return "rose";
    }
  };

  const modeColor = getModeColor();

  // Generate pomodoro session indicators (dots)
  const renderSessionDots = () => {
    const dots = [];
    const totalDots = 8;

    for (let i = 0; i < totalDots; i++) {
      const isActive = i < state.totalPomodoros % totalDots;
      const isCurrentPosition = i === state.totalPomodoros % totalDots && state.mode === "work";

      // Determine animation class for active dots when timer is running
      let animationClass = "";
      if (state.isActive) {
        if (isCurrentPosition) {
          animationClass = "animate-pomodoro-blink";
        } else if (isActive) {
          // Use staggered animations for completed dots
          animationClass = `animate-pomodoro-blink-${i}`;
        }
      }

      dots.push(
        <div
          key={i}
          className={cn(
            "transition-all duration-500",
            isCurrentPosition
              ? "w-4 h-4 bg-rose-500 rounded-full scale-125 shadow-lg shadow-rose-900/20"
              : isActive
              ? "w-3 h-3 bg-rose-500 rounded-full"
              : "w-3 h-3 rounded-full",
            animationClass,
            i === 0 && !isActive && "bg-zinc-500",
            i > 0 && i <= 2 && !isActive && "bg-zinc-600",
            i > 2 && i <= 5 && !isActive && "bg-zinc-700",
            i > 5 && !isActive && "bg-zinc-800"
          )}
        />
      );
    }

    return dots;
  };

  return (
    <div className="bg-zinc-900 text-white p-8 rounded-2xl shadow-xl max-w-md mx-auto border border-zinc-800 backdrop-blur-sm">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold tracking-tight text-white flex items-center gap-1.5">
          <span className="text-rose-500">●</span>
          <span>Focus Timer</span>
        </h2>
        <div
          className={cn(
            "px-3 py-1 rounded-full text-sm font-medium",
            state.mode === "work"
              ? "bg-rose-500/20 text-rose-300"
              : state.mode === "shortBreak"
              ? "bg-rose-500/20 text-rose-300"
              : "bg-rose-500/20 text-rose-300"
          )}
        >
          {state.mode === "work"
            ? "Focus"
            : state.mode === "shortBreak"
            ? "Short Break"
            : "Long Break"}
        </div>
      </div>

      {/* Timer Circle */}
      <div className="relative flex justify-center my-4">
        <svg
          className="w-72 h-72 transform -rotate-90"
          viewBox="0 0 300 300"
        >
          {/* Outer Decorative Circle */}
          <circle
            cx="150"
            cy="150"
            r="140"
            className="fill-none stroke-zinc-800"
            strokeWidth="1"
            strokeDasharray="4 4"
          />

          {/* Main Background Circle */}
          <circle
            cx="150"
            cy="150"
            r="120"
            className="fill-none stroke-zinc-800"
            strokeWidth="8"
          />

          {/* Progress Circle */}
          <circle
            cx="150"
            cy="150"
            r="120"
            className={cn("fill-none", `stroke-rose-500`)}
            strokeWidth="8"
            strokeLinecap="round"
            style={getCircleStyle()}
          />

          {/* Top Marker for Current Progress */}
          {state.isActive && (
            <rect
              x="148"
              y="10"
              width="4"
              height="12"
              rx="2"
              className="fill-rose-500"
            />
          )}
        </svg>

        {/* Time Display Centered in Circle with Pulse Animation */}
        <div
          className={cn(
            "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center",
            animate && "animate-pulse"
          )}
        >
          <div className="text-6xl font-bold tracking-tight">{formatTime(state.time)}</div>
          <div className="text-sm text-gray-400 mt-2">
            {state.mode === "work"
              ? `Cycle ${state.cycles + 1}/4`
              : state.mode === "shortBreak"
              ? "Short Break"
              : "Long Break"}
          </div>
        </div>
      </div>

      {/* Session Indicators with Blinking Dots */}
      <div className="flex justify-center gap-3 mt-8 mb-6">{renderSessionDots()}</div>

      {/* Controls */}
      <div className="mt-8 pt-6 border-t border-zinc-800 grid grid-cols-3 gap-4">
        <button
          onClick={state.isActive ? pauseTimer : startTimer}
          className={cn(
            "col-span-1 flex justify-center items-center rounded-full font-medium py-3 transition-all duration-300",
            state.isActive
              ? "bg-zinc-800 text-white hover:bg-zinc-700"
              : "bg-rose-500 text-white hover:bg-rose-600"
          )}
        >
          {state.isActive ? "Pause" : "Start"}
        </button>

        <button
          onClick={resetTimer}
          className="col-span-1 bg-zinc-800 text-white rounded-full font-medium py-3 hover:bg-zinc-700 transition-all duration-300"
        >
          Reset
        </button>

        <button
          onClick={skipToNext}
          className="col-span-1 bg-zinc-800 text-white rounded-full font-medium py-3 hover:bg-zinc-700 transition-all duration-300"
        >
          Skip
        </button>
      </div>

      {/* Completed count */}
      <div className="mt-6 text-center text-zinc-500 text-sm">
        {state.totalPomodoros} pomodoros completed
      </div>
    </div>
  );
}
