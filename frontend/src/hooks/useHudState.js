import { useEffect, useState } from "react";

// Tiny simulator that ticks HUD values with subtle realism.
export function useHudState() {
  const [speed, setSpeed] = useState(102);
  const [rpm, setRpm] = useState(1.7);
  const [power, setPower] = useState(28);
  const [ttc, setTtc] = useState(2.8);
  const [leadDist, setLeadDist] = useState(24);
  const [fps, setFps] = useState(30);
  const [latency, setLatency] = useState(68);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => {
      // small realistic drift
      setSpeed((s) => clamp(s + rand(-1, 1), 96, 108));
      setRpm((r) => clamp(+(r + rand(-0.05, 0.05)).toFixed(1), 1.4, 2.1));
      setPower((p) => clamp(Math.round(p + rand(-2, 2)), 18, 42));
      setTtc((t) => +(clamp(t + rand(-0.1, 0.1), 2.2, 3.6)).toFixed(1));
      setLeadDist((d) => clamp(Math.round(d + rand(-1, 1)), 20, 30));
      setFps(() => Math.round(29 + Math.random() * 2));
      setLatency(() => Math.round(60 + Math.random() * 18));
      setNow(new Date());
    }, 900);
    return () => clearInterval(id);
  }, []);

  return { speed, rpm, power, ttc, leadDist, fps, latency, now };
}

function rand(a, b) {
  return a + Math.random() * (b - a);
}
function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}
