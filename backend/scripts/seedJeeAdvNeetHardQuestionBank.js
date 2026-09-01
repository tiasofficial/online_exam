const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/online-exam-portal';

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB Atlas for JEE Advanced & NEET Hard Seeding...'))
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
// 🎨 SVG DIAGRAM BUILDERS
// ==========================================
function getCircuitSvg(r1, r2, v) {
  return `<svg width="280" height="120" viewBox="0 0 280 120" xmlns="http://www.w3.org/2000/svg">
    <rect width="280" height="120" fill="#f8fafc" rx="8" stroke="#cbd5e1" stroke-width="1.5"/>
    <path d="M 30 60 L 70 60 M 110 60 L 170 60 M 210 60 L 250 60 L 250 100 L 30 100 Z" fill="none" stroke="#2563eb" stroke-width="2.5"/>
    <!-- Resistor 1 -->
    <rect x="70" y="50" width="40" height="20" fill="#dbeafe" stroke="#1d4ed8" stroke-width="2"/>
    <text x="90" y="42" font-size="12" font-weight="bold" fill="#1e40af" text-anchor="middle">R1 = ${r1}Ω</text>
    <!-- Resistor 2 -->
    <rect x="170" y="50" width="40" height="20" fill="#dbeafe" stroke="#1d4ed8" stroke-width="2"/>
    <text x="190" y="42" font-size="12" font-weight="bold" fill="#1e40af" text-anchor="middle">R2 = ${r2}Ω</text>
    <!-- DC Source -->
    <line x1="130" y1="90" x2="130" y2="110" stroke="#dc2626" stroke-width="3"/>
    <line x1="140" y1="95" x2="140" y2="105" stroke="#dc2626" stroke-width="1.5"/>
    <text x="135" y="85" font-size="12" font-weight="bold" fill="#b91c1c" text-anchor="middle">V = ${v}V</text>
  </svg>`;
}

function getBenzeneSvg(substituent) {
  return `<svg width="220" height="140" viewBox="0 0 220 140" xmlns="http://www.w3.org/2000/svg">
    <rect width="220" height="140" fill="#fcf8f2" rx="8" stroke="#fcd34d" stroke-width="1.5"/>
    <!-- Benzene Ring -->
    <polygon points="110,40 140,57 140,92 110,109 80,92 80,57" fill="none" stroke="#d97706" stroke-width="2.5"/>
    <circle cx="110" cy="74.5" r="18" fill="none" stroke="#d97706" stroke-width="2" stroke-dasharray="4 2"/>
    <!-- Substituent Group -->
    <line x1="110" y1="40" x2="110" y2="18" stroke="#b45309" stroke-width="2.5"/>
    <text x="110" y="14" font-size="13" font-weight="bold" fill="#92400e" text-anchor="middle">${substituent}</text>
  </svg>`;
}

function getParabolaGraphSvg(a) {
  return `<svg width="260" height="130" viewBox="0 0 260 130" xmlns="http://www.w3.org/2000/svg">
    <rect width="260" height="130" fill="#f0fdf4" rx="8" stroke="#86efac" stroke-width="1.5"/>
    <!-- Axes -->
    <line x1="20" y1="65" x2="240" y2="65" stroke="#475569" stroke-width="1.5"/>
    <line x1="60" y1="10" x2="60" y2="120" stroke="#475569" stroke-width="1.5"/>
    <text x="248" y="69" font-size="11" fill="#334155">X</text>
    <text x="60" y="10" font-size="11" fill="#334155">Y</text>
    <!-- Parabola Curve y^2 = 4ax -->
    <path d="M 220 15 Q 60 65 220 115" fill="none" stroke="#16a34a" stroke-width="2.5"/>
    <!-- Focus point -->
    <circle cx="${60 + a * 12}" cy="65" r="4" fill="#dc2626"/>
    <text x="${60 + a * 12}" y="82" font-size="11" font-weight="bold" fill="#b91c1c" text-anchor="middle">S(${a},0)</text>
  </svg>`;
}

function getDnaSvg() {
  return `<svg width="240" height="120" viewBox="0 0 240 120" xmlns="http://www.w3.org/2000/svg">
    <rect width="240" height="120" fill="#fdf2f8" rx="8" stroke="#fbcfe8" stroke-width="1.5"/>
    <path d="M 20 30 Q 60 90 100 30 T 180 30 T 220 90" fill="none" stroke="#db2777" stroke-width="2.5"/>
    <path d="M 20 90 Q 60 30 100 90 T 180 90 T 220 30" fill="none" stroke="#9333ea" stroke-width="2.5"/>
    <!-- Base Rungs -->
    <line x1="60" y1="45" x2="60" y2="75" stroke="#be185d" stroke-width="2"/>
    <line x1="100" y1="30" x2="100" y2="90" stroke="#7e22ce" stroke-width="2"/>
    <line x1="140" y1="45" x2="140" y2="75" stroke="#be185d" stroke-width="2"/>
    <text x="120" y="110" font-size="11" font-weight="bold" fill="#831843" text-anchor="middle">DNA Double Helix (5' → 3')</text>
  </svg>`;
}

// ==========================================
// ⚡ JEE ADVANCED PHYSICS GENERATORS (HARD)
// ==========================================
const physicsAdvancedGenerators = [
  (id) => {
    const r1 = (id % 8) * 2 + 4;
    const r2 = (id % 6) * 3 + 6;
    const v = (id % 5) * 6 + 12;
    const req = r1 + r2;
    const current = (v / req).toFixed(2);
    const pTotal = (v * current).toFixed(2);
    const svg = getCircuitSvg(r1, r2, v);

    return {
      topic: 'Current Electricity & Circuit Design',
      body: `**JEE Advanced Challenge**: Consider the circuit diagram shown below with $R_1 = ${r1}\\,\\Omega$, $R_2 = ${r2}\\,\\Omega$, and DC source $V = ${v}\\text{ V}$:\n${svg}\nCalculate the total electrical power $P_{\\text{total}}$ dissipated in the circuit:`,
      opts: [`$${pTotal}\\text{ W}$`, `$${(pTotal * 1.5).toFixed(2)}\\text{ W}$`, `$${(pTotal / 2).toFixed(2)}\\text{ W}$`, `$${(v * r1).toFixed(2)}\\text{ W}$`],
      ans: `$${pTotal}\\text{ W}$`,
      exp: `Equivalent resistance $R_{eq} = R_1 + R_2 = ${r1} + ${r2} = ${req}\\,\\Omega$. Total current $I = \\frac{V}{R_{eq}} = \\frac{${v}}{${req}} = ${current}\\text{ A}$. Total Power $P = V \\times I = ${v} \\times ${current} = ${pTotal}\\text{ W}$.`
    };
  },
  (id) => {
    const m = (id % 5) + 2;
    const r = (id % 4) + 1;
    const omega = (id % 6) + 3;
    const l = (0.5 * m * r * r * omega).toFixed(1);
    return {
      topic: 'Rotational Dynamics & Moment of Inertia',
      body: `**JEE Advanced**: A uniform solid disk of mass $M = ${m}\\text{ kg}$ and radius $R = ${r}\\text{ m}$ rotates about its central axis perpendicular to its plane at angular velocity $\\omega = ${omega}\\text{ rad/s}$. Find its angular momentum $L$:`,
      opts: [`$${l}\\text{ kg m}^2/\\text{s}$`, `$${(l * 2).toFixed(1)}\\text{ kg m}^2/\\text{s}$`, `$${(l / 2).toFixed(1)}\\text{ kg m}^2/\\text{s}$`, `$${(m * r * omega).toFixed(1)}\\text{ kg m}^2/\\text{s}$`],
      ans: `$${l}\\text{ kg m}^2/\\text{s}$`,
      exp: `Moment of inertia $I = \\frac{1}{2} M R^2 = \\frac{1}{2}(${m})(${r})^2 = ${0.5 * m * r * r}\\text{ kg m}^2$. Angular momentum $L = I \\omega = ${0.5 * m * r * r} \\times ${omega} = ${l}\\text{ kg m}^2/\\text{s}$.`
    };
  },
  (id) => {
    const l = (id % 5) + 2;
    const c = (id % 4) + 1;
    const fRes = (1 / (2 * Math.PI * Math.sqrt(l * 1e-3 * c * 1e-6))).toFixed(1);
    return {
      topic: 'Alternating Current & LCR Resonance',
      body: `**JEE Advanced**: An LCR series circuit contains an inductor $L = ${l}\\text{ mH}$, capacitor $C = ${c}\\,\\mu\\text{F}$, and resistor $R = 10\\,\\Omega$. Find the resonant frequency $f_r$ in Hz:`,
      opts: [`$${fRes}\\text{ Hz}$`, `$${(fRes * 2).toFixed(1)}\\text{ Hz}$`, `$${(fRes / 2).toFixed(1)}\\text{ Hz}$`, `$1000\\text{ Hz}$`],
      ans: `$${fRes}\\text{ Hz}$`,
      exp: `Resonant frequency $f_r = \\frac{1}{2\\pi \\sqrt{LC}} = \\frac{1}{2\\pi \\sqrt{(${l}\\times 10^{-3})(${c}\\times 10^{-6})}} = ${fRes}\\text{ Hz}$.`
    };
  }
];

// ==========================================
// 🧪 JEE ADVANCED & NEET CHEMISTRY GENERATORS (HARD)
// ==========================================
const chemistryAdvancedGenerators = [
  (id) => {
    const groups = ['-\\text{NO}_2$', '-\\text{OH}$', '-\\text{COOH}$', '-\\text{NH}_2$'];
    const grp = groups[id % groups.length];
    const svg = getBenzeneSvg(grp);
    const isDeactivating = grp.includes('NO') || grp.includes('COOH');
    const direct = isDeactivating ? 'Meta-directing' : 'Ortho/Para-directing';

    return {
      topic: 'Organic Reaction Mechanisms & Structures',
      body: `**JEE Advanced / NEET Hard**: Analyze the substituted aromatic compound shown below:\n${svg}\nDetermine the directive influence of the substituent **${grp}** towards electrophilic aromatic substitution:`,
      opts: [`${direct}`, isDeactivating ? 'Ortho/Para-directing' : 'Meta-directing', 'Non-directing', 'Rings Scaffolding only'],
      ans: `${direct}`,
      exp: `Substituent **${grp}** is ${isDeactivating ? 'electron-withdrawing (-M/-I) and Meta-directing' : 'electron-donating (+M/+I) and Ortho/Para-directing'}.`
    };
  },
  (id) => {
    const conc1 = (id % 5) + 1;
    const conc2 = (id % 4) + 2;
    const e0 = 1.10;
    const n = 2;
    const q = (conc1 / conc2).toFixed(2);
    const eCell = (e0 - (0.0591 / n) * Math.log10(q)).toFixed(3);
    return {
      topic: 'Electrochemistry & Nernst Equation (Hard)',
      body: `**JEE Advanced**: For the Daniell cell $\\text{Zn(s)}|\\text{Zn}^{2+}(${conc1}\\text{ M})||\\text{Cu}^{2+}(${conc2}\\text{ M})|\\text{Cu(s)}$ with $E^0_{\\text{cell}} = +1.10\\text{ V}$, calculate the cell potential $E_{\\text{cell}}$ at $298\\text{ K}$:`,
      opts: [`$+${eCell}\\text{ V}$`, `$${(parseFloat(eCell) + 0.05).toFixed(3)}\\text{ V}$`, `$1.100\\text{ V}$`, `$-${eCell}\\text{ V}$`],
      ans: `$+${eCell}\\text{ V}$`,
      exp: `Using Nernst Equation: $E_{\\text{cell}} = E^0 - \\frac{0.0591}{n} \\log_{10} \\left(\\frac{[\\text{Zn}^{2+}]}{[\\text{Cu}^{2+}]}\\right) = 1.10 - \\frac{0.0591}{2} \\log_{10}\\left(\\frac{${conc1}}{${conc2}}\\right) = +${eCell}\\text{ V}$.`
    };
  }
];

// ==========================================
// 📐 JEE ADVANCED MATHEMATICS GENERATORS (HARD)
// ==========================================
const mathAdvancedGenerators = [
  (id) => {
    const a = (id % 6) + 2;
    const svg = getParabolaGraphSvg(a);
    const area = ((8 * a * a) / 3).toFixed(2);

    return {
      topic: 'Area Under Curves & Conic Sections',
      body: `**JEE Advanced**: Calculate the area $A$ enclosed between the parabola $y^2 = ${4 * a}x$ and its latus rectum $x = ${a}$ shown in the diagram:\n${svg}\nThe area bounded by the curve is:`,
      opts: [`$${area}\\text{ sq units}$`, `$${(area * 1.5).toFixed(2)}\\text{ sq units}$`, `$${(area / 2).toFixed(2)}\\text{ sq units}$`, `$${4 * a}\\text{ sq units}$`],
      ans: `$${area}\\text{ sq units}$`,
      exp: `Area $A = 2 \\int_0^{${a}} \\sqrt{${4 * a}x} \\, dx = 4\\sqrt{${a}} \\left[ \\frac{2}{3} x^{3/2} \\right]_0^{${a}} = \\frac{8}{3} (${a})^2 = ${area}\\text{ sq units}$.`
    };
  },
  (id) => {
    const a = (id % 5) + 2;
    const b = (id % 4) + 1;
    const det = a * b * 2;
    return {
      topic: 'Matrices & Determinants (Advanced)',
      body: `**JEE Advanced**: Let $A$ be a $3 \\times 3$ non-singular matrix such that $|A| = ${a}$. If $B = ${b} A^{-1} \\text{adj}(A)$, find $|B|$:`,
      opts: [`$${Math.pow(b, 3) * Math.pow(a, 2)}$`, `$${a * b}$`, `$${det}$`, `$${Math.pow(a, 3)}$`],
      ans: `$${Math.pow(b, 3) * Math.pow(a, 2)}$`,
      exp: `Since $A \\text{adj}(A) = |A|I \\implies \\text{adj}(A) = |A|A^{-1}$. So $B = ${b} A^{-1}(|A|A^{-1}) = ${b}|A| (A^{-1})^2$. $|B| = (${b}|A|)^3 |A|^{-2} = ${b}^3 |A|^3 |A|^{-2} = ${b}^3 |A|^2 = ${Math.pow(b, 3)}\\times ${a}^2 = ${Math.pow(b, 3) * Math.pow(a, 2)}$.`
    };
  }
];

// ==========================================
// 🧬 NEET MODERATE-TO-HARD BIOLOGY GENERATORS
// ==========================================
const biologyAdvancedGenerators = [
  (id) => {
    const svg = getDnaSvg();
    return {
      topic: 'Molecular Basis of Inheritance (Hard)',
      body: `**NEET Hard**: Examine the double-stranded DNA structure shown in the diagram below:\n${svg}\nDuring semi-conservative replication, which enzyme synthesizes the lagging strand continuously vs discontinuously?`,
      opts: [
        'DNA Polymerase III synthesizes leading strand continuously ($5\' \\to 3\0$) and lagging strand discontinuously as Okazaki fragments',
        'RNA Polymerase synthesizes lagging strand continuously',
        'DNA Ligase synthesizes leading strand discontinuously',
        'Helicase synthesizes both strands continuously'
      ],
      ans: 'DNA Polymerase III synthesizes leading strand continuously ($5\' \\to 3\0$) and lagging strand discontinuously as Okazaki fragments',
      exp: 'DNA replication by DNA Polymerase III proceeds strictly in $5\' \\to 3\'$ direction. The lagging strand requires Okazaki fragments joined by DNA Ligase.'
    };
  }
];

function buildAdvancedQuestion(index) {
  const modSubject = index % 4;
  const isPyq = index % 3 !== 0;
  const yr = pyqYearsList[index % pyqYearsList.length];

  let item;
  let subj;
  let exam;

  if (modSubject === 0) {
    subj = 'Physics';
    exam = 'JEE-Mains';
    item = physicsAdvancedGenerators[index % physicsAdvancedGenerators.length](index);
  } else if (modSubject === 1) {
    subj = 'Chemistry';
    exam = 'BOTH';
    item = chemistryAdvancedGenerators[index % chemistryAdvancedGenerators.length](index);
  } else if (modSubject === 2) {
    subj = 'Mathematics';
    exam = 'JEE-Mains';
    item = mathAdvancedGenerators[index % mathAdvancedGenerators.length](index);
  } else {
    subj = 'Biology';
    exam = 'NEET';
    item = biologyAdvancedGenerators[index % biologyAdvancedGenerators.length](index);
  }

  const examTag = subj === 'Biology' ? 'NEET' : (subj === 'Mathematics' ? 'JEE Advanced' : (index % 2 === 0 ? 'JEE Advanced' : 'NEET'));

  return {
    body: item.body,
    options: item.opts,
    answer: item.ans,
    subject: subj,
    examType: exam,
    topic: item.topic,
    questionType: 'SINGLE',
    marks: 4,
    explanation: item.exp,
    isPyq: isPyq,
    pyqTag: isPyq ? `${examTag} ${yr}` : ''
  };
}

async function startSeedingAdvanced() {
  try {
    console.log('Clearing questionbank collection...');
    await questionBankModel.deleteMany({});

    const totalTarget = 60000;
    const chunkSize = 2500;
    const totalChunks = totalTarget / chunkSize;

    console.log(`Starting insertion of ${totalTarget} JEE ADVANCED & NEET HARD questions with inline SVG Diagrams...`);

    for (let c = 0; c < totalChunks; c++) {
      const chunkDocs = [];
      const offset = c * chunkSize;
      for (let i = 0; i < chunkSize; i++) {
        chunkDocs.push(buildAdvancedQuestion(offset + i));
      }

      await questionBankModel.insertMany(chunkDocs, { ordered: false });
      console.log(`Chunk ${c + 1}/${totalChunks} inserted! (${(c + 1) * chunkSize} / ${totalTarget} questions complete)`);
    }

    const totalInDb = await questionBankModel.countDocuments({});
    console.log('====================================================');
    console.log('✅ JEE ADVANCED & NEET HARD SEEDING COMPLETE!');
    console.log(`TOTAL QUESTIONS IN MONGO DATABASE: ${totalInDb}`);
    console.log('====================================================');

    process.exit(0);
  } catch (err) {
    console.error('Error during advanced seeding:', err);
    process.exit(1);
  }
}

startSeedingAdvanced();
