import GlassOrbGauge from "@/components/hud/GlassOrbGauge";

/**
 * PowerGauge — preserves the existing dashboard contract and position while
 * delegating the visual treatment to the reusable premium glass-orb gauge.
 */
export default function PowerGauge({ value }) {
  return (
    <div
      data-testid="power-gauge"
      className="absolute left-16 top-1/2 -translate-y-[45%] pointer-events-none"
    >
      <GlassOrbGauge
        value={Number.isFinite(Number(value)) ? Number(value) : 28}
        min={0}
        max={60}
        unit="kW"
        label="Power"
        leftLabel="CHARGE"
        rightLabel="POWER"
        colorMode="cyan"
        warningLevel="normal"
        decimals={0}
        size={240}
        animated
        valueTestId="power-value"
      />
    </div>
  );
}
