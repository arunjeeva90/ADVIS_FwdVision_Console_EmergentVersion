/**
 * PowerGauge - large purple/blue glass orb on the left.
 */
export default function PowerGauge({ value }) {
  return (
    <div
      data-testid="power-gauge"
      className="absolute left-16 top-1/2 -translate-y-[45%] pointer-events-none"
    >
      <div className="relative w-[240px] h-[240px]">
        {/* outer soft glow */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            filter: "blur(28px)",
            background:
              "radial-gradient(circle,rgba(120,90,255,0.55) 0%,rgba(60,90,220,0) 65%)",
          }}
        />
        {/* glass orb */}
        <div className="relative orb-gauge w-full h-full rounded-full">
          {/* progress ring */}
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
              strokeDasharray={`${(value / 60) * 703} 703`}
              style={{
                filter: "drop-shadow(0 0 8px rgba(140,180,255,0.9))",
              }}
            />
          </svg>

          {/* inner content */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center font-hud">
            <div
              data-testid="power-value"
              className="text-white text-[76px] leading-none font-digital text-glow-blue"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {value}
            </div>
            <div className="text-slate-300 text-sm tracking-widest mt-1">
              kW
            </div>
            <div className="text-slate-400 text-xs tracking-[0.4em] mt-1">
              Power
            </div>
          </div>
        </div>

        {/* Curved bottom labels */}
        <svg
          viewBox="0 0 240 260"
          className="absolute left-0 -bottom-2 w-full h-[80px] pointer-events-none"
        >
          <defs>
            <path
              id="pg-arc"
              d="M 10 130 A 110 110 0 0 0 230 130"
              fill="none"
            />
          </defs>
          <text
            fill="rgba(150,180,240,0.85)"
            fontSize="12"
            letterSpacing="6"
            fontFamily="Chakra Petch, sans-serif"
          >
            <textPath href="#pg-arc" startOffset="6%">
              CHARGE
            </textPath>
          </text>
          <text
            fill="rgba(150,180,240,0.85)"
            fontSize="12"
            letterSpacing="6"
            fontFamily="Chakra Petch, sans-serif"
          >
            <textPath href="#pg-arc" startOffset="72%">
              POWER
            </textPath>
          </text>
        </svg>
      </div>
    </div>
  );
}
