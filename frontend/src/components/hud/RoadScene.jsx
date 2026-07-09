/**
 * RoadScene - the immersive ADAS scene:
 *  - Clean night highway landscape backdrop (no pre-drawn lanes)
 *  - Perspective road overlay with animated dashed lane markers + cyan guidance path
 *  - Ego vehicle at bottom center
 *  - Detected objects with colored bounding boxes and labels
 *
 * Landscape image reference points (measured from landscape_v2.png):
 *   Vanishing point:            screen (50%, ~45%)
 *   Road surface at bottom:     spans full screen width
 *   Streetlights (bottom pair): near x ≈ 22% and x ≈ 78%
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
        {/* soft blue tint + top vignette so HUD text stays readable */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 25%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.35) 100%)",
          }}
        />
      </div>

      {/* Perspective road overlay (dashed lanes + cyan guidance path) */}
      <RoadFloor />

      {/* --------- Detected objects (positioned in vanishing perspective) --------- */}

      {/* Bus - right lane, far */}
      <SceneObject
        src="/vehicles/vehicles/bus/bus_right_lane.png"
        left="66%"
        top="52%"
        width="7%"
        boxColor="#ff9a3d"
        label="Bus"
        aspect={1.5}
      />

      {/* Auto-rickshaw - right lane, mid distance */}
      <SceneObject
        src="/vehicles/vehicles/autorickshaw/autorickshaw_right_lane.png"
        left="73%"
        top="57%"
        width="4.6%"
        boxColor="#ff9a3d"
        label="Auto"
        aspect={1}
      />

      {/* Pedestrian - right side, standing */}
      <SceneObject
        src="/vehicles/vehicles/pedestrian/pedestrian_standing_right.png"
        left="81%"
        top="58%"
        width="2.4%"
        boxColor="#ff9a3d"
        label="Pedestrian"
        aspect={2.6}
      />

      {/* Blue car left lane */}
      <SceneObject
        src="/vehicles/vehicles/car/car_left_lane.png"
        left="33%"
        top="57%"
        width="5.4%"
        boxColor="#4aa8ff"
        label="Car"
        aspect={1}
      />

      {/* 2-wheeler on left */}
      <SceneObject
        src="/vehicles/vehicles/2W_rider/2W_rider_left_lane.png"
        left="22%"
        top="60%"
        width="4%"
        boxColor="#ff9a3d"
        label="2-Wheeler"
        aspect={1.5}
      />

      {/* Lead vehicle - red bounding box + "24 m" label */}
      <SceneObject
        src="/vehicles/vehicles/same_lane_vehicle/samelane_vehicle_red.png"
        left="50%"
        top="54%"
        width="5.4%"
        boxColor="#ff4b5c"
        label={`${hud.leadDist} m`}
        labelStrong
        prominent
        aspect={1.5}
      />

      {/* --------- Ego vehicle (bottom center) --------- */}
      <div
        data-testid="ego-vehicle"
        className="absolute left-1/2 -translate-x-1/2"
        style={{ bottom: "9%", width: "13%" }}
      >
        <img
          src="/vehicles/vehicles/ego_vehicle/ego_vehicle.png"
          alt="Ego vehicle"
          className="w-full h-auto block"
          style={{
            filter:
              "drop-shadow(0 20px 40px rgba(0,0,0,0.85)) drop-shadow(0 0 24px rgba(30,80,160,0.4))",
          }}
        />
      </div>
    </div>
  );
}

/* ---------------- Road floor with perspective ----------------
 * SVG anchored to landscape_v2's vanishing point (screen 50%, ~45%).
 * viewBox 0..1000 x 0..1000 mapped onto the region screen y=45% → 100%.
 *   VP:                (500, 0)
 *   Screen bottom:     y=1000
 *   Road-edge rays extend from VP through the streetlight bases and beyond,
 *   giving continuous perspective from horizon to foreground.
 */
function RoadFloor() {
  return (
    <div aria-hidden className="absolute inset-x-0 top-[45%] bottom-0">
      <svg
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full overflow-visible"
      >
        <defs>
          <linearGradient id="pathGrad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="rgba(0,220,255,0.9)" />
            <stop offset="60%" stopColor="rgba(0,180,255,0.45)" />
            <stop offset="100%" stopColor="rgba(0,150,255,0)" />
          </linearGradient>
          <linearGradient id="laneEdge" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="rgba(220,240,255,0.55)" />
            <stop offset="70%" stopColor="rgba(220,240,255,0.06)" />
            <stop offset="100%" stopColor="rgba(220,240,255,0)" />
          </linearGradient>
          <clipPath id="roadClip">
            <rect x="0" y="0" width="1000" height="1000" />
          </clipPath>
        </defs>

        <g clipPath="url(#roadClip)">
          {/* Outer lane edges — from just inside the streetlight rails */}
          <path
            d="M 60 1000 L 500 0"
            stroke="url(#laneEdge)"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M 940 1000 L 500 0"
            stroke="url(#laneEdge)"
            strokeWidth="2"
            fill="none"
          />

          {/* Inner dashed dividers (4-lane setup) */}
          <DashedLine x1={260} y1={1000} x2={500} y2={0} />
          <DashedLine x1={740} y1={1000} x2={500} y2={0} />

          {/* Ego-lane dividers (immediate lane the ego is in) */}
          <DashedLine x1={370} y1={1000} x2={500} y2={0} short />
          <DashedLine x1={630} y1={1000} x2={500} y2={0} short />

          {/* Cyan guidance path (ego lane), pulsing */}
          <g className="path-pulse">
            <polygon
              points="380,1000 620,1000 505,35 495,35"
              fill="url(#pathGrad)"
              opacity="0.85"
            />
            <polygon
              points="430,1000 570,1000 503,65 497,65"
              fill="rgba(160,250,255,0.55)"
            />
            <MovingPathDashes />
          </g>
        </g>
      </svg>
    </div>
  );
}

/**
 * DashedLine — a dashed lane divider whose dashes appear to move toward the
 * viewer. `short` variant is thinner/dimmer for interior ego-lane lines.
 */
function DashedLine({ x1, y1, x2, y2, short = false }) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={short ? "rgba(210,230,255,0.55)" : "rgba(230,240,255,0.85)"}
      strokeWidth={short ? 1.6 : 2.2}
      strokeDasharray={short ? "22 30" : "34 40"}
      style={{
        filter: `drop-shadow(0 0 3px rgba(200,220,255,${short ? 0.4 : 0.6}))`,
      }}
    >
      <animate
        attributeName="stroke-dashoffset"
        from="0"
        to={short ? "-52" : "-74"}
        dur={short ? "0.5s" : "0.55s"}
        repeatCount="indefinite"
      />
    </line>
  );
}

/**
 * MovingPathDashes — bright cyan segments flowing along the ego lane.
 * Trajectory follows the same perspective rays as the lane so they stay
 * glued to the road surface.
 */
function MovingPathDashes() {
  const bars = Array.from({ length: 6 }).map((_, i) => i);
  const dur = 1.8;
  return (
    <>
      {bars.map((i) => {
        const delay = -(i * dur) / bars.length;
        return (
          <rect
            key={i}
            fill="rgba(180,250,255,0.95)"
            rx="1.5"
            style={{ filter: "drop-shadow(0 0 6px rgba(120,240,255,0.95))" }}
          >
            <animate
              attributeName="y"
              from={60}
              to={1000}
              dur={`${dur}s`}
              begin={`${delay}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="width"
              from={8}
              to={160}
              dur={`${dur}s`}
              begin={`${delay}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="x"
              from={496}
              to={420}
              dur={`${dur}s`}
              begin={`${delay}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="height"
              from={4}
              to={26}
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
          </rect>
        );
      })}
    </>
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
