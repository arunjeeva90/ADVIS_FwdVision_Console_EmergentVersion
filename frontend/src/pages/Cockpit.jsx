import RoadScene from "@/components/hud/RoadScene";
import TopBar from "@/components/hud/TopBar";
import SpeedHUD from "@/components/hud/SpeedHUD";
import PowerGauge from "@/components/hud/PowerGauge";
import RpmGauge from "@/components/hud/RpmGauge";
import BottomMetrics from "@/components/hud/BottomMetrics";
import Diagnostics from "@/components/hud/Diagnostics";
import BottomBar from "@/components/hud/BottomBar";
import { useHudState } from "@/hooks/useHudState";

export default function Cockpit() {
  const hud = useHudState();

  return (
    <div
      data-testid="cockpit-root"
      className="relative w-screen h-screen bg-black text-slate-100 overflow-hidden select-none"
    >
      {/* ambient blue radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 55%, rgba(20,50,110,0.28) 0%, rgba(2,4,10,0.9) 55%, #000 90%)",
        }}
      />

      {/* Layer 1-4: Road / scene / ego / detections */}
      <RoadScene hud={hud} />

      {/* Layer 5: Center speed HUD */}
      <SpeedHUD hud={hud} />

      {/* Layer 6: gauges */}
      <PowerGauge value={hud.power} />
      <RpmGauge value={hud.rpm} />

      {/* Layer 7: bottom telemetry */}
      <BottomMetrics hud={hud} />
      <Diagnostics hud={hud} />

      {/* Layer 8: top bars & bottom bar */}
      <TopBar hud={hud} />
      <BottomBar />

      {/* subtle grain overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />

      {/* vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          boxShadow: "inset 0 0 220px 40px rgba(0,0,0,0.9)",
        }}
      />
    </div>
  );
}
