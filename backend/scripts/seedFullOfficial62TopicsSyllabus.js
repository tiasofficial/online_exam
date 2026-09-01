const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/online-exam-portal';

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB Atlas for FULL 62-OFFICIAL-SYLLABUS SEEDING...'))
  .catch(err => console.error('MongoDB connection error:', err));

const questionBankSchema = new mongoose.Schema({
  body: { type: String, required: true },
  bodyImage: { type: String, default: '' },
  options: [{ type: String, required: true }],
  optionImages: [{ type: String }],
  answer: { type: mongoose.Schema.Types.Mixed, required: true },
  subject: { type: String, required: true },
  examType: { type: String, enum: ['JEE-Mains', 'NEET', 'BOTH'], default: 'BOTH' },
  topic: { type: String, default: 'General' },
  questionType: { type: String, enum: ['SINGLE', 'MULTIPLE', 'NUMERICAL'], default: 'SINGLE' },
  marks: { type: Number, default: 4 },
  explanation: { type: String, default: '' },
  isPyq: { type: Boolean, default: false },
  pyqTag: { type: String, default: '' }
}, { timestamps: true });

const questionBankModel = mongoose.models.questionbank || mongoose.model('questionbank', questionBankSchema);

const pyqYearsList = ['2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'];

// ==========================================
// 🎨 SVG BUILDERS
// ==========================================
function getResistorCircuitSvg(r1, r2, v) {
  return `<svg width="260" height="90" viewBox="0 0 260 90" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border:1px solid #cbd5e1; border-radius:8px;">
    <path d="M 20 45 L 60 45 M 100 45 L 160 45 M 200 45 L 240 45 L 240 75 L 20 75 Z" fill="none" stroke="#2563eb" stroke-width="2"/>
    <rect x="60" y="35" width="40" height="20" fill="#eff6ff" stroke="#2563eb" stroke-width="2" rx="3"/>
    <text x="80" y="30" font-size="9" font-weight="bold" fill="#1e40af" text-anchor="middle">R1 = ${r1}Ω</text>
    <rect x="160" y="35" width="40" height="20" fill="#eff6ff" stroke="#2563eb" stroke-width="2" rx="3"/>
    <text x="180" y="30" font-size="9" font-weight="bold" fill="#1e40af" text-anchor="middle">R2 = ${r2}Ω</text>
    <line x1="125" y1="68" x2="125" y2="82" stroke="#dc2626" stroke-width="3"/>
    <line x1="135" y1="72" x2="135" y2="78" stroke="#dc2626" stroke-width="1.5"/>
    <text x="130" y="63" font-size="9" font-weight="bold" fill="#b91c1c" text-anchor="middle">V = ${v}V</text>
  </svg>`;
}

function getWheatstoneSvg(r1, r2, r3, r4) {
  return `<svg width="240" height="110" viewBox="0 0 240 110" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border:1px solid #cbd5e1; border-radius:8px;">
    <polygon points="120,15 190,55 120,95 50,55" fill="none" stroke="#0284c7" stroke-width="2"/>
    <line x1="50" y1="55" x2="190" y2="55" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="3 2"/>
    <circle cx="120" cy="55" r="9" fill="#fee2e2" stroke="#dc2626" stroke-width="1.5"/>
    <text x="120" y="58" font-size="8" font-weight="bold" fill="#991b1b" text-anchor="middle">G</text>
    <text x="80" y="30" font-size="9" font-weight="bold" fill="#0369a1">${r1}Ω</text>
    <text x="160" y="30" font-size="9" font-weight="bold" fill="#0369a1">${r2}Ω</text>
    <text x="80" y="85" font-size="9" font-weight="bold" fill="#0369a1">${r3}Ω</text>
    <text x="160" y="85" font-size="9" font-weight="bold" fill="#0369a1">${r4}Ω</text>
  </svg>`;
}

function getConvexLensSvg(f) {
  return `<svg width="240" height="90" viewBox="0 0 240 90" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border:1px solid #cbd5e1; border-radius:8px;">
    <line x1="10" y1="45" x2="230" y2="45" stroke="#94a3b8" stroke-width="1.2"/>
    <path d="M 120 10 Q 142 45 120 80 Q 98 45 120 10 Z" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
    <circle cx="${120 - f}" cy="45" r="3" fill="#dc2626"/>
    <circle cx="${120 + f}" cy="45" r="3" fill="#dc2626"/>
    <text x="${120 - f}" y="62" font-size="8" font-weight="bold" fill="#b91c1c" text-anchor="middle">F1(-${f}cm)</text>
    <text x="${120 + f}" y="62" font-size="8" font-weight="bold" fill="#b91c1c" text-anchor="middle">F2(+${f}cm)</text>
  </svg>`;
}

function getLogicGateSvg(gateType) {
  return `<svg width="200" height="80" viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border:1px solid #cbd5e1; border-radius:8px;">
    <line x1="15" y1="25" x2="60" y2="25" stroke="#334155" stroke-width="2"/>
    <line x1="15" y1="55" x2="60" y2="55" stroke="#334155" stroke-width="2"/>
    <path d="M 60 15 L 90 15 A 25 25 0 0 1 90 65 L 60 65 Z" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/>
    <line x1="115" y1="40" x2="175" y2="40" stroke="#334155" stroke-width="2"/>
    <text x="15" y="20" font-size="8" font-weight="bold" fill="#1e293b">A</text>
    <text x="15" y="68" font-size="8" font-weight="bold" fill="#1e293b">B</text>
    <text x="85" y="44" font-size="9" font-weight="bold" fill="#1d4ed8" text-anchor="middle">${gateType}</text>
    <text x="180" y="44" font-size="8" font-weight="bold" fill="#1e293b">Y</text>
  </svg>`;
}

function getDnaSvg() {
  return `<svg width="240" height="95" viewBox="0 0 240 95" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border:1px solid #cbd5e1; border-radius:8px;">
    <path d="M 20 25 Q 60 70 100 25 T 180 25 T 220 70" fill="none" stroke="#db2777" stroke-width="2"/>
    <path d="M 20 70 Q 60 25 100 70 T 180 70 T 220 25" fill="none" stroke="#9333ea" stroke-width="2"/>
    <line x1="60" y1="35" x2="60" y2="60" stroke="#be185d" stroke-width="1.5"/>
    <line x1="100" y1="25" x2="100" y2="70" stroke="#7e22ce" stroke-width="1.5"/>
    <line x1="140" y1="35" x2="140" y2="60" stroke="#be185d" stroke-width="1.5"/>
    <text x="120" y="87" font-size="9" font-weight="600" fill="#831843" text-anchor="middle">DNA Replication Fork (5' → 3')</text>
  </svg>`;
}

// ==========================================
// 📜 OFFICIAL 62 CHAPTER TOPICS & GENERATORS
// ==========================================

// --- PHYSICS (20 CHAPTERS) ---
const physicsSyllabusGenerators = [
  (id) => ({
    topic: 'Physics and Measurement',
    body: `Determine the dimensional formula of universal gravitational constant $G$ (given $F = G \\frac{m_1 m_2}{r^2}$):`,
    opts: ['$[M^{-1} L^3 T^{-2}]$', '$[M^1 L^2 T^{-2}]$', '$[M^{-1} L^2 T^{-1}]$', '$[M^0 L^3 T^{-2}]$'],
    ans: '$[M^{-1} L^3 T^{-2}]$',
    exp: '$G = \\frac{F r^2}{m^2} = \\frac{[M L T^{-2}][L^2]}{[M^2]} = [M^{-1} L^3 T^{-2}]$.'
  }),
  (id) => {
    const u = (id * 5 + 10) % 40 + 20;
    const range = ((u * u) / 10).toFixed(1);
    return {
      topic: 'Kinematics',
      body: `A projectile is launched with velocity $u = ${u}\\text{ m/s}$ at angle $\\theta = 45^\\circ$. Calculate horizontal range $R$ ($g = 10\\text{ m/s}^2$):`,
      opts: [`$${range}\\text{ m}$`, `$${(range / 2).toFixed(1)}\\text{ m}$`, `$${u * 2}\\text{ m}$`, `$${(range * 1.5).toFixed(1)}\\text{ m}$`],
      ans: `$${range}\\text{ m}$`,
      exp: `Range $R = \\frac{u^2 \\sin 2\\theta}{g} = \\frac{${u}^2}{10} = ${range}\\text{ m}$.`
    };
  },
  (id) => ({
    topic: 'Laws of Motion',
    body: `A force $F = 20\\text{ N}$ acts on a mass $m = 4\\text{ kg}$ on a rough horizontal plane (coefficient of static friction $\\mu_s = 0.4$). Calculate maximum static frictional force $f_{s,\\text{max}}$ ($g = 10\\text{ m/s}^2$):`,
    opts: ['$16.0\\text{ N}$', '$20.0\\text{ N}$', '$8.0\\text{ N}$', '$4.0\\text{ N}$'],
    ans: '$16.0\\text{ N}$',
    exp: '$f_{s,\\text{max}} = \\mu_s N = 0.4 \\times (4 \\times 10) = 16.0\\text{ N}$.'
  }),
  (id) => ({
    topic: 'Work, Energy and Power',
    body: `A spring of force constant $k = 400\\text{ N/m}$ is compressed by $x = 0.1\\text{ m}$. Calculate the potential energy stored $U$:`,
    opts: ['$2.0\\text{ J}$', '$4.0\\text{ J}$', '$20.0\\text{ J}$', '$0.2\\text{ J}$'],
    ans: '$2.0\\text{ J}$',
    exp: '$U = \\frac{1}{2} k x^2 = \\frac{1}{2} \\times 400 \\times (0.1)^2 = 2.0\\text{ J}$.'
  }),
  (id) => ({
    topic: 'Rotational Motion',
    body: `Calculate the moment of inertia $I$ of a uniform solid sphere of mass $M = 5\\text{ kg}$ and radius $R = 0.2\\text{ m}$ about its diameter:`,
    opts: ['$0.08\\text{ kg m}^2$', '$0.20\\text{ kg m}^2$', '$0.10\\text{ kg m}^2$', '$0.04\\text{ kg m}^2$'],
    ans: '$0.08\\text{ kg m}^2$',
    exp: '$I = \\frac{2}{5} M R^2 = \\frac{2}{5} \\times 5 \\times (0.2)^2 = 0.08\\text{ kg m}^2$.'
  }),
  (id) => {
    const r = (id * 100 + 6000) % 3000 + 6400;
    const ve = (Math.sqrt(2 * 9.8 * r * 1000) / 1000).toFixed(2);
    return {
      topic: 'Gravitation',
      body: `Calculate escape velocity $v_e$ from a planet of radius $R = ${r}\\text{ km}$ ($g = 9.8\\text{ m/s}^2$):`,
      opts: [`$${ve}\\text{ km/s}$`, `$${(ve * 1.414).toFixed(2)}\\text{ km/s}$`, `$11.2\\text{ km/s}$`, `$5.6\\text{ km/s}$`],
      ans: `$${ve}\\text{ km/s}$`,
      exp: `$v_e = \\sqrt{2gR} = ${ve}\\text{ km/s}$.`
    };
  },
  (id) => ({
    topic: 'Properties of Solids and Liquids',
    body: `A spherical rain drop of radius $r = 1\\text{ mm}$ falls through air (viscosity $\\eta = 1.8 \\times 10^{-5}\\text{ N s/m}^2$). Calculate Stokes\' viscous drag force at speed $v = 10\\text{ m/s}$:`,
    opts: ['$3.39 \\times 10^{-6}\\text{ N}$', '$1.80 \\times 10^{-5}\\text{ N}$', '$6.78 \\times 10^{-6}\\text{ N}$', '$1.00 \\times 10^{-4}\\text{ N}$'],
    ans: '$3.39 \\times 10^{-6}\\text{ N}$',
    exp: '$F = 6\\pi \\eta r v = 6 \\times \\pi \\times (1.8 \\times 10^{-5}) \\times (10^{-3}) \\times (10) = 3.39 \\times 10^{-6}\\text{ N}$.'
  }),
  (id) => ({
    topic: 'Thermodynamics',
    body: `A Carnot engine absorbs $Q_1 = 1000\\text{ J}$ of heat from a reservoir at $T_1 = 500\\text{ K}$ and rejects heat to a sink at $T_2 = 300\\text{ K}$. Calculate efficiency $\\eta$:`,
    opts: ['$40\\%$', '$60\\%$', '$50\\%$', '$20\\%$'],
    ans: '$40\\%$',
    exp: '$\\eta = 1 - \\frac{T_2}{T_1} = 1 - \\frac{300}{500} = 0.40 = 40\\%$.'
  }),
  (id) => ({
    topic: 'Kinetic Theory of Gases',
    body: `Calculate root-mean-square speed $v_{\\text{rms}}$ of Oxygen molecules ($M = 32\\text{ g/mol}$) at temperature $T = 300\\text{ K}$ ($R = 8.314\\text{ J/mol K}$):`,
    opts: ['$483.4\\text{ m/s}$', '$300.0\\text{ m/s}$', '$600.0\\text{ m/s}$', '$241.7\\text{ m/s}$'],
    ans: '$483.4\\text{ m/s}$',
    exp: '$v_{\\text{rms}} = \\sqrt{\\frac{3RT}{M}} = \\sqrt{\\frac{3 \\times 8.314 \\times 300}{0.032}} = 483.4\\text{ m/s}$.'
  }),
  (id) => {
    const m = (id % 5) + 1;
    const k = (id % 4) * 100 + 100;
    const t = (2 * Math.PI * Math.sqrt(m / k)).toFixed(3);
    return {
      topic: 'Oscillations and Waves',
      body: `A particle of mass $m = ${m}\\text{ kg}$ executes SHM with spring constant $k = ${k}\\text{ N/m}$. Calculate period $T$:`,
      opts: [`$${t}\\text{ s}$`, `$${(t * 2).toFixed(3)}\\text{ s}$`, `$${(t / 2).toFixed(3)}\\text{ s}$`, `$1.00\\text{ s}$`],
      ans: `$${t}\\text{ s}$`,
      exp: `$T = 2\\pi \\sqrt{\\frac{m}{k}} = ${t}\\text{ s}$.`
    };
  },
  (id) => ({
    topic: 'Electrostatics',
    body: `Two point charges $+2\\,\\mu\\text{C}$ and $+8\\,\\mu\\text{C}$ are placed $r = 0.3\\text{ m}$ apart in vacuum. Calculate Coulomb electrostatic force $F$ ($k = 9 \\times 10^9\\text{ N m}^2/\\text{C}^2$):`,
    opts: ['$1.60\\text{ N}$', '$3.20\\text{ N}$', '$0.80\\text{ N}$', '$16.0\\text{ N}$'],
    ans: '$1.60\\text{ N}$',
    exp: '$F = \\frac{k q_1 q_2}{r^2} = \\frac{9\\times 10^9 \\times (2\\times 10^{-6}) \\times (8\\times 10^{-6})}{(0.3)^2} = 1.60\\text{ N}$.'
  }),
  (id) => {
    const r1 = (id * 2 + 1) % 8 + 2;
    const r2 = (id * 3 + 2) % 6 + 3;
    const v = (id * 4 + 1) % 10 + 6;
    const req = r1 + r2;
    const pTotal = (v * v / req).toFixed(2);
    const svg = getResistorCircuitSvg(r1, r2, v);
    return {
      topic: 'Current Electricity',
      body: `Analyze the DC resistor circuit with $R_1 = ${r1}\\,\\Omega, R_2 = ${r2}\\,\\Omega$, and $V = ${v}\\text{ V}$:\n${svg}\nCalculate total dissipated power $P$:`,
      opts: [`$${pTotal}\\text{ W}$`, `$${(pTotal * 1.5).toFixed(2)}\\text{ W}$`, `$${(pTotal / 2).toFixed(2)}\\text{ W}$`, `$${v * r1}\\text{ W}$`],
      ans: `$${pTotal}\\text{ W}$`,
      exp: `$R_{eq} = ${req}\\,\\Omega$. $P = \\frac{V^2}{R_{eq}} = ${pTotal}\\text{ W}$.`
    };
  },
  (id) => ({
    topic: 'Magnetic Effects of Current and Magnetism',
    body: `Calculate magnetic field $B$ at the center of a circular wire loop of radius $R = 0.1\\text{ m}$ carrying current $I = 5\\text{ A}$ (take $\\mu_0 = 4\\pi \\times 10^{-7}\\text{ T m/A}$):`,
    opts: ['$3.14 \\times 10^{-5}\\text{ T}$', '$6.28 \\times 10^{-5}\\text{ T}$', '$1.57 \\times 10^{-5}\\text{ T}$', '$3.14 \\times 10^{-4}\\text{ T}$'],
    ans: '$3.14 \\times 10^{-5}\\text{ T}$',
    exp: '$B = \\frac{\\mu_0 I}{2R} = \\frac{4\\pi \\times 10^{-7} \\times 5}{2 \\times 0.1} = 3.14 \\times 10^{-5}\\text{ T}$.'
  }),
  (id) => ({
    topic: 'Electromagnetic Induction and Alternating Currents',
    body: `In an AC circuit, peak voltage $V_0 = 311\\text{ V}$. Calculate RMS voltage $V_{\\text{rms}}$:`,
    opts: ['$220.0\\text{ V}$', '$311.0\\text{ V}$', '$155.5\\text{ V}$', '$440.0\\text{ V}$'],
    ans: '$220.0\\text{ V}$',
    exp: '$V_{\\text{rms}} = \\frac{V_0}{\\sqrt{2}} = \\frac{311}{1.414} = 220.0\\text{ V}$.'
  }),
  (id) => ({
    topic: 'Electromagnetic Waves',
    body: `Which component of the electromagnetic spectrum has the highest frequency and photon energy?`,
    opts: ['Gamma Rays', 'X-Rays', 'Ultraviolet Waves', 'Radio Waves'],
    ans: 'Gamma Rays',
    exp: 'Gamma rays have the shortest wavelength ($< 10^{-12}\\text{ m}$) and highest frequency ($> 10^{20}\\text{ Hz}$).'
  }),
  (id) => {
    const f = (id * 3 + 5) % 20 + 10;
    const p = (100 / f).toFixed(2);
    const svg = getConvexLensSvg(f);
    return {
      topic: 'Optics',
      body: `A convex thin lens with schematic shown below has $f = +${f}\\text{ cm}$:\n${svg}\nFind optical power $P$:`,
      opts: [`$+${p}\\text{ D}$`, `$-${p}\\text{ D}$`, `$${(f / 100).toFixed(2)}\\text{ D}$`, `$+10.0\\text{ D}$`],
      ans: `$+${p}\\text{ D}$`,
      exp: `$P = \\frac{100}{f(\\text{cm})} = +${p}\\text{ D}$.`
    };
  },
  (id) => ({
    topic: 'Dual Nature of Matter and Radiation',
    body: `Incident light of photon energy $E = 4.5\\text{ eV}$ strikes a metal surface with work function $\\phi = 2.1\\text{ eV}$. Calculate stopping potential $V_0$:`,
    opts: ['$2.40\\text{ V}$', '$4.50\\text{ V}$', '$2.10\\text{ V}$', '$6.60\\text{ V}$'],
    ans: '$2.40\\text{ V}$',
    exp: '$e V_0 = E - \\phi = 4.5 - 2.1 = 2.4\\text{ eV} \\implies V_0 = 2.40\\text{ V}$.'
  }),
  (id) => ({
    topic: 'Atoms and Nuclei',
    body: `Calculate the radius $r_1$ of the first Bohr orbit ($n = 1$) of a Hydrogen atom:`,
    opts: ['$0.529\\text{ \\AA}$', '$2.116\\text{ \\AA}$', '$1.058\\text{ \\AA}$', '$0.2645\\text{ \\AA}$'],
    ans: '$0.529\\text{ \\AA}$',
    exp: '$r_n = 0.529 n^2 \\implies r_1 = 0.529\\text{ \\AA}$.'
  }),
  (id) => {
    const gates = ['AND', 'OR', 'NAND', 'NOR'];
    const gType = gates[id % gates.length];
    const svg = getLogicGateSvg(gType);
    const ansStr = gType === 'AND' ? 'Y = A · B' : (gType === 'OR' ? 'Y = A + B' : (gType === 'NAND' ? 'Y = \\overline{A · B}' : 'Y = \\overline{A + B}'));
    return {
      topic: 'Electronic Devices',
      body: `Identify the Boolean output expression $Y$ for the logic gate schematic shown below:\n${svg}`,
      opts: [`$${ansStr}$`, `$Y = A \\oplus B$`, `$Y = A$`, `$Y = \\overline{A}$`],
      ans: `$${ansStr}$`,
      exp: `The ${gType} gate yields Boolean output $${ansStr}$.`
    };
  },
  (id) => ({
    topic: 'Experimental Skills',
    body: `A Vernier Caliper has 10 main scale divisions (MSD = 1 mm) matching 10 Vernier scale divisions (VSD). Calculate Least Count (LC):`,
    opts: ['$0.1\\text{ mm}$', '$0.01\\text{ mm}$', '$1.0\\text{ mm}$', '$0.05\\text{ mm}$'],
    ans: '$0.1\\text{ mm}$',
    exp: 'Least Count $\\text{LC} = 1\\text{ MSD} - 1\\text{ VSD} = 1\\text{ mm} - 0.9\\text{ mm} = 0.1\\text{ mm}$.'
  })
];

// --- CHEMISTRY (19 CHAPTERS) ---
const chemistrySyllabusGenerators = [
  (id) => ({
    topic: 'Some Basic Concepts in Chemistry',
    body: `Calculate the mass of $2.5\\text{ moles}$ of Sodium Hydroxide ($\\text{NaOH}$, Molar mass $= 40\\text{ g/mol}$):`,
    opts: ['$100.0\\text{ g}$', '$80.0\\text{ g}$', '$40.0\\text{ g}$', '$120.0\\text{ g}$'],
    ans: '$100.0\\text{ g}$',
    exp: '$\\text{Mass} = \\text{moles} \\times \\text{Molar mass} = 2.5 \\times 40 = 100.0\\text{ g}$.'
  }),
  (id) => ({
    topic: 'Atomic Structure',
    body: `According to the Bohr model, calculate the energy $E_1$ of an electron in the ground state ($n = 1$) of a Hydrogen atom:`,
    opts: ['$-13.6\\text{ eV}$', '$-3.4\\text{ eV}$', '$-1.51\\text{ eV}$', '$0.0\\text{ eV}$'],
    ans: '$-13.6\\text{ eV}$',
    exp: '$E_n = -\\frac{13.6}{n^2} \\implies E_1 = -13.6\\text{ eV}$.'
  }),
  (id) => ({
    topic: 'Chemical Bonding and Molecular Structure',
    body: `According to VSEPR theory, determine the hybridization and shape of Sulfur Hexafluoride ($\\text{SF}_6$):`,
    opts: ['$sp^3d^2$ and Octahedral', '$sp^3d$ and Trigonal Bipyramidal', '$sp^3$ and Tetrahedral', '$sp^2$ and Planar'],
    ans: '$sp^3d^2$ and Octahedral',
    exp: '$\\text{SF}_6$ has 6 bond pairs around Sulfur $\\implies sp^3d^2$ hybridization with Octahedral geometry.'
  }),
  (id) => ({
    topic: 'Chemical Thermodynamics',
    body: `For a chemical process at $298\\text{ K}$, enthalpy change $\\Delta H = -50\\text{ kJ/mol}$ and entropy change $\\Delta S = -100\\text{ J/K mol}$. Calculate $\\Delta G$:`,
    opts: ['$-20.2\\text{ kJ/mol}$', '$-79.8\\text{ kJ/mol}$', '$+20.2\\text{ kJ/mol}$', '$-50.0\\text{ kJ/mol}$'],
    ans: '$-20.2\\text{ kJ/mol}$',
    exp: '$\\Delta G = \\Delta H - T \\Delta S = -50 - 298 \\times (-0.100) = -20.2\\text{ kJ/mol}$.'
  }),
  (id) => ({
    topic: 'Solutions',
    body: `Calculate the molality ($m$) of a solution containing $20\\text{ g}$ of $\\text{NaOH}$ (Molar mass $= 40\\text{ g/mol}$) dissolved in $500\\text{ g}$ of water:`,
    opts: ['$1.0\\text{ m}$', '$0.5\\text{ m}$', '$2.0\\text{ m}$', '$0.25\\text{ m}$'],
    ans: '$1.0\\text{ m}$',
    exp: '$\\text{Moles of NaOH} = \\frac{20}{40} = 0.5$. $\\text{Molality} = \\frac{0.5}{0.500\\text{ kg}} = 1.0\\text{ m}$.'
  }),
  (id) => ({
    topic: 'Equilibrium',
    body: `If an aqueous solution at $25^\\circ\\text{C}$ has $\\text{pH} = 4.0$, calculate its hydroxyl ion concentration $[\\text{OH}^-]$:`,
    opts: ['$1.0 \\times 10^{-10}\\text{ M}$', '$1.0 \\times 10^{-4}\\text{ M}$', '$1.0 \\times 10^{-14}\\text{ M}$', '$1.0 \\times 10^{-7}\\text{ M}$'],
    ans: '$1.0 \\times 10^{-10}\\text{ M}$',
    exp: '$\\text{pOH} = 14 - 4 = 10 \\implies [\\text{OH}^-] = 10^{-10}\\text{ M}$.'
  }),
  (id) => ({
    topic: 'Redox Reactions and Electrochemistry',
    body: `For the Daniell cell $\\text{Zn(s)}|\\text{Zn}^{2+}(1\\text{ M})||\\text{Cu}^{2+}(0.1\\text{ M})|\\text{Cu(s)}$ with $E^0 = +1.10\\text{ V}$, calculate $E_{\\text{cell}}$ at $298\\text{ K}$:`,
    opts: ['$+1.070\\text{ V}$', '$+1.130\\text{ V}$', '$+1.100\\text{ V}$', '$-1.070\\text{ V}$'],
    ans: '$+1.070\\text{ V}$',
    exp: '$E_{\\text{cell}} = 1.10 - \\frac{0.0591}{2}\\log_{10}(10) = 1.10 - 0.0295 = 1.070\\text{ V}$.'
  }),
  (id) => ({
    topic: 'Chemical Kinetics',
    body: `The half-life period $t_{1/2}$ of a first-order reaction is $30\\text{ min}$. Calculate rate constant $k$:`,
    opts: ['$0.0231\\text{ min}^{-1}$', '$0.0693\\text{ min}^{-1}$', '$30.0\\text{ min}^{-1}$', '$0.0010\\text{ min}^{-1}$'],
    ans: '$0.0231\\text{ min}^{-1}$',
    exp: '$k = \\frac{0.693}{30} = 0.0231\\text{ min}^{-1}$.'
  }),
  (id) => ({
    topic: 'Classification of Elements and Periodicity',
    body: `Which of the following elements has the highest first ionization enthalpy?`,
    opts: ['Helium (He)', 'Neon (Ne)', 'Fluorine (F)', 'Lithium (Li)'],
    ans: 'Helium (He)',
    exp: 'Helium has the highest ionization energy ($2372\\text{ kJ/mol}$) due to its stable $1s^2$ closed shell.'
  }),
  (id) => ({
    topic: 'p-Block Elements',
    body: `Identify the anhydride of Nitric Acid ($\\text{HNO}_3$):`,
    opts: ['$\\text{N}_2\\text{O}_5$', '$\\text{NO}_2$', '$\\text{N}_2\\text{O}_3$', '$\\text{N}_2\\text{O}$'],
    ans: '$\\text{N}_2\\text{O}_5$',
    exp: '$2\\text{HNO}_3 \\xrightarrow{-\\text{H}_2\\text{O}} \\text{N}_2\\text{O}_5$. Nitrogen oxidation state is $+5$ in both.'
  }),
  (id) => ({
    topic: 'd- and f-Block Elements',
    body: `What causes the atomic radii of $4d$ and $5d$ transition series elements in the same group to be nearly identical?`,
    opts: ['Lanthanoid Contraction', 'Actinoid Contraction', 'Shielding Effect', 'Electronegativity'],
    ans: 'Lanthanoid Contraction',
    exp: 'Imperfect shielding of $4f$ electrons leads to Lanthanoid contraction.'
  }),
  (id) => ({
    topic: 'Coordination Compounds',
    body: `According to IUPAC nomenclature, what is the correct name of $[\\text{Co}(\\text{NH}_3)_6]\\text{Cl}_3$?`,
    opts: ['Hexaamminecobalt(III) chloride', 'Hexaamminecobalt(II) chloride', 'Tricobalt hexaammine chloride', 'Cobalt hexammine trichloride'],
    ans: 'Hexaamminecobalt(III) chloride',
    exp: 'Ammonia ligand is neutral, Cobalt oxidation state is $+3$.'
  }),
  (id) => ({
    topic: 'Basic Principles and Techniques',
    body: `Which electronic displacement effect involves permanent polarization of $\\sigma$-bonds due to electronegativity difference?`,
    opts: ['Inductive Effect', 'Electromeric Effect', 'Hyperconjugation', 'Resonance Effect'],
    ans: 'Inductive Effect',
    exp: 'Inductive effect (-I/+I) operates through $\\sigma$-bonds over distance.'
  }),
  (id) => ({
    topic: 'Hydrocarbons',
    body: `Identify the major product obtained when Propene reacts with $\\text{HBr}$ in the absence of peroxides:`,
    opts: ['2-Bromopropane', '1-Bromopropane', '1,2-Dibromopropane', 'Propane'],
    ans: '2-Bromopropane',
    exp: 'Markovnikov addition adds $\\text{H}^+$ to form the more stable secondary carbocation.'
  }),
  (id) => ({
    topic: 'Organic Compounds Containing Halogens',
    body: `Which haloalkane mechanism proceeds via a planar carbocation intermediate with total racemization?`,
    opts: ['$S_N1$ Mechanism', '$S_N2$ Mechanism', 'E2 Elimination', 'Electrophilic Addition'],
    ans: '$S_N1$ Mechanism',
    exp: '$S_N1$ forms a planar carbocation intermediate, allowing attack from both faces.'
  }),
  (id) => ({
    topic: 'Organic Compounds Containing Oxygen',
    body: `Which named reaction converts Phenol into Salicylaldehyde using $\\text{CHCl}_3$ and aqueous $\\text{NaOH}$?`,
    opts: ['Reimer-Tiemann Reaction', 'Kolbe Reaction', 'Cannizzaro Reaction', 'Aldol Condensation'],
    ans: 'Reimer-Tiemann Reaction',
    exp: 'Reimer-Tiemann reaction introduces a $-\\text{CHO}$ group ortho to the phenolic $-\\text{OH}$.'
  }),
  (id) => ({
    topic: 'Organic Compounds Containing Nitrogen',
    body: `Which test is used to distinguish primary aliphatic amines using $\\text{CHCl}_3$ and alcoholic $\\text{KOH}$?`,
    opts: ['Carbylamine Test', 'Hinsberg Test', 'Lassaigne Test', 'Biuret Test'],
    ans: 'Carbylamine Test',
    exp: 'Primary amines react with $\\text{CHCl}_3 + \\text{KOH}$ to form foul-smelling isocyanides.'
  }),
  (id) => ({
    topic: 'Biomolecules',
    body: `Which vitamin deficiency causes the bleeding disorder Scurvy?`,
    opts: ['Vitamin C (Ascorbic acid)', 'Vitamin B12', 'Vitamin D', 'Vitamin A'],
    ans: 'Vitamin C (Ascorbic acid)',
    exp: 'Deficiency of Vitamin C leads to Scurvy characterized by bleeding gums.'
  }),
  (id) => ({
    topic: 'Practical Chemistry',
    body: `In Lassaigne\'s test for Nitrogen detection, the prussian blue precipitate color is due to the formation of:`,
    opts: ['$\\text{Fe}_4[\\text{Fe}(\\text{CN})_6]_3$', '$\\text{Fe}(\\text{SCN})_3$', '$\\text{Na}_4[\\text{Fe}(\\text{CN})_5\\text{NOS}]$', '$\\text{FeSO}_4$'],
    ans: '$\\text{Fe}_4[\\text{Fe}(\\text{CN})_6]_3$',
    exp: 'Ferric ferrocyanide $\\text{Fe}_4[\\text{Fe}(\\text{CN})_6]_3$ gives the characteristic prussian blue color.'
  })
];

// --- BIOLOGY (10 CHAPTERS) ---
const biologySyllabusGenerators = [
  (id) => ({
    topic: 'Diversity in the Living World',
    body: `Which domain of biological classification contains extremophiles such as Methanogens and Halophiles?`,
    opts: ['Archaebacteria', 'Eubacteria', 'Protista', 'Fungi'],
    ans: 'Archaebacteria',
    exp: 'Archaebacteria have specialized cell wall structures enabling survival in extreme environments.'
  }),
  (id) => ({
    topic: 'Structural Organisation in Animals and Plants',
    body: `Which plant tissue is responsible for secondary growth and increase in girth of dicot stems?`,
    opts: ['Vascular Cambium', 'Apical Meristem', 'Phelloderm', 'Xylem Parenchyma'],
    ans: 'Vascular Cambium',
    exp: 'Lateral meristems (vascular cambium) produce secondary xylem and phloem.'
  }),
  (id) => ({
    topic: 'Cell Structure and Function',
    body: `Which cell organelle is known as the power-house of the cell due to ATP generation?`,
    opts: ['Mitochondria', 'Chloroplast', 'Ribosome', 'Lysosome'],
    ans: 'Mitochondria',
    exp: 'Mitochondria perform oxidative phosphorylation to generate ATP.'
  }),
  (id) => ({
    topic: 'Plant Physiology',
    body: `During photosynthesis, the primary $\\text{CO}_2$ acceptor molecule in C4 plants is:`,
    opts: ['Phosphoenolpyruvate (PEP)', 'Ribulose-1,5-bisphosphate (RuBP)', 'Oxaloacetic acid (OAA)', '3-PGA'],
    ans: 'Phosphoenolpyruvate (PEP)',
    exp: 'PEP carboxylase fixes $\\text{CO}_2$ into PEP in mesophyll cells of C4 plants.'
  }),
  (id) => ({
    topic: 'Human Physiology',
    body: `Which functional unit of the human kidney is responsible for blood filtration and urine formation?`,
    opts: ['Nephron', 'Glomerulus', 'Bowman\'s Capsule', 'Loop of Henle'],
    ans: 'Nephron',
    exp: 'Each kidney contains ~1 million structural and functional units called Nephrons.'
  }),
  (id) => ({
    topic: 'Reproduction',
    body: `Where does fertilization naturally take place in the human female reproductive tract?`,
    opts: ['Ampullary-isthmic junction of Fallopian tube', 'Uterine cavity', 'Cervix', 'Ovary'],
    ans: 'Ampullary-isthmic junction of Fallopian tube',
    exp: 'Sperm meets the ovum at the ampullary-isthmic junction of the oviduct.'
  }),
  (id) => ({
    topic: 'Genetics and Evolution',
    body: `In a 1000 base pair double-stranded DNA, if Adenine count is 200, determine Cytosine count via Chargaff\'s rule:`,
    opts: ['300', '200', '600', '400'],
    ans: '300',
    exp: 'A = T = 200. Remaining G + C = 1000 - 400 = 600 \\implies C = 300.'
  }),
  (id) => ({
    topic: 'Biology and Human Welfare',
    body: `Which microscopic organism is widely used as a biocontrol agent against caterpillar pests?`,
    opts: ['Bacillus thuringiensis (Bt)', 'Trichoderma viride', 'Nucleopolyhedrovirus', 'Rhizobium'],
    ans: 'Bacillus thuringiensis (Bt)',
    exp: 'Bt produces endotoxin protein crystals toxic to insect larvae.'
  }),
  (id) => ({
    topic: 'Biotechnology and its Applications',
    body: `Which enzyme is called "molecular scissors" used to cut double-stranded DNA at specific palindromic sequences?`,
    opts: ['Restriction Endonuclease', 'DNA Ligase', 'Taq Polymerase', 'Reverse Transcriptase'],
    ans: 'Restriction Endonuclease',
    exp: 'Restriction endonucleases recognize specific palindromic sequences and cleave phosphodiester bonds.'
  }),
  (id) => ({
    topic: 'Ecology and Environment',
    body: `Which ecological interaction benefits one species while the other species remains unharmful and unaffected (+ / 0)?`,
    opts: ['Commensalism', 'Mutualism', 'Amensalism', 'Parasitism'],
    ans: 'Commensalism',
    exp: 'In commensalism (e.g. epiphytes on trees), one species benefits and the other is unaffected.'
  })
];

// --- MATHEMATICS (13 CHAPTERS) ---
const mathSyllabusGenerators = [
  (id) => ({
    topic: 'Sets, Relations and Functions',
    body: `If set $A$ has $m = 3$ elements and set $B$ has $n = 4$ elements, calculate total number of relations from $A$ to $B$:`,
    opts: ['$2^{12} = 4096$', '$12$', '$2^7 = 128$', '$3^4 = 81$'],
    ans: '$2^{12} = 4096$',
    exp: 'Number of relations $= 2^{m \\times n} = 2^{3 \\times 4} = 2^{12} = 4096$.'
  }),
  (id) => ({
    topic: 'Complex Numbers and Quadratic Equations',
    body: `Find the modulus $|z|$ of the complex number $z = 3 + 4i$:`,
    opts: ['$5.0$', '$7.0$', '$25.0$', '$\\sqrt{7}$'],
    ans: '$5.0$',
    exp: '$|z| = \\sqrt{3^2 + 4^2} = \\sqrt{9 + 16} = \\sqrt{25} = 5.0$.'
  }),
  (id) => ({
    topic: 'Matrices and Determinants',
    body: `If matrix $A = \\begin{pmatrix} 4 & 2 \\\\ 3 & 5 \\end{pmatrix}$, find determinant $|A|$:`,
    opts: ['$14$', '$26$', '$10$', '$20$'],
    ans: '$14$',
    exp: '$|A| = (4)(5) - (2)(3) = 20 - 6 = 14$.'
  }),
  (id) => ({
    topic: 'Permutations and Combinations',
    body: `Calculate the number of ways to select 3 distinct committee members out of 6 candidates ($^6C_3$):`,
    opts: ['$20$', '$120$', '$18$', '$36$'],
    ans: '$20$',
    exp: '$^6C_3 = \\frac{6 \\times 5 \\times 4}{3 \\times 2 \\times 1} = 20$.'
  }),
  (id) => ({
    topic: 'Binomial Theorem and Mathematical Induction',
    body: `Find the coefficient of $x^2$ in the binomial expansion of $(1 + x)^5$:`,
    opts: ['$10$', '$5$', '$20$', '$1$'],
    ans: '$10$',
    exp: 'Coefficient is $^5C_2 = \\frac{5 \\times 4}{2} = 10$.'
  }),
  (id) => ({
    topic: 'Sequence and Series',
    body: `Calculate the sum of first $n = 10$ natural numbers ($\\sum_{k=1}^{10} k$):`,
    opts: ['$55$', '$45$', '$100$', '$50$'],
    ans: '$55$',
    exp: '$S_{10} = \\frac{10(11)}{2} = 55$.'
  }),
  (id) => ({
    topic: 'Limit, Continuity and Differentiability',
    body: `Evaluate the limit $\\lim_{x \\to 0} \\frac{e^{3x} - 1}{\\sin(2x)}$:`,
    opts: ['$\\frac{3}{2}$', '$\\frac{2}{3}$', '$3$', '$1$'],
    ans: '$\\frac{3}{2}$',
    exp: 'L\'Hopital\'s rule: $\\lim_{x\\to 0} \\frac{3 e^{3x}}{2 \\cos(2x)} = \\frac{3}{2}$.'
  }),
  (id) => ({
    topic: 'Integral Calculus',
    body: `Evaluate standard definite integral $\\int_{0}^{1} \\frac{dx}{1 + x^2}$:`,
    opts: ['$\\frac{\\pi}{4}$', '$\\frac{\\pi}{2}$', '$\\pi$', '$1$'],
    ans: '$\\frac{\\pi}{4}$',
    exp: '$\\int_{0}^{1} \\frac{dx}{1 + x^2} = [\\tan^{-1} x]_0^1 = \\frac{\\pi}{4} - 0 = \\frac{\\pi}{4}$.'
  }),
  (id) => ({
    topic: 'Differential Equations',
    body: `Find the order and degree of differential equation $\\left(\\frac{d^2y}{dx^2}\\right)^3 + \\left(\\frac{dy}{dx}\\right)^4 + y = 0$:`,
    opts: ['Order 2, Degree 3', 'Order 3, Degree 2', 'Order 2, Degree 4', 'Order 1, Degree 4'],
    ans: 'Order 2, Degree 3',
    exp: 'Highest derivative is $\\frac{d^2y}{dx^2}$ (Order 2) raised to power 3 (Degree 3).'
  }),
  (id) => ({
    topic: 'Coordinate Geometry',
    body: `Find the focal distance $a$ for standard parabola $y^2 = 12x$:`,
    opts: ['$3$', '$12$', '$6$', '$4$'],
    ans: '$3$',
    exp: '$y^2 = 4ax = 12x \\implies 4a = 12 \\implies a = 3$.'
  }),
  (id) => ({
    topic: 'Three Dimensional Geometry (3D) and Vectors',
    body: `If $\\vec{u} = 2\\hat{i} + 3\\hat{j} + 4\\hat{k}$ and $\\vec{v} = 3\\hat{i} + 2\\hat{j} - \\hat{k}$, find dot product $\\vec{u} \\cdot \\vec{v}$:`,
    opts: ['$8$', '$12$', '$14$', '$6$'],
    ans: '$8$',
    exp: '$\\vec{u} \\cdot \\vec{v} = (2)(3) + (3)(2) + (4)(-1) = 6 + 6 - 4 = 8$.'
  }),
  (id) => ({
    topic: 'Statistics and Probability',
    body: `If $A$ and $B$ are independent events with $P(A) = 0.4$ and $P(B) = 0.5$, find $P(A \\cap B)$:`,
    opts: ['$0.20$', '$0.90$', '$0.10$', '$0.80$'],
    ans: '$0.20$',
    exp: '$P(A \\cap B) = P(A) \\times P(B) = 0.4 \\times 0.5 = 0.20$.'
  }),
  (id) => ({
    topic: 'Trigonometry',
    body: `Evaluate value of $\\sin(75^\\circ)$ in radical form:`,
    opts: ['$\\frac{\\sqrt{6} + \\sqrt{2}}{4}$', '$\\frac{\\sqrt{6} - \\sqrt{2}}{4}$', '$\\frac{\\sqrt{3} + 1}{2}$', '$\\frac{\\sqrt{3} - 1}{2}$'],
    ans: '$\\frac{\\sqrt{6} + \\sqrt{2}}{4}$',
    exp: '$\\sin(45^\\circ + 30^\\circ) = \\sin 45^\\circ \\cos 30^\\circ + \\cos 45^\\circ \\sin 30^\\circ = \\frac{\\sqrt{6} + \\sqrt{2}}{4}$.'
  })
];

function buildOfficialQuestion(index) {
  const modSubject = index % 4;
  const isPyq = index % 3 !== 0;
  const yr = pyqYearsList[index % pyqYearsList.length];
  const subjIndex = Math.floor(index / 4);

  let item;
  let subj;
  let exam;

  if (modSubject === 0) {
    subj = 'Physics';
    exam = 'BOTH';
    item = physicsSyllabusGenerators[subjIndex % physicsSyllabusGenerators.length](index);
  } else if (modSubject === 1) {
    subj = 'Chemistry';
    exam = 'BOTH';
    item = chemistrySyllabusGenerators[subjIndex % chemistrySyllabusGenerators.length](index);
  } else if (modSubject === 2) {
    subj = 'Mathematics';
    exam = 'JEE-Mains';
    item = mathSyllabusGenerators[subjIndex % mathSyllabusGenerators.length](index);
  } else {
    subj = 'Biology';
    exam = 'NEET';
    item = biologySyllabusGenerators[subjIndex % biologySyllabusGenerators.length](index);
  }

  let chosenExamTag;
  if (subj === 'Biology') {
    chosenExamTag = 'NEET';
  } else if (subj === 'Mathematics') {
    chosenExamTag = (index % 3 === 0) ? 'JEE Advanced' : 'JEE Main';
  } else {
    // Physics & Chemistry
    const mod3 = index % 3;
    if (mod3 === 0) chosenExamTag = 'JEE Main';
    else if (mod3 === 1) chosenExamTag = 'JEE Advanced';
    else chosenExamTag = 'NEET';
  }

  let examTypeVal;
  if (chosenExamTag === 'JEE Main') examTypeVal = 'JEE-Mains';
  else if (chosenExamTag === 'JEE Advanced') examTypeVal = 'JEE-Advanced';
  else examTypeVal = 'NEET';

  return {
    body: item.body,
    options: item.opts,
    answer: item.ans,
    subject: subj,
    examType: examTypeVal,
    topic: item.topic,
    questionType: 'SINGLE',
    marks: 4,
    explanation: item.exp,
    isPyq: isPyq,
    pyqTag: isPyq ? `${chosenExamTag} ${yr}` : ''
  };
}

async function startSeedingFullSyllabus() {
  try {
    console.log('Clearing questionbank collection...');
    await questionBankModel.deleteMany({});

    const totalTarget = 60000;
    const chunkSize = 2500;
    const totalChunks = totalTarget / chunkSize;

    console.log(`Starting insertion of ${totalTarget} questions matching ALL 62 OFFICIAL CHAPTER TOPICS...`);

    for (let c = 0; c < totalChunks; c++) {
      const chunkDocs = [];
      const offset = c * chunkSize;
      for (let i = 0; i < chunkSize; i++) {
        chunkDocs.push(buildOfficialQuestion(offset + i));
      }

      await questionBankModel.insertMany(chunkDocs, { ordered: false });
      console.log(`Chunk ${c + 1}/${totalChunks} inserted! (${(c + 1) * chunkSize} / ${totalTarget} questions complete)`);
    }

    const totalInDb = await questionBankModel.countDocuments({});
    const distinctTopics = await questionBankModel.distinct('topic');
    console.log('====================================================');
    console.log('✅ ALL 62 OFFICIAL SYLLABUS CHAPTERS SEEDING SUCCESSFUL!');
    console.log(`TOTAL QUESTIONS IN MONGO DATABASE: ${totalInDb}`);
    console.log(`DISTINCT CHAPTER TOPICS IN MONGO : ${distinctTopics.length}`);
    console.log('TOPICS LIST:');
    console.log(distinctTopics);
    console.log('====================================================');

    process.exit(0);
  } catch (err) {
    console.error('Error during seeding:', err);
    process.exit(1);
  }
}

startSeedingFullSyllabus();
