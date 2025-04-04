import Link from "next/link";
import { ReactNode } from "react";

export default function PomodoroLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-zinc-950 text-white min-h-screen overflow-hidden">
      <nav className="bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link
                href="/"
                className="text-lg font-semibold text-white flex items-center gap-2 transition-transform hover:scale-105"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-rose-500"
                >
                  <line
                    x1="10"
                    x2="14"
                    y1="2"
                    y2="2"
                  />
                  <line
                    x1="12"
                    x2="15"
                    y1="14"
                    y2="11"
                  />
                  <circle
                    cx="12"
                    cy="14"
                    r="8"
                  />
                </svg>
                <span className="relative">
                  Note Board
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-rose-500 transition-all group-hover:w-full"></span>
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-6">
              <Link
                href="/pomodoro"
                className="font-medium text-rose-400 hover:text-rose-300 text-sm relative group"
              >
                Pomodoro
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-rose-500/50"></span>
              </Link>
              <Link
                href="/"
                className="font-medium text-zinc-400 hover:text-zinc-300 text-sm relative group"
              >
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-zinc-500 transition-all group-hover:w-full"></span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}
