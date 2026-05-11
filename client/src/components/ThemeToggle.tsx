import { useId } from "react";
import { useTheme } from "@/contexts/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const uid = useId().replace(/:/g, "");

  return (
    <button
      onClick={toggleTheme}
      data-testid="button-theme-toggle"
      className="focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-400"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        position: "relative",
        width: "60px",
        height: "32px",
        borderRadius: "16px",
        border: "none",
        cursor: "pointer",
        padding: 0,
        overflow: "hidden",
        flexShrink: 0,
        /* Light mode: soft sky blue → very light blue */
        /* Dark mode: dark charcoal-gray → deep slate */
        background: isDark
          ? "linear-gradient(150deg, #1e2128 0%, #2c3038 100%)"
          : "linear-gradient(150deg, #8ec8e8 0%, #d0ecff 100%)",
        transition: "background 0.5s ease",
        boxShadow: isDark
          ? "inset 0 1px 3px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04)"
          : "inset 0 1px 2px rgba(0,80,140,0.15), 0 0 0 1px rgba(255,255,255,0.25)",
      }}
    >
      {/* Stars — visible in dark mode, fade out in light */}
      <svg
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: isDark ? 1 : 0,
          transition: "opacity 0.5s ease",
          pointerEvents: "none",
        }}
        viewBox="0 0 60 32"
      >
        <circle cx="9"  cy="7"  r="0.7"  fill="white" opacity="0.75" />
        <circle cx="21" cy="12" r="0.45" fill="white" opacity="0.6"  />
        <circle cx="6"  cy="20" r="0.55" fill="white" opacity="0.7"  />
        <circle cx="26" cy="24" r="0.4"  fill="white" opacity="0.5"  />
        <circle cx="14" cy="27" r="0.5"  fill="white" opacity="0.65" />
        <circle cx="30" cy="10" r="0.35" fill="white" opacity="0.45" />
      </svg>

      {/* Knob */}
      <div
        style={{
          position: "absolute",
          top: "4px",
          width: "24px",
          height: "24px",
          borderRadius: "50%",
          left: isDark ? "32px" : "4px",
          transition: "left 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: isDark
            ? "0 1px 8px rgba(0,0,0,0.65)"
            : "0 1px 6px rgba(0,0,0,0.18)",
          overflow: "hidden",
        }}
      >
        <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
          <defs>
            {/*
              Sun gradient — muted warm ochre, less yellow.
              Slightly smaller fill radius (r="10.5" vs 12) so the knob
              background peeks around the edge for a refined, inset look.
            */}
            <radialGradient id={`${uid}-sun`} cx="38%" cy="32%" r="62%">
              <stop offset="0%"   stopColor="#F0D898" />
              <stop offset="100%" stopColor="#C89040" />
            </radialGradient>

            {/* Moon gradient — cool silver with luminous highlight (unchanged) */}
            <radialGradient id={`${uid}-moon`} cx="38%" cy="32%" r="62%">
              <stop offset="0%"   stopColor="#EDF4FB" />
              <stop offset="100%" stopColor="#A8BECE" />
            </radialGradient>

            {/* Knob fill for the "ring" peek behind the smaller sun */}
            <radialGradient id={`${uid}-knob-light`} cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#e0f0fa" />
              <stop offset="100%" stopColor="#c8e4f4" />
            </radialGradient>
            <radialGradient id={`${uid}-knob-dark`} cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#3a3f4a" />
              <stop offset="100%" stopColor="#262b34" />
            </radialGradient>

            {/*
              Two static masks — avoids CSS transforms inside <mask>,
              which are unreliable on mobile browsers (iOS Safari, etc.).
              Dark: bite at cx=19 → crescent. Light: bite off-screen → full orb.
            */}
            <mask id={`${uid}-crescent-dark`}>
              <rect width="24" height="24" fill="white" />
              <circle cx="19" cy="8" r="10" fill="black" />
            </mask>
            <mask id={`${uid}-crescent-light`}>
              <rect width="24" height="24" fill="white" />
              <circle cx="35" cy="8" r="10" fill="black" />
            </mask>
          </defs>

          {/* Knob background ring — shows around the slightly-smaller sun */}
          <circle
            cx="12"
            cy="12"
            r="12"
            fill={isDark ? `url(#${uid}-knob-dark)` : `url(#${uid}-knob-light)`}
            style={{ transition: "fill 0.4s ease" }}
          />

          {/* Sun orb — muted ochre, r=10.5 (slightly smaller than knob) */}
          <circle
            cx="12"
            cy="12"
            r="10.5"
            fill={`url(#${uid}-sun)`}
            mask={`url(#${uid}-crescent-light)`}
            style={{
              opacity: isDark ? 0 : 1,
              transition: "opacity 0.35s ease",
            }}
          />

          {/* Moon orb — silver, r=10.5, same sizing */}
          <circle
            cx="12"
            cy="12"
            r="10.5"
            fill={`url(#${uid}-moon)`}
            mask={`url(#${uid}-crescent-dark)`}
            style={{
              opacity: isDark ? 1 : 0,
              transition: "opacity 0.35s ease",
            }}
          />
        </svg>
      </div>
    </button>
  );
}
