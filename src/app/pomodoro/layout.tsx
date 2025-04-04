import { ReactNode } from "react";

export default function PomodoroLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen w-full p-4 md:p-8">{children}</div>;
}
