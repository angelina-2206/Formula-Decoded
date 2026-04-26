"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Helper for generating mock animated values for the simulation stream
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

// Generates a jagged, moving stream for the Velocity chart
function DynamicVelocityStream({ isActive }: { isActive: boolean }) {
  const [points, setPoints] = useState<number[]>(Array(20).fill(10));

  useEffect(() => {
    if (!isActive) {
      setPoints(Array(20).fill(10));
      return;
    }
    const int = setInterval(() => {
      setPoints((prev) => {
        // Create jagged spikes between 10 and 90, matching the reference screenshot heavily
        const nextVal =
          Math.random() > 0.3
            ? Math.random() * 80 + 10
            : Math.random() * 20 + 10;
        return [...prev.slice(1), nextVal];
      });
    }, 150);
    return () => clearInterval(int);
  }, [isActive]);

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${i * 50} ${100 - p}`)
    .join(" ");
  const fillD = `${pathD} L 950 100 L 0 100 Z`;

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 950 100"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,0,51,0.6)" />
          <stop offset="100%" stopColor="rgba(255,0,51,0)" />
        </linearGradient>
      </defs>
      <path d={fillD} fill="url(#fade)" />
      <path
        d={pathD}
        fill="none"
        stroke="#FF0033"
        strokeWidth="4"
        vectorEffect="non-scaling-stroke"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const TRACK_DATA: Record<string, any> = {
  Monza: {
    laps: ["L42", "L43", "L44", "L45"],
    times: ["1:19.421", "1:19.220", "1:18.882", "1:19.001"],
    s1: "26.421S",
    s2: "28.109S",
    s1bar: "100%",
    s2bar: "85%",
    svg: "M 60 140 C 60 100, 30 50, 60 20 C 100 20, 150 20, 170 50 C 190 90, 160 140, 100 140 Z", // Simplified high-speed loop
    strategy: "LAP 22 EXPECTED",
  },
  Silverstone: {
    laps: ["L25", "L26", "L27", "L28"],
    times: ["1:27.421", "1:27.220", "1:26.882", "1:27.001"],
    s1: "28.421S",
    s2: "36.109S",
    s1bar: "100%",
    s2bar: "75%",
    svg: "M 30 140 C 30 100, 50 60, 90 40 C 130 20, 170 60, 180 100 C 170 140, 100 160, 60 140 Z",
    strategy: "LAP 35 EXPECTED",
  },
  "Spa-Francorchamps": {
    laps: ["L12", "L13", "L14", "L15"],
    times: ["1:45.421", "1:45.220", "1:44.882", "1:45.001"],
    s1: "31.421S",
    s2: "45.109S",
    s1bar: "100%",
    s2bar: "65%",
    svg: "M 40 100 L 80 40 C 100 20, 140 30, 170 60 L 150 120 C 130 160, 60 150, 40 100 Z",
    strategy: "LAP 18 EXPECTED",
  },
  Suzuka: {
    laps: ["L38", "L39", "L40", "L41"],
    times: ["1:30.421", "1:30.220", "1:29.882", "1:30.001"],
    s1: "31.421S",
    s2: "41.109S",
    s1bar: "100%",
    s2bar: "80%",
    svg: "M 50 120 C 30 90, 60 40, 100 30 C 150 20, 140 80, 110 90 C 70 100, 140 140, 170 130", // Figure 8 ish
    strategy: "LAP 40 EXPECTED",
  },
};

const TIRE_WEAR_MODIFIERS: Record<string, number> = {
  "Max Verstappen": 0.8, // Smooth
  "Charles Leclerc": 1.1, // Aggressive
  "Lewis Hamilton": 0.9, // Conserving
  "Lando Norris": 1.0, // Balanced
};

const WEATHER_MODIFIERS: Record<string, { wear: number; tempOffset: number }> =
  {
    Dry: { wear: 1.0, tempOffset: 0 },
    "Light Rain": { wear: 0.6, tempOffset: -15 },
    "Heavy Rain": { wear: 0.4, tempOffset: -25 },
    Mixed: { wear: 0.9, tempOffset: -5 },
  };

export default function TelemetrySection() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [config, setConfig] = useState({
    track: "Monza",
    driver: "Max Verstappen",
    team: "Red Bull Racing",
    weather: "Dry",
  });

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

  const wearRate = driverWear * weatherEffects.wear;
  const baseTireTemp = 80 + weatherEffects.tempOffset;

  // Tire Progress (Degradation goes from 100% downwards based on wearRate)
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

  // Tire temps
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

  const handleStart = () => setIsSimulating(true);
  const handleStop = () => setIsSimulating(false);

  // Renders a Circular Progress (Doughnut)
  const CircularProgress = ({
    progress,
    label,
    temp,
    color,
  }: {
    progress: number;
    label: string;
    temp: number;
    color: string;
  }) => {
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "80px",
            height: "80px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <svg width="80" height="80" style={{ transform: "rotate(-90deg)" }}>
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke="#1a1a1a"
              strokeWidth="4"
              fill="none"
            />
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke={color}
              strokeWidth="4"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
          </svg>
          <div
            style={{
              position: "absolute",
              fontFamily: "var(--font-mono)",
              fontSize: "0.9rem",
              color: "#FFF",
            }}
          >
            {Math.round(progress)}%
          </div>
        </div>
        <div
          style={{
            textAlign: "center",
            fontFamily: "var(--font-mono)",
            fontSize: "0.8rem",
          }}
        >
          <div style={{ color: "#888" }}>{label}</div>
          <div style={{ color: color }}>{Math.round(temp)}°C</div>
        </div>
      </div>
    );
  };

  const panelStyle = {
    background: "#080808",
    border: "1px solid #1a1a1a",
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column" as const,
    position: "relative" as const,
  };

  const headerStyle = {
    fontFamily: "var(--font-mono)",
    fontSize: "0.80rem",
    letterSpacing: "0.05em",
    color: "#888",
    textTransform: "uppercase" as const,
    marginBottom: "1rem",
    display: "flex",
    justifyContent: "space-between",
  };

  return (
    <section
      id="race-control"
      style={{
        background: "#050505",
        minHeight: "100vh",
        paddingTop: "6rem",
        paddingBottom: "4rem",
        color: "#FFF",
      }}
    >
      <div className="container-xl" style={{ maxWidth: "1600px" }}>
        {/* CONFIGURATION PANEL */}
        <div
          style={{ ...panelStyle, marginBottom: "2rem", background: "#0a0a0a" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "2rem",
            }}
          >
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="section-label"
              >
                <span />
                <span>Simulation Setup</span>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="section-title"
                style={{ margin: 0, fontSize: "2.5rem" }}
              >
                Pit Wall Interface
              </motion.h2>
              <p
                style={{
                  margin: "0.5rem 0 0 0",
                  color: "#888",
                  fontSize: "0.9rem",
                }}
              >
                Select simulation parameters to boot telemetry suite.
              </p>
            </div>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                flexWrap: "wrap",
                fontFamily: "var(--font-mono)",
                fontSize: "0.9rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <label style={{ color: "#888" }}>TRACK</label>
                <select
                  disabled={isSimulating}
                  value={config.track}
                  onChange={(e) =>
                    setConfig({ ...config, track: e.target.value })
                  }
                  style={{
                    background: "#111",
                    color: "#FFF",
                    border: "1px solid #333",
                    padding: "0.5rem",
                    width: "150px",
                  }}
                >
                  <option>Monza</option>
                  <option>Silverstone</option>
                  <option>Spa-Francorchamps</option>
                  <option>Suzuka</option>
                </select>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <label style={{ color: "#888" }}>TEAM</label>
                <select
                  disabled={isSimulating}
                  value={config.team}
                  onChange={(e) =>
                    setConfig({ ...config, team: e.target.value })
                  }
                  style={{
                    background: "#111",
                    color: "#FFF",
                    border: "1px solid #333",
                    padding: "0.5rem",
                    width: "150px",
                  }}
                >
                  <option>Red Bull Racing</option>
                  <option>Ferrari</option>
                  <option>Mercedes</option>
                  <option>McLaren</option>
                </select>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <label style={{ color: "#888" }}>DRIVER</label>
                <select
                  disabled={isSimulating}
                  value={config.driver}
                  onChange={(e) =>
                    setConfig({ ...config, driver: e.target.value })
                  }
                  style={{
                    background: "#111",
                    color: "#FFF",
                    border: "1px solid #333",
                    padding: "0.5rem",
                    width: "150px",
                  }}
                >
                  <option>Max Verstappen</option>
                  <option>Charles Leclerc</option>
                  <option>Lewis Hamilton</option>
                  <option>Lando Norris</option>
                </select>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <label style={{ color: "#888" }}>WEATHER</label>
                <select
                  disabled={isSimulating}
                  value={config.weather}
                  onChange={(e) =>
                    setConfig({ ...config, weather: e.target.value })
                  }
                  style={{
                    background: "#111",
                    color: "#FFF",
                    border: "1px solid #333",
                    padding: "0.5rem",
                    width: "150px",
                  }}
                >
                  <option>Dry</option>
                  <option>Light Rain</option>
                  <option>Heavy Rain</option>
                  <option>Mixed</option>
                </select>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  marginLeft: "1rem",
                }}
              >
                <button
                  onClick={isSimulating ? handleStop : handleStart}
                  style={{
                    padding: "0.6rem 1.5rem",
                    background: isSimulating ? "transparent" : "#FFF",
                    color: isSimulating ? "#FF0033" : "#000",
                    border: isSimulating
                      ? "1px solid #FF0033"
                      : "1px solid #FFF",
                    fontWeight: "bold",
                    cursor: "pointer",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {isSimulating ? "SHUTDOWN SIM" : "BOOT SIM"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ACTIVE DASHBOARD GRID */}
        {isSimulating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.5fr 1fr",
              gap: "1px",
              height: "800px",
              background: "#1a1a1a",
              border: "1px solid #1a1a1a",
            }}
          >
            {/* --- LEFT COLUMN --- */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1px" }}
            >
              {/* TIMING */}
              <div style={{ ...panelStyle, flex: 1 }}>
                <div style={headerStyle}>
                  <span>Sector Breakdown</span>
                  <span style={{ color: "#888" }}>LIVE_T2</span>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.5rem",
                    fontFamily: "var(--font-mono)",
                    marginTop: "1rem",
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "0.5rem",
                        fontSize: "0.85rem",
                      }}
                    >
                      <span>SECTOR 1</span>
                      <span style={{ color: "#00E5FF" }}>
                        {trackData.s1}{" "}
                        <span
                          style={{
                            background: "#00E5FF",
                            color: "#000",
                            padding: "0 4px",
                            fontSize: "0.6rem",
                            borderRadius: "2px",
                            verticalAlign: "top",
                            marginLeft: "4px",
                          }}
                        >
                          PB
                        </span>
                      </span>
                    </div>
                    <div
                      style={{
                        height: "4px",
                        background: "#1a1a1a",
                        width: "100%",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          background: "#00E5FF",
                          width: trackData.s1bar,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "0.5rem",
                        fontSize: "0.85rem",
                      }}
                    >
                      <span>SECTOR 2</span>
                      <span style={{ color: "#FFEA00" }}>{trackData.s2}</span>
                    </div>
                    <div
                      style={{
                        height: "4px",
                        background: "#1a1a1a",
                        width: "100%",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          background: "#FFEA00",
                          width: trackData.s2bar,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "0.5rem",
                        fontSize: "0.85rem",
                      }}
                    >
                      <span>SECTOR 3</span>
                      <span style={{ color: "#888" }}>IN PROGRESS...</span>
                    </div>
                    <div
                      style={{
                        height: "4px",
                        background: "#1a1a1a",
                        width: "100%",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          background: "#FF0033",
                          width: "40%",
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ ...headerStyle, marginTop: "4rem" }}>
                  <span>Lap History</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.85rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      color: "#666",
                    }}
                  >
                    <span>{trackData.laps[0]}</span>
                    <span>{trackData.times[0]}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      color: "#666",
                    }}
                  >
                    <span>{trackData.laps[1]}</span>
                    <span>{trackData.times[1]}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      color: "#00E5FF",
                    }}
                  >
                    <span>{trackData.laps[2]}</span>
                    <span>{trackData.times[2]}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      color: "#FFF",
                    }}
                  >
                    <span>{trackData.laps[3]}</span>
                    <span>{trackData.times[3]}</span>
                  </div>
                </div>
              </div>

              {/* GPS TRACKER */}
              <div style={{ ...panelStyle, height: "300px" }}>
                <div style={headerStyle}>GPS Tracker</div>
                <div
                  style={{
                    flex: 1,
                    position: "relative",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <svg width="220" height="160" viewBox="0 0 200 150">
                    <path
                      d={trackData.svg}
                      fill="none"
                      stroke="#222"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {isSimulating && (
                      <motion.circle
                        r="5"
                        fill="#FF0033"
                        initial={{ offsetDistance: "0%" }}
                        animate={{ offsetDistance: "100%" }}
                        transition={{
                          duration: 80,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        style={{
                          offsetPath: `path('${trackData.svg}')`,
                        }}
                      />
                    )}
                  </svg>
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      textAlign: "right",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    <div
                      style={{
                        color: "#888",
                        fontSize: "0.7rem",
                        marginBottom: "0.2rem",
                      }}
                    >
                      POSITION
                    </div>
                    <div
                      style={{
                        fontSize: "2.5rem",
                        fontWeight: "bold",
                        fontStyle: "italic",
                        lineHeight: 1,
                      }}
                    >
                      P01
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* --- CENTER COLUMN --- */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1px" }}
            >
              {/* VELOCITY & INPUTS */}
              <div style={{ ...panelStyle, flex: 1, padding: "2.5rem" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: "0.5rem",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "5rem",
                        fontWeight: "bold",
                        fontStyle: "italic",
                        fontFamily: "var(--font-display)",
                        lineHeight: 0.8,
                      }}
                    >
                      {Math.round(speed)}
                    </span>
                    <span
                      style={{
                        fontSize: "1.2rem",
                        color: "#888",
                        fontFamily: "var(--font-display)",
                        fontWeight: "bold",
                      }}
                    >
                      KM/H
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "2.5rem",
                        color: "#FF0033",
                        fontFamily: "var(--font-display)",
                        fontWeight: "bold",
                        lineHeight: 1,
                      }}
                    >
                      G{gear}
                    </span>
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: "#888",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      GEAR
                    </span>
                  </div>
                </div>

                <div style={{ ...headerStyle, marginTop: "2rem" }}>
                  VELOCITY STREAM
                </div>
                <div
                  style={{
                    height: "180px",
                    position: "relative",
                    marginBottom: "2rem",
                  }}
                >
                  <DynamicVelocityStream isActive={isSimulating} />
                </div>

                {/* Input Bars */}
                <div
                  style={{
                    display: "flex",
                    gap: "2.5rem",
                    marginTop: "auto",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.8rem",
                    fontWeight: "bold",
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.75rem",
                    }}
                  >
                    <div style={{ color: "#888" }}>THROTTLE</div>
                    <div
                      style={{
                        height: "8px",
                        background: "#1a1a1a",
                        width: "100%",
                        borderRadius: "2px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          background: "#00FF66",
                          width: `${Math.max(0, Math.min(100, throttle))}%`,
                          transition: "width 0.1s",
                        }}
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.75rem",
                    }}
                  >
                    <div style={{ color: "#888" }}>BRAKE</div>
                    <div
                      style={{
                        height: "8px",
                        background: "#1a1a1a",
                        width: "100%",
                        borderRadius: "2px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          background: "#FF0033",
                          width: `${Math.max(0, Math.min(100, brake))}%`,
                          transition: "width 0.1s",
                        }}
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.75rem",
                    }}
                  >
                    <div style={{ color: "#888" }}>RPM</div>
                    <div
                      style={{
                        height: "8px",
                        background: "#1a1a1a",
                        width: "100%",
                        borderRadius: "2px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          background: "#FFEA00",
                          width: `${Math.max(0, Math.min(100, (rpm / 13000) * 100))}%`,
                          transition: "width 0.1s",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ERS */}
              <div
                style={{ ...panelStyle, height: "250px", padding: "2.5rem" }}
              >
                <div style={headerStyle}>
                  <span>Energy Recovery System</span>
                  <span style={{ color: "#00E5FF" }}>OVT_ACTIVE</span>
                </div>

                <div style={{ marginTop: "1rem" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontFamily: "var(--font-display)",
                      fontSize: "1rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <span style={{ fontStyle: "italic", fontWeight: "bold" }}>
                      ERS STORAGE
                    </span>
                    <span>{Math.round(ersStorage)}%</span>
                  </div>

                  {/* Segmented Bar */}
                  <div
                    style={{
                      display: "flex",
                      gap: "4px",
                      height: "35px",
                      width: "100%",
                    }}
                  >
                    {[...Array(6)].map((_, i) => {
                      const threshold = (i + 1) * (100 / 6);
                      const isFilled = ersStorage >= threshold - 100 / 12;
                      return (
                        <div
                          key={i}
                          style={{
                            flex: 1,
                            background: isFilled ? "#00E5FF" : "#1a1a1a",
                            transition: "background 0.3s",
                            borderRadius: "2px",
                          }}
                        />
                      );
                    })}
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr 1fr",
                    gap: "1rem",
                    marginTop: "auto",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.75rem",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      background: "#141414",
                      padding: "1rem 0",
                      borderRadius: "4px",
                    }}
                  >
                    <div style={{ color: "#888", marginBottom: "0.5rem" }}>
                      MGU-K
                    </div>
                    <div style={{ color: "#00FF66", fontWeight: "bold" }}>
                      NOM
                    </div>
                  </div>
                  <div
                    style={{
                      background: "#141414",
                      padding: "1rem 0",
                      borderRadius: "4px",
                    }}
                  >
                    <div style={{ color: "#888", marginBottom: "0.5rem" }}>
                      MGU-H
                    </div>
                    <div style={{ color: "#00FF66", fontWeight: "bold" }}>
                      NOM
                    </div>
                  </div>
                  <div
                    style={{
                      background: "#141414",
                      padding: "1rem 0",
                      borderRadius: "4px",
                    }}
                  >
                    <div style={{ color: "#888", marginBottom: "0.5rem" }}>
                      TEMP
                    </div>
                    <div style={{ color: "#FFF", fontWeight: "bold" }}>
                      92°C
                    </div>
                  </div>
                  <div
                    style={{
                      background: "#FF0033",
                      color: "#FFF",
                      padding: "1rem 0",
                      borderRadius: "4px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <div style={{ fontWeight: "bold", fontSize: "0.85rem" }}>
                      DRS
                    </div>
                    <div style={{ fontWeight: "bold", fontSize: "0.85rem" }}>
                      OPEN
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* --- RIGHT COLUMN --- */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1px" }}
            >
              {/* TIRES */}
              <div style={{ ...panelStyle, flex: 1 }}>
                <div style={headerStyle}>Tire Wear & Temps</div>

                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    position: "relative",
                    margin: "2rem 0",
                  }}
                >
                  {/* Middle Car Outline Placeholder */}
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: "70px",
                      height: "180px",
                      border: "2px solid #1a1a1a",
                      borderRadius: "12px",
                    }}
                  />

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "0 2rem",
                    }}
                  >
                    <CircularProgress
                      progress={flProg}
                      label={
                        config.weather.includes("Rain") ? "FL (W)" : "FL (S)"
                      }
                      temp={flTemp}
                      color={
                        config.weather.includes("Rain") ? "#0066FF" : "#00E5FF"
                      }
                    />
                    <CircularProgress
                      progress={frProg}
                      label={
                        config.weather.includes("Rain") ? "FR (W)" : "FR (S)"
                      }
                      temp={frTemp}
                      color={
                        config.weather.includes("Rain") ? "#0066FF" : "#00E5FF"
                      }
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "0 2rem",
                      marginTop: "5rem",
                    }}
                  >
                    <CircularProgress
                      progress={rlProg}
                      label={
                        config.weather.includes("Rain") ? "RL (W)" : "RL (S)"
                      }
                      temp={rlTemp}
                      color={
                        config.weather.includes("Rain") ? "#0066FF" : "#FFEA00"
                      }
                    />
                    <CircularProgress
                      progress={rrProg}
                      label={
                        config.weather.includes("Rain") ? "RR (W)" : "RR (S)"
                      }
                      temp={rrTemp}
                      color={
                        config.weather.includes("Rain") ? "#0066FF" : "#FFEA00"
                      }
                    />
                  </div>
                </div>

                <div
                  style={{
                    ...headerStyle,
                    margin: "auto 0 0 0",
                    borderTop: "1px solid #1a1a1a",
                    paddingTop: "1.5rem",
                    color: "#666",
                  }}
                >
                  <span>PIT STRATEGY</span>
                  <span style={{ color: "#FF0033" }}>{trackData.strategy}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
