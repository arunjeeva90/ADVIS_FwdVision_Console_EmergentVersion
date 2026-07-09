import { Fuel, Thermometer } from "lucide-react";

/**
 * BottomBar - fuel/energy indicator on left, temperature on right, headlight AUTO.
 */
export default function BottomBar() {
  return (
    <>
      {/* Bottom left: fuel E/F */}
      <div
        data-testid="bottom-fuel"
        className="absolute left-8 bottom-6 flex items-center gap-3 font-hud text-slate-300"
      >
        <Fuel className="w-5 h-5 text-slate-300" strokeWidth={1.5} />
        <span className="text-slate-400 text-sm">E</span>
        <div className="seg-bar">
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className={i < 5 ? "on" : ""}
            />
          ))}
        </div>
        <span className="text-slate-400 text-sm">F</span>

        {/* range chip */}
        <div className="ml-6 flex items-center gap-2">
          <Fuel className="w-5 h-5 text-slate-300" strokeWidth={1.5} />
          <span className="text-slate-200 text-lg tracking-wide">412 km</span>
        </div>
      </div>

      {/* Bottom right: temp + headlight */}
      <div
        data-testid="bottom-temp"
        className="absolute right-8 bottom-6 flex items-center gap-6 font-hud text-slate-300"
      >
        <div className="flex items-center gap-3">
          <Thermometer className="w-5 h-5 text-slate-300" strokeWidth={1.5} />
          <span className="text-slate-400 text-sm">C</span>
          <div className="seg-bar">
            {Array.from({ length: 8 }).map((_, i) => (
              <span
                key={i}
                className={i < 3 ? "on" : i === 6 || i === 7 ? "warn" : ""}
              />
            ))}
          </div>
          <span className="text-slate-400 text-sm">H</span>
        </div>

        <div className="flex flex-col items-center">
          <HeadlightIcon />
          <span className="text-emerald-400 text-[11px] tracking-widest mt-1">AUTO</span>
        </div>
      </div>
    </>
  );
}

function HeadlightIcon() {
  return (
    <svg width="30" height="20" viewBox="0 0 30 20" fill="none">
      <path
        d="M 3 4 Q 3 2 5 2 L 14 2 Q 20 2 20 10 Q 20 18 14 18 L 5 18 Q 3 18 3 16 Z"
        fill="none"
        stroke="rgba(60,240,140,0.9)"
        strokeWidth="1.4"
        style={{ filter: "drop-shadow(0 0 6px rgba(60,240,140,0.8))" }}
      />
      <path
        d="M 22 5 L 28 5 M 22 9 L 28 9 M 22 13 L 28 13"
        stroke="rgba(60,240,140,0.9)"
        strokeWidth="1.4"
        strokeLinecap="round"
        style={{ filter: "drop-shadow(0 0 4px rgba(60,240,140,0.8))" }}
      />
    </svg>
  );
}
