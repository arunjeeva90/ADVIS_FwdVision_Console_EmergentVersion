/**
 * RoadScene — cinematic ADAS perception view.
 *
 * Design principles applied in this revision:
 *   • FOV brought slightly down — vanishing point at screen y = 52 %.
 *   • Clean 3-lane road: 2 outer edges + 2 dashed dividers only.
 *   • No bounding boxes or text labels overlaid on vehicles (per user
 *     request).  ADAS metadata (distance, TTC, count, etc.) is retained
 *     only inside the bottom telemetry panel.
 *   • Vehicles are placed with a single perspective helper
 *     `laneToScreen(lane, depth, baseWidth)` so their wheels/feet sit
 *     firmly on the correct lane surface and their apparent size shrinks
 *     with distance, matching real-life size ratios:
 *
 *       sedan      : baseW = 22 %      (reference)
 *       bus        : baseW = 40 %  ≈ 1.8 × sedan
 *       auto-rksh  : baseW = 20 %  ≈ 0.9 × sedan
 *       2W + rider : baseW = 12 %  ≈ 0.55 × sedan
 *       pedestrian : baseW = 6.5 % ≈ 0.30 × sedan
 */

/* ---------- perspective helper ---------- */
const VP_Y = 52; // screen % from top → vanishing point
const BOTTOM_Y = 100; // road extends to screen bottom
const LANE_HALFWIDTH = 28; // screen % — outer-lane centre offset at bottom

function laneToScreen(lane, depth, baseWidthPct) {
  // depth: 0 (at VP / horizon) → 1 (at viewer / screen bottom)
  const y_pct = VP_Y + depth * (BOTTOM_Y - VP_Y);
  const x_pct = 50 + lane * depth * LANE_HALFWIDTH;
  const width_pct = baseWidthPct * depth;
  return { x_pct, y_pct, width_pct };
}

/* ---------- vehicle roster (real-life proportions, sorted furthest-first for z-order) ---------- */
// baseWidth is expressed as a % of viewport width and is scaled by depth.
// Real-life reference widths (m): sedan 1.8, bus 2.5, auto 1.4, motorcycle+rider 0.9, pedestrian 0.5.
// baseWidth values below match that ratio while staying compact for the HUD scene.
const VEHICLES = [
  // lead vehicle — ego lane, far ahead (smallest depth → drawn first / behind)
  {
    src: "/vehicles/vehicles/cropped/same_lane_vehicle/samelane_vehicle_red.png",
    lane: 0,
    depth: 0.28,
    baseWidth: 14,
  },
  // auto-rickshaw — right lane, ahead of bus
  {
    src: "/vehicles/vehicles/cropped/autorickshaw/autorickshaw_right_lane.png",
    lane: 1.05,
    depth: 0.32,
    baseWidth: 12,
  },
  // 2-wheeler — far left, mid-far distance
  {
    src: "/vehicles/vehicles/cropped/2W_rider/2W_rider_left_lane.png",
    lane: -1.35,
    depth: 0.36,
    baseWidth: 7,
  },
  // bus — right lane, mid distance (biggest vehicle)
  {
    src: "/vehicles/vehicles/cropped/bus/bus_right_lane.png",
    lane: 1,
    depth: 0.42,
    baseWidth: 22,
  },
  // pedestrian — right shoulder
  {
    src: "/vehicles/vehicles/cropped/pedestrian/pedestrian_standing_right.png",
    lane: 1.45,
    depth: 0.48,
    baseWidth: 3.5,
  },
  // blue car — left lane, closest (largest visible, drawn last / on top)
  {
    src: "/vehicles/vehicles/cropped/car/car_left_lane.png",
    lane: -0.85,
    depth: 0.52,
    baseWidth: 14,
  },
];

export default function RoadScene() {
  return (
    <div
      data-testid="road-scene"
      className="absolute inset-0 overflow-hidden pointer-events-none"
    >
      {/* Full-screen landscape backdrop */}
      <div aria-hidden className="absolute inset-0">
        <img
          src="/vehicles/vehicles/landscape_v2.png"
          alt=""
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 22%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.35) 100%)",
          }}
        />
      </div>

      {/* Perspective road overlay (lanes + guidance) */}
      <RoadFloor />

      {/* --------- Detected objects (no bbox, no label) --------- */}
      {VEHICLES.map((v, i) => {
        const { x_pct, y_pct, width_pct } = laneToScreen(
          v.lane,
          v.depth,
          v.baseWidth,
        );
        return (
          <img
            key={i}
            src={v.src}
            alt=""
            className="absolute block pointer-events-none"
            style={{
              left: `${x_pct}%`,
              top: `${y_pct}%`,
              width: `${width_pct}%`,
              transform: "translate(-50%, -100%)",
              filter:
                "drop-shadow(0 4px 12px rgba(0,0,0,0.75)) drop-shadow(0 0 14px rgba(20,50,90,0.35))",
            }}
          />
        );
      })}

      {/* --------- Ego vehicle (fixed at bottom centre) --------- */}
      <div
        data-testid="ego-vehicle"
        className="absolute left-1/2"
        style={{
          bottom: "5%",
          width: "15%",
          transform: "translateX(-50%)",
        }}
      >
        <img
          src="/vehicles/vehicles/cropped/ego_vehicle/ego_vehicle.png"
          alt="Ego vehicle"
          className="w-full h-auto block"
          style={{
            filter:
              "drop-shadow(0 22px 44px rgba(0,0,0,0.9)) drop-shadow(0 0 28px rgba(40,110,200,0.35))",
          }}
        />
      </div>
    </div>
  );
}

/* ---------------- Road floor with perspective ---------------- */
/*
 * SVG container spans screen y = VP_Y % → 100 %.
 *   viewBox 0..1000 × 0..1000 mapped onto that region.
 *   Vanishing point:   (500, 0)
 *   3-lane setup at y = 1000 (screen bottom):
 *     outer-left edge      :  x = -50
 *     lane-1 | lane-2 div  :  x = 280   (dashed)
 *     lane-2 | lane-3 div  :  x = 720   (dashed)
 *     outer-right edge     :  x = 1050
 *   → ego lane centre at 500, lane width ≈ 44 % of viewport at the bottom.
 */
function RoadFloor() {
  return (
    <div
      aria-hidden
      className="absolute inset-x-0 bottom-0"
      style={{ top: `${VP_Y}%` }}
    >
      <svg
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full overflow-visible"
      >
        <defs>
          <linearGradient id="pathBody" x1="0.5" y1="1" x2="0.5" y2="0">
            <stop offset="0%" stopColor="rgba(0,220,255,0.9)" />
            <stop offset="45%" stopColor="rgba(0,190,255,0.55)" />
            <stop offset="80%" stopColor="rgba(80,210,255,0.22)" />
            <stop offset="100%" stopColor="rgba(120,240,255,0)" />
          </linearGradient>
          <linearGradient id="pathCore" x1="0.5" y1="1" x2="0.5" y2="0">
            <stop offset="0%" stopColor="rgba(230,255,255,0.9)" />
            <stop offset="50%" stopColor="rgba(180,240,255,0.55)" />
            <stop offset="100%" stopColor="rgba(180,240,255,0)" />
          </linearGradient>
          <linearGradient id="laneEdge" x1="0.5" y1="1" x2="0.5" y2="0">
            <stop offset="0%" stopColor="rgba(220,240,255,0.6)" />
            <stop offset="70%" stopColor="rgba(220,240,255,0.06)" />
            <stop offset="100%" stopColor="rgba(220,240,255,0)" />
          </linearGradient>
          <filter
            id="cyanGlow"
            x="-40%"
            y="-20%"
            width="180%"
            height="140%"
          >
            <feGaussianBlur stdDeviation="12" result="b1" />
            <feGaussianBlur stdDeviation="24" in="SourceGraphic" result="b2" />
            <feMerge>
              <feMergeNode in="b2" />
              <feMergeNode in="b1" />
              <feMergeNode in="b1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <clipPath id="roadClip">
            <rect x="0" y="0" width="1000" height="1000" />
          </clipPath>
        </defs>

        <g clipPath="url(#roadClip)">
          {/* Two outer road edges */}
          <path
            d="M -50 1000 L 500 0"
            stroke="url(#laneEdge)"
            strokeWidth="2.2"
            fill="none"
          />
          <path
            d="M 1050 1000 L 500 0"
            stroke="url(#laneEdge)"
            strokeWidth="2.2"
            fill="none"
          />

          {/* Two dashed lane dividers (3-lane road) */}
          <DashedLine x1={280} y1={1000} x2={500} y2={0} />
          <DashedLine x1={720} y1={1000} x2={500} y2={0} />

          {/* -------- Cyan pulsing guidance path (ego lane) -------- */}
          <g className="guidance-pulse">
            <polygon
              points="310,1000 690,1000 512,80 488,80"
              fill="url(#pathBody)"
              opacity="0.4"
              filter="url(#cyanGlow)"
            />
            <polygon
              points="340,1000 660,1000 508,92 492,92"
              fill="url(#pathBody)"
              opacity="0.95"
            />
            <polygon
              points="390,1000 610,1000 505,108 495,108"
              fill="rgba(150,240,255,0.55)"
            />
            <polygon
              points="440,1000 560,1000 502,128 498,128"
              fill="url(#pathCore)"
              opacity="0.85"
            />
            {/* chevron marker at the tip */}
            <path
              d="M 476 82 L 500 68 L 524 82 L 520 88 L 500 78 L 480 88 Z"
              fill="rgba(220,255,255,0.95)"
              style={{ filter: "drop-shadow(0 0 6px rgba(140,240,255,1))" }}
            />
          </g>
        </g>
      </svg>
    </div>
  );
}

/**
 * DashedLine — animates top → bottom (dashes flow toward the viewer).
 */
function DashedLine({ x1, y1, x2, y2 }) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke="rgba(235,245,255,0.9)"
      strokeWidth="2.4"
      strokeDasharray="38 42"
      style={{ filter: "drop-shadow(0 0 4px rgba(180,210,255,0.7))" }}
    >
      <animate
        attributeName="stroke-dashoffset"
        from="0"
        to="80"
        dur="0.6s"
        repeatCount="indefinite"
      />
    </line>
  );
}
