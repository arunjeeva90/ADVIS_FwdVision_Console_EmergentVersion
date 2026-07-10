import GlassOrbGauge from "@/components/hud/GlassOrbGauge";

/**
 * RpmGauge — preserves the existing dashboard contract and position while
 * delegating the visual treatment to the reusable premium glass-orb gauge.
 */
export default function RpmGauge({ value }) {
  const rpmValue = Number.isFinite(Number(value)) ? Number(value) : 1.7;
  const warningLevel = rpmValue >= 5.2 ? "critical" : rpmValue >= 4.2 ? "caution" : "normal";

  return (
    <div
      data-testid="rpm-gauge"
      className="absolute right-16 top-1/2 -translate-y-[45%] pointer-events-none"
    >
      <GlassOrbGauge
        value={rpmValue}
        min={0}
        max={6}
        unit="x1000 rpm"
        label="RPM"
        colorMode="magenta"
        showScale
        scaleMinLabel="0"
        scaleMaxLabel="6"
        warningLevel={warningLevel}
        decimals={1}
        size={240}
        animated
        valueTestId="rpm-value"
      />
    </div>
  );
}
