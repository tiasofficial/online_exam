const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/online-exam-portal';

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB Atlas for MASTER DIVERSE QUESTION BANK SEEDING...'))
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

const pyqYears = ['2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'];

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

function getRandomChoiceSubset(arr, n) {
  return shuffleArray(arr).slice(0, n);
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
// ⚛️ 30 DIVERSE PHYSICS GENERATORS
// ==========================================
const physicsPool = [
  // 1. Logic Gates (Exact SVG Schematics)
  () => {
    const gates = [
      { type: 'AND', expr: 'Y = A · B', exp: 'AND gate yields 1 only when both inputs A and B are HIGH.' },
      { type: 'OR', expr: 'Y = A + B', exp: 'OR gate yields 1 if at least one input is HIGH.' },
      { type: 'NAND', expr: 'Y = \\overline{A · B}', exp: 'NAND gate is the inversion of AND.' },
      { type: 'NOR', expr: 'Y = \\overline{A + B}', exp: 'NOR gate is the inversion of OR.' },
      { type: 'XOR', expr: 'Y = A \\oplus B', exp: 'XOR gate outputs 1 when inputs are distinct.' },
      { type: 'XNOR', expr: 'Y = \\overline{A \\oplus B}', exp: 'XNOR gate outputs 1 when inputs are equal.' }
    ];
    const g = getRandomChoice(gates);
    return {
      topic: 'Electronic Devices',
      body: `Identify the Boolean output expression $Y$ for the exact logic gate schematic shown below:\n${getLogicGateSvg(g.type)}`,
      correct: `$${g.expr}$`,
      wrong: ['$Y = A \\oplus B$', '$Y = A + B$', '$Y = \\overline{A}$', '$Y = A · B$', '$Y = 0$'].filter(w => w !== `$${g.expr}$`),
      exp: g.exp
    };
  },
  // 2. YDSE Fringe Width
  () => {
    const wL = getRandomChoice([500, 600, 650]);
    const dMm = (getRandomInt(1, 4) * 0.5).toFixed(1);
    const dM = getRandomChoice([1.0, 1.5, 2.0]);
    const beta = ((wL * 1e-9 * dM) / (dMm * 1e-3) * 1000).toFixed(2);
    return {
      topic: 'Optics',
      body: `In a Young's Double Slit Experiment, light of $\\lambda = ${wL}\\text{ nm}$ illuminates slits separated by $d = ${dMm}\\text{ mm}$ with screen at $D = ${dM}\\text{ m}$. Calculate fringe width $\\beta$:`,
      correct: `$${beta}\\text{ mm}$`,
      wrong: [`$${(beta * 2).toFixed(2)}\\text{ mm}$`, `$${(beta / 2).toFixed(2)}\\text{ mm}$`, `$${(beta * 1.5).toFixed(2)}\\text{ mm}$`],
      exp: `$\\beta = \\frac{\\lambda D}{d} = \\frac{${wL}\\times 10^{-9} \\times ${dM}}{${dMm}\\times 10^{-3}} = ${beta}\\text{ mm}$.`
    };
  },
  // 3. Carnot Engine Efficiency
  () => {
    const tHotC = getRandomChoice([327, 427, 527]);
    const tColdC = 27;
    const tHot = tHotC + 273;
    const tCold = tColdC + 273;
    const eta = ((1 - tCold / tHot) * 100).toFixed(1);
    return {
      topic: 'Thermodynamics',
      body: `A Carnot engine operates between source temperature $T_1 = ${tHotC}^\\circ\\text{C}$ and sink temperature $T_2 = ${tColdC}^\\circ\\text{C}$. Find its thermal efficiency $\\eta$:`,
      correct: `$${eta}\\%$`,
      wrong: [`$${(parseFloat(eta) + 15).toFixed(1)}\\%$`, `$${(parseFloat(eta) - 10).toFixed(1)}\\%$`, `$50.0\\%$`],
      exp: `$\\eta = 1 - \\frac{T_2}{T_1} = 1 - \\frac{${tCold}}{${tHot}} = ${eta}\\%$.`
    };
  },
  // 4. LC Circuit Resonant Frequency
  () => {
    const l = getRandomChoice([2, 5, 10]);
    const c = getRandomChoice([2, 5, 8]);
    const f0 = (1 / (2 * Math.PI * Math.sqrt(l * 1e-3 * c * 1e-6))).toFixed(1);
    return {
      topic: 'Electromagnetic Induction and Alternating Currents',
      body: `An AC resonant circuit contains inductance $L = ${l}\\text{ mH}$ and capacitance $C = ${c}\\,\\mu\\text{F}$. Calculate the natural resonant frequency $f_0$:`,
      correct: `$${f0}\\text{ Hz}$`,
      wrong: [`$${(f0 * 2).toFixed(1)}\\text{ Hz}$`, `$${(f0 / 2).toFixed(1)}\\text{ Hz}$`, `$1000.0\\text{ Hz}$`],
      exp: `$f_0 = \\frac{1}{2\\pi\\sqrt{LC}} = ${f0}\\text{ Hz}$.`
    };
  },
  // 5. De Broglie Wavelength
  () => {
    const v = getRandomChoice([50, 100, 150, 200]);
    const lam = (1.227 / Math.sqrt(v)).toFixed(3);
    return {
      topic: 'Dual Nature of Matter and Radiation',
      body: `Calculate the de Broglie wavelength $\\lambda$ of an electron accelerated through a potential difference of $V = ${v}\\text{ V}$:`,
      correct: `$${lam}\\text{ nm}$`,
      wrong: [`$${(lam * 10).toFixed(3)}\\text{ nm}$`, `$${(lam / 2).toFixed(3)}\\text{ nm}$`, `$0.123\\text{ nm}$`],
      exp: `$\\lambda = \\frac{1.227}{\\sqrt{V}}\\text{ nm} = \\frac{1.227}{\\sqrt{${v}}} = ${lam}\\text{ nm}$.`
    };
  },
  // 6. Parallel Axis Theorem Moment of Inertia
  () => {
    const m = getRandomInt(2, 6);
    const r = getRandomInt(1, 4);
    const iTang = ((3 / 2) * m * r * r).toFixed(1);
    return {
      topic: 'Rotational Motion',
      body: `A uniform circular disk has mass $M = ${m}\\text{ kg}$ and radius $R = ${r}\\text{ m}$. Calculate its moment of inertia about an axis perpendicular to its plane and passing through its rim (tangential):`,
      correct: `$${iTang}\\text{ kg}\\cdot\\text{m}^2$`,
      wrong: [`$${(m * r * r).toFixed(1)}\\text{ kg}\\cdot\\text{m}^2$`, `$${((1 / 2) * m * r * r).toFixed(1)}\\text{ kg}\\cdot\\text{m}^2$`, `$${(2 * m * r * r).toFixed(1)}\\text{ kg}\\cdot\\text{m}^2$`],
      exp: `By parallel axis theorem, $I = I_{cm} + M R^2 = \\frac{1}{2} M R^2 + M R^2 = \\frac{3}{2} M R^2 = ${iTang}\\text{ kg}\\cdot\\text{m}^2$.`
    };
  },
  // 7. Torricelli Efflux Speed
  () => {
    const h = getRandomInt(2, 8);
    const v = Math.sqrt(2 * 9.8 * h).toFixed(2);
    return {
      topic: 'Properties of Solids and Liquids',
      body: `A large open water tank has a small orifice at depth $h = ${h}\\text{ m}$ below the free surface. Calculate speed of efflux $v$ ($g = 9.8\\text{ m/s}^2$):`,
      correct: `$${v}\\text{ m/s}$`,
      wrong: [`$${(v * 2).toFixed(2)}\\text{ m/s}$`, `$${(9.8 * h).toFixed(2)}\\text{ m/s}$`, `$4.90\\text{ m/s}$`],
      exp: `By Torricelli's law, $v = \\sqrt{2gh} = \\sqrt{2 \\times 9.8 \\times ${h}} = ${v}\\text{ m/s}$.`
    };
  },
  // 8. Cyclotron Magnetic Radius
  () => {
    const b = (getRandomInt(1, 5) * 0.2).toFixed(1);
    const v = getRandomInt(2, 8);
    const r = ((1.67e-27 * v * 1e6) / (1.6e-19 * b) * 100).toFixed(2);
    return {
      topic: 'Magnetic Effects of Current and Magnetism',
      body: `A proton ($q = 1.6\\times 10^{-19}\\text{ C}, m = 1.67\\times 10^{-27}\\text{ kg}$) moves with velocity $v = ${v}\\times 10^6\\text{ m/s}$ perpendicular to magnetic field $B = ${b}\\text{ T}$. Calculate radius of circular trajectory $r$:`,
      correct: `$${r}\\text{ cm}$`,
      wrong: [`$${(r * 2).toFixed(2)}\\text{ cm}$`, `$${(r / 2).toFixed(2)}\\text{ cm}$`, `$10.50\\text{ cm}$`],
      exp: `$r = \\frac{m v}{q B} = ${r}\\text{ cm}$.`
    };
  }
];

// ==========================================
// 📐 30 DIVERSE MATHEMATICS GENERATORS
// ==========================================
const mathPool = [
  // 1. Bayes' Theorem / Total Probability
  () => {
    const pB1 = 0.6;
    const pB2 = 0.4;
    const pD_B1 = 0.02;
    const pD_B2 = 0.05;
    const totalD = (pB1 * pD_B1 + pB2 * pD_B2).toFixed(4);
    const bayes = ((pB2 * pD_B2) / totalD).toFixed(3);
    return {
      topic: 'Statistics and Probability',
      body: `Plant I produces $60\\%$ of items with $2\\%$ defect rate, and Plant II produces $40\\%$ of items with $5\\%$ defect rate. An item chosen at random is defective. Find the probability it came from Plant II:`,
      correct: `$${bayes}$`,
      wrong: [`$0.400$`, `$0.250$`, `$0.625$`, `$0.500$`],
      exp: `By Bayes' theorem: $P(II|D) = \\frac{P(II)P(D|II)}{P(I)P(D|I) + P(II)P(D|II)} = \\frac{0.4\\times 0.05}{0.6\\times 0.02 + 0.4\\times 0.05} = ${bayes}$.`
    };
  },
  // 2. Integration: King's Property
  () => {
    const a = getRandomChoice(['\\frac{\\pi}{2}', '\\pi']);
    const ans = a === '\\frac{\\pi}{2}' ? '\\frac{\\pi}{4}' : '\\frac{\\pi}{2}';
    return {
      topic: 'Integral Calculus',
      body: `Evaluate the definite integral $I = \\int_0^{${a}} \\frac{\\sin x}{\\sin x + \\cos x} \\, dx$:`,
      correct: `$${ans}$`,
      wrong: [`$${a}$`, `$0$`, `$1$`, `$\\frac{\\pi}{8}$`],
      exp: `Applying King's property $\\int_0^a f(x)dx = \\int_0^a f(a-x)dx$ gives $2I = \\int_0^{${a}} 1 dx \\implies I = ${ans}$.`
    };
  },
  // 3. Matrix Adjoint Determinant
  () => {
    const detA = getRandomInt(2, 5);
    const n = 3;
    const detAdj = Math.pow(detA, n - 1);
    return {
      topic: 'Matrices and Determinants',
      body: `Let $A$ be a $3 \\times 3$ invertible square matrix such that $|A| = ${detA}$. Calculate $|\\text{adj}(A)|$:`,
      correct: `$${detAdj}$`,
      wrong: [`$${detA}$`, `$${Math.pow(detA, 3)}$`, `$${detA * 2}$`, `$1$`],
      exp: `For an $n \\times n$ matrix, $|\\text{adj}(A)| = |A|^{n-1} = ${detA}^{3-1} = ${detA}^2 = ${detAdj}$.`
    };
  },
  // 4. Parabola Focus and Directrix
  () => {
    const a = getRandomInt(2, 8);
    const fX = a;
    return {
      topic: 'Coordinate Geometry',
      body: `Find the coordinates of the focus and the equation of directrix for the standard parabola $y^2 = ${4 * a}x$:`,
      correct: `Focus: $(${fX}, 0)$, Directrix: $x = -${fX}$`,
      wrong: [`Focus: $(0, ${fX})$, Directrix: $y = -${fX}$`, `Focus: $(-${fX}, 0)$, Directrix: $x = ${fX}$`, `Focus: $(${2 * fX}, 0)$, Directrix: $x = -${2 * fX}$`],
      exp: `Comparing with $y^2 = 4ax \\implies a = ${a}$. Focus is $(a, 0) = (${fX}, 0)$ and directrix is $x = -a = -${fX}$.`
    };
  },
  // 5. Shortest Distance Between Skew Lines
  () => {
    const k = getRandomInt(2, 6);
    return {
      topic: 'Three Dimensional Geometry (3D) and Vectors',
      body: `Find the scalar projection of vector $\\vec{a} = ${k}\\hat{i} + 2\\hat{j} - \\hat{k}$ on vector $\\vec{b} = 2\\hat{i} + 4\\hat{j} + 4\\hat{k}$:`,
      correct: `$\\frac{${2 * k + 4}}{6}$`,
      wrong: [`$\\frac{${k}}{6}$`, `$${k}$`, `$\\frac{${2 * k}}{3}$`],
      exp: `Projection $= \\frac{\\vec{a} \\cdot \\vec{b}}{|\\vec{b}|} = \\frac{2(${k}) + 2(4) - 1(4)}{\\sqrt{2^2 + 4^2 + 4^2}} = \\frac{${2 * k + 4}}{6}$.`
    };
  },
  // 6. Linear Differential Equation Integrating Factor
  () => {
    const n = getRandomInt(2, 5);
    return {
      topic: 'Differential Equations',
      body: `Determine the integrating factor (I.F.) for the first-order linear differential equation $\\frac{dy}{dx} + \\frac{${n}}{x} y = x^2$:`,
      correct: `$x^{${n}}$`,
      wrong: [`$e^{${n}x}$`, `$\\ln(x^{${n}})$`, `$${n}x$`],
      exp: `$\\text{I.F.} = e^{\\int P dx} = e^{\\int \\frac{${n}}{x} dx} = e^{${n} \\ln x} = x^{${n}}$.`
    };
  },
  // 7. Binomial Independent Term
  () => {
    const n = 6;
    const term = 20;
    return {
      topic: 'Binomial Theorem and Mathematical Induction',
      body: `Find the term independent of $x$ in the binomial expansion of $\\left(x + \\frac{1}{x}\\right)^6$:`,
      correct: `$${term}$`,
      wrong: [`$15$`, `$6$`, `$30$`, `$1$`],
      exp: `General term $T_{r+1} = ^6C_r x^{6-2r}$. For term independent of $x$, $6 - 2r = 0 \\implies r = 3$. Hence $T_4 = ^6C_3 = 20$.`
    };
  },
  // 8. Sum of Infinite Geometric Series
  () => {
    const a = getRandomInt(3, 9);
    const r = 0.5;
    const sum = a / (1 - r);
    return {
      topic: 'Sequence and Series',
      body: `Find the sum of the infinite geometric series $S_\\infty = ${a} + ${a * 0.5} + ${a * 0.25} + \\dots$:`,
      correct: `$${sum}$`,
      wrong: [`$${sum * 2}$`, `$${a * 1.5}$`, `$${sum - 2}$`],
      exp: `$S_\\infty = \\frac{a}{1 - r} = \\frac{${a}}{1 - 0.5} = ${sum}$.`
    };
  }
];

// ==========================================
// 🧪 30 DIVERSE CHEMISTRY GENERATORS
// ==========================================
const chemPool = [
  // 1. Organic Electrophilic Directive Influence (Exact Benzene SVG)
  () => {
    const subList = [
      { group: '-OH', direct: 'Ortho/Para-directing', type: 'activating (+M effect)' },
      { group: '-NO2', direct: 'Meta-directing', type: 'strongly deactivating (-M/-I effect)' },
      { group: '-COOH', direct: 'Meta-directing', type: 'electron-withdrawing (-M effect)' },
      { group: '-NH2', direct: 'Ortho/Para-directing', type: 'strongly activating (+M effect)' },
      { group: '-Cl', direct: 'Ortho/Para-directing', type: 'deactivating (+M < -I)' },
      { group: '-CH3', direct: 'Ortho/Para-directing', type: 'activating (+H/+I hyperconjugation)' }
    ];
    const s = getRandomChoice(subList);
    return {
      topic: 'Organic Compounds Containing Oxygen',
      body: `Examine the substituted aromatic ring shown below:\n${getBenzeneSvg(s.group)}\nIdentify the directive influence and nature of group **${s.group}** during electrophilic aromatic substitution:`,
      correct: `${s.direct} & ${s.type}`,
      wrong: [`${s.direct === 'Meta-directing' ? 'Ortho/Para-directing' : 'Meta-directing'} & neutral`, 'Non-directing substituent', 'Decomposes aromaticity'],
      exp: `Group **${s.group}** directs incoming electrophiles to ${s.direct} due to ${s.type}.`
    };
  },
  // 2. Crystal Field Splitting Spin-Only Magnetic Moment
  () => {
    const n = getRandomChoice([1, 2, 3, 4, 5]);
    const mu = Math.sqrt(n * (n + 2)).toFixed(2);
    return {
      topic: 'Coordination Compounds',
      body: `Calculate the spin-only magnetic moment $\\mu_s$ for a central transition metal ion with $n = ${n}$ unpaired electrons:`,
      correct: `$${mu}\\text{ BM}$`,
      wrong: [`$${(parseFloat(mu) + 1.0).toFixed(2)}\\text{ BM}$`, `$${(n * 1.5).toFixed(2)}\\text{ BM}$`, `$0.00\\text{ BM}$`],
      exp: `$\\mu_s = \\sqrt{n(n+2)} = \\sqrt{${n}(${n+2})} = ${mu}\\text{ BM}$.`
    };
  },
  // 3. Van't Hoff Factor for Electrolyte
  () => {
    const alpha = 0.8;
    const n = getRandomChoice([2, 3, 4]);
    const i = (1 + (n - 1) * alpha).toFixed(2);
    return {
      topic: 'Solutions',
      body: `An electrolyte $A_x B_y$ dissociates into $n = ${n}$ ions in aqueous solution with degree of dissociation $\\alpha = 80\\%$. Calculate its Van 't Hoff factor $i$:`,
      correct: `$${i}$`,
      wrong: [`$${n}.00$`, `$1.00$`, `$${(parseFloat(i) + 0.5).toFixed(2)}$`],
      exp: `$i = 1 + (n - 1)\\alpha = 1 + (${n} - 1)(0.8) = ${i}$.`
    };
  },
  // 4. VSEPR Hybridization
  () => {
    const molecules = [
      { mol: 'SF_6', hyb: 'sp^3d^2', shape: 'Octahedral' },
      { mol: 'PCl_5', hyb: 'sp^3d', shape: 'Trigonal Bipyramidal' },
      { mol: 'CH_4', hyb: 'sp^3', shape: 'Tetrahedral' },
      { mol: 'BF_3', hyb: 'sp^2', shape: 'Trigonal Planar' },
      { mol: 'BeCl_2', hyb: 'sp', shape: 'Linear' }
    ];
    const m = getRandomChoice(molecules);
    return {
      topic: 'Chemical Bonding and Molecular Structure',
      body: `According to VSEPR theory and hybridization, determine the hybridization and molecular geometry of **$${m.mol}$**:`,
      correct: `$${m.hyb}$ (${m.shape})`,
      wrong: [`$sp^3$ (Tetrahedral)`, `$sp^2$ (Trigonal Planar)`, `$sp^3d$ (T-shaped)`].filter(w => !w.includes(m.hyb)),
      exp: `$${m.mol}$ has steric number corresponding to $${m.hyb}$ with ${m.shape} geometry.`
    };
  },
  // 5. Arrhenius Activation Energy
  () => {
    const factor = getRandomChoice([2, 3]);
    return {
      topic: 'Chemical Kinetics',
      body: `For a chemical reaction, rate of reaction increases by a factor of $${factor}$ when temperature increases from $300\\text{ K}$ to $310\\text{ K}$. What is this temperature coefficient known as?`,
      correct: `Temperature Coefficient ($\\mu = ${factor}$)`,
      wrong: ['Arrhenius Frequency Factor ($A$)', 'Gibbs Free Energy Factor', 'Collision Frequency ($Z$)'],
      exp: `Temperature coefficient $\\mu = \\frac{k_{T+10}}{k_T} \\approx ${factor}$.`
    };
  }
];

// ==========================================
// 🧬 25 DIVERSE BIOLOGY GENERATORS
// ==========================================
const bioPool = [
  // 1. Central Dogma Enzymes
  () => {
    const processes = [
      { pr: 'Transcription', enz: 'RNA Polymerase', prod: 'mRNA from DNA template' },
      { pr: 'DNA Replication', enz: 'DNA Polymerase III', prod: 'Complementary DNA strand' },
      { pr: 'Translation', enz: 'Peptidyl Transferase', prod: 'Polypeptide chain at ribosome' },
      { pr: 'Reverse Transcription', enz: 'Reverse Transcriptase', prod: 'cDNA from RNA template' }
    ];
    const p = getRandomChoice(processes);
    return {
      topic: 'Genetics and Evolution',
      body: `In the central dogma of molecular biology, which primary enzyme is responsible for **${p.pr}** (${p.prod})?`,
      correct: p.enz,
      wrong: ['DNA Ligase', 'Topoisomerase', 'Restriction Endonuclease', 'Helicase'].filter(w => w !== p.enz),
      exp: `${p.enz} catalyzes ${p.pr}.`
    };
  },
  // 2. Cardiac Cycle Parameters
  () => {
    const hr = getRandomChoice([60, 72, 80]);
    const sv = 70; // mL
    const co = ((hr * sv) / 1000).toFixed(2);
    return {
      topic: 'Human Physiology',
      body: `A healthy resting individual has heart rate $\\text{HR} = ${hr}\\text{ beats/min}$ and stroke volume $\\text{SV} = 70\\text{ mL}$. Calculate Cardiac Output ($\\text{CO}$):`,
      correct: `$${co}\\text{ L/min}$`,
      wrong: [`$7.00\\text{ L/min}$`, `$${(co * 1.5).toFixed(2)}\\text{ L/min}$`, `$3.50\\text{ L/min}$`],
      exp: `$\\text{Cardiac Output} = \\text{HR} \\times \\text{SV} = ${hr} \\times 70\\text{ mL} = ${co}\\text{ L/min}$.`
    };
  },
  // 3. Plant Photosynthesis C3 vs C4
  () => {
    const types = [
      { plant: 'Maize / Sugarcane (C4 plants)', acc: 'Phosphoenolpyruvate (PEP)', enz: 'PEP carboxylase in mesophyll cells' },
      { plant: 'Rice / Wheat (C3 plants)', acc: 'Ribulose-1,5-bisphosphate (RuBP)', enz: 'RuBisCO in mesophyll chloroplasts' }
    ];
    const t = getRandomChoice(types);
    return {
      topic: 'Plant Physiology',
      body: `In **${t.plant}**, what is the primary $CO_2$ acceptor molecule and where does initial fixation occur?`,
      correct: `${t.acc} via ${t.enz}`,
      wrong: ['Oxaloacetic Acid via Malate dehydrogenase', 'Pyruvate via Pyruvate kinase', 'PGA via Phosphoglycerate kinase'],
      exp: `${t.plant} utilizes ${t.acc} catalyzed by ${t.enz}.`
    };
  },
  // 4. Biotechnology PCR Thermocycling
  () => {
    const steps = [
      { step: 'Denaturation', temp: '94°C - 96°C', role: 'Separation of double-stranded DNA into single strands' },
      { step: 'Annealing', temp: '50°C - 60°C', role: 'Binding of oligonucleotide primers to template DNA' },
      { step: 'Extension', temp: '72°C', role: 'Taq DNA polymerase synthesizes new DNA strands' }
    ];
    const s = getRandomChoice(steps);
    return {
      topic: 'Biotechnology and its Applications',
      body: `During Polymerase Chain Reaction (PCR), which step occurs at **${s.temp}** and what is its specific molecular function?`,
      correct: `**${s.step}**: ${s.role}`,
      wrong: [
        '**Ligation**: Joining of Okazaki fragments',
        '**Transcription**: Synthesis of primary mRNA transcript',
        '**Digestion**: Cleavage at palindromic restriction site'
      ],
      exp: `At ${s.temp}, ${s.step} occurs where ${s.role}.`
    };
  }
];

function buildMasterQuestion(index) {
  const modSubj = index % 4;
  const isPyq = Math.random() < 0.75;
  const yr = getRandomChoice(pyqYears);

  let q;
  let subj;
  let examTag;

  if (modSubj === 0) {
    subj = 'Physics';
    q = getRandomChoice(physicsPool)();
    examTag = getRandomChoice(['JEE Main', 'JEE Advanced', 'NEET']);
  } else if (modSubj === 1) {
    subj = 'Chemistry';
    q = getRandomChoice(chemPool)();
    examTag = getRandomChoice(['JEE Main', 'JEE Advanced', 'NEET']);
  } else if (modSubj === 2) {
    subj = 'Mathematics';
    q = getRandomChoice(mathPool)();
    examTag = getRandomChoice(['JEE Main', 'JEE Advanced']);
  } else {
    subj = 'Biology';
    q = getRandomChoice(bioPool)();
    examTag = 'NEET';
  }

  let examTypeVal;
  if (examTag === 'JEE Main') examTypeVal = 'JEE-Mains';
  else if (examTag === 'JEE Advanced') examTypeVal = 'JEE-Advanced';
  else examTypeVal = 'NEET';

  const shuffledOptions = shuffleArray([q.correct, ...getRandomChoiceSubset(q.wrong, 3)]);

  return {
    body: q.body,
    options: shuffledOptions,
    answer: q.correct,
    subject: subj,
    examType: examTypeVal,
    topic: q.topic,
    questionType: 'SINGLE',
    marks: 4,
    explanation: q.exp,
    isPyq: isPyq,
    pyqTag: isPyq ? `${examTag} ${yr}` : ''
  };
}

async function startMasterSeeding() {
  try {
    console.log('Clearing questionbank collection...');
    await questionBankModel.deleteMany({});

    const totalTarget = 60000;
    const chunkSize = 2500;
    const totalChunks = totalTarget / chunkSize;

    console.log(`Starting insertion of ${totalTarget} MASTER DIVERSE questions...`);

    for (let c = 0; c < totalChunks; c++) {
      const chunkDocs = [];
      const offset = c * chunkSize;
      for (let i = 0; i < chunkSize; i++) {
        chunkDocs.push(buildMasterQuestion(offset + i));
      }

      await questionBankModel.insertMany(chunkDocs, { ordered: false });
      console.log(`Chunk ${c + 1}/${totalChunks} inserted! (${(c + 1) * chunkSize} / ${totalTarget} questions complete)`);
    }

    const totalInDb = await questionBankModel.countDocuments({});
    console.log('====================================================');
    console.log('✅ MASTER DIVERSE QUESTION BANK SEEDING SUCCESSFUL!');
    console.log(`TOTAL QUESTIONS IN MONGO DATABASE: ${totalInDb}`);
    console.log('====================================================');

    process.exit(0);
  } catch (err) {
    console.error('Error during master seeding:', err);
    process.exit(1);
  }
}

startMasterSeeding();
