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

/* ---------------- Road floor with perspective ---------------- */
function RoadFloor() {
  return (
    <div aria-hidden className="absolute inset-x-0 top-[52%] bottom-0">
      <svg
        viewBox="0 0 1000 500"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          <linearGradient id="pathGrad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="rgba(0,220,255,0.8)" />
            <stop offset="60%" stopColor="rgba(0,180,255,0.45)" />
            <stop offset="100%" stopColor="rgba(0,150,255,0.02)" />
          </linearGradient>
          <linearGradient id="laneEdge" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="rgba(220,240,255,0.6)" />
            <stop offset="100%" stopColor="rgba(220,240,255,0.02)" />
          </linearGradient>
        </defs>

        {/* Outer lane edges - fade as they approach horizon */}
        <path d="M 60 500 L 465 40" stroke="url(#laneEdge)" strokeWidth="1.6" fill="none" />
        <path d="M 940 500 L 535 40" stroke="url(#laneEdge)" strokeWidth="1.6" fill="none" />

        {/* Inner dashed dividers */}
        <DashedLine x1={340} y1={500} x2={485} y2={40} />
        <DashedLine x1={660} y1={500} x2={515} y2={40} />

        {/* Cyan guidance path (trapezoid), pulsing */}
        <g className="path-pulse">
          <polygon
            points="430,500 570,500 508,60 492,60"
            fill="url(#pathGrad)"
            opacity="0.7"
          />
          <polygon
            points="465,500 535,500 504,90 496,90"
            fill="rgba(160,250,255,0.55)"
          />
          <MovingPathDashes />
        </g>
      </svg>
    </div>
  );
}

function DashedLine({ x1, y1, x2, y2 }) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke="rgba(230,240,255,0.75)"
      strokeWidth="2"
      strokeDasharray="20 22"
      style={{ filter: "drop-shadow(0 0 3px rgba(200,220,255,0.6))" }}
    >
      <animate
        attributeName="stroke-dashoffset"
        from="0"
        to="-42"
        dur="0.55s"
        repeatCount="indefinite"
      />
    </line>
  );
}

function MovingPathDashes() {
  const bars = Array.from({ length: 6 }).map((_, i) => i);
  return (
    <>
      {bars.map((i) => (
        <rect
          key={i}
          x={490}
          width={20}
          height={7}
          fill="rgba(180,250,255,0.9)"
          rx="1"
          style={{ filter: "drop-shadow(0 0 4px rgba(120,240,255,0.9))" }}
        >
          <animate
            attributeName="y"
            from={80 + i * 70}
            to={80 + i * 70 + 420}
            dur="1.6s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="width"
            from={10}
            to={50}
            dur="1.6s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="x"
            from={495}
            to={475}
            dur="1.6s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            from="0.15"
            to="1"
            dur="1.6s"
            repeatCount="indefinite"
          />
        </rect>
      ))}
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
