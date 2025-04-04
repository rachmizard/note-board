import { PomodoroProvider } from "@/components/pomodoro/PomodoroContext";
import { PomodoroTimer } from "@/components/pomodoro/PomodoroTimer";

export default function PomodoroPage() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-10 text-center tracking-tight flex items-center justify-center gap-2">
        <span className="text-white">Focus</span>
        <span className="text-rose-500">Timer</span>
      </h1>
      <div className="relative w-full max-w-3xl mx-auto">
        {/* Decorative elements */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>

        <PomodoroProvider>
          <PomodoroTimer />
        </PomodoroProvider>
      </div>
    </div>
  );
}
