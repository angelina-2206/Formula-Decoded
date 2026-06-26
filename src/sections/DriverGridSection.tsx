"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const getFallbackImage = (number: string, color: string, name: string) => {
  const lastName = name.split(" ").pop() || name;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500">
    <defs>
      <linearGradient id="bgGrad-${number}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0b0b0d" />
        <stop offset="100%" stop-color="#18181c" />
      </linearGradient>
      <linearGradient id="accentGrad-${number}" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${color}" />
        <stop offset="100%" stop-color="${color}1a" />
      </linearGradient>
      <filter id="neonGlow-${number}">
        <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <rect width="400" height="500" fill="url(#bgGrad-${number})" />
    <circle cx="200" cy="200" r="110" fill="none" stroke="${color}" stroke-width="1" opacity="0.15" />
    <circle cx="200" cy="200" r="130" fill="none" stroke="${color}" stroke-width="1" stroke-dasharray="6 10" opacity="0.1" />
    
    <!-- Stylized Racing Helmet Outline -->
    <path d="M200,90 C140,90 110,130 110,190 C110,210 115,235 120,245 C128,260 145,285 170,295 C180,300 190,305 200,305 C210,305 220,300 230,295 C255,285 272,260 280,245 C285,235 290,210 290,190 C290,130 260,90 200,90 Z" fill="url(#accentGrad-${number})" opacity="0.2" />
    <path d="M140,175 Q200,155 260,175 Q268,200 260,220 Q200,235 140,220 Q132,200 140,175 Z" fill="${color}" opacity="0.5" filter="url(#neonGlow-${number})" />
    
    <!-- Telemetry grid markings -->
    <path d="M 50 200 L 90 200 M 310 200 L 350 200 M 200 50 L 200 70 M 200 310 L 200 330" stroke="rgba(255,255,255,0.07)" stroke-width="1.5" />
    
    <!-- Driver Number -->
    <text x="200" y="390" font-family="sans-serif" font-size="90" font-weight="900" text-anchor="middle" fill="#ffffff" opacity="0.85">${number}</text>
    
    <!-- Driver Name -->
    <text x="200" y="435" font-family="sans-serif" font-size="20" font-weight="700" text-anchor="middle" fill="${color}" opacity="0.8" letter-spacing="3" text-transform="uppercase">${lastName}</text>
  </svg>`;
  
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
};

const DRIVERS = [
  // ── Red Bull Racing ──
  {
    number: "1",
    name: "Max Verstappen",
    team: "Red Bull Racing",
    country: "NED",
    color: "#3671C6",
    image:
      "https://media.formula1.com/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png",
    bio: "Max Verstappen is a Dutch racing driver competing for Red Bull Racing. A multi-time World Champion, he is known for his aggressive driving style, incredible consistency, and exceptional wet-weather skills. He made his F1 debut at just 17 years old, becoming the youngest driver to compete in the sport's history.",
  },
  {
    number: "6",
    name: "Isack Hadjar",
    team: "Red Bull Racing",
    country: "FRA",
    color: "#3671C6",
    image:
      "https://media.formula1.com/content/dam/fom-website/drivers/I/ISAHAD01_Isack_Hadjar/isahad01.png",
    bio: "Isack Hadjar is a French-Algerian racing driver who earned his Red Bull Racing seat through dominant performances in the junior categories. A product of the Red Bull Junior Team, Hadjar impressed with his racecraft and consistency in Formula 2 before being promoted to partner Verstappen in the senior team.",
  },

  // ── Ferrari ──
  {
    number: "16",
    name: "Charles Leclerc",
    team: "Ferrari",
    country: "MON",
    color: "#E8002D",
    image:
      "https://media.formula1.com/content/dam/fom-website/drivers/C/CHALEC01_Charles_Leclerc/chalec01.png",
    bio: "Charles Leclerc is a Monégasque racing driver driving for Scuderia Ferrari. A product of the Ferrari Driver Academy, Leclerc is renowned for his blistering one-lap pace and spectacular qualifying performances. He carries the hopes of the Tifosi and is a central figure in Ferrari's quest for World Championship glory.",
  },
  {
    number: "44",
    name: "Lewis Hamilton",
    team: "Ferrari",
    country: "GBR",
    color: "#E8002D",
    image:
      "https://media.formula1.com/content/dam/fom-website/drivers/L/LEWHAM01_Lewis_Hamilton/lewham01.png",
    bio: "Sir Lewis Hamilton is a British racing driver widely regarded as one of the greatest F1 drivers of all time. He holds numerous records, including the most wins, pole positions, and podium finishes. After a historic stint with Mercedes, he made a sensational move to Scuderia Ferrari, aiming to cement his legendary status with the Prancing Horse.",
  },

  // ── Williams (MOVED UP) ──
  {
    number: "23",
    name: "Alex Albon",
    team: "Williams",
    country: "THA",
    color: "#64C4FF",
    image:
      "https://media.formula1.com/content/dam/fom-website/drivers/A/ALEALB01_Alex_Albon/alealb01.png",
    bio: "Alex Albon is a Thai-British racing driver competing for Williams. After a challenging stint at Red Bull, Albon rebuilt his career with impressive performances at Williams, often dragging the car into points-scoring positions. Known for his racecraft and consistency, he is a vital leader in Williams' rebuild project.",
  },
  {
    number: "55",
    name: "Carlos Sainz",
    team: "Williams",
    country: "ESP",
    color: "#64C4FF",
    image:
      "https://media.formula1.com/content/dam/fom-website/drivers/C/CARSAI01_Carlos_Sainz/carsai01.png",
    bio: "Carlos Sainz is a Spanish racing driver known for his smooth operating style, technical feedback, and strategic acumen. After building a strong reputation at McLaren and Ferrari, he brings a wealth of experience and pace to Williams, looking to lead the historic team back up the grid.",
  },

  // ── McLaren ──
  {
    number: "4",
    name: "Lando Norris",
    team: "McLaren",
    country: "GBR",
    color: "#FF8000",
    image:
      "https://media.formula1.com/content/dam/fom-website/drivers/L/LANNOR01_Lando_Norris/lannor01.png",
    bio: "Lando Norris is a British racing driver competing for McLaren. Known for his charismatic personality off-track and his raw speed on it, Norris has developed into one of the top talents on the grid. He is a key asset to McLaren, consistently pushing the car to its limits and fighting at the sharp end of the field.",
  },
  {
    number: "81",
    name: "Oscar Piastri",
    team: "McLaren",
    country: "AUS",
    color: "#FF8000",
    image:
      "https://media.formula1.com/content/dam/fom-website/drivers/O/OSCPIA01_Oscar_Piastri/oscpia01.png",
    bio: "Oscar Piastri is an Australian racing driver competing for McLaren. After dominating the junior categories and winning Formula 3 and Formula 2 in consecutive rookie years, he made a massive impact in his F1 debut. Known for his calm demeanor, analytical approach, and exceptional race pace, he is a future champion contender.",
  },

  // ── Mercedes ──
  {
    number: "63",
    name: "George Russell",
    team: "Mercedes",
    country: "GBR",
    color: "#27F4D2",
    image:
      "https://media.formula1.com/content/dam/fom-website/drivers/G/GEORUS01_George_Russell/georus01.png",
    bio: "George Russell is a British racing driver competing for Mercedes-AMG Petronas. After impressing at Williams, he secured his seat at the top team, quickly proving his worth with consistent performances and tactical intelligence. Known as 'Mr. Saturday' for his qualifying prowess, he is the future spearhead of Mercedes.",
  },
  {
    number: "12",
    name: "Kimi Antonelli",
    team: "Mercedes",
    country: "ITA",
    color: "#27F4D2",
    image:
      "https://media.formula1.com/content/dam/fom-website/drivers/K/KIMANT01_Kimi_Antonelli/kimant01.png",
    bio: "Andrea Kimi Antonelli is an Italian racing prodigy who joined Mercedes as one of the youngest drivers on the grid. Hand-picked by the team after a meteoric rise through the junior formulas, Antonelli is celebrated for his natural speed and smooth driving style. He chose number 12 as a tribute to his idol, Ayrton Senna.",
  },

  // ── Aston Martin ──
  {
    number: "14",
    name: "Fernando Alonso",
    team: "Aston Martin",
    country: "ESP",
    color: "#229971",
    image:
      "https://media.formula1.com/content/dam/fom-website/drivers/F/FERALO01_Fernando_Alonso/feralo01.png",
    bio: "Fernando Alonso is a Spanish double World Champion racing for Aston Martin. Renowned for his racecraft, tactical brilliance, and relentless determination, Alonso remains one of the most formidable competitors in F1 history. His ability to extract maximum performance from any machinery is legendary.",
  },
  {
    number: "18",
    name: "Lance Stroll",
    team: "Aston Martin",
    country: "CAN",
    color: "#229971",
    image:
      "https://media.formula1.com/content/dam/fom-website/drivers/L/LANSTR01_Lance_Stroll/lanstr01.png",
    bio: "Lance Stroll is a Canadian racing driver competing for Aston Martin. The son of team owner Lawrence Stroll, Lance has proven his mettle with podium finishes and a pole position. He brings strong wet-weather skills and racecraft to the team, continually developing as a driver in the sport's midfield battles.",
  },

  // ── Alpine ──
  {
    number: "10",
    name: "Pierre Gasly",
    team: "Alpine",
    country: "FRA",
    color: "#FF87BC",
    image:
      "https://media.formula1.com/content/dam/fom-website/drivers/P/PIEGAS01_Pierre_Gasly/piegas01.png",
    bio: "Pierre Gasly is a French racing driver competing for Alpine. A race winner and former AlphaTauri standout, Gasly is known for his fierce determination and ability to over-perform relative to his machinery. He leads Alpine's charge into the new era of regulations with his experience and raw speed.",
  },
  {
    number: "43",
    name: "Franco Colapinto",
    team: "Alpine",
    country: "ARG",
    color: "#FF87BC",
    image:
      "https://media.formula1.com/content/dam/fom-website/drivers/F/FRACOL01_Franco_Colapinto/fracol01.png",
    bio: "Franco Colapinto is an Argentine racing driver who made a stunning mid-season F1 debut with Williams before securing a full-time seat at Alpine. He became the first Argentine driver to compete in Formula One in decades, bringing South American passion and raw talent to the grid. His number 43 was also used by his father in racing.",
  },

  // ── Racing Bulls ──
  {
    number: "30",
    name: "Liam Lawson",
    team: "Racing Bulls",
    country: "NZL",
    color: "#6692FF",
    image:
      "https://media.formula1.com/content/dam/fom-website/drivers/L/LIALAW01_Liam_Lawson/lialaw01.png",
    bio: "Liam Lawson is a New Zealand racing driver competing for Racing Bulls. A Red Bull Junior Team product, Lawson made an immediate impact as a substitute driver before earning a full-time seat. He is known for his aggressive overtaking and ability to perform under pressure on the biggest stages.",
  },
  {
    number: "41",
    name: "Arvid Lindblad",
    team: "Racing Bulls",
    country: "GBR",
    color: "#6692FF",
    image:
      "https://media.formula1.com/content/dam/fom-website/drivers/A/ARVLIN01_Arvid_Lindblad/arvlin01.png",
    bio: "Arvid Lindblad is a British racing driver and one of the most exciting rookies of the 2026 season. A Red Bull Junior Team protégé, he showed electrifying speed through the junior formulas. He chose number 41 as the digits resemble his initials, 'AL'. He is widely regarded as a future star of the sport.",
  },

  // ── Haas F1 Team ──
  {
    number: "87",
    name: "Oliver Bearman",
    team: "Haas",
    country: "GBR",
    color: "#B6BABD",
    image:
      "https://media.formula1.com/content/dam/fom-website/drivers/O/OLIBEA01_Oliver_Bearman/olibea01.png",
    bio: "Oliver Bearman is a British racing driver competing for Haas. He made headlines with an incredible debut filling in at Ferrari, scoring points on his very first Grand Prix. A Ferrari Academy graduate, Bearman brings youthful energy and raw pace to Haas. His number 87 combines the birth dates of his father and brother.",
  },
  {
    number: "31",
    name: "Esteban Ocon",
    team: "Haas",
    country: "FRA",
    color: "#B6BABD",
    image:
      "https://media.formula1.com/content/dam/fom-website/drivers/E/ESTOCO01_Esteban_Ocon/estoco01.png",
    bio: "Esteban Ocon is a French racing driver competing for Haas. A race winner at the 2021 Hungarian Grand Prix, Ocon is known for his tenacity and defensive driving skills. Having raced for multiple teams including Alpine, he brings valuable experience and a never-give-up attitude to the American outfit.",
  },

  // ── Audi ──
  {
    number: "27",
    name: "Nico Hülkenberg",
    team: "Audi",
    country: "GER",
    color: "#F50537",
    image:
      "https://media.formula1.com/content/dam/fom-website/drivers/N/NICHUL01_Nico_Hulkenberg/nichul01.png",
    bio: "Nico Hülkenberg is a German racing driver leading Audi's entry into Formula One. A Le Mans 24 Hours winner and one of the most experienced drivers on the grid, Hülkenberg is celebrated for his qualifying speed and ability to consistently extract the maximum from his car. He brings vital experience to the German manufacturer's ambitious F1 project.",
  },
  {
    number: "5",
    name: "Gabriel Bortoleto",
    team: "Audi",
    country: "BRA",
    color: "#F50537",
    image:
      "https://media.formula1.com/content/dam/fom-website/drivers/G/GABBOR01_Gabriel_Bortoleto/gabbor01.png",
    bio: "Gabriel Bortoleto is a Brazilian racing driver and the reigning Formula 2 champion. A McLaren junior turned Audi works driver, Bortoleto chose number 5 — previously associated with Sebastian Vettel — after winning the 2023 FIA Formula 3 championship with it. He represents the new generation of Brazilian talent in Formula One.",
  },

  // ── Cadillac ──
  {
    number: "11",
    name: "Sergio Pérez",
    team: "Cadillac",
    country: "MEX",
    color: "#C0C0C0",
    image:
      "https://media.formula1.com/content/dam/fom-website/drivers/S/SERPER01_Sergio_Perez/serper01.png",
    bio: "Sergio 'Checo' Pérez is a Mexican racing driver competing for the new Cadillac F1 team. Known as the 'Mexican Minister of Defence' for his exceptional tyre management and defensive skills, Pérez brings invaluable experience from Red Bull Racing. He is a race winner and beloved figure in the sport, spearheading Cadillac's debut season.",
  },
  {
    number: "77",
    name: "Valtteri Bottas",
    team: "Cadillac",
    country: "FIN",
    color: "#C0C0C0",
    image:
      "https://media.formula1.com/content/dam/fom-website/drivers/V/VALBOT01_Valtteri_Bottas/valbot01.png",
    bio: "Valtteri Bottas is a Finnish racing driver and multi-race winner who joins Cadillac for their inaugural F1 season. A former Mercedes driver and multiple Grand Prix winner, Bottas brings championship-calibre experience and a cool, methodical approach to setting up a car. His consistent speed and technical feedback are invaluable for the new American team.",
  },
];

export default function DriverGridSection() {
  const [selectedDriver, setSelectedDriver] = useState<
    (typeof DRIVERS)[0] | null
  >(null);
  const [visibleCount, setVisibleCount] = useState(8);

  return (
    <section
      id="drivers"
      style={{
        position: "relative",
        background: "var(--color-surface)",
        borderTop: "1px solid var(--color-border)",
        minHeight: "100vh",
        paddingBottom: "4rem",
      }}
    >
      <div
        className="grid-bg"
        style={{ position: "absolute", inset: 0, opacity: 0.15 }}
      />

      <div
        className="container-xl section-padding"
        style={{ position: "relative", zIndex: 2 }}
      >
        {/* Header */}
        <div style={{ marginBottom: "3rem" }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="section-label"
          >
            <span />
            <span>2026 Season</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="section-title"
          >
            Driver Grid
          </motion.h2>
        </div>

        {/* Driver cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {DRIVERS.slice(0, visibleCount).map((driver, i) => (
            <motion.div
              key={driver.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{
                y: -8,
                boxShadow: `0 10px 30px ${driver.color}25`,
                borderColor: driver.color,
                transition: { duration: 0.2 },
              }}
              onClick={() => setSelectedDriver(driver)}
              className="card-dark"
              style={{
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                padding: 0,
                border: "1px solid rgba(240,240,240,0.1)",
              }}
            >
              {/* Team color accent line */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  background: driver.color,
                  zIndex: 10,
                }}
              />

              {/* Driver Photo Area */}
              <div
                style={{
                  position: "relative",
                  height: "220px",
                  background: `linear-gradient(to bottom, ${driver.color}15, var(--color-surface))`,
                  borderBottom: "1px solid rgba(240,240,240,0.05)",
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                {/* Giant faded number in background */}
                <div
                  style={{
                    position: "absolute",
                    top: "-20%",
                    right: "-10%",
                    fontFamily: "var(--font-display)",
                    fontSize: "12rem",
                    fontWeight: 900,
                    color: driver.color,
                    opacity: 0.08,
                    lineHeight: 1,
                    pointerEvents: "none",
                  }}
                >
                  {driver.number}
                </div>
                <img
                  src={driver.image}
                  alt={driver.name}
                  referrerPolicy="no-referrer"
                  style={{
                    height: "90%",
                    objectFit: "contain",
                    position: "relative",
                    zIndex: 2,
                    filter: "drop-shadow(0 0 10px rgba(0,0,0,0.5))",
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = getFallbackImage(driver.number, driver.color, driver.name);
                  }}
                />
              </div>

              {/* Driver Info Content */}
              <div style={{ padding: "1.5rem" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "0.5rem",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.2rem",
                        fontWeight: 800,
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                        marginBottom: "0.2rem",
                      }}
                    >
                      {driver.name}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "0.85rem",
                        color: driver.color,
                        fontWeight: 600,
                      }}
                    >
                      {driver.team}
                    </div>
                  </div>
                  <span
                    className="hud-tag"
                    style={{
                      borderColor: driver.color,
                      color: driver.color,
                      background: `${driver.color}15`,
                    }}
                  >
                    {driver.country}
                  </span>
                </div>

                {/* Bottom accent */}
                <div
                  style={{
                    marginTop: "1.5rem",
                    paddingTop: "1rem",
                    borderTop: "1px solid rgba(240,240,240,0.1)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span className="hud-label">RSC</span>
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.2rem",
                      fontWeight: 900,
                      color: "var(--color-text)",
                      textShadow: `0 0 10px ${driver.color}60`,
                    }}
                  >
                    {driver.number}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load More section */}
        {visibleCount < DRIVERS.length && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "4rem",
              gap: "1.5rem",
            }}
          >
            {/* Progress bar / Telemetry data */}
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "0.85rem",
                color: "rgba(240,240,240,0.5)",
                letterSpacing: "0.1em",
                display: "flex",
                alignItems: "center",
                gap: "1.5rem",
              }}
            >
              <span>DISPATCHING TELEMETRY</span>
              <div
                style={{
                  width: "120px",
                  height: "4px",
                  background: "rgba(240,240,240,0.1)",
                  position: "relative",
                  borderRadius: "2px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: `${(visibleCount / DRIVERS.length) * 100}%`,
                    background: "var(--color-primary)",
                  }}
                />
              </div>
              <span>
                {visibleCount} / {DRIVERS.length} DRIVERS
              </span>
            </div>

            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 20px rgba(255,255,255,0.15)",
                borderColor: "var(--color-text)",
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setVisibleCount((prev) => Math.min(prev + 8, DRIVERS.length))}
              style={{
                background: "transparent",
                border: "1px solid rgba(240,240,240,0.2)",
                color: "var(--color-text)",
                padding: "1rem 2.5rem",
                fontFamily: "var(--font-display)",
                fontSize: "1rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.3s ease",
              }}
            >
              {/* Corner tech decals */}
              <div style={{ position: "absolute", top: 0, left: 0, width: "6px", height: "6px", borderLeft: "2px solid var(--color-primary)", borderTop: "2px solid var(--color-primary)" }} />
              <div style={{ position: "absolute", bottom: 0, right: 0, width: "6px", height: "6px", borderRight: "2px solid var(--color-primary)", borderBottom: "2px solid var(--color-primary)" }} />
              
              LOAD NEXT SECTOR
            </motion.button>
          </div>
        )}
      </div>

      {/* Interactive Detail Modal */}
      <AnimatePresence>
        {selectedDriver && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDriver(null)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.8)",
                backdropFilter: "blur(5px)",
                zIndex: 100,
              }}
            />

            {/* Modal Container */}
            <div
              style={{
                position: "fixed",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 101,
                pointerEvents: "none",
                padding: "2rem",
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="card-dark"
                style={{
                  width: "100%",
                  maxWidth: "900px",
                  pointerEvents: "auto",
                  position: "relative",
                  overflow: "hidden",
                  border: `1px solid ${selectedDriver.color}50`,
                  boxShadow: `0 20px 50px ${selectedDriver.color}20`,
                  display: "grid",
                  gridTemplateColumns: "1fr 1.5fr",
                  background: "var(--color-background)",
                }}
              >
                {/* Close button */}
                <button
                  onClick={() => setSelectedDriver(null)}
                  style={{
                    position: "absolute",
                    top: "1.5rem",
                    right: "1.5rem",
                    background: "transparent",
                    border: "none",
                    color: "rgba(240,240,240,0.6)",
                    cursor: "pointer",
                    zIndex: 10,
                    fontFamily: "var(--font-display)",
                    fontSize: "1.2rem",
                  }}
                >
                  ✕
                </button>

                {/* Left Side: Photo & Number */}
                <div
                  style={{
                    background: `linear-gradient(135deg, ${selectedDriver.color}30, var(--color-surface))`,
                    position: "relative",
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    minHeight: "400px",
                    borderRight: "1px solid rgba(240,240,240,0.1)",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "1rem",
                      left: "1rem",
                      fontFamily: "var(--font-display)",
                      fontSize: "8rem",
                      fontWeight: 900,
                      color: selectedDriver.color,
                      opacity: 0.15,
                      lineHeight: 1,
                    }}
                  >
                    {selectedDriver.number}
                  </div>
                  <img
                    src={selectedDriver.image}
                    alt={selectedDriver.name}
                    referrerPolicy="no-referrer"
                    style={{
                      width: "90%",
                      maxHeight: "90%",
                      objectFit: "contain",
                      filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.5))",
                      position: "relative",
                      zIndex: 2,
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = getFallbackImage(selectedDriver.number, selectedDriver.color, selectedDriver.name);
                    }}
                  />
                </div>

                {/* Right Side: Details & Bio */}
                <div style={{ padding: "3rem 2.5rem" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <div
                      style={{
                        width: "4px",
                        height: "24px",
                        background: selectedDriver.color,
                      }}
                    />
                    <span
                      className="hud-label"
                      style={{ color: selectedDriver.color }}
                    >
                      {selectedDriver.team}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "2.5rem",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      marginBottom: "1.5rem",
                      letterSpacing: "0.02em",
                      lineHeight: 1.1,
                    }}
                  >
                    {selectedDriver.name}
                  </h3>

                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      marginBottom: "2rem",
                    }}
                  >
                    <div
                      className="card-dark"
                      style={{
                        padding: "0.75rem 1rem",
                        border: "1px solid rgba(240,240,240,0.1)",
                        background: "var(--color-surface)",
                      }}
                    >
                      <div className="hud-label">Nationality</div>
                      <div
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "1.1rem",
                          fontWeight: 700,
                        }}
                      >
                        {selectedDriver.country}
                      </div>
                    </div>
                    <div
                      className="card-dark"
                      style={{
                        padding: "0.75rem 1rem",
                        border: "1px solid rgba(240,240,240,0.1)",
                        background: "var(--color-surface)",
                      }}
                    >
                      <div className="hud-label">Car Number</div>
                      <div
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "1.1rem",
                          fontWeight: 700,
                          color: selectedDriver.color,
                        }}
                      >
                        {selectedDriver.number}
                      </div>
                    </div>
                  </div>

                  <div className="hud-label" style={{ marginBottom: "0.5rem" }}>
                    Driver Profile
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "1rem",
                      lineHeight: 1.6,
                      color: "rgba(240,240,240,0.7)",
                    }}
                  >
                    {selectedDriver.bio}
                  </p>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
