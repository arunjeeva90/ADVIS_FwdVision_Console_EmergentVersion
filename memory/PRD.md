# ADAS HUD Cockpit — PRD

## Original Problem Statement
Design a futuristic automotive ADAS digital cockpit / HUD console screen matching an uploaded reference image (16:9 ultra-wide, dark night-driving theme, glass/neon). Use the vehicle images from vehicles.zip. Full spec in original prompt.

## User Choices
- Interactivity: Subtle animations (pulsing glows, moving lane markers, ticking speed)
- Assets: Use uploaded vehicle images from vehicles.zip
- Deployment target: Web app (16:9)

## Architecture
- Pure frontend React app (no backend needed)
- Single route "/" renders <Cockpit/>
- Modular components under `/app/frontend/src/components/hud/`
- Live values driven by `useHudState` hook (setInterval-based simulator)
- Vehicle PNGs preprocessed to remove white backgrounds (Python PIL) and served from `/vehicles/...`

## Personas
- Automotive designers / product managers exploring ADAS HUD concepts
- Prospective EV buyers / demo audiences seeing what a modern digital cluster looks like

## Phase 1 (DELIVERED 2026-02)
1. Full 16:9 ADAS HUD layout — TopBar (battery, nav, gear, temp, time, speed limit), center Speed HUD with arc + ticks, orb gauges (Power / RPM), Bottom metrics (5 sections), Diagnostics card, Bottom bar (fuel + temp + headlight AUTO)
2. Immersive road scene — landscape backdrop, perspective road, cyan pulsing guidance path, moving dashed lane markers, ego vehicle at bottom
3. ADAS perception — detected objects (lead 24m red, car blue, bus/auto/pedestrian/2-wheeler orange) with pulsing bounding boxes + labels
4. Live animations — ticking speed/RPM/power/TTC/leadDist, moving path dashes, pulsing bboxes, glow effects

## Phase 2 — Backlog
- P0: Scenario switcher (urban / highway / rain / fog day-modes)
- P0: Interactive ADAS toggles (ACC/LKA/AEB on-off with visual state)
- P1: Backend telemetry endpoint powering a real-time simulator (WebSocket)
- P1: Audio cues (indicator, AEB warning beep, chime for lane departure)
- P2: Route replay / scenario editor
- P2: Multi-language display + unit toggle (km/h ↔ mph)
- P2: Configuration panel (choose vehicle model, theme accent color)

## Files of Interest
- `/app/frontend/src/pages/Cockpit.jsx` — main layout composition
- `/app/frontend/src/components/hud/*.jsx` — RoadScene, TopBar, SpeedHUD, PowerGauge, RpmGauge, BottomMetrics, Diagnostics, BottomBar
- `/app/frontend/src/hooks/useHudState.js` — value simulator
- `/app/frontend/src/index.css` — glass, glow, animation utilities
- `/app/frontend/public/vehicles/vehicles/` — vehicle PNG assets
