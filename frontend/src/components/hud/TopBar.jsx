import { Battery, CornerUpLeft } from "lucide-react";

/**
 * TopBar - contains left (battery + nav), right (gear/temp/time + speed limit).
 * The center speed HUD is a separate component but overlaps this same top area.
 */
export default function TopBar({ hud }) {
  const time = hud.now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <>
      {/* ---------- TOP LEFT: battery ---------- */}
      <div
        data-testid="battery-panel"
        className="absolute top-6 left-8 flex items-center gap-3 font-hud"
      >
        <div className="relative">
          <div className="w-10 h-5 rounded-[3px] border border-slate-300/70 flex items-center px-[3px]">
            <div
              className="h-[10px] rounded-[1px]"
              style={{
                width: "78%",
                background:
                  "linear-gradient(90deg,#37e39a 0%,#7bf5c6 60%,#b4ffe1 100%)",
                boxShadow: "0 0 8px rgba(55,227,154,0.65)",
              }}
            />
          </div>
          <div className="absolute -right-[3px] top-1/2 -translate-y-1/2 w-[3px] h-2 bg-slate-300/70 rounded-r" />
        </div>
        <span className="text-lg tracking-wider">78%</span>
        <span className="text-slate-400 text-lg ml-2">412 km</span>
      </div>

      {/* ---------- NAV panel (below battery) ---------- */}
      <div
        data-testid="nav-panel"
        className="absolute top-[74px] left-10 font-hud"
      >
        <div className="flex items-center gap-3">
          <CornerUpLeft
            className="text-slate-100 w-9 h-9"
            strokeWidth={1.5}
            style={{ transform: "scaleX(-1) rotate(0deg)" }}
          />
          <div className="text-3xl tracking-wide">2.6 km</div>
          <div className="px-2 py-[2px] text-[10px] tracking-[0.3em] border border-slate-400/50 rounded-full text-slate-200">
            SOUTH
          </div>
        </div>
        <div className="ml-12 -mt-1 text-slate-300 text-base tracking-wide">
          Stay on NH48
        </div>
        <div className="ml-12 mt-2 w-40 h-[3px] rounded-full bg-slate-700/60 overflow-hidden relative">
          <div
            className="absolute left-0 top-0 h-full rounded-full"
            style={{
              width: "40%",
              background:
                "linear-gradient(90deg,#3aa7ff 0%,#66d3ff 100%)",
              boxShadow: "0 0 8px rgba(90,180,255,0.7)",
            }}
          />
          <div className="absolute left-[40%] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)]" />
        </div>
      </div>

      {/* ---------- TOP RIGHT: gear, temp, time ---------- */}
      <div
        data-testid="top-right-status"
        className="absolute top-6 right-8 flex items-center gap-8 font-hud"
      >
        <div className="text-4xl font-semibold text-amber-400 text-glow-blue" style={{ textShadow: "0 0 12px rgba(255,170,60,0.65)" }}>
          D
        </div>
        <div className="text-2xl text-slate-100 tracking-wide">23°C</div>
        <div className="text-2xl text-slate-100 tracking-wide">{time}</div>
      </div>

      {/* ---------- Speed limit sign ---------- */}
      <div
        data-testid="speed-limit"
        className="absolute top-[80px] right-16 flex flex-col items-center font-hud"
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{
            background: "#f7f7f7",
            border: "5px solid #e02b2b",
            boxShadow:
              "0 0 12px rgba(224,43,43,0.55), inset 0 0 8px rgba(0,0,0,0.15)",
          }}
        >
          <span className="text-black text-2xl font-bold">80</span>
        </div>
        <div className="text-xs text-slate-400 mt-1 tracking-widest">
          Speed Limit
        </div>
      </div>
    </>
  );
}
