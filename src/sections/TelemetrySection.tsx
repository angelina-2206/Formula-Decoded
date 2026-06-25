"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── helpers ────────────────────────────────── */
function useMockStream(
  baseValue: number,
  variance: number,
  intervalMs = 100,
  isActive = true,
) {
  const [val, setVal] = useState(baseValue);
  useEffect(() => {
    if (!isActive) {
      setVal(baseValue);
      return;
    }
    const int = setInterval(() => {
      setVal(baseValue + (Math.random() * 2 - 1) * variance);
    }, intervalMs);
    return () => clearInterval(int);
  }, [baseValue, variance, intervalMs, isActive]);
  return isActive ? val : baseValue;
}

/* ─── velocity chart ─────────────────────────── */
function DynamicVelocityStream({ isActive }: { isActive: boolean }) {
  const [points, setPoints] = useState<number[]>(Array(30).fill(10));

  useEffect(() => {
    if (!isActive) {
      setPoints(Array(30).fill(10));
      return;
    }
    const int = setInterval(() => {
      setPoints((prev) => {
        const nextVal =
          Math.random() > 0.3
            ? Math.random() * 80 + 10
            : Math.random() * 20 + 10;
        return [...prev.slice(1), nextVal];
      });
    }, 120);
    return () => clearInterval(int);
  }, [isActive]);

  const w = 1000;
  const gap = w / (points.length - 1);
  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${i * gap} ${100 - p}`)
    .join(" ");
  const fillD = `${pathD} L ${w} 100 L 0 100 Z`;

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${w} 100`}
      preserveAspectRatio="none"
      style={{ filter: "drop-shadow(0 0 6px rgba(225,6,0,0.4))" }}
    >
      <defs>
        <linearGradient id="vel-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(225,6,0,0.5)" />
          <stop offset="100%" stopColor="rgba(225,6,0,0)" />
        </linearGradient>
        <linearGradient id="vel-stroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e10600" />
          <stop offset="100%" stopColor="#ff4444" />
        </linearGradient>
      </defs>
      {/* grid lines */}
      {[25, 50, 75].map((y) => (
        <line
          key={y}
          x1="0"
          y1={y}
          x2={w}
          y2={y}
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="1"
        />
      ))}
      <path d={fillD} fill="url(#vel-fade)" />
      <path
        d={pathD}
        fill="none"
        stroke="url(#vel-stroke)"
        strokeWidth="3"
        vectorEffect="non-scaling-stroke"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ─── Rev Lights Bar ─────────────────────────── */
function RevLights({ rpm, isActive }: { rpm: number; isActive: boolean }) {
  const litCount = isActive ? Math.floor((rpm / 15000) * 15) : 0;
  return (
    <div className="pitwall-rev-lights">
      {Array.from({ length: 15 }).map((_, i) => {
        const isLit = i < litCount;
        const color =
          i < 5 ? "#00e5ff" : i < 10 ? "#e10600" : "#a855f7";
        return (
          <div
            key={i}
            className="pitwall-rev-dot"
            style={{
              background: isLit ? color : "rgba(255,255,255,0.06)",
              boxShadow: isLit
                ? `0 0 8px ${color}, 0 0 20px ${color}40`
                : "none",
              transition: "all 0.08s ease",
            }}
          />
        );
      })}
    </div>
  );
}

/* ─── data ───────────────────────────────────── */
const TRACK_DATA: Record<string, any> = {
  Monza: {
    laps: ["L42", "L43", "L44", "L45"],
    times: ["1:19.421", "1:19.220", "1:18.882", "1:19.001"],
    s1: "26.421S",
    s2: "28.109S",
    s3: "24.352S",
    s1bar: 100,
    s2bar: 85,
    s3bar: 40,
    svg: "M 60 140 C 60 100, 30 50, 60 20 C 100 20, 150 20, 170 50 C 190 90, 160 140, 100 140 Z",
    strategy: "LAP 22 EXPECTED",
    gap: "+0.000",
    interval: "LEADER",
    bestLap: "1:18.882",
    trackTemp: "42°C",
    airTemp: "28°C",
    wind: "12 KM/H NW",
  },
  Silverstone: {
    laps: ["L25", "L26", "L27", "L28"],
    times: ["1:27.421", "1:27.220", "1:26.882", "1:27.001"],
    s1: "28.421S",
    s2: "36.109S",
    s3: "22.352S",
    s1bar: 100,
    s2bar: 75,
    s3bar: 45,
    svg: "M 30 140 C 30 100, 50 60, 90 40 C 130 20, 170 60, 180 100 C 170 140, 100 160, 60 140 Z",
    strategy: "LAP 35 EXPECTED",
    gap: "+0.342",
    interval: "+0.342",
    bestLap: "1:26.882",
    trackTemp: "36°C",
    airTemp: "22°C",
    wind: "18 KM/H SW",
  },
  "Spa-Francorchamps": {
    laps: ["L12", "L13", "L14", "L15"],
    times: ["1:45.421", "1:45.220", "1:44.882", "1:45.001"],
    s1: "31.421S",
    s2: "45.109S",
    s3: "28.352S",
    s1bar: 100,
    s2bar: 65,
    s3bar: 50,
    svg: "M 40 100 L 80 40 C 100 20, 140 30, 170 60 L 150 120 C 130 160, 60 150, 40 100 Z",
    strategy: "LAP 18 EXPECTED",
    gap: "+1.204",
    interval: "+0.892",
    bestLap: "1:44.882",
    trackTemp: "30°C",
    airTemp: "18°C",
    wind: "24 KM/H N",
  },
  Suzuka: {
    laps: ["L38", "L39", "L40", "L41"],
    times: ["1:30.421", "1:30.220", "1:29.882", "1:30.001"],
    s1: "31.421S",
    s2: "41.109S",
    s3: "17.352S",
    s1bar: 100,
    s2bar: 80,
    s3bar: 35,
    svg: "M 50 120 C 30 90, 60 40, 100 30 C 150 20, 140 80, 110 90 C 70 100, 140 140, 170 130",
    strategy: "LAP 40 EXPECTED",
    gap: "+0.087",
    interval: "+0.087",
    bestLap: "1:29.882",
    trackTemp: "38°C",
    airTemp: "24°C",
    wind: "8 KM/H E",
  },
};

const TEAM_COLORS: Record<string, { primary: string; accent: string }> = {
  "Red Bull Racing": { primary: "#1e41ff", accent: "#ffea00" },
  Ferrari: { primary: "#e10600", accent: "#fff200" },
  Mercedes: { primary: "#27f4d2", accent: "#000000" },
  McLaren: { primary: "#ff8000", accent: "#47c7fc" },
};

const TIRE_WEAR_MODIFIERS: Record<string, number> = {
  "Max Verstappen": 0.8,
  "Charles Leclerc": 1.1,
  "Lewis Hamilton": 0.9,
  "Lando Norris": 1.0,
};

const WEATHER_MODIFIERS: Record<string, { wear: number; tempOffset: number }> =
  {
    Dry: { wear: 1.0, tempOffset: 0 },
    "Light Rain": { wear: 0.6, tempOffset: -15 },
    "Heavy Rain": { wear: 0.4, tempOffset: -25 },
    Mixed: { wear: 0.9, tempOffset: -5 },
  };

/* ─── SUB-COMPONENTS ─────────────────────────── */

function PanelHeader({
  title,
  tag,
  tagColor,
  live,
}: {
  title: string;
  tag?: string;
  tagColor?: string;
  live?: boolean;
}) {
  return (
    <div className="pitwall-panel-header">
      <div className="pitwall-panel-title">
        {live && (
          <span className="pitwall-live-dot" />
        )}
        <span>{title}</span>
      </div>
      {tag && (
        <span
          className="pitwall-panel-tag"
          style={{
            color: tagColor || "#888",
            borderColor: tagColor
              ? `${tagColor}40`
              : "rgba(255,255,255,0.1)",
          }}
        >
          {tag}
        </span>
      )}
    </div>
  );
}

function CircularProgress({
  progress,
  label,
  temp,
  color,
  size = 76,
}: {
  progress: number;
  label: string;
  temp: number;
  color: string;
  size?: number;
}) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;
  const tempColor =
    temp > 105 ? "#e10600" : temp > 95 ? "#ffea00" : "#00e5ff";

  return (
    <div className="pitwall-tire-gauge">
      <div
        className="pitwall-tire-ring"
        style={{ width: size, height: size }}
      >
        <svg
          width={size}
          height={size}
          style={{ transform: "rotate(-90deg)" }}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="4"
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth="4"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 4px ${color})`,
              transition: "stroke-dashoffset 0.3s ease",
            }}
          />
        </svg>
        <div className="pitwall-tire-pct">{Math.round(progress)}%</div>
      </div>
      <div className="pitwall-tire-meta">
        <span className="pitwall-tire-label">{label}</span>
        <span style={{ color: tempColor, fontWeight: 600 }}>
          {Math.round(temp)}°C
        </span>
      </div>
    </div>
  );
}

/* ─── MAIN ───────────────────────────────────── */

export default function TelemetrySection() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [config, setConfig] = useState({
    track: "Monza",
    driver: "Max Verstappen",
    team: "Red Bull Racing",
    weather: "Dry",
  });
  const [bootPhase, setBootPhase] = useState(0); // 0 = idle, 1 = booting, 2 = live
  const [clock, setClock] = useState("00:00:00");

  // Clock tick
  useEffect(() => {
    if (!isSimulating) return;
    const start = Date.now();
    const int = setInterval(() => {
      const elapsed = Date.now() - start;
      const s = Math.floor(elapsed / 1000) % 60;
      const m = Math.floor(elapsed / 60000) % 60;
      const h = Math.floor(elapsed / 3600000);
      setClock(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`,
      );
    }, 1000);
    return () => clearInterval(int);
  }, [isSimulating]);

  const handleBoot = useCallback(() => {
    setBootPhase(1);
    setTimeout(() => {
      setBootPhase(2);
      setIsSimulating(true);
    }, 1800);
  }, []);

  const handleShutdown = useCallback(() => {
    setIsSimulating(false);
    setBootPhase(0);
    setClock("00:00:00");
  }, []);

  const speed = useMockStream(isSimulating ? 328 : 0, 8, 150);
  const gear =
    speed > 300
      ? 8
      : speed > 250
        ? 7
        : speed > 200
          ? 6
          : speed > 150
            ? 5
            : speed > 100
              ? 4
              : speed > 50
                ? 3
                : speed > 20
                  ? 2
                  : 1;
  const throttle = useMockStream(isSimulating ? 85 : 0, 15, 100, isSimulating);
  const isBraking = speed < 150 && isSimulating;
  const brake = useMockStream(isBraking ? 60 : 0, 20, 100, isBraking);
  const rpm = useMockStream(isSimulating ? 11500 : 0, 400, 100, isSimulating);
  const ersStorage = useMockStream(
    isSimulating ? 68 : 100,
    1,
    1000,
    isSimulating,
  );

  const trackData = TRACK_DATA[config.track] || TRACK_DATA["Monza"];
  const driverWear = TIRE_WEAR_MODIFIERS[config.driver] || 1.0;
  const weatherEffects =
    WEATHER_MODIFIERS[config.weather] || WEATHER_MODIFIERS["Dry"];
  const teamColor =
    TEAM_COLORS[config.team] || TEAM_COLORS["Red Bull Racing"];

  const wearRate = driverWear * weatherEffects.wear;
  const baseTireTemp = 80 + weatherEffects.tempOffset;

  const flProg = useMockStream(
    isSimulating ? Math.max(0, 100 - 25 * wearRate) : 100,
    0.5,
    1000,
  );
  const frProg = useMockStream(
    isSimulating ? Math.max(0, 100 - 21 * wearRate) : 100,
    0.5,
    1000,
  );
  const rlProg = useMockStream(
    isSimulating ? Math.max(0, 100 - 32 * wearRate) : 100,
    0.5,
    1000,
  );
  const rrProg = useMockStream(
    isSimulating ? Math.max(0, 100 - 35 * wearRate) : 100,
    0.5,
    1000,
  );

  const flTemp = useMockStream(
    isSimulating ? 102 + weatherEffects.tempOffset : baseTireTemp,
    2,
    500,
  );
  const frTemp = useMockStream(
    isSimulating ? 104 + weatherEffects.tempOffset : baseTireTemp,
    2,
    500,
  );
  const rlTemp = useMockStream(
    isSimulating ? 112 + weatherEffects.tempOffset : baseTireTemp,
    2,
    500,
  );
  const rrTemp = useMockStream(
    isSimulating ? 110 + weatherEffects.tempOffset : baseTireTemp,
    2,
    500,
  );

  const sectorColors = ["#a855f7", "#00e5ff", "#e10600"];

  return (
    <section id="race-control" className="pitwall-section">
      {/* ── Ambient Glow ── */}
      <div
        className="pitwall-ambient-glow"
        style={{
          background: `radial-gradient(ellipse 60% 40% at 50% 0%, ${teamColor.primary}15, transparent)`,
        }}
      />

      <div className="container-xl" style={{ maxWidth: "1600px", position: "relative", zIndex: 1 }}>
        {/* ═══ HEADER BAR ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="pitwall-header-bar"
        >
          {/* Left: title */}
          <div>
            <div className="section-label">
              <span />
              <span>Race Control</span>
            </div>
            <h2 className="section-title" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", margin: 0 }}>
              Pit Wall <span style={{ color: teamColor.primary }}>Interface</span>
            </h2>
            <p style={{ margin: "0.5rem 0 0", color: "rgba(255,255,255,0.4)", fontSize: "0.85rem", fontFamily: "var(--font-heading)" }}>
              Live telemetry simulation • Select parameters below
            </p>
          </div>

          {/* Right: clock + status */}
          <div className="pitwall-header-right">
            <div className="pitwall-clock">
              <span className="pitwall-clock-label">SESSION</span>
              <span className="pitwall-clock-time">{clock}</span>
            </div>
            <div
              className="pitwall-status-badge"
              style={{
                borderColor: isSimulating
                  ? "#00e5ff"
                  : bootPhase === 1
                    ? "#ffea00"
                    : "rgba(255,255,255,0.15)",
                color: isSimulating
                  ? "#00e5ff"
                  : bootPhase === 1
                    ? "#ffea00"
                    : "rgba(255,255,255,0.3)",
                boxShadow: isSimulating
                  ? "0 0 15px rgba(0,229,255,0.2)"
                  : "none",
              }}
            >
              {isSimulating
                ? "● LIVE"
                : bootPhase === 1
                  ? "◌ BOOTING..."
                  : "○ STANDBY"}
            </div>
          </div>
        </motion.div>

        {/* ═══ CONFIG BAR ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="pitwall-config-bar"
        >
          <div className="pitwall-config-selectors">
            {[
              {
                label: "CIRCUIT",
                value: config.track,
                options: Object.keys(TRACK_DATA),
                key: "track",
              },
              {
                label: "TEAM",
                value: config.team,
                options: Object.keys(TEAM_COLORS),
                key: "team",
              },
              {
                label: "DRIVER",
                value: config.driver,
                options: Object.keys(TIRE_WEAR_MODIFIERS),
                key: "driver",
              },
              {
                label: "CONDITIONS",
                value: config.weather,
                options: Object.keys(WEATHER_MODIFIERS),
                key: "weather",
              },
            ].map((sel) => (
              <div key={sel.key} className="pitwall-config-group">
                <label className="pitwall-config-label">{sel.label}</label>
                <select
                  disabled={isSimulating}
                  value={sel.value}
                  onChange={(e) =>
                    setConfig({ ...config, [sel.key]: e.target.value })
                  }
                  className="pitwall-select"
                >
                  {sel.options.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <button
            onClick={isSimulating ? handleShutdown : handleBoot}
            disabled={bootPhase === 1}
            className={`pitwall-boot-btn ${isSimulating ? "pitwall-boot-btn--active" : ""}`}
            style={{
              "--team-color": teamColor.primary,
            } as React.CSSProperties}
          >
            <span className="pitwall-boot-btn-icon">
              {isSimulating ? "■" : bootPhase === 1 ? "◌" : "▶"}
            </span>
            <span>
              {isSimulating
                ? "SHUTDOWN"
                : bootPhase === 1
                  ? "BOOTING..."
                  : "BOOT SIM"}
            </span>
          </button>
        </motion.div>

        {/* ═══ BOOT ANIMATION ═══ */}
        <AnimatePresence>
          {bootPhase === 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pitwall-boot-overlay"
            >
              <div className="pitwall-boot-line" />
              <p className="pitwall-boot-text">
                INITIALIZING TELEMETRY SYSTEMS...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ DASHBOARD ═══ */}
        <AnimatePresence>
          {isSimulating && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Rev Lights */}
              <RevLights rpm={rpm} isActive={isSimulating} />

              {/* Team color stripe */}
              <div
                className="pitwall-team-stripe"
                style={{
                  background: `linear-gradient(90deg, ${teamColor.primary}, ${teamColor.primary}80, transparent)`,
                }}
              />

              {/* Main Grid */}
              <div className="pitwall-grid">
                {/* ─── LEFT COLUMN ─── */}
                <div className="pitwall-col">
                  {/* Sector Breakdown */}
                  <div className="pitwall-panel">
                    <PanelHeader
                      title="SECTOR BREAKDOWN"
                      tag="TIMING"
                      tagColor="#a855f7"
                      live
                    />

                    <div className="pitwall-sectors">
                      {[
                        {
                          name: "S1",
                          time: trackData.s1,
                          pct: trackData.s1bar,
                          badge: "PB",
                        },
                        {
                          name: "S2",
                          time: trackData.s2,
                          pct: trackData.s2bar,
                          badge: null,
                        },
                        {
                          name: "S3",
                          time: trackData.s3,
                          pct: trackData.s3bar,
                          badge: null,
                        },
                      ].map((sector, i) => (
                        <div key={sector.name} className="pitwall-sector-row">
                          <div className="pitwall-sector-info">
                            <span
                              className="pitwall-sector-name"
                              style={{ color: sectorColors[i] }}
                            >
                              {sector.name}
                            </span>
                            <span className="pitwall-sector-time">
                              {sector.time}
                              {sector.badge && (
                                <span
                                  className="pitwall-badge"
                                  style={{
                                    background: sectorColors[i],
                                    color: "#000",
                                  }}
                                >
                                  {sector.badge}
                                </span>
                              )}
                            </span>
                          </div>
                          <div className="pitwall-sector-bar-bg">
                            <motion.div
                              className="pitwall-sector-bar-fill"
                              initial={{ width: 0 }}
                              animate={{ width: `${sector.pct}%` }}
                              transition={{ duration: 1, delay: i * 0.2 }}
                              style={{ background: sectorColors[i] }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Lap History */}
                    <div className="pitwall-lap-history">
                      <div className="pitwall-lap-history-title">LAP TIMES</div>
                      {trackData.laps.map((lap: string, i: number) => {
                        const isFastest = i === 2;
                        return (
                          <div
                            key={lap}
                            className={`pitwall-lap-row ${isFastest ? "pitwall-lap-row--fastest" : ""}`}
                          >
                            <span>{lap}</span>
                            <span>{trackData.times[i]}</span>
                            {isFastest && (
                              <span className="pitwall-fastest-badge">
                                FASTEST
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* GPS + Track Map */}
                  <div className="pitwall-panel pitwall-panel--gps">
                    <PanelHeader
                      title="GPS TRACKER"
                      tag={config.track.toUpperCase()}
                      tagColor={teamColor.primary}
                    />
                    <div className="pitwall-gps-content">
                      <svg
                        width="220"
                        height="160"
                        viewBox="0 0 200 150"
                        className="pitwall-track-svg"
                      >
                        <path
                          d={trackData.svg}
                          fill="none"
                          stroke="rgba(255,255,255,0.08)"
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d={trackData.svg}
                          fill="none"
                          stroke="rgba(255,255,255,0.15)"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {isSimulating && (
                          <>
                            <motion.circle
                              r="6"
                              fill={teamColor.primary}
                              initial={{ offsetDistance: "0%" }}
                              animate={{ offsetDistance: "100%" }}
                              transition={{
                                duration: 80,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                              style={{
                                offsetPath: `path('${trackData.svg}')`,
                                filter: `drop-shadow(0 0 8px ${teamColor.primary})`,
                              }}
                            />
                          </>
                        )}
                      </svg>
                      {/* Position badge */}
                      <div className="pitwall-position">
                        <span className="pitwall-position-label">POS</span>
                        <span className="pitwall-position-number">P1</span>
                        <span className="pitwall-gap-label">GAP</span>
                        <span className="pitwall-gap-value">
                          {trackData.gap}
                        </span>
                      </div>
                    </div>

                    {/* Track conditions */}
                    <div className="pitwall-track-conditions">
                      <div className="pitwall-condition-item">
                        <span>TRACK</span>
                        <span>{trackData.trackTemp}</span>
                      </div>
                      <div className="pitwall-condition-item">
                        <span>AIR</span>
                        <span>{trackData.airTemp}</span>
                      </div>
                      <div className="pitwall-condition-item">
                        <span>WIND</span>
                        <span>{trackData.wind}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ─── CENTER COLUMN ─── */}
                <div className="pitwall-col pitwall-col--center">
                  {/* Speed + Velocity */}
                  <div className="pitwall-panel pitwall-panel--hero">
                    <div className="pitwall-speed-row">
                      <div className="pitwall-speed-block">
                        <motion.span
                          className="pitwall-speed-value"
                          key={Math.round(speed)}
                          initial={{ opacity: 0.7 }}
                          animate={{ opacity: 1 }}
                        >
                          {Math.round(speed)}
                        </motion.span>
                        <span className="pitwall-speed-unit">KM/H</span>
                      </div>
                      <div className="pitwall-gear-block">
                        <span
                          className="pitwall-gear-value"
                          style={{ color: teamColor.primary }}
                        >
                          {gear}
                        </span>
                        <span className="pitwall-gear-label">GEAR</span>
                      </div>
                    </div>

                    <PanelHeader title="VELOCITY TRACE" live />
                    <div className="pitwall-velocity-chart">
                      <DynamicVelocityStream isActive={isSimulating} />
                    </div>

                    {/* Input Bars */}
                    <div className="pitwall-inputs">
                      {[
                        {
                          label: "THROTTLE",
                          value: throttle,
                          max: 100,
                          color: "#22c55e",
                        },
                        {
                          label: "BRAKE",
                          value: brake,
                          max: 100,
                          color: "#e10600",
                        },
                        {
                          label: "RPM",
                          value: rpm,
                          max: 15000,
                          color: "#ffea00",
                        },
                      ].map((input) => (
                        <div key={input.label} className="pitwall-input-bar">
                          <div className="pitwall-input-header">
                            <span>{input.label}</span>
                            <span style={{ color: input.color }}>
                              {input.label === "RPM"
                                ? Math.round(input.value).toLocaleString()
                                : `${Math.round(Math.max(0, Math.min(100, input.value)))}%`}
                            </span>
                          </div>
                          <div className="pitwall-input-track">
                            <div
                              className="pitwall-input-fill"
                              style={{
                                width: `${Math.max(0, Math.min(100, (input.value / input.max) * 100))}%`,
                                background: `linear-gradient(90deg, ${input.color}80, ${input.color})`,
                                boxShadow: `0 0 8px ${input.color}40`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ERS Panel */}
                  <div className="pitwall-panel pitwall-panel--ers">
                    <PanelHeader
                      title="ENERGY RECOVERY"
                      tag="OVT_ACTIVE"
                      tagColor="#00e5ff"
                      live
                    />

                    <div className="pitwall-ers-bar-section">
                      <div className="pitwall-ers-bar-header">
                        <span>ERS DEPLOYMENT</span>
                        <span style={{ color: "#00e5ff", fontWeight: 700, fontSize: "1.1rem" }}>
                          {Math.round(ersStorage)}%
                        </span>
                      </div>
                      <div className="pitwall-ers-segments">
                        {[...Array(10)].map((_, i) => {
                          const threshold = (i + 1) * 10;
                          const isFilled = ersStorage >= threshold - 5;
                          return (
                            <div
                              key={i}
                              className="pitwall-ers-seg"
                              style={{
                                background: isFilled
                                  ? i < 3
                                    ? "#e10600"
                                    : i < 7
                                      ? "#00e5ff"
                                      : "#22c55e"
                                  : "rgba(255,255,255,0.04)",
                                boxShadow: isFilled
                                  ? `0 0 6px ${i < 3 ? "#e10600" : i < 7 ? "#00e5ff" : "#22c55e"}50`
                                  : "none",
                              }}
                            />
                          );
                        })}
                      </div>
                    </div>

                    <div className="pitwall-ers-stats">
                      {[
                        { label: "MGU-K", value: "HARVEST", color: "#22c55e" },
                        { label: "MGU-H", value: "DEPLOY", color: "#00e5ff" },
                        { label: "BATT", value: "92°C", color: "#fff" },
                        {
                          label: "DRS",
                          value: "OPEN",
                          color: "#000",
                          bg: teamColor.primary,
                        },
                      ].map((stat) => (
                        <div
                          key={stat.label}
                          className="pitwall-ers-stat"
                          style={{
                            background: stat.bg || "rgba(255,255,255,0.03)",
                            border: stat.bg
                              ? "none"
                              : "1px solid rgba(255,255,255,0.06)",
                          }}
                        >
                          <span className="pitwall-ers-stat-label">
                            {stat.label}
                          </span>
                          <span
                            className="pitwall-ers-stat-value"
                            style={{
                              color: stat.color,
                              textShadow:
                                stat.color !== "#000" && stat.color !== "#fff"
                                  ? `0 0 8px ${stat.color}60`
                                  : "none",
                            }}
                          >
                            {stat.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ─── RIGHT COLUMN ─── */}
                <div className="pitwall-col">
                  {/* Tire Wear */}
                  <div className="pitwall-panel pitwall-panel--tires">
                    <PanelHeader
                      title="TIRE MANAGEMENT"
                      tag={
                        config.weather.includes("Rain") ? "WET" : "SLICK"
                      }
                      tagColor={
                        config.weather.includes("Rain")
                          ? "#0066FF"
                          : "#ffea00"
                      }
                    />

                    <div className="pitwall-tire-layout">
                      {/* Car silhouette */}
                      <div className="pitwall-car-outline">
                        <svg
                          width="60"
                          height="140"
                          viewBox="0 0 60 140"
                          fill="none"
                        >
                          {/* Simplified top-down car */}
                          <path
                            d="M30 5 L42 20 L44 40 L48 50 L48 90 L44 100 L42 120 L30 135 L18 120 L16 100 L12 90 L12 50 L16 40 L18 20 Z"
                            stroke="rgba(255,255,255,0.12)"
                            strokeWidth="1.5"
                            fill="rgba(255,255,255,0.02)"
                          />
                          {/* Team color accent */}
                          <line
                            x1="30"
                            y1="20"
                            x2="30"
                            y2="120"
                            stroke={teamColor.primary}
                            strokeWidth="1"
                            opacity="0.3"
                          />
                        </svg>
                      </div>

                      {/* Tires */}
                      <div className="pitwall-tires-grid">
                        <div className="pitwall-tires-row">
                          <CircularProgress
                            progress={flProg}
                            label={
                              config.weather.includes("Rain")
                                ? "FL (W)"
                                : "FL (S)"
                            }
                            temp={flTemp}
                            color={
                              config.weather.includes("Rain")
                                ? "#0066FF"
                                : "#00e5ff"
                            }
                          />
                          <CircularProgress
                            progress={frProg}
                            label={
                              config.weather.includes("Rain")
                                ? "FR (W)"
                                : "FR (S)"
                            }
                            temp={frTemp}
                            color={
                              config.weather.includes("Rain")
                                ? "#0066FF"
                                : "#00e5ff"
                            }
                          />
                        </div>
                        <div className="pitwall-tires-row">
                          <CircularProgress
                            progress={rlProg}
                            label={
                              config.weather.includes("Rain")
                                ? "RL (W)"
                                : "RL (S)"
                            }
                            temp={rlTemp}
                            color={
                              config.weather.includes("Rain")
                                ? "#0066FF"
                                : "#ffea00"
                            }
                          />
                          <CircularProgress
                            progress={rrProg}
                            label={
                              config.weather.includes("Rain")
                                ? "RR (W)"
                                : "RR (S)"
                            }
                            temp={rrTemp}
                            color={
                              config.weather.includes("Rain")
                                ? "#0066FF"
                                : "#ffea00"
                            }
                          />
                        </div>
                      </div>
                    </div>

                    {/* Pit Strategy */}
                    <div className="pitwall-pit-strategy">
                      <div className="pitwall-pit-strategy-header">
                        <span>PIT WINDOW</span>
                        <span
                          className="pitwall-pit-strategy-value"
                          style={{ color: "#e10600" }}
                        >
                          {trackData.strategy}
                        </span>
                      </div>
                      <div className="pitwall-pit-strategy-bar">
                        <motion.div
                          className="pitwall-pit-strategy-fill"
                          initial={{ width: 0 }}
                          animate={{ width: "65%" }}
                          transition={{ duration: 2 }}
                          style={{
                            background: `linear-gradient(90deg, #22c55e, #ffea00, #e10600)`,
                          }}
                        />
                        <div
                          className="pitwall-pit-marker"
                          style={{ left: "65%" }}
                        >
                          <div className="pitwall-pit-marker-line" />
                          <span>NOW</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Race Standings mini */}
                  <div className="pitwall-panel pitwall-panel--standings">
                    <PanelHeader title="RACE STANDINGS" live />
                    <div className="pitwall-standings-list">
                      {[
                        {
                          pos: "P1",
                          name: config.driver.split(" ")[1]?.toUpperCase() || config.driver.toUpperCase(),
                          team: config.team,
                          gap: "LEADER",
                          highlight: true,
                        },
                        { pos: "P2", name: "NORRIS", team: "McLaren", gap: "+1.234" },
                        { pos: "P3", name: "LECLERC", team: "Ferrari", gap: "+2.891" },
                        { pos: "P4", name: "HAMILTON", team: "Mercedes", gap: "+4.102" },
                        { pos: "P5", name: "PIASTRI", team: "McLaren", gap: "+5.667" },
                      ].map((driver) => (
                        <div
                          key={driver.pos}
                          className={`pitwall-standing-row ${driver.highlight ? "pitwall-standing-row--highlight" : ""}`}
                          style={
                            driver.highlight
                              ? ({
                                  "--highlight-color": teamColor.primary,
                                } as React.CSSProperties)
                              : undefined
                          }
                        >
                          <span className="pitwall-standing-pos">
                            {driver.pos}
                          </span>
                          <span className="pitwall-standing-name">
                            {driver.name}
                          </span>
                          <span
                            className="pitwall-standing-gap"
                            style={{
                              color: driver.highlight ? teamColor.primary : "#666",
                            }}
                          >
                            {driver.gap}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ IDLE STATE ═══ */}
        {!isSimulating && bootPhase === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pitwall-idle"
          >
            <div className="pitwall-idle-inner">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <circle cx="40" cy="40" r="38" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                <circle cx="40" cy="40" r="28" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                <path
                  d="M40 15 L40 25 M40 55 L40 65 M15 40 L25 40 M55 40 L65 40"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="1"
                />
                <circle cx="40" cy="40" r="4" fill="rgba(225,6,0,0.3)" />
              </svg>
              <p className="pitwall-idle-text">
                TELEMETRY SYSTEMS OFFLINE
              </p>
              <p className="pitwall-idle-subtext">
                Configure parameters above and boot simulation
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
