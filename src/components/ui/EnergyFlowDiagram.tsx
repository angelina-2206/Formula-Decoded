import { motion } from "framer-motion";

type EnergyFlowDiagramProps = {
    activeMode: string;
    modeColor: string;
};

export default function EnergyFlowDiagram({ activeMode, modeColor }: EnergyFlowDiagramProps) {
    // Shared animated line settings for energy flow
    const flowProps = {
        strokeDasharray: "8 8",
        animate: {
            strokeDashoffset: [0, -40]
        },
        transition: {
            repeat: Infinity,
            duration: 1.5,
            ease: "linear" as const
        }
    };

    // Reverse flow for harvesting (battery charging)
    const reverseFlowProps = {
        strokeDasharray: "8 8",
        animate: {
            strokeDashoffset: [0, 40]
        },
        transition: {
            repeat: Infinity,
            duration: 1.5,
            ease: "linear" as const
        }
    };

    const isRecharging = activeMode === "recharge";
    const flowColor = isRecharging ? "var(--color-blue)" : modeColor;
    const currentFlowProps = isRecharging ? reverseFlowProps : flowProps;

    return (
        <div style={{ position: "relative", width: "100%", height: "300px", marginTop: "2rem" }}>
            {/* SVG Overlay for Connections */}
            <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 1, pointerEvents: "none" }}>
                <defs>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Battery to MGU-K Flow Line */}
                <motion.path
                    d="M 120 220 L 120 150 L 250 150"
                    stroke={flowColor}
                    strokeWidth="3"
                    fill="none"
                    filter="url(#glow)"
                    opacity={0.8}
                    {...currentFlowProps}
                />

                {/* ICE to Engine/Output Flow Line */}
                <motion.path
                    d="M 250 80 L 350 80"
                    stroke={modeColor}
                    strokeWidth="3"
                    fill="none"
                    filter="url(#glow)"
                    opacity={activeMode === "recharge" ? 0.3 : 0.8}
                    {...flowProps}
                />

                {/* MGU-K to Output Flow Line */}
                <motion.path
                    d="M 250 150 L 350 150"
                    stroke={flowColor}
                    strokeWidth="3"
                    fill="none"
                    filter="url(#glow)"
                    opacity={0.8}
                    {...currentFlowProps}
                />

                {/* Turbo to ICE connection */}
                <motion.path
                    d="M 120 80 L 250 80"
                    stroke="rgba(240,240,240,0.3)"
                    strokeWidth="2"
                    fill="none"
                />
            </svg>

            {/* Component Blocks */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", height: "100%", position: "relative", zIndex: 2 }}>

                {/* Column 1: Energy Sources / Turbo */}
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    {/* Turbocharger */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="card-dark"
                        style={{ padding: "1rem", textAlign: "center", border: "1px solid rgba(240,240,240,0.1)", background: "var(--color-surface)" }}
                    >
                        <span className="hud-label">Turbo</span>
                    </motion.div>

                    {/* Energy Store (Battery) */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="card-dark"
                        style={{
                            padding: "1rem", textAlign: "center",
                            border: `1px solid ${isRecharging ? flowColor : "rgba(240,240,240,0.1)"}`,
                            boxShadow: isRecharging ? `0 0 15px ${flowColor}40` : "none",
                            background: "var(--color-surface)"
                        }}
                    >
                        <span className="hud-label">Energy Store</span>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: "0.8rem", color: isRecharging ? flowColor : "rgba(240,240,240,0.5)", marginTop: "0.5rem" }}>
                            {isRecharging ? "CHARGING" : "DISCHARGING"}
                        </div>
                    </motion.div>
                </div>

                {/* Column 2: Converters / Engines */}
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    {/* ICE */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="card-dark"
                        style={{ padding: "1.5rem 1rem", textAlign: "center", border: `1px solid ${activeMode !== "recharge" ? modeColor : "rgba(240,240,240,0.1)"}`, background: "var(--color-surface)" }}
                    >
                        <span className="hud-label">Internal Combustion</span>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: activeMode !== "recharge" ? modeColor : "rgba(240,240,240,0.5)", marginTop: "0.5rem" }}>
                            V6 1.6L
                        </div>
                    </motion.div>

                    {/* MGU-K */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="card-dark"
                        style={{ padding: "1.5rem 1rem", textAlign: "center", border: `1px solid ${flowColor}`, background: "var(--color-surface)" }}
                    >
                        <span className="hud-label">MGU-K</span>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: flowColor, marginTop: "0.5rem" }}>
                            350 kW
                        </div>
                    </motion.div>
                </div>

                {/* Column 3: Output */}
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="card-dark"
                        style={{ padding: "2rem 1rem", textAlign: "center", border: `2px solid ${modeColor}`, background: "var(--color-surface-2)" }}
                    >
                        <span className="hud-label" style={{ color: modeColor }}>Total Output</span>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: 800, color: "var(--color-text)", marginTop: "0.5rem", lineHeight: 1 }}>
                            {activeMode === "overtake" ? "1000+" : activeMode === "boost" ? "900" : "400"}
                        </div>
                        <span className="hud-label" style={{ fontSize: "0.6rem" }}>HP</span>
                    </motion.div>
                </div>

            </div>
        </div>
    );
}
