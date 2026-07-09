/**
 * RoadScene — cinematic ADAS perception view.
 *
 * Revisions applied in this pass:
 *   1. Road SVG now spans screen y = 47 % → 85 % (was 100 %), leaving clear
 *      space for the bottom info console below.  Ego car sits just above
 *      that break line.
 *   2. Lead-vehicle skin colour is TTC-driven:
 *        TTC ≤ 2.5 s  → RED     (imminent collision)
 *        2.5–5 s      → ORANGE  (caution)
 *        > 5 s        → NORMAL  (blue-shift via CSS filter)
 *   3. Outer road-edge rays terminate at the actual trapezoid's TOP corners
 *      (SVG x = 470 / 530 at y = 0), not at a single vanishing point,
 *      hugging the leg sides of the trapezoidal cutout in landscape_v2.png.
 *      Lane spread extends near-screen-width at the bottom.
 *   4. Moving dotted barricades march down each road edge, adding realism.
 */

/* ---------- perspective helper ---------- */
const VP_Y = 47;      // screen % from top → top of road trapezoid
const BOTTOM_Y = 85;  // screen % → bottom of visible road (info panel below)
// Road extends to (−50, 1050) SVG-x at the bottom = slight over-scan; ego lane
// centred, adjacent lanes each occupy ~33 % width at the bottom.
const LANE_HALFWIDTH = 30;

function laneToScreen(lane, depth, baseWidthPct) {
  const y_pct = VP_Y + depth * (BOTTOM_Y - VP_Y);
  const x_pct = 50 + lane * depth * LANE_HALFWIDTH;
  const width_pct = baseWidthPct * depth;
  return { x_pct, y_pct, width_pct };
}

/* ---------- vehicle roster (furthest-first for correct z-order) ---------- */
const VEHICLES = [
  // auto-rickshaw — right lane, ahead of bus
  {
    src: "/vehicles/vehicles/cropped/autorickshaw/autorickshaw_right_lane.png",
    lane: 1.05, depth: 0.32, baseWidth: 12,
  },
  // 2-wheeler — far left
  {
    src: "/vehicles/vehicles/cropped/2W_rider/2W_rider_left_lane.png",
    lane: -1.35, depth: 0.36, baseWidth: 7,
  },
  // bus — right lane
  {
    src: "/vehicles/vehicles/cropped/bus/bus_right_lane.png",
    lane: 1, depth: 0.42, baseWidth: 22,
  },
  // pedestrian — right shoulder
  {
    src: "/vehicles/vehicles/cropped/pedestrian/pedestrian_standing_right.png",
    lane: 1.45, depth: 0.48, baseWidth: 3.5,
  },
  // blue car — left lane, closest of the detected objects
  {
    src: "/vehicles/vehicles/cropped/car/car_left_lane.png",
    lane: -0.85, depth: 0.52, baseWidth: 14,
  },
];

/* Resolve the lead-vehicle image and CSS filter based on TTC. */
function leadForTtc(ttc) {
  if (ttc <= 2.5) {
    return {
      src: "/vehicles/vehicles/cropped/same_lane_vehicle/samelane_vehicle_red.png",
      filter: "drop-shadow(0 0 14px rgba(255,60,80,0.9)) drop-shadow(0 4px 12px rgba(0,0,0,0.8))",
    };
  }
  if (ttc <= 5) {
    return {
      src: "/vehicles/vehicles/cropped/same_lane_vehicle/samelane_vehicle_orange.png",
      filter: "drop-shadow(0 0 14px rgba(255,160,60,0.85)) drop-shadow(0 4px 12px rgba(0,0,0,0.8))",
    };
  }
  return {
    src: "/vehicles/vehicles/cropped/same_lane_vehicle/samelane_vehicle_orange.png",
    // shift orange → blue/cyan and reduce saturation for a "safe/normal" look
    filter:
      "hue-rotate(170deg) saturate(0.6) brightness(0.95) drop-shadow(0 0 10px rgba(80,180,255,0.55)) drop-shadow(0 4px 12px rgba(0,0,0,0.7))",
  };
}

export default function RoadScene({ hud }) {
  const lead = leadForTtc(hud?.ttc ?? 3);
  const leadPos = laneToScreen(0, 0.28, 14);

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

      {/* Perspective road overlay */}
      <RoadFloor />

      {/* Lead vehicle — TTC-coloured, drawn first (furthest) */}
      <img
        data-testid="lead-vehicle"
        src={lead.src}
        alt=""
        className="absolute block pointer-events-none"
        style={{
          left: `${leadPos.x_pct}%`,
          top: `${leadPos.y_pct}%`,
          width: `${leadPos.width_pct}%`,
          transform: "translate(-50%, -100%)",
          filter: lead.filter,
        }}
      />

      {/* Other detected objects (sorted furthest-first) */}
      {VEHICLES.map((v, i) => {
        const { x_pct, y_pct, width_pct } = laneToScreen(v.lane, v.depth, v.baseWidth);
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

      {/* Ego vehicle — anchored just above the bottom info console */}
      <div
        data-testid="ego-vehicle"
        className="absolute left-1/2"
        style={{
          bottom: `${100 - BOTTOM_Y - 1}%`,
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
              "drop-shadow(0 18px 32px rgba(0,0,0,0.9)) drop-shadow(0 0 28px rgba(40,110,200,0.35))",
          }}
        />
      </div>
    </div>
  );
}

/* ---------------- Road floor: lanes + guidance + barricades ---------------- */
/*
 * SVG viewBox 0..1000 × 0..1000 mapped onto screen y = 47 % → 85 %.
 *
 * Trapezoid corners (matching landscape_v2's road cutout):
 *   top-left     ( 470,    0 )
 *   top-right    ( 530,    0 )
 *   bottom-left  ( -50, 1000 )
 *   bottom-right (1050, 1000 )
 *
 * 3 lanes evenly split → dividers at bottom x = 317 / 683, at top x = 490 / 510.
 */
function RoadFloor() {
  return (
    <div
      aria-hidden
      className="absolute inset-x-0"
      style={{ top: `${VP_Y}%`, bottom: `${100 - BOTTOM_Y}%` }}
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
            <stop offset="0%" stopColor="rgba(220,240,255,0.65)" />
            <stop offset="70%" stopColor="rgba(220,240,255,0.15)" />
            <stop offset="100%" stopColor="rgba(220,240,255,0.05)" />
          </linearGradient>
          <filter id="cyanGlow" x="-40%" y="-20%" width="180%" height="140%">
            <feGaussianBlur stdDeviation="12" result="b1" />
            <feGaussianBlur stdDeviation="24" in="SourceGraphic" result="b2" />
            <feMerge>
              <feMergeNode in="b2" />
              <feMergeNode in="b1" />
              <feMergeNode in="b1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer road edges — hug the trapezoid legs */}
        <path
          d="M -50 1000 L 470 0"
          stroke="url(#laneEdge)"
          strokeWidth="2.4"
          fill="none"
        />
        <path
          d="M 1050 1000 L 530 0"
          stroke="url(#laneEdge)"
          strokeWidth="2.4"
          fill="none"
        />

        {/* Dashed lane dividers — 3-lane road, converging into the trapezoid top */}
        <DashedLine x1={317} y1={1000} x2={490} y2={0} />
        <DashedLine x1={683} y1={1000} x2={510} y2={0} />

        {/* Moving barricades along both road edges */}
        <Barricades />

        {/* -------- Cyan pulsing guidance path (ego lane) -------- */}
        <g className="guidance-pulse">
          <polygon
            points="330,1000 670,1000 508,60 492,60"
            fill="url(#pathBody)"
            opacity="0.4"
            filter="url(#cyanGlow)"
          />
          <polygon
            points="360,1000 640,1000 505,72 495,72"
            fill="url(#pathBody)"
            opacity="0.95"
          />
          <polygon
            points="410,1000 590,1000 503,88 497,88"
            fill="rgba(150,240,255,0.55)"
          />
          <polygon
            points="460,1000 540,1000 501,108 499,108"
            fill="url(#pathCore)"
            opacity="0.85"
          />
          <path
            d="M 476 62 L 500 48 L 524 62 L 520 68 L 500 58 L 480 68 Z"
            fill="rgba(220,255,255,0.95)"
            style={{ filter: "drop-shadow(0 0 6px rgba(140,240,255,1))" }}
          />
        </g>
      </svg>
    </div>
  );
}

/* ---------- Dashed lane divider, dashes flow top→bottom ---------- */
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

/* ---------- Moving barricade dots along both outer road edges ---------- */
/*
 * Each side gets 6 evenly-spaced dots that travel from the trapezoid top
 * corner down to the bottom corner (along the actual leg of the trapezoid),
 * growing in size to sell the perspective.
 */
function Barricades() {
  const N = 7;
  const dur = 2.6; // s per full traversal
  const sides = [
    // left leg: (470, 0) → (-50, 1000)
    { xFrom: 470, yFrom: 0, xTo: -50, yTo: 1000 },
    // right leg: (530, 0) → (1050, 1000)
    { xFrom: 530, yFrom: 0, xTo: 1050, yTo: 1000 },
  ];
  return (
    <g>
      {sides.map((s, si) =>
        Array.from({ length: N }).map((_, i) => {
          const delay = -(i * dur) / N;
          return (
            <circle
              key={`${si}-${i}`}
              cx={s.xFrom}
              cy={s.yFrom}
              r={3}
              fill="rgba(255,170,60,0.95)"
              style={{ filter: "drop-shadow(0 0 6px rgba(255,150,50,0.9))" }}
            >
              <animate
                attributeName="cx"
                from={s.xFrom}
                to={s.xTo}
                dur={`${dur}s`}
                begin={`${delay}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="cy"
                from={s.yFrom}
                to={s.yTo}
                dur={`${dur}s`}
                begin={`${delay}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="r"
                from={2}
                to={9}
                dur={`${dur}s`}
                begin={`${delay}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0;1;1;0.15"
                keyTimes="0;0.15;0.85;1"
                dur={`${dur}s`}
                begin={`${delay}s`}
                repeatCount="indefinite"
              />
            </circle>
          );
        }),
      )}
    </g>
  );
}
