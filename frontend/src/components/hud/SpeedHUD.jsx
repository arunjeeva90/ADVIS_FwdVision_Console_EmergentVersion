import { Navigation, Car } from "lucide-react";

/**
 * Center Speed HUD - large digital number "102" with KM/H below,
 * semi-circular arc with tick marks behind, and status row.
 */
export default function SpeedHUD({ hud }) {
  return (
    <div
      data-testid="speed-hud"
      className="absolute left-1/2 -translate-x-1/2 top-6 flex flex-col items-center pointer-events-none"
    >
      {/* semi-circle arc */}
      <div className="relative w-[560px] h-[220px]">
        <svg
          viewBox="0 0 560 240"
          className="absolute inset-0 w-full h-full"
        >
          <defs>
            <linearGradient id="arcGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(90,150,255,0.15)" />
              <stop offset="50%" stopColor="rgba(120,210,255,0.9)" />
              <stop offset="100%" stopColor="rgba(90,150,255,0.15)" />
            </linearGradient>
          </defs>
          {/* main arc */}
          <path
            d="M 40 220 A 240 240 0 0 1 520 220"
            fill="none"
            stroke="url(#arcGrad)"
            strokeWidth="1.4"
            strokeLinecap="round"
            style={{ filter: "drop-shadow(0 0 6px rgba(120,200,255,0.5))" }}
          />
          {/* tick marks along arc */}
          {Array.from({ length: 61 }).map((_, i) => {
            const t = i / 60;
            const ang = Math.PI * (1 - t);
            const cx = 280;
            const cy = 220;
            const r1 = 240;
            const long = i % 5 === 0;
            const r2 = r1 - (long ? 18 : 10);
            const x1 = cx + r1 * Math.cos(ang);
            const y1 = cy - r1 * Math.sin(ang);
            const x2 = cx + r2 * Math.cos(ang);
            const y2 = cy - r2 * Math.sin(ang);
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={long ? "rgba(160,210,255,0.85)" : "rgba(120,180,240,0.35)"}
                strokeWidth={long ? 1.4 : 0.8}
              />
            );
          })}
        </svg>

        {/* Big speed number */}
        <div className="absolute inset-x-0 top-[36px] flex flex-col items-center">
          <div
            data-testid="speed-value"
            className="font-digital text-white text-[110px] leading-none tracking-tight text-glow-blue flicker"
            style={{
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {String(Math.round(hud.speed)).padStart(3, "0").replace(/^0+/, "") || "0"}
          </div>
          <div className="font-hud text-slate-300 text-sm tracking-[0.5em] mt-1">
            KM/H
          </div>
        </div>
      </div>

      {/* ADAS status row */}
      <div
        data-testid="adas-status"
        className="mt-2 flex items-center gap-6 font-hud"
      >
        <div className="glass-panel px-4 py-1.5 rounded-full flex items-center gap-2 pointer-events-auto">
          <Navigation
            className="w-4 h-4 text-emerald-400"
            strokeWidth={2}
            style={{ filter: "drop-shadow(0 0 6px rgba(52,211,153,0.7))" }}
          />
          <span className="text-emerald-300 text-sm tracking-wide">
            Lane Centering ON
          </span>
        </div>
        <div className="glass-panel px-4 py-1.5 rounded-full flex items-center gap-2 pointer-events-auto">
          <Car
            className="w-4 h-4 text-emerald-400"
            strokeWidth={2}
            style={{ filter: "drop-shadow(0 0 6px rgba(52,211,153,0.7))" }}
          />
          <span className="text-emerald-300 text-sm tracking-wide">
            AEB Ready
          </span>
        </div>
      </div>
    </div>
  );
}
