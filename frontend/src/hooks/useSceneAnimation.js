import { useEffect, useRef, useState } from "react";

/**
 * useSceneAnimation — high-frequency animation state for the ADAS scene:
 *   • leadDepth (0.18 – 0.55)   – oscillates so lead moves closer/farther
 *   • leadTtc                    – derived from leadDepth (close → small TTC)
 *   • pedDepth (0.10 – 0.85)     – linear approach then fade + reset (loop)
 *   • pedOpacity (0 – 1)         – fades near the end of the pedestrian loop
 *   • t                          – global seconds, used for lateral wobble
 *
 * Uses requestAnimationFrame for smoothness and rate-limits React state
 * updates to ~30 fps to avoid unnecessary re-renders.
 */
export function useSceneAnimation() {
  const [state, setState] = useState({
    leadDepth: 0.32,
    leadTtc: 3.0,
    pedDepth: 0.15,
    pedOpacity: 1,
    t: 0,
  });
  const lastPushRef = useRef(0);

  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = () => {
      const now = performance.now();
      const t = (now - start) / 1000;

      // Lead vehicle: sine oscillation between far (0.18) and close (0.55)
      const LEAD_PERIOD = 7.0;
      const phase = (t * (Math.PI * 2)) / LEAD_PERIOD;
      const leadDepth = 0.18 + (0.55 - 0.18) * (0.5 - 0.5 * Math.cos(phase));
      // Map depth → TTC (roughly): far ≈ 4.5 s, close ≈ 1.4 s
      const leadTtc = Math.max(1.2, 5.6 - leadDepth * 8.2);

      // Pedestrian: approach cycle over 9 s, hold near the end, fade, reset
      const PED_PERIOD = 9.0;
      const c = (t % PED_PERIOD) / PED_PERIOD; // 0..1
      let pedDepth;
      let pedOpacity;
      if (c < 0.75) {
        // approach from far to near
        pedDepth = 0.1 + (c / 0.75) * (0.85 - 0.1);
        pedOpacity = 1;
      } else if (c < 0.9) {
        // hold + start fading
        pedDepth = 0.85;
        pedOpacity = 1 - (c - 0.75) / 0.15;
      } else {
        // gap before re-appearing (invisible reset)
        pedDepth = 0.1;
        pedOpacity = 0;
      }

      // Push to React state at ~30 fps
      if (now - lastPushRef.current >= 33) {
        lastPushRef.current = now;
        setState({ leadDepth, leadTtc, pedDepth, pedOpacity, t });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return state;
}
