/**
 * RoadScene - ADAS perception scene refined to match the locked reference:
 *   - Wide FOV (road edges spread near screen corners at bottom)
 *   - Vanishing point at screen (50%, 42%)
 *   - 3 driving lanes, ego dead-centre in the middle lane
 *   - Vehicles scaled to lane depth (bus > car > auto > 2W > pedestrian)
 *   - Dashed lane dividers animate top→bottom (toward the viewer)
 *   - High-quality pulsing cyan guidance path with white core & chevron tip
 */
export default function RoadScene({ hud }) {
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
              "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 22%, rgba(0,0,0,0) 42%, rgba(0,0,0,0.35) 100%)",
          }}
        />
      </div>

      {/* Perspective road overlay (lanes + guidance) */}
      <RoadFloor />

      {/* --------- Detected objects (scaled with lane depth) --------- */}

      {/* Lead vehicle (red bbox) — ego lane, near horizon (small) */}
      <SceneObject
        src="/vehicles/vehicles/same_lane_vehicle/samelane_vehicle_red.png"
        left="50%"
        top="49%"
        width="4.4%"
        boxColor="#ff4b5c"
        label={`${hud.leadDist} m`}
        labelStrong
        prominent
        aspect={1.5}
      />

      {/* Blue car — left lane, mid-distance */}
      <SceneObject
        src="/vehicles/vehicles/car/car_left_lane.png"
        left="35.5%"
        top="57%"
        width="6.4%"
        boxColor="#4aa8ff"
        label="Car"
        aspect={1}
      />

      {/* 2-wheeler — far left, further away */}
      <SceneObject
        src="/vehicles/vehicles/2W_rider/2W_rider_left_lane.png"
        left="24%"
        top="60%"
        width="4.2%"
        boxColor="#ff9a3d"
        label="2-Wheeler"
        aspect={1.5}
      />

      {/* Bus — right lane, mid-distance, larger physical size */}
      <SceneObject
        src="/vehicles/vehicles/bus/bus_right_lane.png"
        left="63%"
        top="53%"
        width="7.8%"
        boxColor="#ff9a3d"
        label="Bus"
        aspect={1.35}
      />

      {/* Auto-rickshaw — right, further from ego */}
      <SceneObject
        src="/vehicles/vehicles/autorickshaw/autorickshaw_right_lane.png"
        left="73%"
        top="58%"
        width="5%"
        boxColor="#ff9a3d"
        label="Auto"
        aspect={1}
      />

      {/* Pedestrian — right shoulder */}
      <SceneObject
        src="/vehicles/vehicles/pedestrian/pedestrian_standing_right.png"
        left="82%"
        top="60%"
        width="2.6%"
        boxColor="#ff9a3d"
        label="Pedestrian"
        aspect={2.6}
      />

      {/* --------- Ego vehicle (bottom centre) --------- */}
      <div
        data-testid="ego-vehicle"
        className="absolute left-1/2 -translate-x-1/2"
        style={{ bottom: "7%", width: "15%" }}
      >
        <img
          src="/vehicles/vehicles/ego_vehicle/ego_vehicle.png"
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
 * SVG viewBox 0..1000 x 0..1000 mapped onto screen region y=42% → 100%.
 *   Vanishing point:   (500, 0)
 *   At y=1000 (screen bottom):
 *     outer-left edge:      x = -50
 *     ego-lane left edge:   x = 300
 *     ego-lane right edge:  x = 700
 *     outer-right edge:     x = 1050
 */
function RoadFloor() {
  return (
    <div aria-hidden className="absolute inset-x-0 top-[42%] bottom-0">
      <svg
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full overflow-visible"
      >
        <defs>
          {/* Vertical gradient for the guidance path — cyan bottom → transparent top */}
          <linearGradient id="pathBody" x1="0.5" y1="1" x2="0.5" y2="0">
            <stop offset="0%" stopColor="rgba(0,220,255,0.85)" />
            <stop offset="45%" stopColor="rgba(0,190,255,0.55)" />
            <stop offset="80%" stopColor="rgba(80,210,255,0.22)" />
            <stop offset="100%" stopColor="rgba(120,240,255,0)" />
          </linearGradient>

          {/* Bright white core */}
          <linearGradient id="pathCore" x1="0.5" y1="1" x2="0.5" y2="0">
            <stop offset="0%" stopColor="rgba(230,255,255,0.9)" />
            <stop offset="50%" stopColor="rgba(180,240,255,0.55)" />
            <stop offset="100%" stopColor="rgba(180,240,255,0)" />
          </linearGradient>

          {/* Lane-edge fade */}
          <linearGradient id="laneEdge" x1="0.5" y1="1" x2="0.5" y2="0">
            <stop offset="0%" stopColor="rgba(220,240,255,0.55)" />
            <stop offset="70%" stopColor="rgba(220,240,255,0.06)" />
            <stop offset="100%" stopColor="rgba(220,240,255,0)" />
          </linearGradient>

          {/* Soft cyan glow filter for the guidance path */}
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
          {/* Outer road edges (solid, fading toward horizon) */}
          <path
            d="M -50 1000 L 500 0"
            stroke="url(#laneEdge)"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M 1050 1000 L 500 0"
            stroke="url(#laneEdge)"
            strokeWidth="2"
            fill="none"
          />

          {/* Ego-lane inner dashed dividers */}
          <DashedLine x1={300} y1={1000} x2={500} y2={0} bright />
          <DashedLine x1={700} y1={1000} x2={500} y2={0} bright />

          {/* Adjacent-lane dashed dividers (dimmer, between edge and ego lane) */}
          <DashedLine x1={140} y1={1000} x2={500} y2={0} />
          <DashedLine x1={860} y1={1000} x2={500} y2={0} />

          {/* ------------- Cyan pulsing guidance path ------------- */}
          <g className="guidance-pulse">
            {/* soft outer glow layer */}
            <polygon
              points="300,1000 700,1000 508,45 492,45"
              fill="url(#pathBody)"
              opacity="0.35"
              filter="url(#cyanGlow)"
            />
            {/* main body */}
            <polygon
              points="330,1000 670,1000 506,55 494,55"
              fill="url(#pathBody)"
              opacity="0.95"
            />
            {/* inner bright layer */}
            <polygon
              points="380,1000 620,1000 504,70 496,70"
              fill="rgba(150,240,255,0.55)"
            />
            {/* white core */}
            <polygon
              points="430,1000 570,1000 502,90 498,90"
              fill="url(#pathCore)"
              opacity="0.85"
            />

            {/* chevron marker at the tip (small bright bar just below VP) */}
            <path
              d="M 476 46 L 500 32 L 524 46 L 520 52 L 500 42 L 480 52 Z"
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
 * Positive stroke-dashoffset shifts the dash pattern in the direction of
 * (x1,y1) which is the BOTTOM anchor, producing the illusion of forward
 * motion.
 */
function DashedLine({ x1, y1, x2, y2, bright = false }) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={
        bright ? "rgba(235,245,255,0.9)" : "rgba(210,225,250,0.5)"
      }
      strokeWidth={bright ? 2.4 : 1.8}
      strokeDasharray={bright ? "38 42" : "26 34"}
      style={{
        filter: `drop-shadow(0 0 4px rgba(180,210,255,${bright ? 0.75 : 0.4}))`,
      }}
    >
      <animate
        attributeName="stroke-dashoffset"
        from="0"
        to={bright ? "80" : "60"}
        dur={bright ? "0.6s" : "0.55s"}
        repeatCount="indefinite"
      />
    </line>
  );
}

/* ---------------- Object w/ bbox + label ---------------- */
function SceneObject({
  src,
  left,
  top,
  width,
  boxColor,
  label,
  labelStrong,
  prominent,
  aspect = 1,
}) {
  return (
    <div
      className="absolute"
      style={{
        left,
        top,
        width,
        transform: "translate(-50%, -50%)",
      }}
    >
      <div className="relative" style={{ aspectRatio: `1 / ${aspect}` }}>
        <img
          src={src}
          alt=""
          className="w-full h-full object-contain block"
          style={{ filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.6))" }}
        />
        <div
          className="absolute inset-0 bbox bbox-corners"
          style={{
            color: boxColor,
            border: `1.4px solid ${boxColor}`,
            boxShadow: `0 0 ${prominent ? 20 : 10}px ${boxColor}`,
            borderRadius: 2,
          }}
        >
          <i />
        </div>
        {label && (
          <div
            className="absolute left-1/2 -translate-x-1/2 -top-5 px-1.5 py-[1px] rounded-sm text-[10px] font-hud tracking-wide whitespace-nowrap"
            style={{
              background: labelStrong ? boxColor : "rgba(6,10,18,0.85)",
              color: labelStrong ? "#0a0a0f" : boxColor,
              border: `1px solid ${boxColor}`,
              boxShadow: `0 0 8px ${boxColor}`,
              fontWeight: 600,
            }}
          >
            {label}
          </div>
        )}
      </div>
    </div>
  );
}
