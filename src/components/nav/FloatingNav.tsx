"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function FloatingNav() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Handle client-side animations after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const navItems = [
    {
      name: "Home",
      path: "/",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
        >
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      )
    },
    {
      name: "Pomodoro",
      path: "/pomodoro",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
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
      )
    },
    {
      name: "Tasks",
      path: "/tasks",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
        >
          <rect
            x="3"
            y="4"
            width="18"
            height="18"
            rx="2"
            ry="2"
          />
          <line
            x1="16"
            x2="16"
            y1="2"
            y2="6"
          />
          <line
            x1="8"
            x2="8"
            y1="2"
            y2="6"
          />
          <line
            x1="3"
            x2="21"
            y1="10"
            y2="10"
          />
          <path d="m9 16 2 2 4-4" />
        </svg>
      )
    }
  ];

  // Client-side only styles
  const clientSideStyles = isMounted
    ? {
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.05) inset"
      }
    : {};

  return (
    <div
      className={cn(
        "fixed left-4 top-1/2 -translate-y-1/2 flex flex-col items-center p-3 bg-zinc-900/90 backdrop-blur-xl rounded-2xl border border-zinc-800/60 shadow-xl z-50 transition-all duration-300 ease-in-out",
        isExpanded ? "w-48" : "w-16",
        // Only apply animations after mount to prevent hydration mismatch
        isMounted ? "opacity-100" : "opacity-0"
      )}
      style={clientSideStyles}
    >
      {isMounted && (
        <div
          className={cn(
            "absolute -right-1 top-4 w-3 h-10 bg-rose-500/20 rounded-l-full transition-all duration-300",
            isExpanded ? "opacity-100" : "opacity-0"
          )}
        />
      )}

      <button
        onClick={toggleExpand}
        className="relative p-3 mb-3 bg-zinc-800/80 rounded-xl text-zinc-300 hover:text-white hover:bg-rose-500/30 transition-all duration-300 hover:shadow-md hover:shadow-rose-500/10 group"
        aria-label={isExpanded ? "Collapse menu" : "Expand menu"}
      >
        {!isExpanded && isMounted && (
          <span
            className="absolute left-full ml-2 px-2 py-1 rounded-md bg-zinc-800/90 backdrop-blur-sm text-xs font-medium text-zinc-200 opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity duration-200 z-[60] shadow-lg border border-zinc-700/50"
            style={{ animation: "tooltipFadeIn 0.2s ease forwards" }}
          >
            {isExpanded ? "Collapse" : "Expand"} menu
          </span>
        )}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(
            "w-5 h-5 transition-all duration-300 group-hover:scale-110",
            isExpanded ? "rotate-180" : ""
          )}
        >
          {isExpanded ? <path d="M13 17l-5-5 5-5" /> : <path d="M9 17l5-5-5-5" />}
        </svg>
      </button>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent my-2"></div>

      <div className="w-full space-y-2 py-1">
        {navItems.map((item, index) => {
          // Generate className without animations initially
          const linkClassName = cn(
            "w-full flex items-center gap-3 py-3 px-3 rounded-xl transition-all duration-300 relative group",
            pathname === item.path
              ? "bg-gradient-to-r from-rose-500/20 to-rose-500/5 text-rose-300 shadow-sm"
              : "text-zinc-400 hover:bg-zinc-800/70 hover:text-zinc-200",
            !isExpanded && "justify-center",
            isMounted && "hover:scale-105"
          );

          return (
            <Link
              key={item.path}
              href={item.path}
              className={linkClassName}
              aria-label={item.name}
              // Only add client-side animations after component is mounted
              {...(isMounted && {
                style: {
                  animation: `fadeIn 0.5s ease forwards ${index * 100}ms`
                }
              })}
            >
              <span className="relative flex items-center justify-center">
                {item.icon}
                {pathname === item.path && isMounted && (
                  <span className="absolute -right-1 -top-1 w-2 h-2 rounded-full bg-rose-500 shadow-md shadow-rose-500/30 animate-pulse"></span>
                )}
              </span>

              {isExpanded ? (
                <span
                  className={cn(
                    "whitespace-nowrap font-medium transition-all duration-300",
                    pathname === item.path ? "text-rose-300" : "text-zinc-300"
                  )}
                >
                  {item.name}
                </span>
              ) : (
                isMounted && (
                  <span
                    className="absolute left-full ml-2 px-2 py-1 rounded-md bg-zinc-800/90 backdrop-blur-sm text-xs font-medium text-zinc-200 opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity duration-200 z-[60] shadow-lg border border-zinc-700/50"
                    style={{ animation: "tooltipFadeIn 0.2s ease forwards" }}
                  >
                    {item.name}
                  </span>
                )
              )}
            </Link>
          );
        })}
      </div>

      {isExpanded && isMounted && (
        <div className="w-full px-3 mt-4 mb-1">
          <div className="text-xs text-zinc-500 uppercase tracking-wider font-medium">
            NoteBoard
          </div>
        </div>
      )}
    </div>
  );
}

// Add this to your globals.css if not already there
// @keyframes fadeIn {
//   from { opacity: 0; transform: translateY(10px); }
//   to { opacity: 1; transform: translateY(0); }
// }
