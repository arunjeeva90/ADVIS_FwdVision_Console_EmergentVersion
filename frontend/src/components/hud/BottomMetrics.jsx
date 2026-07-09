import { Car, Radar } from "lucide-react";

/**
 * BottomMetrics - 5-section rounded rectangular glass panel with Lead Vehicle,
 * TTC, Lane Status, Objects, Road.
 */
export default function BottomMetrics({ hud }) {
  return (
    <div
      data-testid="bottom-metrics"
      className="absolute left-1/2 -translate-x-1/2 bottom-6 glass-panel-strong rounded-2xl px-2 py-3"
      style={{ width: "780px" }}
    >
      <div className="flex items-stretch divide-x divide-slate-100/10">
        {/* Section 1: Lead Vehicle */}
        <Section label="Lead Vehicle">
          <div className="flex items-center gap-3">
            <div className="text-white text-3xl font-digital">
              {hud.leadDist} m
            </div>
          </div>
          <CarIcon />
        </Section>

        {/* Section 2: TTC */}
        <Section label="TTC">
          <div className="text-white text-3xl font-digital">
            {hud.ttc.toFixed(1)} s
          </div>
          <RadarMini />
        </Section>

        {/* Section 3: Lane Status */}
        <Section label="Lane Status">
          <LaneIcon />
        </Section>

        {/* Section 4: Objects */}
        <Section label="Objects">
          <div className="text-white text-3xl font-digital">6</div>
          <RadarMini />
        </Section>

        {/* Section 5: Road */}
        <Section label="Road">
          <div className="text-white text-2xl font-digital">Dry</div>
          <RoadIcon />
        </Section>
      </div>
    </div>
  );
}

function Section({ label, children }) {
  return (
    <div className="flex-1 min-w-[140px] px-5 py-1 flex flex-col items-center gap-2">
      <div className="text-slate-400 text-[11px] tracking-[0.25em] uppercase whitespace-nowrap">
        {label}
      </div>
      {children}
    </div>
  );
}

function CarIcon() {
  return (
    <svg width="46" height="20" viewBox="0 0 46 20" fill="none">
      <path
        d="M4 14 L8 6 Q10 3 14 3 L32 3 Q36 3 38 6 L42 14 Z"
        fill="rgba(255,60,80,0.85)"
        stroke="rgba(255,120,140,1)"
        strokeWidth="1"
        style={{ filter: "drop-shadow(0 0 6px rgba(255,60,80,0.8))" }}
      />
      <circle cx="12" cy="16" r="2.4" fill="#0b0b12" stroke="#ff5566" />
      <circle cx="34" cy="16" r="2.4" fill="#0b0b12" stroke="#ff5566" />
    </svg>
  );
}

function RadarMini() {
  return (
    <svg width="42" height="18" viewBox="0 0 42 18" fill="none">
      <ellipse
        cx="21"
        cy="14"
        rx="18"
        ry="3"
        stroke="rgba(140,200,255,0.7)"
        strokeWidth="1"
        fill="none"
      />
      <ellipse
        cx="21"
        cy="14"
        rx="12"
        ry="2"
        stroke="rgba(140,200,255,0.5)"
        strokeWidth="0.8"
        fill="none"
      />
      <path
        d="M 21 14 L 4 6"
        stroke="rgba(120,220,255,0.9)"
        strokeWidth="1"
        style={{ filter: "drop-shadow(0 0 4px rgba(120,220,255,0.8))" }}
      />
      <circle cx="21" cy="14" r="1.4" fill="rgba(120,220,255,1)" />
    </svg>
  );
}

function LaneIcon() {
  return (
    <svg width="70" height="34" viewBox="0 0 70 34" fill="none">
      <path
        d="M 6 32 L 26 4"
        stroke="rgba(60,240,140,0.95)"
        strokeWidth="2.5"
        strokeLinecap="round"
        style={{ filter: "drop-shadow(0 0 6px rgba(60,240,140,0.85))" }}
      />
      <path
        d="M 64 32 L 44 4"
        stroke="rgba(60,240,140,0.95)"
        strokeWidth="2.5"
        strokeLinecap="round"
        style={{ filter: "drop-shadow(0 0 6px rgba(60,240,140,0.85))" }}
      />
      <path
        d="M 35 32 L 35 22 M 35 18 L 35 12 M 35 8 L 35 4"
        stroke="rgba(60,240,140,0.9)"
        strokeWidth="2.2"
        strokeLinecap="round"
        style={{ filter: "drop-shadow(0 0 4px rgba(60,240,140,0.7))" }}
      />
    </svg>
  );
}

function RoadIcon() {
  return (
    <svg width="60" height="28" viewBox="0 0 60 28" fill="none">
      <path
        d="M 8 26 L 26 2"
        stroke="rgba(220,230,255,0.8)"
        strokeWidth="1.6"
      />
      <path
        d="M 52 26 L 34 2"
        stroke="rgba(220,230,255,0.8)"
        strokeWidth="1.6"
      />
      <path
        d="M 30 26 L 30 20 M 30 16 L 30 10 M 30 6 L 30 2"
        stroke="rgba(220,230,255,0.7)"
        strokeWidth="1.4"
      />
    </svg>
  );
}
