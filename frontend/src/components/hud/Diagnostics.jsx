/**
 * Diagnostics - Small translucent card at the right, above the bottom bar.
 */
export default function Diagnostics({ hud }) {
  const rows = [
    { k: "FPS", v: hud.fps },
    { k: "Latency", v: `${hud.latency} ms` },
    { k: "Sensors", v: "OK" },
    { k: "Vision", v: "OK" },
  ];
  return (
    <div
      data-testid="diagnostics"
      className="absolute right-8 bottom-[120px] glass-panel rounded-lg px-4 py-2 min-w-[210px] font-mono-hud"
    >
      <div className="divide-y divide-slate-100/5">
        {rows.map((r) => (
          <div
            key={r.k}
            className="flex items-center justify-between py-1.5 text-[13px]"
          >
            <span className="text-slate-400">{r.k}</span>
            <span className="text-emerald-400 tabular-nums" style={{ textShadow: "0 0 6px rgba(52,211,153,0.5)" }}>
              {r.v}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
