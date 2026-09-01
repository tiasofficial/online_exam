const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/online-exam-portal';

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB Atlas for 100% High Diversity Seeding...'))
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

const pyqYearsList = ['2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'];

// ==========================================
// 📐 MATHEMATICS GENERATORS
// ==========================================
const mathGenerators = [
  (id) => {
    const k = (id * 3 + 2) % 15 + 1;
    const det = k * 4 - 6;
    return {
      topic: 'Matrices & Determinants',
      body: `If $A = \\begin{pmatrix} ${k} & 2 \\\\ 3 & 4 \\end{pmatrix}$, find the determinant $|A|$:`,
      opts: [`$${det}$`, `$${det + 5}$`, `$${det - 4}$`, `$${det * 2}$`],
      ans: `$${det}$`,
      exp: `|A| = (${k})(4) - (2)(3) = ${k * 4} - 6 = ${det}.`
    };
  },
  (id) => {
    const a = (id * 5 + 1) % 12 + 1;
    const b = (id * 7 + 3) % 12 + 1;
    const modSq = a * a + b * b;
    return {
      topic: 'Complex Numbers',
      body: `Find the modulus $|z|$ of the complex number $z = ${a} + ${b}i$:`,
      opts: [`$\\sqrt{${modSq}}$`, `$${a + b}$`, `$${modSq}$`, `$\\sqrt{${a * b}}$`],
      ans: `$\\sqrt{${modSq}}$`,
      exp: `|z| = \\sqrt{a^2 + b^2} = \\sqrt{${a}^2 + ${b}^2} = \\sqrt{${modSq}}.`
    };
  },
  (id) => {
    const a = (id * 4 + 1) % 8 + 2;
    const b = (id * 3 + 2) % 6 + 3;
    return {
      topic: 'Limits & Continuity',
      body: `Evaluate the limit $\\lim_{x \\to 0} \\frac{e^{${a}x} - 1}{\\sin(${b}x)}$:`,
      opts: [`$\\frac{${a}}{${b}}$`, `$\\frac{${b}}{${a}}$`, `$${a + b}$`, `$1$`],
      ans: `$\\frac{${a}}{${b}}$`,
      exp: `L'Hopital's rule: \\lim_{x\\to 0} \\frac{${a} e^{${a}x}}{${b} \\cos(${b}x)} = \\frac{${a}}{${b}}.`
    };
  },
  (id) => {
    const a = (id * 2 + 1) % 7 + 1;
    return {
      topic: 'Indefinite Integrals',
      body: `Evaluate the integral $\\int \\frac{dx}{x^2 + ${a * a}}$:`,
      opts: [`$\\frac{1}{${a}} \\tan^{-1}\\left(\\frac{x}{${a}}\\right) + C$`, `$\\tan^{-1}\\left(\\frac{x}{${a}}\\right) + C$`, `$\\frac{1}{${a}} \\ln|x^2 + ${a * a}| + C$`, `$\\frac{1}{2${a}} \\ln|x| + C$`],
      ans: `$\\frac{1}{${a}} \\tan^{-1}\\left(\\frac{x}{${a}}\\right) + C$`,
      exp: `Standard integral formula: \\int \\frac{dx}{x^2 + a^2} = \\frac{1}{a} \\tan^{-1}\\frac{x}{a} + C.`
    };
  },
  (id) => {
    const a = (id * 3 + 1) % 8 + 2;
    const b = (id * 2 + 3) % 6 + 1;
    const dot = a * 2 + b * 3 - 4;
    return {
      topic: 'Vector Algebra',
      body: `If $\\vec{u} = ${a}\\hat{i} + ${b}\\hat{j} + 4\\hat{k}$ and $\\vec{v} = 2\\hat{i} + 3\\hat{j} - \\hat{k}$, find $\\vec{u} \\cdot \\vec{v}$:`,
      opts: [`$${dot}$`, `$${dot + 5}$`, `$${dot - 3}$`, `$${a * b}$`],
      ans: `$${dot}$`,
      exp: `\\vec{u} \\cdot \\vec{v} = (${a})(2) + (${b})(3) + (4)(-1) = ${dot}.`
    };
  },
  (id) => {
    const n = (id * 5 + 1) % 6 + 4;
    const nCr = (n * (n - 1)) / 2;
    return {
      topic: 'Permutations & Combinations',
      body: `Calculate the number of ways to choose 2 items out of ${n} distinct items ($^{${n}}C_2$):`,
      opts: [`$${nCr}$`, `$${n * (n - 1)}$`, `$${nCr + 4}$`, `$${n * 2}$`],
      ans: `$${nCr}$`,
      exp: `^nC_2 = \\frac{n(n-1)}{2} = \\frac{${n}(${n - 1})}{2} = ${nCr}.`
    };
  },
  (id) => {
    const a = (id * 3 + 2) % 9 + 2;
    return {
      topic: 'Conic Sections (Parabola)',
      body: `Find the focal distance $a$ for the parabola $y^2 = ${4 * a}x$:`,
      opts: [`$${a}$`, `$${4 * a}$`, `$${2 * a}$`, `$\\frac{${a}}{2}$`],
      ans: `$${a}$`,
      exp: `Comparing with standard parabola y^2 = 4ax yields a = ${a}.`
    };
  },
  (id) => {
    const p = (((id * 3) % 4) + 1) * 0.2;
    return {
      topic: 'Probability & Statistics',
      body: `If the probability of success in a trial is $P = ${p.toFixed(1)}$, what is the probability of failure $Q$?`,
      opts: [`$${(1 - p).toFixed(1)}$`, `$${p.toFixed(1)}$`, `$0.5$`, `$${(p / 2).toFixed(2)}$`],
      ans: `$${(1 - p).toFixed(1)}$`,
      exp: `Q = 1 - P = 1 - ${p.toFixed(1)} = ${(1 - p).toFixed(1)}.`
    };
  },
  (id) => {
    const m = (id * 2 + 1) % 6 + 1;
    const c = (id * 4 + 3) % 5 + 2;
    return {
      topic: 'Straight Lines & Circles',
      body: `Find the y-intercept of the straight line $y = ${m}x + ${c}$:`,
      opts: [`$${c}$`, `$${m}$`, `$${-c}$`, `$\\frac{${c}}{${m}}$`],
      ans: `$${c}$`,
      exp: `In slope-intercept form y = mx + c, the y-intercept is c = ${c}.`
    };
  },
  (id) => {
    const n = (id * 3 + 1) % 7 + 3;
    const sum = (n * (n + 1)) / 2;
    return {
      topic: 'Sequences & Series (AP & GP)',
      body: `Find the sum of the first ${n} natural numbers ($1 + 2 + \\dots + ${n}$):`,
      opts: [`$${sum}$`, `$${sum + n}$`, `$${n * n}$`, `$${sum - 1}$`],
      ans: `$${sum}$`,
      exp: `Sum = \\frac{n(n+1)}{2} = \\frac{${n}(${n + 1})}{2} = ${sum}.`
    };
  }
];

// ==========================================
// ⚛️ PHYSICS GENERATORS
// ==========================================
const physicsArchitectures = [
  (id) => {
    const v = (id * 7 + 10) % 50 + 10;
    const r = (id * 3 + 1) % 6 + 2;
    const i = (v / r).toFixed(1);
    return {
      topic: 'Current Electricity & Circuits',
      body: `A DC voltage $V = ${v}\\text{ V}$ is applied across resistor $R = ${r}\\,\\Omega$. Calculate the electric current $I$:`,
      opts: [`$${i}\\text{ A}$`, `$${v * r}\\text{ A}$`, `$${(r / v).toFixed(2)}\\text{ A}$`, `$${i * 2}\\text{ A}$`],
      ans: `$${i}\\text{ A}$`,
      exp: `I = \\frac{V}{R} = \\frac{${v}}{${r}} = ${i}\\text{ A}.`
    };
  },
  (id) => {
    const m = (id * 2 + 1) % 5 + 2;
    const a = (id * 4 + 3) % 4 + 3;
    const f = m * a;
    return {
      topic: 'Laws of Motion & Friction',
      body: `Calculate the net force $F$ required to accelerate a mass of $m = ${m}\\text{ kg}$ at $a = ${a}\\text{ m/s}^2$:`,
      opts: [`$${f}\\text{ N}$`, `$${f + 10}\\text{ N}$`, `$${m + a}\\text{ N}$`, `$${(m / a).toFixed(2)}\\text{ N}$`],
      ans: `$${f}\\text{ N}$`,
      exp: `Newton's Second Law: F = m \\times a = ${m} \\times ${a} = ${f}\\text{ N}.`
    };
  },
  (id) => {
    const f = (id * 5 + 10) % 40 + 10;
    const p = (100 / f).toFixed(2);
    return {
      topic: 'Ray Optics & Optical Instruments',
      body: `A convex lens has focal length $f = +${f}\\text{ cm}$. Find its optical power $P$:`,
      opts: [`$+${p}\\text{ D}$`, `$-${p}\\text{ D}$`, `$${(f / 100).toFixed(2)}\\text{ D}$`, `$+${(p * 2)}\\text{ D}$`],
      ans: `$+${p}\\text{ D}$`,
      exp: `Power P = \\frac{100}{f(\\text{cm})} = \\frac{100}{${f}} = +${p}\\text{ D}.`
    };
  },
  (id) => {
    const u = (id * 4 + 1) % 20 + 5;
    const a = (id * 2 + 1) % 3 + 2;
    const t = 3;
    const v = u + a * t;
    return {
      topic: 'Kinematics & Motion',
      body: `A body starts with initial velocity $u = ${u}\\text{ m/s}$ and accelerates at $a = ${a}\\text{ m/s}^2$ for $t = ${t}\\text{ s}$. Find final velocity $v$:`,
      opts: [`$${v}\\text{ m/s}$`, `$${v + 5}\\text{ m/s}$`, `$${u * t}\\text{ m/s}$`, `$${a * t}\\text{ m/s}$`],
      ans: `$${v}\\text{ m/s}$`,
      exp: `v = u + at = ${u} + (${a})(${t}) = ${v}\\text{ m/s}.`
    };
  },
  (id) => {
    const t1 = (id * 30 + 100) % 400 + 400;
    const t2 = 300;
    const eff = (((t1 - t2) / t1) * 100).toFixed(1);
    return {
      topic: 'Thermodynamics & Heat Transfer',
      body: `A Carnot engine operates between $T_1 = ${t1}\\text{ K}$ and $T_2 = ${t2}\\text{ K}$. Calculate its efficiency $\\eta$:`,
      opts: [`$${eff}\\%$`, `$${(eff / 2).toFixed(1)}\\%$`, `$100\\%$`, `$${(t2 / t1 * 100).toFixed(1)}\\%$`],
      ans: `$${eff}\\%$`,
      exp: `\\eta = 1 - \\frac{T_2}{T_1} = 1 - \\frac{${t2}}{${t1}} = ${eff}\\%.`
    };
  },
  (id) => {
    const c1 = (id * 3 + 1) % 5 + 2;
    const c2 = (id * 2 + 3) % 4 + 3;
    const cEq = c1 + c2;
    return {
      topic: 'Capacitance & Dielectrics',
      body: `Two capacitors $C_1 = ${c1}\\,\\mu\\text{F}$ and $C_2 = ${c2}\\,\\mu\\text{F}$ are connected in parallel. Equivalent capacitance $C_{eq}$ is:`,
      opts: [`$${cEq}\\,\\mu\\text{F}$`, `$${((c1 * c2) / (c1 + c2)).toFixed(2)}\\,\\mu\\text{F}$`, `$${c1 * c2}\\,\\mu\\text{F}$`, `$${c1}\\mu\\text{F}$`],
      ans: `$${cEq}\\,\\mu\\text{F}$`,
      exp: `Parallel combination: C_{eq} = C_1 + C_2 = ${c1} + ${c2} = ${cEq}\\,\\mu\\text{F}.`
    };
  },
  (id) => {
    const m = (id * 2 + 1) % 6 + 1;
    const v = (id * 3 + 2) % 5 + 4;
    const ke = 0.5 * m * v * v;
    return {
      topic: 'Work, Power & Energy',
      body: `Calculate the kinetic energy of an object of mass $m = ${m}\\text{ kg}$ moving at speed $v = ${v}\\text{ m/s}$:`,
      opts: [`$${ke}\\text{ J}$`, `$${m * v}\\text{ J}$`, `$${ke * 2}\\text{ J}$`, `$${(ke / 2).toFixed(1)}\\text{ J}$`],
      ans: `$${ke}\\text{ J}$`,
      exp: `KE = \\frac{1}{2} m v^2 = \\frac{1}{2} (${m}) (${v})^2 = ${ke}\\text{ J}.`
    };
  },
  (id) => {
    const h = (id * 3 + 1) % 5 + 1;
    const lambda = (1.227 / Math.sqrt(h * 100)).toFixed(3);
    return {
      topic: 'Dual Nature of Matter',
      body: `Accelerating an electron through potential difference $V = ${h * 100}\\text{ V}$ gives de Broglie wavelength $\\lambda$:`,
      opts: [`$${lambda}\\text{ \\AA}$`, `$${(lambda * 2).toFixed(3)}\\text{ \\AA}$`, `$10\\text{ \\AA}$`, `$0.1\\text{ \\AA}$`],
      ans: `$${lambda}\\text{ \\AA}$`,
      exp: `\\lambda = \\frac{12.27}{\\sqrt{V}}\\text{ \\AA} = \\frac{12.27}{\\sqrt{${h * 100}}} = ${lambda}\\text{ \\AA}.`
    };
  }
];

// ==========================================
// 🧪 CHEMISTRY GENERATORS
// ==========================================
const chemistryArchitectures = [
  (id) => {
    const eCat = (0.1 * ((id * 3) % 8 + 4)).toFixed(2);
    const eAn = (-0.1 * ((id * 2) % 6 + 2)).toFixed(2);
    const eCell = (parseFloat(eCat) - parseFloat(eAn)).toFixed(2);
    return {
      topic: 'Electrochemistry & Nernst Equation',
      body: `For a cell with $E^0_{\\text{cathode}} = +${eCat}\\text{ V}$ and $E^0_{\\text{anode}} = ${eAn}\\text{ V}$, standard cell potential $E^0_{\\text{cell}}$ is:`,
      opts: [`$+${eCell}\\text{ V}$`, `$${(eCat - eAn).toFixed(2)}\\text{ V}$`, `$${eCat}\\text{ V}$`, `$-${eCell}\\text{ V}$`],
      ans: `$+${eCell}\\text{ V}$`,
      exp: `E^0_{cell} = E^0_{cathode} - E^0_{anode} = ${eCat} - (${eAn}) = +${eCell}\\text{ V}.`
    };
  },
  (id) => {
    const items = [
      { name: '$\\text{SF}_6$', hyb: '$sp^3d^2$', shape: 'Octahedral' },
      { name: '$\\text{PCl}_5$', hyb: '$sp^3d$', shape: 'Trigonal Bipyramidal' },
      { name: '$\\text{CH}_4$', hyb: '$sp^3$', shape: 'Tetrahedral' },
      { name: '$\\text{BF}_3$', hyb: '$sp^2$', shape: 'Trigonal Planar' }
    ];
    const it = items[id % items.length];
    return {
      topic: 'Chemical Bonding & Molecular Structure',
      body: `Under VSEPR theory, hybridization and geometry of ${it.name} are:`,
      opts: [`${it.hyb} and ${it.shape}`, `$sp^3$ and Pyramidal`, `$sp^2$ and Linear`, `$sp^3d^2$ and Square Planar`],
      ans: `${it.hyb} and ${it.shape}`,
      exp: `${it.name} steric number corresponds to ${it.hyb} (${it.shape}).`
    };
  },
  (id) => {
    const tHalf = (id * 7 + 10) % 40 + 10;
    const k = (0.693 / tHalf).toFixed(4);
    return {
      topic: 'Chemical Kinetics & Rate Laws',
      body: `The half-life $t_{1/2}$ of a first order reaction is $${tHalf}\\text{ min}$. Calculate rate constant $k$:`,
      opts: [`$${k}\\text{ min}^{-1}$`, `$${(tHalf * 0.693).toFixed(2)}\\text{ min}^{-1}$`, `$${tHalf}\\text{ min}^{-1}$`, `$${(k * 2).toFixed(4)}\\text{ min}^{-1}$`],
      ans: `$${k}\\text{ min}^{-1}$`,
      exp: `k = \\frac{0.693}{t_{1/2}} = \\frac{0.693}{${tHalf}} = ${k}\\text{ min}^{-1}.`
    };
  },
  (id) => {
    const pH = (id * 2 + 1) % 6 + 2;
    const pOH = 14 - pH;
    return {
      topic: 'Chemical & Ionic Equilibrium',
      body: `If an aqueous solution at $25^\\circ\\text{C}$ has $\\text{pH} = ${pH}$, its $\\text{pOH}$ is:`,
      opts: [`$${pOH}$`, `$${pH}$`, `$14$`, `$7$` ],
      ans: `$${pOH}$`,
      exp: `pH + pOH = 14 \\implies pOH = 14 - ${pH} = ${pOH}.`
    };
  },
  (id) => {
    const nMoles = (id * 3 + 1) % 5 + 1;
    const mass = nMoles * 40;
    return {
      topic: 'Mole Concept & Stoichiometry',
      body: `Calculate the mass of $${nMoles}\\text{ moles}$ of Sodium Hydroxide ($\\text{NaOH}$, Molar mass $= 40\\text{ g/mol}$):`,
      opts: [`$${mass}\\text{ g}$`, `$${nMoles * 20}\\text{ g}$`, `$40\\text{ g}$`, `$${mass + 10}\\text{ g}$`],
      ans: `$${mass}\\text{ g}$`,
      exp: `Mass = moles \\times Molar Mass = ${nMoles} \\times 40 = ${mass}\\text{ g}.`
    };
  }
];

// ==========================================
// 🧬 BIOLOGY GENERATORS
// ==========================================
const biologyArchitectures = [
  (id) => {
    const aCount = (id * 11 + 10) % 200 + 150;
    const cCount = 500 - aCount;
    return {
      topic: 'Genetics & Mendelian Inheritance',
      body: `In a 1000 base pair double-stranded DNA, if Adenine count is ${aCount}, determine Cytosine count via Chargaff's rule:`,
      opts: [`${cCount}`, `${aCount}`, `${cCount * 2}`, `${1000 - aCount}`],
      ans: `${cCount}`,
      exp: `A = T = ${aCount}. Remaining G + C = 1000 - 2(${aCount}). Cytosine C = 500 - ${aCount} = ${cCount}.`
    };
  },
  (id) => {
    const items = [
      { name: 'Mitochondria', fn: 'ATP generation via oxidative phosphorylation' },
      { name: 'Ribosome', fn: 'Protein synthesis' },
      { name: 'Lysosome', fn: 'Intracellular digestion via hydrolytic enzymes' },
      { name: 'Golgi Apparatus', fn: 'Packaging and secretion of proteins' }
    ];
    const it = items[id % items.length];
    return {
      topic: 'Cell Structure & Organelles',
      body: `Which cellular organelle is responsible for **${it.fn}**?`,
      opts: [`${it.name}`, `Endoplasmic Reticulum`, `Peroxisome`, `Centrosome`],
      ans: `${it.name}`,
      exp: `${it.name} is specialized for ${it.fn}.`
    };
  },
  (id) => {
    const ratios = [
      { type: 'Monohybrid Phenotypic Ratio', ratio: '3 : 1' },
      { type: 'Dihybrid Phenotypic Ratio', ratio: '9 : 3 : 3 : 1' },
      { type: 'Incomplete Dominance Ratio', ratio: '1 : 2 : 1' },
      { type: 'Test Cross Ratio', ratio: '1 : 1' }
    ];
    const it = ratios[id % ratios.length];
    return {
      topic: 'Genetics & Mendelian Inheritance',
      body: `What is the expected **${it.type}** in Mendelian inheritance?`,
      opts: [`${it.ratio}`, `9 : 7`, `15 : 1`, `9 : 3 : 4`],
      ans: `${it.ratio}`,
      exp: `Standard Mendelian cross yields ${it.type} of ${it.ratio}.`
    };
  },
  (id) => {
    const plants = [
      { name: 'Maize & Sugarcane', path: 'C4 Pathway (Hatch-Slack)' },
      { name: 'Rice & Wheat', path: 'C3 Pathway (Calvin Cycle)' },
      { name: 'Pineapple & Opuntia', path: 'CAM Pathway' }
    ];
    const it = plants[id % plants.length];
    return {
      topic: 'Photosynthesis & Light Reactions',
      body: `Which photosynthetic pathway is predominantly utilized by **${it.name}**?`,
      opts: [`${it.path}`, `Glycolysis`, `TCA Cycle`, `Oxidative Phosphorylation`],
      ans: `${it.path}`,
      exp: `${it.name} utilize ${it.path} to maximize carbon fixation.`
    };
  }
];

function buildQuestion(index) {
  const modSubject = index % 4;
  const isPyq = index % 3 !== 0;
  const yr = pyqYearsList[index % pyqYearsList.length];

  let item;
  let subj;
  let exam;

  if (modSubject === 0) {
    subj = 'Physics';
    exam = 'BOTH';
    item = physicsArchitectures[index % physicsArchitectures.length](index);
  } else if (modSubject === 1) {
    subj = 'Chemistry';
    exam = 'BOTH';
    item = chemistryArchitectures[index % chemistryArchitectures.length](index);
  } else if (modSubject === 2) {
    subj = 'Mathematics';
    exam = 'JEE-Mains';
    item = mathGenerators[index % mathGenerators.length](index);
  } else {
    subj = 'Biology';
    exam = 'NEET';
    item = biologyArchitectures[index % biologyArchitectures.length](index);
  }

  const examTag = subj === 'Biology' ? 'NEET' : (subj === 'Mathematics' ? 'JEE Main' : (index % 2 === 0 ? 'JEE Main' : 'NEET'));

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

async function startSeeding() {
  try {
    console.log('Clearing questionbank collection...');
    await questionBankModel.deleteMany({});

    const totalTarget = 60000;
    const chunkSize = 2500;
    const totalChunks = totalTarget / chunkSize;

    console.log(`Starting memory-optimized insertion of ${totalTarget} questions in ${totalChunks} chunks of ${chunkSize}...`);

    for (let c = 0; c < totalChunks; c++) {
      const chunkDocs = [];
      const offset = c * chunkSize;
      for (let i = 0; i < chunkSize; i++) {
        chunkDocs.push(buildQuestion(offset + i));
      }

      await questionBankModel.insertMany(chunkDocs, { ordered: false });
      console.log(`Chunk ${c + 1}/${totalChunks} inserted! (${(c + 1) * chunkSize} / ${totalTarget} questions complete)`);
    }

    const totalInDb = await questionBankModel.countDocuments({});
    console.log('====================================================');
    console.log('✅ HIGH DIVERSITY SEEDING SUCCESSFUL!');
    console.log(`TOTAL QUESTIONS IN MONGO DATABASE: ${totalInDb}`);
    console.log('====================================================');

    process.exit(0);
  } catch (err) {
    console.error('Error during seeding:', err);
    process.exit(1);
  }
}

startSeeding();
