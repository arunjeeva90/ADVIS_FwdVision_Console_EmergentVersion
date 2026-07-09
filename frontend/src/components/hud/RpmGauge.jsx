/**
 * RpmGauge - large purple/blue glass orb on the right with mini scale.
 */
export default function RpmGauge({ value }) {
  return (
    <div
      data-testid="rpm-gauge"
      className="absolute right-16 top-1/2 -translate-y-[45%] pointer-events-none"
    >
      <div className="relative w-[240px] h-[240px]">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            filter: "blur(28px)",
            background:
              "radial-gradient(circle,rgba(120,90,255,0.55) 0%,rgba(60,90,220,0) 65%)",
          }}
        />
        <div className="relative orb-gauge w-full h-full rounded-full">
          <svg
            viewBox="0 0 240 240"
            className="absolute inset-0 w-full h-full -rotate-90"
          >
            <circle
              cx="120"
              cy="120"
              r="112"
              fill="none"
              stroke="rgba(120,150,255,0.15)"
              strokeWidth="2"
            />
            <circle
              cx="120"
              cy="120"
              r="112"
              fill="none"
              stroke="rgba(140,180,255,0.85)"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeDasharray={`${(value / 6) * 703} 703`}
              style={{ filter: "drop-shadow(0 0 8px rgba(140,180,255,0.9))" }}
            />
            {/* red danger accent at lower right */}
            <path
              d="M 200 190 A 112 112 0 0 1 120 232"
              fill="none"
              stroke="rgba(255,70,90,0.85)"
              strokeWidth="3"
              strokeLinecap="round"
              style={{ filter: "drop-shadow(0 0 8px rgba(255,70,90,0.85))" }}
              transform="rotate(90 120 120)"
            />
          </svg>

          <div className="relative z-10 h-full flex flex-col items-center justify-center font-hud">
            <div
              data-testid="rpm-value"
              className="text-white text-[76px] leading-none font-digital text-glow-blue"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {value.toFixed(1)}
            </div>
            <div className="text-slate-300 text-xs tracking-[0.3em] mt-1">
              x1000 rpm
            </div>
          </div>
        </div>

        {/* mini 0..6 scale below */}
        <div className="absolute left-3 right-3 -bottom-3 flex items-center justify-between font-mono-hud text-[11px] text-slate-400">
          <span>0</span>
          <div className="flex-1 mx-2 h-[2px] bg-gradient-to-r from-cyan-400/40 via-slate-400/40 to-rose-500/50 rounded-full" />
          <span>6</span>
        </div>
      </div>
    </div>
  );
}
