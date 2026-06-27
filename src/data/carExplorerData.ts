// ── Car Explorer Component Data ──────────────────────────────────────────────
// Each component maps to a mesh group in the GLB model (or procedural fallback).

export type SpecBar = { label: string; val: number };
export type SpecRow = { k: string; v: string; highlight?: boolean };

export type ComponentSpecs = {
  overview: string;
  technical: SpecRow[];
  bars: SpecBar[];
  tags: string[];
  note: string;
};

export type CarComponent = {
  id: number;
  meshIdx: number;
  name: string;
  short: string;
  tag: string;
  desc: string;
  explodeDir: [number, number, number];
  specs: ComponentSpecs;
};

export const COMPONENTS: CarComponent[] = [
  {
    id: 0,
    meshIdx: 0,
    name: "FRONT WING",
    short: "Front Wing",
    tag: "AERODYNAMICS",
    desc: "Multi-element composite wing with active DRS flap",
    explodeDir: [0, 0.3, 2.2],
    specs: {
      overview:
        "The front wing generates roughly 25-30% of total downforce. Its complex multi-element design manages airflow for the entire car, directing clean air to the sidepod inlets and conditioning vortices to reduce drag at the rear.",
      technical: [
        { k: "Material", v: "Carbon fibre composite" },
        { k: "Weight", v: "≈ 4.2 kg" },
        { k: "Elements", v: "5-element cascade" },
        { k: "Downforce share", v: "~28% total" },
        { k: "DRS angle", v: "15° → 0° (stall)" },
        { k: "Max load", v: "~2,500 N" },
      ],
      bars: [
        { label: "Downforce contribution", val: 28 },
        { label: "Drag sensitivity", val: 72 },
        { label: "Structural stiffness", val: 90 },
      ],
      tags: ["DRS CAPABLE", "ACTIVE AERO", "CARBON FIBRE", "FIA ART.3.9"],
      note: "2026 REG: Active aerodynamic systems replace traditional DRS. Wings auto-adjust between corner (high-DF) and straight (low-drag) modes based on speed threshold.",
    },
  },
  {
    id: 1,
    meshIdx: 1,
    name: "MONOCOQUE",
    short: "Chassis",
    tag: "CHASSIS",
    desc: "Carbon fibre safety cell — the structural core of the car",
    explodeDir: [0, 0, 0],
    specs: {
      overview:
        "The monocoque is the central survival cell housing the driver. Constructed from pre-preg carbon fibre autoclave-cured at 120°C, it must withstand 25G frontal impacts, side-intrusion tests, and roof crush loads per FIA Article 15.",
      technical: [
        { k: "Material", v: "Pre-preg CF + Kevlar" },
        { k: "Wall thickness", v: "3.5 – 8 mm" },
        { k: "Total weight", v: "≈ 38 kg" },
        { k: "Torsional stiffness", v: ">12,000 Nm/°" },
        { k: "Min driver weight", v: "80 kg (driver+seat)" },
        { k: "Halo attachment", v: "6 × M12 titanium bolts" },
      ],
      bars: [
        { label: "Structural rigidity", val: 98 },
        { label: "Crash energy absorption", val: 94 },
        { label: "Weight optimisation", val: 88 },
      ],
      tags: ["FIA ART.15", "SURVIVAL CELL", "HALO MOUNT", "HOMOLOGATED"],
      note: 'Monocoque must be recertified by FIA after any modification. Red Bull use a "coke bottle" narrowing behind the cockpit to improve rear aerodynamic efficiency.',
    },
  },
  {
    id: 2,
    meshIdx: 2,
    name: "REAR WING",
    short: "Rear Wing",
    tag: "AERODYNAMICS",
    desc: "Beam wing + main plane generating rear downforce and DRS",
    explodeDir: [0, 0.4, -2.0],
    specs: {
      overview:
        "The rear wing is the single largest downforce-generating device on the car, producing up to 800N of load at race speeds. DRS opens the top flap reducing drag by ~10 km/h on straights.",
      technical: [
        { k: "Main plane AoA", v: "10° – 30°" },
        { k: "DRS chord length", v: "≈ 400 mm" },
        { k: "Drag reduction (DRS)", v: "~20–25% less drag" },
        { k: "Top speed delta", v: "+10–12 km/h" },
        { k: "Material", v: "Carbon fibre, titanium nuts" },
        { k: "Beam wing gap", v: "10 mm minimum" },
      ],
      bars: [
        { label: "Downforce contribution", val: 35 },
        { label: "Drag at 300 km/h", val: 65 },
        { label: "DRS efficiency gain", val: 80 },
      ],
      tags: ["DRS ZONE", "FIA ART.3.10", "ACTIVE ELEMENT", "BEAM WING"],
      note: "2026 regulation change: DRS abolished. Replaced by Moveable Aero System (MAS) which uses wing flex controlled by hydraulic actuators — teams can no longer tune gap settings freely.",
    },
  },
  {
    id: 3,
    meshIdx: 3,
    name: "SIDEPODS & COOLING",
    short: "Sidepods",
    tag: "THERMAL MGMT",
    desc: "Undercut sidepods housing radiators, intercooler, oil coolers",
    explodeDir: [1.6, 0, 0],
    specs: {
      overview:
        "Sidepods house the radiator stack, intercooler, hydraulic fluid cooler, and gearbox oil cooler. Airflow management through the inlet is the primary differentiator between teams — RB19's extreme undercut was the most aggressive in 2023.",
      technical: [
        { k: "Inlet area", v: "≈ 0.12 m²" },
        { k: "Radiator count", v: "2× water + 1× oil" },
        { k: "Coolant temp range", v: "80 – 110 °C" },
        { k: "Undercut depth", v: "Max per ART.3.5" },
        { k: "Exit chimney area", v: "Free (engine cover)" },
        { k: "Floor connection", v: "Diffuser outwash zone" },
      ],
      bars: [
        { label: "Cooling efficiency", val: 87 },
        { label: "Aero impact (negative)", val: 55 },
        { label: "Packaging complexity", val: 92 },
      ],
      tags: ["THERMAL", "RADIATOR STACK", "UNDERCUT", "OUTWASH VORTEX"],
      note: "RB19 pioneered extreme sidepod undercuts with near-zero side profile. This reduces drag but demands aggressive internal packaging — all cooling stacked almost vertically.",
    },
  },
  {
    id: 4,
    meshIdx: 4,
    name: "FLOOR & DIFFUSER",
    short: "Floor",
    tag: "GROUND EFFECT",
    desc: "Primary downforce source via ground-effect venturi tunnels",
    explodeDir: [0, -0.9, 0],
    specs: {
      overview:
        "Since 2022, F1 returned to ground effect. The floor's venturi channels accelerate airflow beneath the car creating a low-pressure zone that \"sucks\" the car down. The rear diffuser expands this flow, recovering pressure and generating 40-45% of total downforce.",
      technical: [
        { k: "Ride height (front)", v: "8 – 15 mm" },
        { k: "Ride height (rear)", v: "60 – 90 mm" },
        { k: "Venturi channels", v: "2 tunnels per side" },
        { k: "Diffuser expansion", v: "13° max angle" },
        { k: "Downforce share", v: "~40% total" },
        { k: "Porpoising threshold", v: "< 8 mm → stall" },
      ],
      bars: [
        { label: "Downforce contribution", val: 42 },
        { label: "Ride height sensitivity", val: 95 },
        { label: "Porpoising risk", val: 68 },
      ],
      tags: ["GROUND EFFECT", "VENTURI", "DIFFUSER", "FIA ART.3.15"],
      note: '2022 regs introduced floor edges and a sealed underfloor. Teams discovered "porpoising" — aerodynamic stall at low ride heights causing violent oscillations — a unique challenge for 2022 season.',
    },
  },
  {
    id: 5,
    meshIdx: 5,
    name: "POWER UNIT",
    short: "Power Unit",
    tag: "POWERTRAIN",
    desc: "1.6L turbo-hybrid V6 — 1000+ HP combined output",
    explodeDir: [0, 0.5, -0.4],
    specs: {
      overview:
        "The F1 power unit is the most thermally efficient internal combustion engine ever built, achieving ~52% thermal efficiency vs ~40% for road cars. It combines a 1.6L V6 ICE with two motor-generator units (MGU-K and MGU-H) and an energy store.",
      technical: [
        { k: "ICE displacement", v: "1,600 cc V6" },
        { k: "Rev limit", v: "15,000 RPM (FIA)" },
        { k: "Thermal efficiency", v: "~52%" },
        { k: "ICE output", v: "~565 kW (~760 HP)" },
        { k: "MGU-K peak output", v: "120 kW (FIA limit)" },
        { k: "Total combined", v: ">1000 HP" },
        { k: "Fuel flow limit", v: "100 kg/hr at >10,500 RPM" },
        { k: "Fuel per race", v: "110 kg (2026: 70 kg)" },
      ],
      bars: [
        { label: "Thermal efficiency", val: 52 },
        { label: "Power density", val: 97 },
        { label: "Reliability (2023)", val: 88 },
      ],
      tags: ["HONDA RBPT", "ICE + ERS", "MGU-K", "TURBO"],
      note: "2026 rules increase electrical power to 350 kW MGU-K (vs 120 kW now) with a 50/50 ICE/electric power split — fundamentally changing engine-braking, energy deployment strategy, and fuel composition.",
    },
  },
  {
    id: 6,
    meshIdx: 6,
    name: "SUSPENSION & WHEELS",
    short: "Suspension",
    tag: "CHASSIS",
    desc: "Double-wishbone pull/push rod with inboard dampers",
    explodeDir: [1.4, -0.3, 0.5],
    specs: {
      overview:
        "F1 uses double-wishbone suspension with inboard-mounted springs and dampers connected via pull-rod (rear) or push-rod (front) geometry. The suspension must simultaneously manage aerodynamic ride height and mechanical grip — often conflicting targets.",
      technical: [
        { k: "Front geometry", v: "Pushrod double wishbone" },
        { k: "Rear geometry", v: "Pullrod double wishbone" },
        { k: "Spring rate (front)", v: "100 – 300 N/mm" },
        { k: "Spring rate (rear)", v: "80 – 220 N/mm" },
        { k: "Camber range", v: "-3.5° to 0°" },
        { k: "Toe range", v: "-0.2° to +0.2°" },
        { k: "Wheel diameter", v: '18-inch (since 2022)' },
        { k: "Tyre supplier", v: "Pirelli (sole supplier)" },
      ],
      bars: [
        { label: "Mechanical grip", val: 78 },
        { label: "Aero-mechanical conflict", val: 82 },
        { label: "Setup complexity", val: 95 },
      ],
      tags: ["PULLROD REAR", "PUSHROD FRONT", "18-INCH RIM", "PIRELLI P-ZERO"],
      note: "Active suspension has been banned since 1994. 2026 proposals discussed reintroduction but FIA confirmed continued ban. Teams use heave springs and inerters to control aerodynamic ride height indirectly.",
    },
  },
];

export type ViewMode = "assembled" | "exploded" | "xray";
