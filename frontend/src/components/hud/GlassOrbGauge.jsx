import { useEffect, useId, useMemo, useRef, useState } from "react";
import "./GlassOrbGauge.css";

const COLOR_MODES = {
  blue: { primary: "#2f7cff", secondary: "#00d5ff", rgb: "47,124,255" },
  cyan: { primary: "#00d5ff", secondary: "#7cecff", rgb: "0,213,255" },
  orange: { primary: "#ff9a1f", secondary: "#ffd06a", rgb: "255,154,31" },
  red: { primary: "#ff2d45", secondary: "#ff6680", rgb: "255,45,69" },
  magenta: { primary: "#ff2bd6", secondary: "#ff5d7d", rgb: "255,43,214" },
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function useAnimatedNumber(value, animated, duration = 620) {
  const numericValue = Number.isFinite(Number(value)) ? Number(value) : 0;
  const [displayValue, setDisplayValue] = useState(numericValue);
  const previousValue = useRef(numericValue);

  useEffect(() => {
    if (!animated) {
      previousValue.current = numericValue;
      setDisplayValue(numericValue);
      return undefined;
    }

    const from = previousValue.current;
    const delta = numericValue - from;
    const start = performance.now();
    let frameId = 0;

    const tick = (now) => {
      const elapsed = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      setDisplayValue(from + delta * eased);
      if (elapsed < 1) frameId = requestAnimationFrame(tick);
      else previousValue.current = numericValue;
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [animated, duration, numericValue]);

  return displayValue;
}

export default function GlassOrbGauge({
  value = 0,
  min = 0,
  max = 100,
  unit = "",
  label = "",
  leftLabel = "",
  rightLabel = "",
  colorMode = "blue",
  showScale = false,
  scaleMinLabel = "",
  scaleMaxLabel = "",
  warningLevel = "normal",
  decimals = 0,
  size = 240,
  animated = true,
  valueTestId,
}) {
  const safeMin = Number.isFinite(Number(min)) ? Number(min) : 0;
  const safeMax = Number.isFinite(Number(max)) && Number(max) > safeMin ? Number(max) : safeMin + 1;
  const numericValue = Number.isFinite(Number(value)) ? Number(value) : safeMin;
  const clampedValue = clamp(numericValue, safeMin, safeMax);
  const percentage = ((clampedValue - safeMin) / (safeMax - safeMin)) * 100;
  const displayValue = useAnimatedNumber(clampedValue, animated);
  const reactId = useId().replace(/:/g, "");

  const resolvedMode = warningLevel === "critical"
    ? (colorMode === "magenta" ? "magenta" : "red")
    : warningLevel === "caution"
      ? "orange"
      : colorMode;

  const palette = COLOR_MODES[resolvedMode] || COLOR_MODES.blue;
  const formattedValue = useMemo(
    () => displayValue.toFixed(Math.max(0, decimals)),
    [decimals, displayValue],
  );

  const style = {
    "--orb-size": `${size}px`,
    "--orb-primary": palette.primary,
    "--orb-secondary": palette.secondary,
    "--orb-rgb": palette.rgb,
    "--orb-progress": percentage,
  };

  return (
    <div
      className={`glass-orb-gauge glass-orb-gauge--${resolvedMode} ${animated ? "is-animated" : ""}`}
      style={style}
      role="img"
      aria-label={`${label || "Gauge"}: ${clampedValue.toFixed(decimals)} ${unit}`.trim()}
    >
      <div className="glass-orb-gauge__ambient" aria-hidden />
      <div className="glass-orb-gauge__halo" aria-hidden />

      <div className="glass-orb-gauge__shell">
        <div className="glass-orb-gauge__refraction" aria-hidden />
        <div className="glass-orb-gauge__inner-ring" aria-hidden />
        <div className="glass-orb-gauge__core" aria-hidden />
        <div className="glass-orb-gauge__shimmer" aria-hidden />
        <div className="glass-orb-gauge__specular" aria-hidden />
        <div className="glass-orb-gauge__rim-light" aria-hidden />

        <svg
          className="glass-orb-gauge__instrument"
          viewBox="0 0 240 240"
          aria-hidden
        >
          <defs>
            <linearGradient id={`orb-track-${reactId}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(210,225,255,0.05)" />
              <stop offset="50%" stopColor="rgba(170,190,255,0.22)" />
              <stop offset="100%" stopColor="rgba(210,225,255,0.05)" />
            </linearGradient>
            <linearGradient id={`orb-active-${reactId}`} x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor={palette.secondary} />
              <stop offset="60%" stopColor={palette.primary} />
              <stop offset="100%" stopColor="rgba(255,255,255,0.95)" />
            </linearGradient>
            <filter id={`orb-glow-${reactId}`} x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="4.2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <path id={`orb-label-arc-${reactId}`} d="M 30 164 A 101 101 0 0 0 210 164" fill="none" />
          </defs>

          <circle
            className="glass-orb-gauge__track"
            cx="120"
            cy="120"
            r="103"
            pathLength="100"
            fill="none"
            stroke={`url(#orb-track-${reactId})`}
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="62 38"
            transform="rotate(68 120 120)"
          />
          <circle
            className="glass-orb-gauge__active-arc"
            cx="120"
            cy="120"
            r="103"
            pathLength="100"
            fill="none"
            stroke={`url(#orb-active-${reactId})`}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${percentage * 0.62} ${100 - percentage * 0.62}`}
            transform="rotate(68 120 120)"
            filter={`url(#orb-glow-${reactId})`}
          />

          {Array.from({ length: 17 }).map((_, index) => {
            const angle = 126 + index * 9.75;
            const major = index === 0 || index === 8 || index === 16;
            return (
              <line
                key={angle}
                className="glass-orb-gauge__tick"
                x1="120"
                y1={major ? "209" : "212"}
                x2="120"
                y2="218"
                transform={`rotate(${angle} 120 120)`}
                strokeWidth={major ? "1.5" : "0.8"}
              />
            );
          })}

          {(leftLabel || rightLabel) && (
            <g className="glass-orb-gauge__curve-labels">
              {leftLabel && (
                <text>
                  <textPath href={`#orb-label-arc-${reactId}`} startOffset="2%">
                    {leftLabel}
                  </textPath>
                </text>
              )}
              {rightLabel && (
                <text>
                  <textPath href={`#orb-label-arc-${reactId}`} startOffset="72%">
                    {rightLabel}
                  </textPath>
                </text>
              )}
            </g>
          )}
        </svg>

        <div className="glass-orb-gauge__content">
          <div
            data-testid={valueTestId}
            className="glass-orb-gauge__value"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {formattedValue}
          </div>
          <div className="glass-orb-gauge__unit">{unit}</div>
          {label && <div className="glass-orb-gauge__label">{label}</div>}
        </div>

        {showScale && (
          <div className="glass-orb-gauge__scale" aria-hidden>
            <span>{scaleMinLabel}</span>
            <span>{scaleMaxLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
}
