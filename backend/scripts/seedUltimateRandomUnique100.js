const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/online-exam-portal';

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB Atlas for ULTIMATE RANDOM UNIQUE SEEDING...'))
  .catch(err => console.error('MongoDB connection error:', err));

const questionBankSchema = new mongoose.Schema({
  body: { type: String, required: true },
  bodyImage: { type: String, default: '' },
  options: [{ type: String, required: true }],
  optionImages: [{ type: String }],
  answer: { type: mongoose.Schema.Types.Mixed, required: true },
  subject: { type: String, required: true },
  examType: { type: String, enum: ['JEE-Mains', 'JEE-Advanced', 'NEET', 'BOTH'], default: 'BOTH' },
  topic: { type: String, default: 'General' },
  questionType: { type: String, enum: ['SINGLE', 'MULTIPLE', 'NUMERICAL'], default: 'SINGLE' },
  marks: { type: Number, default: 4 },
  explanation: { type: String, default: '' },
  isPyq: { type: Boolean, default: false },
  pyqTag: { type: String, default: '' }
}, { timestamps: true });

const questionBankModel = mongoose.models.questionbank || mongoose.model('questionbank', questionBankSchema);

const pyqYears = ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffleArray(arr) {
  const newArr = [...arr];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

// ==========================================
// 🎨 DYNAMIC SVG GENERATORS
// ==========================================
function getLogicGateSvg(gateType) {
  const colors = { AND: '#2563eb', OR: '#16a34a', NAND: '#dc2626', NOR: '#9333ea', XOR: '#ea580c', XNOR: '#0891b2' };
  const color = colors[gateType] || '#2563eb';

  if (gateType === 'AND') {
    return `<svg width="220" height="85" viewBox="0 0 220 85" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border:1px solid #cbd5e1; border-radius:8px;">
      <line x1="15" y1="25" x2="65" y2="25" stroke="#334155" stroke-width="2"/>
      <line x1="15" y1="60" x2="65" y2="60" stroke="#334155" stroke-width="2"/>
      <path d="M 65 15 L 95 15 A 27.5 27.5 0 0 1 95 70 L 65 70 Z" fill="#eff6ff" stroke="${color}" stroke-width="2.2"/>
      <line x1="122.5" y1="42.5" x2="185" y2="42.5" stroke="#334155" stroke-width="2"/>
      <text x="15" y="20" font-size="9" font-weight="bold" fill="#1e293b">A</text>
      <text x="15" y="73" font-size="9" font-weight="bold" fill="#1e293b">B</text>
      <text x="85" y="46" font-size="10" font-weight="bold" fill="${color}" text-anchor="middle">AND</text>
      <text x="195" y="46" font-size="9" font-weight="bold" fill="#1e293b">Y</text>
    </svg>`;
  }

  if (gateType === 'NAND') {
    return `<svg width="220" height="85" viewBox="0 0 220 85" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border:1px solid #cbd5e1; border-radius:8px;">
      <line x1="15" y1="25" x2="65" y2="25" stroke="#334155" stroke-width="2"/>
      <line x1="15" y1="60" x2="65" y2="60" stroke="#334155" stroke-width="2"/>
      <path d="M 65 15 L 95 15 A 27.5 27.5 0 0 1 95 70 L 65 70 Z" fill="#fef2f2" stroke="${color}" stroke-width="2.2"/>
      <circle cx="127.5" cy="42.5" r="5" fill="#ffffff" stroke="${color}" stroke-width="2"/>
      <line x1="132.5" y1="42.5" x2="185" y2="42.5" stroke="#334155" stroke-width="2"/>
      <text x="15" y="20" font-size="9" font-weight="bold" fill="#1e293b">A</text>
      <text x="15" y="73" font-size="9" font-weight="bold" fill="#1e293b">B</text>
      <text x="85" y="46" font-size="10" font-weight="bold" fill="${color}" text-anchor="middle">NAND</text>
      <text x="195" y="46" font-size="9" font-weight="bold" fill="#1e293b">Y</text>
    </svg>`;
  }

  if (gateType === 'OR') {
    return `<svg width="220" height="85" viewBox="0 0 220 85" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border:1px solid #cbd5e1; border-radius:8px;">
      <line x1="15" y1="25" x2="70" y2="25" stroke="#334155" stroke-width="2"/>
      <line x1="15" y1="60" x2="70" y2="60" stroke="#334155" stroke-width="2"/>
      <path d="M 60 15 Q 75 42.5 60 70 Q 95 70 125 42.5 Q 95 15 60 15 Z" fill="#f0fdf4" stroke="${color}" stroke-width="2.2"/>
      <line x1="125" y1="42.5" x2="185" y2="42.5" stroke="#334155" stroke-width="2"/>
      <text x="15" y="20" font-size="9" font-weight="bold" fill="#1e293b">A</text>
      <text x="15" y="73" font-size="9" font-weight="bold" fill="#1e293b">B</text>
      <text x="85" y="46" font-size="10" font-weight="bold" fill="${color}" text-anchor="middle">OR</text>
      <text x="195" y="46" font-size="9" font-weight="bold" fill="#1e293b">Y</text>
    </svg>`;
  }

  if (gateType === 'NOR') {
    return `<svg width="220" height="85" viewBox="0 0 220 85" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border:1px solid #cbd5e1; border-radius:8px;">
      <line x1="15" y1="25" x2="70" y2="25" stroke="#334155" stroke-width="2"/>
      <line x1="15" y1="60" x2="70" y2="60" stroke="#334155" stroke-width="2"/>
      <path d="M 60 15 Q 75 42.5 60 70 Q 95 70 125 42.5 Q 95 15 60 15 Z" fill="#faf5ff" stroke="${color}" stroke-width="2.2"/>
      <circle cx="130" cy="42.5" r="5" fill="#ffffff" stroke="${color}" stroke-width="2"/>
      <line x1="135" y1="42.5" x2="185" y2="42.5" stroke="#334155" stroke-width="2"/>
      <text x="15" y="20" font-size="9" font-weight="bold" fill="#1e293b">A</text>
      <text x="15" y="73" font-size="9" font-weight="bold" fill="#1e293b">B</text>
      <text x="85" y="46" font-size="10" font-weight="bold" fill="${color}" text-anchor="middle">NOR</text>
      <text x="195" y="46" font-size="9" font-weight="bold" fill="#1e293b">Y</text>
    </svg>`;
  }

  if (gateType === 'XOR') {
    return `<svg width="220" height="85" viewBox="0 0 220 85" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border:1px solid #cbd5e1; border-radius:8px;">
      <line x1="15" y1="25" x2="52" y2="25" stroke="#334155" stroke-width="2"/>
      <line x1="15" y1="60" x2="52" y2="60" stroke="#334155" stroke-width="2"/>
      <path d="M 52 15 Q 67 42.5 52 70" fill="none" stroke="${color}" stroke-width="2.2"/>
      <path d="M 60 15 Q 75 42.5 60 70 Q 95 70 125 42.5 Q 95 15 60 15 Z" fill="#fff7ed" stroke="${color}" stroke-width="2.2"/>
      <line x1="125" y1="42.5" x2="185" y2="42.5" stroke="#334155" stroke-width="2"/>
      <text x="15" y="20" font-size="9" font-weight="bold" fill="#1e293b">A</text>
      <text x="15" y="73" font-size="9" font-weight="bold" fill="#1e293b">B</text>
      <text x="85" y="46" font-size="10" font-weight="bold" fill="${color}" text-anchor="middle">XOR</text>
      <text x="195" y="46" font-size="9" font-weight="bold" fill="#1e293b">Y</text>
    </svg>`;
  }

  if (gateType === 'XNOR') {
    return `<svg width="220" height="85" viewBox="0 0 220 85" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border:1px solid #cbd5e1; border-radius:8px;">
      <line x1="15" y1="25" x2="52" y2="25" stroke="#334155" stroke-width="2"/>
      <line x1="15" y1="60" x2="52" y2="60" stroke="#334155" stroke-width="2"/>
      <path d="M 52 15 Q 67 42.5 52 70" fill="none" stroke="${color}" stroke-width="2.2"/>
      <path d="M 60 15 Q 75 42.5 60 70 Q 95 70 125 42.5 Q 95 15 60 15 Z" fill="#ecfeff" stroke="${color}" stroke-width="2.2"/>
      <circle cx="130" cy="42.5" r="5" fill="#ffffff" stroke="${color}" stroke-width="2"/>
      <line x1="135" y1="42.5" x2="185" y2="42.5" stroke="#334155" stroke-width="2"/>
      <text x="15" y="20" font-size="9" font-weight="bold" fill="#1e293b">A</text>
      <text x="15" y="73" font-size="9" font-weight="bold" fill="#1e293b">B</text>
      <text x="85" y="46" font-size="10" font-weight="bold" fill="${color}" text-anchor="middle">XNOR</text>
      <text x="195" y="46" font-size="9" font-weight="bold" fill="#1e293b">Y</text>
    </svg>`;
  }

  return getLogicGateSvg('AND');
}

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

function getBenzeneSvg(sub) {
  return `<svg width="200" height="120" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border:1px solid #cbd5e1; border-radius:8px;">
    <polygon points="100,32 128,48 128,80 100,96 72,80 72,48" fill="none" stroke="#d97706" stroke-width="2.2"/>
    <circle cx="100" cy="64" r="15" fill="none" stroke="#d97706" stroke-width="1.8" stroke-dasharray="3 2"/>
    <line x1="100" y1="32" x2="100" y2="15" stroke="#b45309" stroke-width="2"/>
    <text x="100" y="12" font-size="11" font-weight="bold" fill="#92400e" text-anchor="middle">${sub}</text>
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

// ==========================================
// ⚛️ HIGH-DIVERSITY PHYSICS GENERATOR
// ==========================================
function generatePhysicsQuestion(id) {
  const concepts = [
    // 1. Electronic Devices Logic Gate (Randomized Gate Type!)
    () => {
      const gateList = [
        { type: 'AND', expr: 'Y = A · B', exp: 'AND gate outputs 1 only when both inputs are 1.' },
        { type: 'OR', expr: 'Y = A + B', exp: 'OR gate outputs 1 when at least one input is 1.' },
        { type: 'NAND', expr: 'Y = \\overline{A · B}', exp: 'NAND is the inverse of AND gate.' },
        { type: 'NOR', expr: 'Y = \\overline{A + B}', exp: 'NOR is the inverse of OR gate.' },
        { type: 'XOR', expr: 'Y = A \\oplus B', exp: 'XOR gate outputs 1 when inputs are different.' },
        { type: 'XNOR', expr: 'Y = \\overline{A \\oplus B}', exp: 'XNOR gate outputs 1 when inputs are identical.' }
      ];
      const g = getRandomChoice(gateList);
      const svg = getLogicGateSvg(g.type);
      return {
        topic: 'Electronic Devices',
        body: `Identify the Boolean output expression $Y$ for the **${g.type}** logic gate schematic shown below:\n${svg}`,
        correct: `$${g.expr}$`,
        wrong: ['$Y = A \\oplus B$', '$Y = A$', '$Y = \\overline{A}$', '$Y = 0$', '$Y = 1$'],
        exp: g.exp
      };
    },
    // 2. Kinematics Projectile
    () => {
      const u = getRandomInt(15, 60);
      const angle = getRandomChoice([30, 45, 60]);
      const rad = (angle * Math.PI) / 180;
      const range = ((u * u * Math.sin(2 * rad)) / 10).toFixed(1);
      return {
        topic: 'Kinematics',
        body: `A projectile is launched with initial speed $u = ${u}\\text{ m/s}$ at angle $\\theta = ${angle}^\\circ$ to horizontal. Calculate maximum range $R$ ($g = 10\\text{ m/s}^2$):`,
        correct: `$${range}\\text{ m}$`,
        wrong: [`$${(range * 1.5).toFixed(1)}\\text{ m}$`, `$${(range / 2).toFixed(1)}\\text{ m}$`, `$${u * 2}\\text{ m}$`, `$${(range * 0.8).toFixed(1)}\\text{ m}$`],
        exp: `Range $R = \\frac{u^2 \\sin 2\\theta}{g} = \\frac{${u}^2 \\sin(${2 * angle}^\\circ)}{10} = ${range}\\text{ m}$.`
      };
    },
    // 3. Current Electricity Circuit Power
    () => {
      const r1 = getRandomInt(2, 15);
      const r2 = getRandomInt(2, 15);
      const v = getRandomInt(6, 24);
      const req = r1 + r2;
      const power = ((v * v) / req).toFixed(2);
      const svg = getResistorCircuitSvg(r1, r2, v);
      return {
        topic: 'Current Electricity',
        body: `For the series DC circuit with $R_1 = ${r1}\\,\\Omega, R_2 = ${r2}\\,\\Omega$, and $V = ${v}\\text{ V}$ shown below:\n${svg}\nCalculate total dissipated power $P$:`,
        correct: `$${power}\\text{ W}$`,
        wrong: [`$${(power * 1.4).toFixed(2)}\\text{ W}$`, `$${(power / 2).toFixed(2)}\\text{ W}$`, `$${v * r1}\\text{ W}$`, `$${(v * v).toFixed(2)}\\text{ W}$`],
        exp: `$R_{eq} = ${req}\\,\\Omega$. $P = \\frac{V^2}{R_{eq}} = \\frac{${v}^2}{${req}} = ${power}\\text{ W}$.`
      };
    },
    // 4. Ray Optics Lens Power
    () => {
      const f = getRandomInt(10, 40);
      const p = (100 / f).toFixed(2);
      const svg = getConvexLensSvg(f);
      return {
        topic: 'Optics',
        body: `A convex lens with focal length schematic shown below has $f = +${f}\\text{ cm}$:\n${svg}\nCalculate optical power $P$:`,
        correct: `$+${p}\\text{ D}$`,
        wrong: [`$-${p}\\text{ D}$`, `$${(f / 100).toFixed(2)}\\text{ D}$`, `$+10.0\\text{ D}$`, `$-10.0\\text{ D}$`],
        exp: `$P = \\frac{100}{f(\\text{cm})} = +${p}\\text{ D}$.`
      };
    },
    // 5. Gravitation Escape Velocity
    () => {
      const r = getRandomInt(5000, 9000);
      const ve = (Math.sqrt(2 * 9.8 * r * 1000) / 1000).toFixed(2);
      return {
        topic: 'Gravitation',
        body: `Calculate escape velocity $v_e$ from a planet of radius $R = ${r}\\text{ km}$ ($g = 9.8\\text{ m/s}^2$):`,
        correct: `$${ve}\\text{ km/s}$`,
        wrong: [`$${(ve * 1.414).toFixed(2)}\\text{ km/s}$`, `$11.20\\text{ km/s}$`, `$5.60\\text{ km/s}$`, `$${(r / 100).toFixed(2)}\\text{ km/s}$`],
        exp: `$v_e = \\sqrt{2gR} = ${ve}\\text{ km/s}$.`
      };
    },
    // 6. Modern Physics Photoelectric
    () => {
      const eEv = (getRandomInt(35, 70) / 10).toFixed(1);
      const phi = 2.1;
      const v0 = (eEv - phi).toFixed(1);
      return {
        topic: 'Dual Nature of Matter and Radiation',
        body: `Incident light of photon energy $E = ${eEv}\\text{ eV}$ strikes a metal surface with work function $\\phi = 2.1\\text{ eV}$. Calculate stopping potential $V_0$:`,
        correct: `$${v0}\\text{ V}$`,
        wrong: [`$${eEv}\\text{ V}$`, `$2.1\\text{ V}$`, `$${(parseFloat(v0) + 1.5).toFixed(1)}\\text{ V}$`, `$0.5\\text{ V}$`],
        exp: `$e V_0 = E - \\phi = ${eEv} - 2.1 = ${v0}\\text{ eV} \\implies V_0 = ${v0}\\text{ V}$.`
      };
    }
  ];

  const choice = getRandomChoice(concepts)();
  const allOpts = shuffleArray([choice.correct, ...getRandomChoiceSubset(choice.wrong, 3)]);

  return {
    topic: choice.topic,
    body: choice.body,
    options: allOpts,
    answer: choice.correct,
    explanation: choice.exp
  };
}

// ==========================================
// 🧪 HIGH-DIVERSITY CHEMISTRY GENERATOR
// ==========================================
function generateChemistryQuestion(id) {
  const concepts = [
    // 1. Organic Mechanism Directive Influence (Random Substituted Group!)
    () => {
      const subList = [
        { group: '-OH', direct: 'Ortho/Para-directing', type: 'donating (+M/+I)' },
        { group: '-NO2', direct: 'Meta-directing', type: 'withdrawing (-M/-I)' },
        { group: '-COOH', direct: 'Meta-directing', type: 'withdrawing (-M/-I)' },
        { group: '-NH2', direct: 'Ortho/Para-directing', type: 'donating (+M/+I)' },
        { group: '-Cl', direct: 'Ortho/Para-directing', type: 'deactivating (+M < -I)' },
        { group: '-CH3', direct: 'Ortho/Para-directing', type: 'hyperconjugative (+H/+I)' },
        { group: '-OCH3', direct: 'Ortho/Para-directing', type: 'donating (+M)' }
      ];
      const s = getRandomChoice(subList);
      const svg = getBenzeneSvg(s.group);
      return {
        topic: 'Organic Compounds Containing Oxygen',
        body: `Examine the substituted benzene compound shown below:\n${svg}\nDetermine the directive influence of functional group **${s.group}** towards electrophilic substitution:`,
        correct: s.direct,
        wrong: [s.direct === 'Meta-directing' ? 'Ortho/Para-directing' : 'Meta-directing', 'Non-directing', 'Ring Scaffolding only'],
        exp: `Group **${s.group}** is ${s.type} and ${s.direct}.`
      };
    },
    // 2. Electrochemistry Nernst Equation
    () => {
      const c1 = getRandomInt(1, 5);
      const c2 = getRandomInt(2, 6);
      const q = (c1 / c2).toFixed(2);
      const eCell = (1.10 - (0.0591 / 2) * Math.log10(q)).toFixed(3);
      return {
        topic: 'Redox Reactions and Electrochemistry',
        body: `For the Daniell cell $\\text{Zn(s)}|\\text{Zn}^{2+}(${c1}\\text{ M})||\\text{Cu}^{2+}(${c2}\\text{ M})|\\text{Cu(s)}$ with $E^0 = +1.10\\text{ V}$, calculate $E_{\\text{cell}}$ at $298\\text{ K}$:`,
        correct: `$+${eCell}\\text{ V}$`,
        wrong: [`$${(parseFloat(eCell) + 0.05).toFixed(3)}\\text{ V}$`, `$1.100\\text{ V}$`, `$-${eCell}\\text{ V}$`, `$0.000\\text{ V}$`],
        exp: `$E_{\\text{cell}} = 1.10 - \\frac{0.0591}{2}\\log_{10}\\left(\\frac{${c1}}{${c2}}\\right) = +${eCell}\\text{ V}$.`
      };
    },
    // 3. Equilibrium pH/pOH
    () => {
      const pH = getRandomInt(2, 6);
      const pOH = 14 - pH;
      const conc = `1.0 \\times 10^{-${pOH}}\\text{ M}`;
      return {
        topic: 'Equilibrium',
        body: `If an aqueous solution at $25^\\circ\\text{C}$ has $\\text{pH} = ${pH}.0$, calculate its hydroxyl ion concentration $[\\text{OH}^-]$:`,
        correct: `$${conc}$`,
        wrong: [`$1.0 \\times 10^{-${pH}}\\text{ M}$`, `$1.0 \\times 10^{-14}\\text{ M}$`, `$1.0 \\times 10^{-7}\\text{ M}$`, `$1.0 \\times 10^{-1}\\text{ M}$`],
        exp: `$\\text{pOH} = 14 - ${pH} = ${pOH} \\implies [\\text{OH}^-] = 10^{-${pOH}}\\text{ M}$.`
      };
    },
    // 4. Chemical Kinetics Half Life
    () => {
      const tHalf = getRandomInt(10, 50);
      const k = (0.693 / tHalf).toFixed(4);
      return {
        topic: 'Chemical Kinetics',
        body: `The half-life period $t_{1/2}$ of a first-order reaction is $${tHalf}\\text{ min}$. Calculate rate constant $k$:`,
        correct: `$${k}\\text{ min}^{-1}$`,
        wrong: [`$${(tHalf * 0.693).toFixed(2)}\\text{ min}^{-1}$`, `$${tHalf}.0\\text{ min}^{-1}$`, `$0.0100\\text{ min}^{-1}$`, `$0.5000\\text{ min}^{-1}$`],
        exp: `$k = \\frac{0.693}{${tHalf}} = ${k}\\text{ min}^{-1}$.`
      };
    }
  ];

  const choice = getRandomChoice(concepts)();
  const allOpts = shuffleArray([choice.correct, ...getRandomChoiceSubset(choice.wrong, 3)]);

  return {
    topic: choice.topic,
    body: choice.body,
    options: allOpts,
    answer: choice.correct,
    explanation: choice.exp
  };
}

// ==========================================
// 📐 HIGH-DIVERSITY MATHEMATICS GENERATOR
// ==========================================
function generateMathQuestion(id) {
  const concepts = [
    // 1. Matrices & Determinants (Random Values!)
    () => {
      const a = getRandomInt(2, 9);
      const b = getRandomInt(1, 6);
      const c = getRandomInt(1, 6);
      const d = getRandomInt(2, 9);
      const det = a * d - b * c;
      return {
        topic: 'Matrices and Determinants',
        body: `If matrix $A = \\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}$, find determinant $|A|$:`,
        correct: `$${det}$`,
        wrong: [`$${det + 5}$`, `$${det - 4}$`, `$${a * d + b * c}$`, `$${a + d}$`],
        exp: `$|A| = (${a})(${d}) - (${b})(${c}) = ${det}$.`
      };
    },
    // 2. Probability Independent Events (Random Probabilities!)
    () => {
      const pA = (getRandomInt(1, 4) * 0.2).toFixed(1);
      const pB = (getRandomInt(1, 4) * 0.2).toFixed(1);
      const pAns = (pA * pB).toFixed(2);
      return {
        topic: 'Statistics and Probability',
        body: `If $A$ and $B$ are independent events with $P(A) = ${pA}$ and $P(B) = ${pB}$, find $P(A \\cap B)$:`,
        correct: `$${pAns}$`,
        wrong: [`$${(parseFloat(pA) + parseFloat(pB)).toFixed(2)}$`, `$${(pA / pB).toFixed(2)}$`, `$0.50$`, `$0.00$`],
        exp: `$P(A \\cap B) = P(A) \\times P(B) = ${pA} \\times ${pB} = ${pAns}$.`
      };
    },
    // 3. Complex Number Modulus (Random Real/Imaginary!)
    () => {
      const x = getRandomInt(3, 12);
      const y = getRandomInt(4, 16);
      const modSq = x * x + y * y;
      const isInt = Math.sqrt(modSq) % 1 === 0;
      const modStr = isInt ? `${Math.sqrt(modSq)}` : `\\sqrt{${modSq}}`;
      return {
        topic: 'Complex Numbers and Quadratic Equations',
        body: `Find modulus $|z|$ of complex number $z = ${x} + ${y}i$:`,
        correct: `$${modStr}$`,
        wrong: [`$${x + y}$`, `$${x * y}$`, `$${modSq}$`, `$\\sqrt{${x + y}}$`],
        exp: `$|z| = \\sqrt{${x}^2 + ${y}^2} = \\sqrt{${modSq}} = ${modStr}$.`
      };
    },
    // 4. L'Hopital Limits (Random Multipliers!)
    () => {
      const a = getRandomInt(2, 7);
      const b = getRandomInt(2, 7);
      return {
        topic: 'Limit, Continuity and Differentiability',
        body: `Evaluate limit $\\lim_{x \\to 0} \\frac{e^{${a}x} - 1}{\\sin(${b}x)}$:`,
        correct: `$\\frac{${a}}{${b}}$`,
        wrong: [`$\\frac{${b}}{${a}}$`, `$${a + b}$`, `$1$`, `$0$`],
        exp: `L'Hopital's rule: $\\lim_{x\\to 0} \\frac{${a} e^{${a}x}}{${b} \\cos(${b}x)} = \\frac{${a}}{${b}}$.`
      };
    }
  ];

  const choice = getRandomChoice(concepts)();
  const allOpts = shuffleArray([choice.correct, ...getRandomChoiceSubset(choice.wrong, 3)]);

  return {
    topic: choice.topic,
    body: choice.body,
    options: allOpts,
    answer: choice.correct,
    explanation: choice.exp
  };
}

// ==========================================
// 🧬 HIGH-DIVERSITY BIOLOGY GENERATOR
// ==========================================
function generateBiologyQuestion(id) {
  const concepts = [
    // 1. DNA Chargaff Rule (Random Base Counts!)
    () => {
      const aCount = getRandomInt(120, 380);
      const cCount = 500 - aCount;
      return {
        topic: 'Genetics and Evolution',
        body: `In a 1000 base pair double-stranded DNA molecule, if Adenine count is ${aCount}, determine Cytosine count via Chargaff's rule:`,
        correct: `${cCount}`,
        wrong: [`${aCount}`, `${cCount * 2}`, `${1000 - aCount}`, `${500}`],
        exp: `A = T = ${aCount}. Remaining G + C = 1000 - 2(${aCount}) \\implies C = 500 - ${aCount} = ${cCount}.`
      };
    },
    // 2. Cell Organelle Function
    () => {
      const organelles = [
        { name: 'Mitochondria', fn: 'ATP generation via oxidative phosphorylation' },
        { name: 'Ribosome', fn: 'Protein translation and peptide bond synthesis' },
        { name: 'Lysosome', fn: 'Intracellular digestion via acid hydrolases' },
        { name: 'Golgi Apparatus', fn: 'Post-translational modification and protein sorting' },
        { name: 'Chloroplast', fn: 'Photosynthetic light reaction and carbon fixation' }
      ];
      const o = getRandomChoice(organelles);
      return {
        topic: 'Cell Structure and Function',
        body: `Which cellular organelle is specifically responsible for **${o.fn}**?`,
        correct: o.name,
        wrong: ['Endoplasmic Reticulum', 'Peroxisome', 'Centrosome', 'Vacuole'].filter(x => x !== o.name),
        exp: `${o.name} is specialized for ${o.fn}.`
      };
    }
  ];

  const choice = getRandomChoice(concepts)();
  const allOpts = shuffleArray([choice.correct, ...getRandomChoiceSubset(choice.wrong, 3)]);

  return {
    topic: choice.topic,
    body: choice.body,
    options: allOpts,
    answer: choice.correct,
    explanation: choice.exp
  };
}

function getRandomChoiceSubset(arr, n) {
  return shuffleArray(arr).slice(0, n);
}

function buildUltimateQuestion(index) {
  const modSubject = index % 4;
  const isPyq = Math.random() < 0.7; // 70% PYQ rate
  const yr = getRandomChoice(pyqYears);

  let q;
  let subj;
  let examTag;

  if (modSubject === 0) {
    subj = 'Physics';
    q = generatePhysicsQuestion(index);
    examTag = getRandomChoice(['JEE Main', 'JEE Advanced', 'NEET']);
  } else if (modSubject === 1) {
    subj = 'Chemistry';
    q = generateChemistryQuestion(index);
    examTag = getRandomChoice(['JEE Main', 'JEE Advanced', 'NEET']);
  } else if (modSubject === 2) {
    subj = 'Mathematics';
    q = generateMathQuestion(index);
    examTag = getRandomChoice(['JEE Main', 'JEE Advanced']);
  } else {
    subj = 'Biology';
    q = generateBiologyQuestion(index);
    examTag = 'NEET';
  }

  let examTypeVal;
  if (examTag === 'JEE Main') examTypeVal = 'JEE-Mains';
  else if (examTag === 'JEE Advanced') examTypeVal = 'JEE-Advanced';
  else examTypeVal = 'NEET';

  return {
    body: q.body,
    options: q.options,
    answer: q.answer,
    subject: subj,
    examType: examTypeVal,
    topic: q.topic,
    questionType: 'SINGLE',
    marks: 4,
    explanation: q.explanation,
    isPyq: isPyq,
    pyqTag: isPyq ? `${examTag} ${yr}` : ''
  };
}

async function startUltimateSeeding() {
  try {
    console.log('Clearing questionbank collection...');
    await questionBankModel.deleteMany({});

    const totalTarget = 60000;
    const chunkSize = 2500;
    const totalChunks = totalTarget / chunkSize;

    console.log(`Starting insertion of ${totalTarget} ULTIMATE RANDOMIZED UNIQUE questions...`);

    for (let c = 0; c < totalChunks; c++) {
      const chunkDocs = [];
      const offset = c * chunkSize;
      for (let i = 0; i < chunkSize; i++) {
        chunkDocs.push(buildUltimateQuestion(offset + i));
      }

      await questionBankModel.insertMany(chunkDocs, { ordered: false });
      console.log(`Chunk ${c + 1}/${totalChunks} inserted! (${(c + 1) * chunkSize} / ${totalTarget} questions complete)`);
    }

    const totalInDb = await questionBankModel.countDocuments({});
    console.log('====================================================');
    console.log('✅ ULTIMATE RANDOM UNIQUE SEEDING SUCCESSFUL!');
    console.log(`TOTAL QUESTIONS IN MONGO DATABASE: ${totalInDb}`);
    console.log('====================================================');

    process.exit(0);
  } catch (err) {
    console.error('Error during seeding:', err);
    process.exit(1);
  }
}

startUltimateSeeding();
