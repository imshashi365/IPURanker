"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Image from "next/image"

export function DarkModeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted to prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Return a placeholder with the same dimensions to prevent layout shift
    return (
      <div className="w-12 h-12 rounded-full bg-muted/50 animate-pulse" />
    )
  }

  const isDark = resolvedTheme === "dark"

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark")
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={cn(
        "relative w-12 h-12 rounded-full border-2 transition-all duration-300 ease-in-out",
        "hover:scale-105 active:scale-95",
        isDark
          ? "bg-slate-900 border-slate-700 hover:bg-slate-800"
          : "bg-amber-50 border-amber-200 hover:bg-amber-100"
      )}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <div className="relative w-6 h-6 transition-transform duration-300 ease-in-out">
        {/* Sun Icon */}
        <div
          className={cn(
            "absolute inset-0 transition-all duration-300 ease-in-out",
            isDark 
              ? "opacity-0 scale-0 rotate-90" 
              : "opacity-100 scale-100 rotate-0"
          )}
        >
          <Image
            src="/assets/day-mode.png"
            alt="Light mode"
            width={24}
            height={24}
            className="w-full h-full"
          />
        </div>
        
        {/* Moon Icon */}
        <div
          className={cn(
            "absolute inset-0 transition-all duration-300 ease-in-out",
            isDark 
              ? "opacity-100 scale-100 rotate-0" 
              : "opacity-0 scale-0 -rotate-90"
          )}
        >
          <Image
            src="/assets/night-mode-svgrepo-com.svg"
            alt="Dark mode"
            width={24}
            height={24}
            className="w-full h-full"
          />
        </div>
      </div>
      
      {/* Glow effect */}
      <div
        className={cn(
          "absolute inset-0 rounded-full transition-all duration-300 ease-in-out pointer-events-none",
          isDark
            ? "shadow-[0_0_20px_rgba(59,130,246,0.3)]"
            : "shadow-[0_0_20px_rgba(251,191,36,0.3)]"
        )}
      />
    </Button>
  )
}
