const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/online-exam-portal';

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB Atlas for MEGA DIVERSE MULTI-CONCEPT SEEDING...'))
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

function getBenzeneSvg(sub) {
  return `<svg width="200" height="120" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border:1px solid #cbd5e1; border-radius:8px;">
    <polygon points="100,32 128,48 128,80 100,96 72,80 72,48" fill="none" stroke="#d97706" stroke-width="2.2"/>
    <circle cx="100" cy="64" r="15" fill="none" stroke="#d97706" stroke-width="1.8" stroke-dasharray="3 2"/>
    <line x1="100" y1="32" x2="100" y2="15" stroke="#b45309" stroke-width="2"/>
    <text x="100" y="12" font-size="11" font-weight="bold" fill="#92400e" text-anchor="middle">${sub}</text>
  </svg>`;
}

// ==========================================
// ⚛️ ULTRA-DIVERSE TOPIC-BASED PHYSICS GENERATORS
// ==========================================
const physicsTopicGenerators = {
  'Optics': [
    // 1. Brewster's Angle
    () => {
      const mu = getRandomChoice([1.5, 1.732, 1.33, 1.414]);
      const deg = Math.round((Math.atan(mu) * 180) / Math.PI);
      return {
        body: `Unpolarized light is incident from air onto a medium of refractive index $\\mu = ${mu}$. Calculate the Brewster's polarizing angle $\\theta_p$:`,
        correct: `$${deg}^\\circ$`,
        wrong: [`$${deg + 15}^\\circ$`, `$${deg - 10}^\\circ$`, `$45^\\circ$`],
        exp: `By Brewster's law: $\\tan\\theta_p = \\mu = ${mu} \\implies \\theta_p = \\tan^{-1}(${mu}) \\approx ${deg}^\\circ$.`
      };
    },
    // 2. Prism Minimum Deviation
    () => {
      const A = 60;
      const mu = 1.414; // sqrt(2)
      return {
        body: `An equilateral glass prism ($A = 60^\\circ$) has refractive index $\\mu = \\sqrt{2}$. Calculate the angle of minimum deviation $\\delta_m$:`,
        correct: `$30^\\circ$`,
        wrong: [`$45^\\circ$`, `$60^\\circ$`, `$15^\\circ$`],
        exp: `$\\mu = \\frac{\\sin((A+\\delta_m)/2)}{\\sin(A/2)} \\implies \\sqrt{2} = \\frac{\\sin((60+\\delta_m)/2)}{\\sin(30^\\circ)} \\implies \\sin((60+\\delta_m)/2) = \\frac{\\sqrt{2}}{2} = \\sin(45^\\circ) \\implies \\delta_m = 30^\\circ$.`
      };
    },
    // 3. Astronomical Telescope Tube Length & Magnification
    () => {
      const fo = getRandomChoice([100, 120, 150]);
      const fe = getRandomChoice([5, 10]);
      const m = Math.round(fo / fe);
      const l = fo + fe;
      return {
        body: `An astronomical telescope in normal adjustment has objective focal length $f_o = ${fo}\\text{ cm}$ and eyepiece focal length $f_e = ${fe}\\text{ cm}$. Find its magnifying power $M$ and tube length $L$:`,
        correct: `$M = ${m}, L = ${l}\\text{ cm}$`,
        wrong: [`$M = ${m * 2}, L = ${l + 10}\\text{ cm}$`, `$M = ${m}, L = ${fo - fe}\\text{ cm}$`, `$M = ${Math.round(fe / fo)}, L = ${l}\\text{ cm}$`],
        exp: `$M = \\frac{f_o}{f_e} = \\frac{${fo}}{${fe}} = ${m}$. Tube length $L = f_o + f_e = ${fo} + ${fe} = ${l}\\text{ cm}$.`
      };
    },
    // 4. Lens Maker's Formula
    () => {
      const r = getRandomChoice([10, 20, 30]);
      const mu = 1.5;
      const f = r;
      return {
        body: `An equiconvex thin glass lens ($\\mu = 1.5$) has radii of curvature $|R_1| = |R_2| = ${r}\\text{ cm}$. Calculate its focal length $f$ in air:`,
        correct: `$${f}\\text{ cm}$`,
        wrong: [`$${f / 2}\\text{ cm}$`, `$${f * 2}\\text{ cm}$`, `$-${f}\\text{ cm}$`],
        exp: `$\\frac{1}{f} = (\\mu - 1)\\left(\\frac{1}{R} - \\frac{1}{-R}\\right) = (1.5 - 1)\\left(\\frac{2}{${r}}\\right) = \\frac{1}{${r}} \\implies f = ${f}\\text{ cm}$.`
      };
    },
    // 5. Total Internal Reflection Critical Angle
    () => {
      const mu = getRandomChoice([2.0, 1.414]);
      const deg = mu === 2.0 ? 30 : 45;
      return {
        body: `Light travels from a dense optical medium of refractive index $\\mu = ${mu}$ into air. Calculate the critical angle $\\theta_c$ for total internal reflection:`,
        correct: `$${deg}^\\circ$`,
        wrong: [`$${deg + 15}^\\circ$`, `$${deg - 10}^\\circ$`, `$90^\\circ$`],
        exp: `$\\sin\\theta_c = \\frac{1}{\\mu} = \\frac{1}{${mu}} \\implies \\theta_c = ${deg}^\\circ$.`
      };
    },
    // 6. Normal Shift / Apparent Depth
    () => {
      const t = getRandomChoice([12, 16, 20]);
      const mu = 4 / 3;
      const app = (t / mu).toFixed(1);
      const shift = (t - app).toFixed(1);
      return {
        body: `A water tank of depth $d = ${t}\\text{ cm}$ ($\\mu = \\frac{4}{3}$) has a coin at its bottom. Calculate the normal apparent shift $\\Delta t$ of the coin:`,
        correct: `$${shift}\\text{ cm}$`,
        wrong: [`$${app}\\text{ cm}$`, `$${(shift * 2).toFixed(1)}\\text{ cm}$`, `$1.0\\text{ cm}$`],
        exp: `$\\Delta t = d\\left(1 - \\frac{1}{\\mu}\\right) = ${t}\\left(1 - \\frac{3}{4}\\right) = \\frac{${t}}{4} = ${shift}\\text{ cm}$.`
      };
    },
    // 7. Single Slit Diffraction Central Max Width
    () => {
      const aUm = 0.2; // mm
      const lam = 600; // nm
      const dM = 1.0; // m
      const width = ((2 * lam * 1e-9 * dM) / (aUm * 1e-3) * 1000).toFixed(1);
      return {
        body: `Light of wavelength $\\lambda = ${lam}\\text{ nm}$ undergoes Fraunhofer diffraction through a single slit of width $a = ${aUm}\\text{ mm}$ with screen at $D = ${dM}\\text{ m}$. Calculate the linear width of the central maximum:`,
        correct: `$${width}\\text{ mm}$`,
        wrong: [`$${(width / 2).toFixed(1)}\\text{ mm}$`, `$${(width * 2).toFixed(1)}\\text{ mm}$`, `$1.5\\text{ mm}$`],
        exp: `Linear width of central maximum $W = \\frac{2\\lambda D}{a} = \\frac{2 \\times 600\\times 10^{-9} \\times 1}{0.2\\times 10^{-3}} = ${width}\\text{ mm}$.`
      };
    }
  ],
  'Current Electricity': [
    // 1. Drift Velocity
    () => {
      const i = getRandomChoice([2, 4, 5]);
      const a = 1; // mm^2
      const n = 8.5; // x10^28
      const vd = ((i) / (n * 1e28 * 1.6e-19 * a * 1e-6) * 1e3).toFixed(3);
      return {
        body: `A copper conductor of cross-sectional area $A = 1.0\\text{ mm}^2$ carries current $I = ${i}\\text{ A}$. If electron number density $n = 8.5\\times 10^{28}\\text{ m}^{-3}$, calculate the electron drift velocity $v_d$:`,
        correct: `$${vd}\\text{ mm/s}$`,
        wrong: [`$${(vd * 10).toFixed(3)}\\text{ mm/s}$`, `$${(vd / 2).toFixed(3)}\\text{ mm/s}$`, `$1.250\\text{ mm/s}$`],
        exp: `$v_d = \\frac{I}{n e A} = ${vd}\\text{ mm/s}$.`
      };
    },
    // 2. Temperature Coefficient of Resistance
    () => {
      const r0 = 10;
      const alpha = 0.004;
      const t = getRandomChoice([50, 100, 150]);
      const rt = (r0 * (1 + alpha * t)).toFixed(1);
      return {
        body: `A platinum wire has resistance $R_0 = 10\\,\\Omega$ at $0^\\circ\\text{C}$. If temperature coefficient of resistance $\\alpha = 0.004\\text{ }^\\circ\\text{C}^{-1}$, calculate its resistance at $T = ${t}^\\circ\\text{C}$:`,
        correct: `$${rt}\\,\\Omega$`,
        wrong: [`$${(rt * 1.5).toFixed(1)}\\,\\Omega$`, `$10.0\\,\\Omega$`, `$${(rt - 2).toFixed(1)}\\,\\Omega$`],
        exp: `$R_T = R_0(1 + \\alpha T) = 10(1 + 0.004 \\times ${t}) = ${rt}\\,\\Omega$.`
      };
    },
    // 3. Wheatstone Bridge Balance
    () => {
      const p = getRandomInt(2, 6);
      const q = getRandomInt(4, 10);
      const r = p * 2;
      const s = q * 2;
      return {
        body: `In a balanced Wheatstone bridge network, arms $P = ${p}\\,\\Omega, Q = ${q}\\,\\Omega$, and $R = ${r}\\,\\Omega$. Find the unknown resistance $S$:`,
        correct: `$${s}\\,\\Omega$`,
        wrong: [`$${s + 4}\\,\\Omega$`, `$${s / 2}\\,\\Omega$`, `$${p + q}\\,\\Omega$`],
        exp: `Condition for balance: $\\frac{P}{Q} = \\frac{R}{S} \\implies S = \\frac{Q \\times R}{P} = \\frac{${q} \\times ${r}}{${p}} = ${s}\\,\\Omega$.`
      };
    }
  ],
  'Electrostatics': [
    // 1. Gauss Law Cube Flux
    () => {
      const q = getRandomChoice([2, 4, 6]);
      return {
        body: `A point charge $q = +${q}\\,\\mu\\text{C}$ is placed at the exact geometric center of a closed cube. Calculate the electric flux $\\Phi_E$ passing through any **one single face** of the cube:`,
        correct: `$\\frac{${q}\\,\\mu\\text{C}}{6\\varepsilon_0}$`,
        wrong: [`$\\frac{${q}\\,\\mu\\text{C}}{\\varepsilon_0}$`, `$\\frac{${q}\\,\\mu\\text{C}}{8\\varepsilon_0}$`, `$0$`],
        exp: `Total flux through all 6 faces is $\\frac{q}{\\varepsilon_0}$. By symmetry, flux through one face is $\\frac{q}{6\\varepsilon_0}$.`
      };
    },
    // 2. Capacitance with Dielectric Slab
    () => {
      const c0 = getRandomChoice([10, 20, 30]);
      const k = getRandomChoice([2, 4, 5]);
      return {
        body: `A parallel plate air capacitor has capacitance $C_0 = ${c0}\\,\\mu\\text{F}$. When the space between the plates is completely filled with a dielectric of constant $K = ${k}$, find the new capacitance $C$:`,
        correct: `$${c0 * k}\\,\\mu\\text{F}$`,
        wrong: [`$${c0 / k}\\,\\mu\\text{F}$`, `$${c0 + k}\\,\\mu\\text{F}$`, `$${c0}\\,\\mu\\text{F}$`],
        exp: `$C = K \\cdot C_0 = ${k} \\times ${c0} = ${c0 * k}\\,\\mu\\text{F}$.`
      };
    }
  ],
  'Electronic Devices': [
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
        body: `Identify the Boolean output expression $Y$ for the exact logic gate schematic shown below:\n${getLogicGateSvg(g.type)}`,
        correct: `$${g.expr}$`,
        wrong: ['$Y = A \\oplus B$', '$Y = A + B$', '$Y = \\overline{A}$', '$Y = A · B$', '$Y = 0$'].filter(w => w !== `$${g.expr}$`),
        exp: g.exp
      };
    }
  ]
};

// ==========================================
// 📐 ULTRA-DIVERSE TOPIC-BASED MATH GENERATORS
// ==========================================
const mathTopicGenerators = {
  'Statistics and Probability': [
    // 1. Bayes' Theorem
    () => {
      const pB1 = 0.6;
      const pB2 = 0.4;
      const pD_B1 = 0.02;
      const pD_B2 = 0.05;
      const totalD = (pB1 * pD_B1 + pB2 * pD_B2).toFixed(4);
      const bayes = ((pB2 * pD_B2) / totalD).toFixed(3);
      return {
        body: `Plant I manufactures $60\\%$ of output with $2\\%$ defect rate, while Plant II produces $40\\%$ with $5\\%$ defect rate. An item selected at random is defective. Find the probability it was manufactured in Plant II:`,
        correct: `$${bayes}$`,
        wrong: [`$0.400$`, `$0.250$`, `$0.625$`, `$0.500$`],
        exp: `By Bayes' theorem: $P(II|D) = \\frac{P(II)P(D|II)}{P(I)P(D|I) + P(II)P(D|II)} = \\frac{0.4\\times 0.05}{0.6\\times 0.02 + 0.4\\times 0.05} = ${bayes}$.`
      };
    },
    // 2. Binomial Distribution Exactly r Successes
    () => {
      const n = 5;
      const p = '1/6'; // fair die rolling 6
      const ans = `\\frac{625}{3888}`;
      return {
        body: `A fair 6-sided die is thrown $5$ times. Find the probability of getting exactly one $6$ (one success):`,
        correct: `$${ans}$`,
        wrong: [`$\\frac{1}{6}$`, `$\\frac{5}{6}$`, `$\\frac{125}{3888}$`],
        exp: `Binomial distribution: $P(X=1) = ^5C_1 \\left(\\frac{1}{6}\\right)^1 \\left(\\frac{5}{6}\\right)^4 = 5 \\times \\frac{625}{7776} = \\frac{625}{3888}$.`
      };
    },
    // 3. Variance & Standard Deviation of First n Naturals
    () => {
      const n = getRandomChoice([5, 7, 9, 11]);
      const variance = ((n * n - 1) / 12).toFixed(2);
      return {
        body: `Calculate the variance $\\sigma^2$ of the first $n = ${n}$ natural numbers $\\{1, 2, 3, \\dots, ${n}\\}$:`,
        correct: `$${variance}$`,
        wrong: [`$${(variance * 1.5).toFixed(2)}$`, `$${n}.00$`, `$${((n * n) / 12).toFixed(2)}$`],
        exp: `Variance of first $n$ natural numbers is $\\sigma^2 = \\frac{n^2 - 1}{12} = \\frac{${n}^2 - 1}{12} = ${variance}$.`
      };
    }
  ],
  'Matrices and Determinants': [
    // 1. Adjoint Determinant Property
    () => {
      const detA = getRandomInt(2, 5);
      const detAdj = Math.pow(detA, 2);
      return {
        body: `If $A$ is a $3 \\times 3$ matrix with determinant $|A| = ${detA}$, calculate $|\\text{adj}(A)|$:`,
        correct: `$${detAdj}$`,
        wrong: [`$${detA}$`, `$${Math.pow(detA, 3)}$`, `$${detA * 2}$`],
        exp: `$|\\text{adj}(A)| = |A|^{n-1} = ${detA}^{3-1} = ${detA}^2 = ${detAdj}$.`
      };
    },
    // 2. Trace and Orthogonal Matrix
    () => {
      return {
        body: `If $A$ is an orthogonal matrix ($A A^T = I$), what are the possible values for its determinant $|A|$?`,
        correct: `$\\pm 1$`,
        wrong: [`$0$ only`, `$1$ only`, `Any real number`],
        exp: `$|A A^T| = |A|^2 = |I| = 1 \\implies |A| = \\pm 1$.`
      };
    }
  ],
  'Integral Calculus': [
    // 1. King's Property
    () => {
      return {
        body: `Evaluate the definite integral $I = \\int_0^{\\pi/2} \\frac{\\sqrt{\\sin x}}{\\sqrt{\\sin x} + \\sqrt{\\cos x}} \\, dx$:`,
        correct: `$\\frac{\\pi}{4}$`,
        wrong: [`$\\frac{\\pi}{2}$`, `$0$`, `$1$`, `$\\frac{\\pi}{8}$`],
        exp: `Using King's property $I = \\int_0^a f(a-x)dx$ yields $2I = \\int_0^{\\pi/2} 1 dx = \\frac{\\pi}{2} \\implies I = \\frac{\\pi}{4}$.`
      };
    },
    // 2. Integration by Parts e^x(f+f')
    () => {
      return {
        body: `Evaluate the indefinite integral $\\int e^x (\\tan x + \\sec^2 x) \\, dx$:`,
        correct: `$e^x \\tan x + C$`,
        wrong: [`$e^x \\sec^2 x + C$`, `$e^x \\sin x + C$`, `$\\tan x + C$`],
        exp: `Standard form $\\int e^x (f(x) + f'(x)) dx = e^x f(x) + C$ where $f(x) = \\tan x, f'(x) = \\sec^2 x$.`
      };
    }
  ]
};

// ==========================================
// 🧪 ULTRA-DIVERSE TOPIC-BASED CHEM GENERATORS
// ==========================================
const chemTopicGenerators = {
  'Organic Compounds Containing Oxygen': [
    // 1. Substituted Benzene Directive Influence (Exact SVG)
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
        body: `Examine the substituted aromatic structure shown below:\n${getBenzeneSvg(s.group)}\nDetermine the directive influence and activating/deactivating nature of group **${s.group}**:`,
        correct: `${s.direct} & ${s.type}`,
        wrong: [`${s.direct === 'Meta-directing' ? 'Ortho/Para-directing' : 'Meta-directing'} & neutral`, 'Non-directing substituent', 'Ring decomposition'],
        exp: `Group **${s.group}** directs incoming electrophiles to ${s.direct} due to ${s.type}.`
      };
    },
    // 2. Lucas Test Alcohol Distinction
    () => {
      return {
        body: `Which class of alcohols reacts immediately with Lucas reagent (anhydrous $ZnCl_2 + \\text{conc. } HCl$) at room temperature to form turbidity?`,
        correct: `Tertiary ($3^\\circ$) Alcohols`,
        wrong: [`Secondary ($2^\\circ$) Alcohols`, `Primary ($1^\\circ$) Alcohols`, `Methanol only`],
        exp: `$3^\\circ$ alcohols form stable carbocations and react instantaneously to form insoluble alkyl chlorides.`
      };
    }
  ],
  'Coordination Compounds': [
    // 1. Spin-Only Magnetic Moment
    () => {
      const n = getRandomChoice([1, 2, 3, 4, 5]);
      const mu = Math.sqrt(n * (n + 2)).toFixed(2);
      return {
        body: `Calculate the spin-only magnetic moment $\\mu_s$ for a complex ion containing $n = ${n}$ unpaired electrons in its central metal orbital:`,
        correct: `$${mu}\\text{ BM}$`,
        wrong: [`$${(parseFloat(mu) + 1.0).toFixed(2)}\\text{ BM}$`, `$${(n * 1.5).toFixed(2)}\\text{ BM}$`, `$0.00\\text{ BM}$`],
        exp: `$\\mu_s = \\sqrt{n(n+2)} = \\sqrt{${n}(${n+2})} = ${mu}\\text{ BM}$.`
      };
    }
  ]
};

// ==========================================
// 🧬 ULTRA-DIVERSE TOPIC-BASED BIO GENERATORS
// ==========================================
const bioTopicGenerators = {
  'Genetics and Evolution': [
    () => {
      return {
        body: `In Mendelian dihybrid inheritance, what is the expected phenotypic ratio in the $F_2$ generation from a cross between two heterozygous parents ($AaBb \\times AaBb$)?`,
        correct: `$9 : 3 : 3 : 1$`,
        wrong: [`$1 : 2 : 1$`, `$9 : 7$`, `$1 : 1 : 1 : 1$`],
        exp: `Mendel's law of independent assortment produces a classic dihybrid phenotypic ratio of $9:3:3:1$.`
      };
    },
    () => {
      const aCount = getRandomInt(150, 350);
      const cCount = 500 - aCount;
      return {
        body: `A double-stranded DNA segment contains $1000$ base pairs ($2000$ nucleotides). If Adenine ($A$) count is $${aCount}$, find Cytosine ($C$) count via Chargaff's rules:`,
        correct: `$${cCount}$`,
        wrong: [`$${aCount}$`, `$${cCount * 2}$`, `$${1000 - aCount}$`],
        exp: `$A = T = ${aCount}$. Therefore $G + C = 1000 - 2(${aCount}) \\implies C = 500 - ${aCount} = ${cCount}$.`
      };
    }
  ],
  'Human Physiology': [
    () => {
      const hr = getRandomChoice([60, 72, 80]);
      const sv = 70;
      const co = ((hr * sv) / 1000).toFixed(2);
      return {
        body: `Calculate the Cardiac Output ($\\text{CO}$) of a healthy adult with resting heart rate $\\text{HR} = ${hr}\\text{ beats/min}$ and stroke volume $\\text{SV} = 70\\text{ mL}$:`,
        correct: `$${co}\\text{ L/min}$`,
        wrong: [`$7.00\\text{ L/min}$`, `$${(co * 1.5).toFixed(2)}\\text{ L/min}$`, `$3.50\\text{ L/min}$`],
        exp: `$\\text{CO} = \\text{HR} \\times \\text{SV} = ${hr} \\times 70\\text{ mL} = ${co}\\text{ L/min}$.`
      };
    }
  ]
};

function buildMegaQuestion(index) {
  const modSubj = index % 4;
  const isPyq = Math.random() < 0.8;
  const yr = getRandomChoice(pyqYears);

  let subj;
  let qTopic;
  let qItem;
  let examTag;

  if (modSubj === 0) {
    subj = 'Physics';
    const topics = Object.keys(physicsTopicGenerators);
    qTopic = getRandomChoice(topics);
    const genList = physicsTopicGenerators[qTopic];
    qItem = getRandomChoice(genList)();
    examTag = getRandomChoice(['JEE Main', 'JEE Advanced', 'NEET']);
  } else if (modSubj === 1) {
    subj = 'Chemistry';
    const topics = Object.keys(chemTopicGenerators);
    qTopic = getRandomChoice(topics);
    const genList = chemTopicGenerators[qTopic];
    qItem = getRandomChoice(genList)();
    examTag = getRandomChoice(['JEE Main', 'JEE Advanced', 'NEET']);
  } else if (modSubj === 2) {
    subj = 'Mathematics';
    const topics = Object.keys(mathTopicGenerators);
    qTopic = getRandomChoice(topics);
    const genList = mathTopicGenerators[qTopic];
    qItem = getRandomChoice(genList)();
    examTag = getRandomChoice(['JEE Main', 'JEE Advanced']);
  } else {
    subj = 'Biology';
    const topics = Object.keys(bioTopicGenerators);
    qTopic = getRandomChoice(topics);
    const genList = bioTopicGenerators[qTopic];
    qItem = getRandomChoice(genList)();
    examTag = 'NEET';
  }

  let examTypeVal;
  if (examTag === 'JEE Main') examTypeVal = 'JEE-Mains';
  else if (examTag === 'JEE Advanced') examTypeVal = 'JEE-Advanced';
  else examTypeVal = 'NEET';

  const shuffledOptions = shuffleArray([qItem.correct, ...getRandomChoiceSubset(qItem.wrong, 3)]);

  return {
    body: qItem.body,
    options: shuffledOptions,
    answer: qItem.correct,
    subject: subj,
    examType: examTypeVal,
    topic: qTopic,
    questionType: 'SINGLE',
    marks: 4,
    explanation: qItem.exp,
    isPyq: isPyq,
    pyqTag: isPyq ? `${examTag} ${yr}` : ''
  };
}

async function startMegaSeeding() {
  try {
    console.log('Clearing questionbank collection...');
    await questionBankModel.deleteMany({});

    const totalTarget = 60000;
    const chunkSize = 2500;
    const totalChunks = totalTarget / chunkSize;

    console.log(`Starting insertion of ${totalTarget} MEGA DIVERSE MULTI-CONCEPT questions...`);

    for (let c = 0; c < totalChunks; c++) {
      const chunkDocs = [];
      const offset = c * chunkSize;
      for (let i = 0; i < chunkSize; i++) {
        chunkDocs.push(buildMegaQuestion(offset + i));
      }

      await questionBankModel.insertMany(chunkDocs, { ordered: false });
      console.log(`Chunk ${c + 1}/${totalChunks} inserted! (${(c + 1) * chunkSize} / ${totalTarget} questions complete)`);
    }

    const totalInDb = await questionBankModel.countDocuments({});
    console.log('====================================================');
    console.log('✅ MEGA DIVERSE MULTI-CONCEPT SEEDING SUCCESSFUL!');
    console.log(`TOTAL QUESTIONS IN MONGO DATABASE: ${totalInDb}`);
    console.log('====================================================');

    process.exit(0);
  } catch (err) {
    console.error('Error during mega seeding:', err);
    process.exit(1);
  }
}

startMegaSeeding();
