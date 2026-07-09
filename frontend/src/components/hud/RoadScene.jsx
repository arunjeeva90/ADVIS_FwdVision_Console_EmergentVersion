/**
 * RoadScene - the immersive ADAS scene:
 *  - Night highway landscape background
 *  - Perspective road with animated dashed lane markers + cyan guidance path
 *  - Ego vehicle at bottom center
 *  - Detected objects with colored bounding boxes and labels
 */
export default function RoadScene({ hud }) {
  return (
    <div
      data-testid="road-scene"
      className="absolute inset-0 overflow-hidden pointer-events-none"
    >
      {/* Landscape background (mountains + city lights) */}
      <div
        aria-hidden
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          top: "18%",
          width: "86%",
          height: "62%",
        }}
      >
        <img
          src="/vehicles/vehicles/landscape.png"
          alt=""
          className="w-full h-full object-cover opacity-95"
          style={{
            maskImage:
              "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,1) 25%, rgba(0,0,0,0) 82%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,1) 25%, rgba(0,0,0,0) 82%)",
          }}
        />
      </div>

      {/* Perspective road overlay (dashed lanes + cyan guidance path) */}
      <RoadFloor />

      {/* --------- Detected objects (positioned in vanishing perspective) --------- */}

      {/* Bus - right lane, far */}
      <SceneObject
        src="/vehicles/vehicles/bus/bus_right_lane.png"
        left="65%"
        top="55%"
        width="7%"
        boxColor="#ff9a3d"
        label="Bus"
        aspect={1.5}
      />

      {/* Auto-rickshaw - right lane, mid distance */}
      <SceneObject
        src="/vehicles/vehicles/autorickshaw/autorickshaw_right_lane.png"
        left="72%"
        top="60%"
        width="4.6%"
        boxColor="#ff9a3d"
        label="Auto"
        aspect={1}
      />

      {/* Pedestrian - right side, standing */}
      <SceneObject
        src="/vehicles/vehicles/pedestrian/pedestrian_standing_right.png"
        left="80%"
        top="61%"
        width="2.4%"
        boxColor="#ff9a3d"
        label="Pedestrian"
        aspect={2.6}
      />

      {/* Blue car left lane */}
      <SceneObject
        src="/vehicles/vehicles/car/car_left_lane.png"
        left="34%"
        top="60%"
        width="5.4%"
        boxColor="#4aa8ff"
        label="Car"
        aspect={1}
      />

      {/* 2-wheeler on left */}
      <SceneObject
        src="/vehicles/vehicles/2W_rider/2W_rider_left_lane.png"
        left="23%"
        top="63%"
        width="4%"
        boxColor="#ff9a3d"
        label="2-Wheeler"
        aspect={1.5}
      />

      {/* Lead vehicle - red bounding box + "24 m" label */}
      <SceneObject
        src="/vehicles/vehicles/same_lane_vehicle/samelane_vehicle_red.png"
        left="50%"
        top="57%"
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
              "drop-shadow(0 20px 40px rgba(0,0,0,0.8)) drop-shadow(0 0 20px rgba(30,80,160,0.4))",
          }}
        />
      </div>
    </div>
  );
}

/* ---------------- Road floor with perspective ----------------
 * SVG is aligned to the road baked into the landscape image:
 *   Vanishing point (screen): x=50%, y≈53.9%  → SVG (500, 0)
 *   Screen y=80% (landscape image bottom)     → SVG y ≈ 566
 *   Screen y=100% (screen bottom)             → SVG y = 1000
 *
 *   At screen y=80% the road-edges/lane-dividers of the landscape sit at
 *   ~12.4%, 39.4%, 60.6%, 87.6% of screen width → SVG x 124/394/606/876
 *   Extending those same rays past y=566 to y=1000 keeps the perspective
 *   perfectly consistent with the background image.
 */
function RoadFloor() {
  return (
    <div aria-hidden className="absolute inset-x-0 top-[53.9%] bottom-0">
      <svg
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full overflow-visible"
      >
        <defs>
          <linearGradient id="pathGrad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="rgba(0,220,255,0.85)" />
            <stop offset="60%" stopColor="rgba(0,180,255,0.4)" />
            <stop offset="100%" stopColor="rgba(0,150,255,0)" />
          </linearGradient>
          <linearGradient id="laneEdge" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="rgba(220,240,255,0.55)" />
            <stop offset="70%" stopColor="rgba(220,240,255,0.08)" />
            <stop offset="100%" stopColor="rgba(220,240,255,0)" />
          </linearGradient>
          {/* clip to viewport so far-extended lines don't paint outside */}
          <clipPath id="roadClip">
            <rect x="0" y="0" width="1000" height="1000" />
          </clipPath>
        </defs>

        <g clipPath="url(#roadClip)">
          {/* Outer road edges — begin at landscape bottom, extend beyond */}
          <path d="M -164 1000 L 500 0" stroke="url(#laneEdge)" strokeWidth="2" fill="none" />
          <path d="M 1164 1000 L 500 0" stroke="url(#laneEdge)" strokeWidth="2" fill="none" />

          {/* Inner dashed dividers (aligned to background lane markings) */}
          <DashedLine x1={313} y1={1000} x2={500} y2={0} />
          <DashedLine x1={687} y1={1000} x2={500} y2={0} />

          {/* Cyan guidance path (ego lane), pulsing */}
          <g className="path-pulse">
            <polygon
              points="380,1000 620,1000 505,40 495,40"
              fill="url(#pathGrad)"
              opacity="0.85"
            />
            <polygon
              points="430,1000 570,1000 503,70 497,70"
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
 * viewer, matching the road perspective. We express the dash pattern in the
 * segment's own local coordinate so speed feels natural.
 */
function DashedLine({ x1, y1, x2, y2 }) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke="rgba(230,240,255,0.85)"
      strokeWidth="2.2"
      strokeDasharray="34 40"
      pathLength="1000"
      style={{ filter: "drop-shadow(0 0 3px rgba(200,220,255,0.6))" }}
    >
      {/* Dash offset animates negatively so dashes flow TOWARD the viewer */}
      <animate
        attributeName="stroke-dashoffset"
        from="0"
        to="-74"
        dur="0.55s"
        repeatCount="indefinite"
      />
    </line>
  );
}

/**
 * MovingPathDashes — bright cyan segments flowing along the ego lane guidance
 * path. Their trajectory follows the exact same perspective rays that define
 * the lane so they stay glued to the background lanes.
 *
 * Trajectory: from VP (500, 40) at width≈4 → widens & moves to (500±≈120, 1000).
 */
function MovingPathDashes() {
  const bars = Array.from({ length: 5 }).map((_, i) => i);
  const dur = 1.7; // seconds per bar to traverse the path
  return (
    <>
      {bars.map((i) => {
        const delay = -(i * dur) / bars.length;
        return (
          <rect
            key={i}
            fill="rgba(180,250,255,0.95)"
            rx="1.5"
            style={{ filter: "drop-shadow(0 0 6px rgba(120,240,255,0.9))" }}
          >
            {/* Move from just below VP to bottom, following perspective */}
            <animate
              attributeName="y"
              from={80}
              to={1000}
              dur={`${dur}s`}
              begin={`${delay}s`}
              repeatCount="indefinite"
            />
            {/* Widen with perspective: 8 → 140 */}
            <animate
              attributeName="width"
              from={8}
              to={140}
              dur={`${dur}s`}
              begin={`${delay}s`}
              repeatCount="indefinite"
            />
            {/* Keep segment centered on lane center (x = 500 - width/2) */}
            <animate
              attributeName="x"
              from={496}
              to={430}
              dur={`${dur}s`}
              begin={`${delay}s`}
              repeatCount="indefinite"
            />
            {/* Height grows with perspective too */}
            <animate
              attributeName="height"
              from={4}
              to={22}
              dur={`${dur}s`}
              begin={`${delay}s`}
              repeatCount="indefinite"
            />
            {/* Fade in near VP, fade near bottom */}
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
      <div
        className="relative"
        style={{ aspectRatio: `1 / ${aspect}` }}
      >
        <img
          src={src}
          alt=""
          className="w-full h-full object-contain block"
          style={{
            filter:
              "drop-shadow(0 6px 10px rgba(0,0,0,0.6))",
          }}
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
