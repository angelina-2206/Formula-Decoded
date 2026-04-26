"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DRIVERS = [
  {
    number: "1",
    name: "Max Verstappen",
    team: "Red Bull Racing",
    country: "NED",
    color: "#3671C6",
    image:
      "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png",
    bio: "Max Verstappen is a Dutch racing driver who competes in Formula One for Red Bull Racing. He is a multi-time World Champion, known for his aggressive driving style, incredible consistency, and exceptional wet-weather skills. He made his F1 debut at just 17 years old, becoming the youngest driver to compete in the sport's history.",
  },
  {
    number: "44",
    name: "Lewis Hamilton",
    team: "Ferrari",
    country: "GBR",
    color: "#E8002D",
    image:
      "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LEWHAM01_Lewis_Hamilton/lewham01.png",
    bio: "Sir Lewis Hamilton is a British racing driver widely regarded as one of the greatest F1 drivers of all time. He holds numerous records, including the most wins, pole positions, and podium finishes. After a historic stint with Mercedes, he made a sensational move to Scuderia Ferrari, aiming to cement his legendary status with the Prancing Horse.",
  },
  {
    number: "16",
    name: "Charles Leclerc",
    team: "Ferrari",
    country: "MON",
    color: "#E8002D",
    image:
      "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/C/CHALEC01_Charles_Leclerc/chalec01.png",
    bio: "Charles Leclerc is a Monégasque racing driver driving for Scuderia Ferrari. A product of the Ferrari Driver Academy, Leclerc is renowned for his blistering one-lap pace and spectacular qualifying performances. He carries the hopes of the Tifosi and is a central figure in Ferrari's quest for World Championship glory.",
  },
  {
    number: "4",
    name: "Lando Norris",
    team: "McLaren",
    country: "GBR",
    color: "#FF8000",
    image:
      "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LANNOR01_Lando_Norris/lannor01.png",
    bio: "Lando Norris is a British racing driver competing for McLaren. Known for his charismatic personality off-track and his raw speed on it, Norris has developed into one of the top talents on the grid. He is a key asset to McLaren, consistently pushing the car to its limits and fighting at the sharp end of the field.",
  },
  {
    number: "14",
    name: "Fernando Alonso",
    team: "Aston Martin",
    country: "ESP",
    color: "#229971",
    image:
      "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/F/FERALO01_Fernando_Alonso/feralo01.png",
    bio: "Fernando Alonso is a Spanish double World Champion racing for Aston Martin. Renowned for his racecraft, tactical brilliance, and relentless determination, Alonso remains one of the most formidable competitors in F1 history despite his age. His ability to extract maximum performance from any machinery is legendary.",
  },
  {
    number: "63",
    name: "George Russell",
    team: "Mercedes",
    country: "GBR",
    color: "#27F4D2",
    image:
      "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/G/GEORUS01_George_Russell/georus01.png",
    bio: "George Russell is a British racing driver competing for Mercedes-AMG Petronas. After impressing at Williams, he secured his seat at the top team, quickly proving his worth with consistent performances and tactical intelligence. Known as 'Mr. Saturday' for his qualifying prowess, he is the future spearhead of Mercedes.",
  },
  {
    number: "55",
    name: "Carlos Sainz",
    team: "Williams",
    country: "ESP",
    color: "#64C4FF",
    image:
      "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/C/CARSAI01_Carlos_Sainz/carsai01.png",
    bio: "Carlos Sainz is a Spanish racing driver known for his smooth operating style, technical feedback, and strategic acumen. After building a strong reputation at McLaren and Ferrari, he brings a wealth of experience and pace to Williams, looking to lead the historic team back up the grid with his incredibly consistent race performances.",
  },
  {
    number: "81",
    name: "Oscar Piastri",
    team: "McLaren",
    country: "AUS",
    color: "#FF8000",
    image:
      "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/O/OSCPIA01_Oscar_Piastri/oscpia01.png",
    bio: "Oscar Piastri is an Australian racing driver competing for McLaren. After dominating the junior categories and winning Formula 3 and Formula 2 in consecutive rookie years, he made a massive impact in his F1 debut. Known for his calm demeanor, analytical approach, and exceptional race pace, he is already a front-runner and future champion contender.",
  },
];

export default function DriverGridSection() {
  const [selectedDriver, setSelectedDriver] = useState<
    (typeof DRIVERS)[0] | null
  >(null);

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
          {DRIVERS.map((driver, i) => (
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
                  style={{
                    height: "90%",
                    objectFit: "contain",
                    position: "relative",
                    zIndex: 2,
                    filter: "drop-shadow(0 0 10px rgba(0,0,0,0.5))",
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://placehold.co/400x500/111/fff?text=No+Photo";
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
                    style={{
                      width: "90%",
                      maxHeight: "90%",
                      objectFit: "contain",
                      filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.5))",
                      position: "relative",
                      zIndex: 2,
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://placehold.co/400x500/111/fff?text=No+Photo";
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
