const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/online-exam-portal';

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB Atlas for 62-CHAPTER EXHAUSTIVE SEEDING...'))
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

function getRandomChoiceSubset(arr, n) {
  return shuffleArray(arr).slice(0, n);
}

// Logic Gate SVG generator
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
// ⚛️ ALL 20 PHYSICS TOPICS
// ==========================================
const physicsChapters = {
  'Physics and Measurement': [
    () => ({
      body: `What is the dimensional formula of the Universal Gravitational Constant $G$?`,
      correct: `$[M^{-1} L^3 T^{-2}]$`,
      wrong: [`$[M L^2 T^{-2}]$`, `$[M^{-1} L^2 T^{-1}]$`, `$[M^0 L^3 T^{-2}]$`],
      exp: `From $F = \\frac{G m_1 m_2}{r^2} \\implies [G] = \\frac{[F][r^2]}{[m^2]} = \\frac{MLT^{-2} \\cdot L^2}{M^2} = [M^{-1} L^3 T^{-2}]$.`
    }),
    () => {
      const dm = 2, dv = 3;
      const dK = dm + 2 * dv;
      return {
        body: `If the error in measuring mass is $${dm}\\%$ and velocity is $${dv}\\%$, find the percentage error in calculated kinetic energy $K = \\frac{1}{2}mv^2$:`,
        correct: `$${dK}\\%$`,
        wrong: [`$${dm + dv}\\%$`, `$${dm * dv}\\%$`, `$${dK + 2}\\%$`],
        exp: `$\\frac{\\Delta K}{K} = \\frac{\\Delta m}{m} + 2\\frac{\\Delta v}{v} = ${dm}\\% + 2(${dv}\\%) = ${dK}\\%$.`
      };
    }
  ],
  'Kinematics': [
    () => {
      const u = getRandomChoice([20, 30, 40]);
      const g = 10;
      const hMax = ((u * u) / (2 * g)).toFixed(1);
      return {
        body: `A particle is projected vertically upwards with speed $u = ${u}\\text{ m/s}$ ($g = 10\\text{ m/s}^2$). Find its maximum height $H_{\\text{max}}$:`,
        correct: `$${hMax}\\text{ m}$`,
        wrong: [`$${(hMax * 2).toFixed(1)}\\text{ m}$`, `$${(hMax / 2).toFixed(1)}\\text{ m}$`, `$${u}\\text{ m}$`],
        exp: `$H_{\\text{max}} = \\frac{u^2}{2g} = \\frac{${u}^2}{20} = ${hMax}\\text{ m}$.`
      };
    },
    () => ({
      body: `A body covers the first half of a total distance with speed $v_1 = 40\\text{ km/h}$ and the second half with $v_2 = 60\\text{ km/h}$. Find its average speed:`,
      correct: `$48\\text{ km/h}$`,
      wrong: [`$50\\text{ km/h}$`, `$45\\text{ km/h}$`, `$52\\text{ km/h}$`],
      exp: `$v_{\\text{avg}} = \\frac{2 v_1 v_2}{v_1 + v_2} = \\frac{2 \\times 40 \\times 60}{100} = 48\\text{ km/h}$.`
    })
  ],
  'Laws of Motion': [
    () => {
      const m = getRandomChoice([2, 4, 5]);
      const a = getRandomChoice([3, 4, 6]);
      return {
        body: `A constant horizontal force accelerates a mass $m = ${m}\\text{ kg}$ at $a = ${a}\\text{ m/s}^2$ on a frictionless surface. Calculate the net force $F$:`,
        correct: `$${m * a}\\text{ N}$`,
        wrong: [`$${m + a}\\text{ N}$`, `$${m * a * 2}\\text{ N}$`, `$${(m * a) / 2}\\text{ N}$`],
        exp: `$F = m a = ${m} \\times ${a} = ${m * a}\\text{ N}$.`
      };
    },
    () => ({
      body: `A vehicle of mass $m$ rounds an unbanked circular road of radius $R$ with coefficient of static friction $\\mu_s$. The maximum safe speed without skidding is:`,
      correct: `$\\sqrt{\\mu_s R g}$`,
      wrong: [`$\\mu_s R g$`, `$\\sqrt{\\frac{R g}{\\mu_s}}$`, `$\\frac{\\mu_s g}{R}$`],
      exp: `Centripetal force is provided by static friction: $\\frac{m v^2}{R} \\le \\mu_s m g \\implies v_{\\text{max}} = \\sqrt{\\mu_s R g}$.`
    })
  ],
  'Work, Energy and Power': [
    () => {
      const k = 200; // N/m
      const x = 0.1; // m
      const u = (0.5 * k * x * x).toFixed(2);
      return {
        body: `Calculate the potential energy stored in an elastic spring of force constant $k = 200\\text{ N/m}$ when compressed by $x = 10\\text{ cm}$:`,
        correct: `$${u}\\text{ J}$`,
        wrong: [`$2.00\\text{ J}$`, `$0.50\\text{ J}$`, `$10.00\\text{ J}$`],
        exp: `$U = \\frac{1}{2} k x^2 = \\frac{1}{2}(200)(0.1)^2 = 1.00\\text{ J}$.`
      };
    },
    () => ({
      body: `What is the minimum speed required at the lowest point of a vertical circle of radius $R$ so that a mass completes the vertical loop?`,
      correct: `$\\sqrt{5gR}$`,
      wrong: [`$\\sqrt{gR}$`, `$\\sqrt{3gR}$`, `$\\sqrt{2gR}$`],
      exp: `At the top, $v_{\\text{top}} = \\sqrt{gR}$. By energy conservation, $v_{\\text{bottom}} = \\sqrt{v_{\\text{top}}^2 + 4gR} = \\sqrt{5gR}$.`
    })
  ],
  'Rotational Motion': [
    () => {
      const m = getRandomChoice([2, 4, 6]);
      const r = 1;
      const iCm = (0.5 * m * r * r).toFixed(1);
      const iTang = (1.5 * m * r * r).toFixed(1);
      return {
        body: `A uniform circular disk has mass $M = ${m}\\text{ kg}$ and radius $R = 1\\text{ m}$. Calculate its moment of inertia about an axis perpendicular to its plane and passing through its rim (tangential):`,
        correct: `$${iTang}\\text{ kg} \\cdot \\text{m}^2$`,
        wrong: [`$${iCm}\\text{ kg} \\cdot \\text{m}^2$`, `$${(m * 2).toFixed(1)}\\text{ kg} \\cdot \\text{m}^2$`, `$${(m * 3).toFixed(1)}\\text{ kg} \\cdot \\text{m}^2$`],
        exp: `By parallel axis theorem, $I = I_{cm} + MR^2 = \\frac{1}{2}MR^2 + MR^2 = \\frac{3}{2}MR^2 = ${iTang}\\text{ kg} \\cdot \\text{m}^2$.`
      };
    }
  ],
  'Gravitation': [
    () => {
      const rE = 6400; // km
      const h = 3200; // km
      return {
        body: `At what height $h$ above the Earth's surface does the acceleration due to gravity become $\\frac{g}{4}$ (where $R = 6400\\text{ km}$ is Earth's radius)?`,
        correct: `$${rE}\\text{ km}$ ($h = R$)`,
        wrong: [`$3200\\text{ km}$ ($h = R/2$)`, `$12800\\text{ km}$ ($h = 2R$)`, `$1600\\text{ km}$ ($h = R/4$)`],
        exp: `$g' = g\\left(\\frac{R}{R+h}\\right)^2 = \\frac{g}{4} \\implies \\frac{R}{R+h} = \\frac{1}{2} \\implies h = R = 6400\\text{ km}$.`
      };
    },
    () => ({
      body: `What is the escape velocity of a body from the surface of Earth ($R = 6400\\text{ km}, g = 9.8\\text{ m/s}^2$)?`,
      correct: `$11.2\\text{ km/s}$`,
      wrong: [`$7.9\\text{ km/s}$`, `$22.4\\text{ km/s}$`, `$9.8\\text{ km/s}$`],
      exp: `$v_e = \\sqrt{2gR} = \\sqrt{2 \\times 9.8 \\times 6.4\\times 10^6} \\approx 11.2\\text{ km/s}$.`
    })
  ],
  'Properties of Solids and Liquids': [
    () => ({
      body: `What is the excess pressure inside a spherical soap bubble of surface tension $T$ and radius $R$ in air?`,
      correct: `$\\frac{4T}{R}$`,
      wrong: [`$\\frac{2T}{R}$`, `$\\frac{T}{R}$`, `$\\frac{8T}{R}$`],
      exp: `A soap bubble has two free liquid-air interfaces, hence $\\Delta P = \\frac{2T}{R} + \\frac{2T}{R} = \\frac{4T}{R}$.`
    }),
    () => {
      const h = 5; // m
      const g = 10;
      const v = Math.sqrt(2 * g * h).toFixed(1);
      return {
        body: `A tank of depth $H$ has a small orifice at depth $h = ${h}\\text{ m}$ below the water surface. Find the Torricelli speed of efflux ($g = 10\\text{ m/s}^2$):`,
        correct: `$${v}\\text{ m/s}$`,
        wrong: [`$${(v * 2).toFixed(1)}\\text{ m/s}$`, `$5.0\\text{ m/s}$`, `$25.0\\text{ m/s}$`],
        exp: `By Torricelli's Law: $v = \\sqrt{2gh} = \\sqrt{2 \\times 10 \\times ${h}} = ${v}\\text{ m/s}$.`
      };
    }
  ],
  'Thermodynamics': [
    () => {
      const t1 = 600, t2 = 300;
      const eta = Math.round((1 - t2 / t1) * 100);
      return {
        body: `Calculate the efficiency $\\eta$ of an ideal Carnot engine operating between temperatures $T_1 = ${t1}\\text{ K}$ (source) and $T_2 = ${t2}\\text{ K}$ (sink):`,
        correct: `$${eta}\\%$`,
        wrong: [`$${eta - 15}\\%$`, `$${eta + 20}\\%$`, `$75\\%$`],
        exp: `$\\eta = 1 - \\frac{T_2}{T_1} = 1 - \\frac{${t2}}{${t1}} = 0.50 = ${eta}\\%$.`
      };
    }
  ],
  'Kinetic Theory of Gases': [
    () => ({
      body: `What is the ratio of molar heat capacities $\\gamma = \\frac{C_p}{C_v}$ for an ideal rigid diatomic gas ($f = 5$)?`,
      correct: `$\\frac{7}{5} = 1.40$`,
      wrong: [`$\\frac{5}{3} \\approx 1.67$`, `$\\frac{4}{3} \\approx 1.33$`, `$\\frac{9}{7} \\approx 1.28$`],
      exp: `$\\gamma = 1 + \\frac{2}{f} = 1 + \\frac{2}{5} = \\frac{7}{5} = 1.40$.`
    })
  ],
  'Oscillations and Waves': [
    () => {
      const f1 = 256, f2 = 260;
      return {
        body: `Two tuning forks of frequencies $f_1 = ${f1}\\text{ Hz}$ and $f_2 = ${f2}\\text{ Hz}$ are sounded together. How many beats are heard per second?`,
        correct: `$${Math.abs(f2 - f1)}$ beats/s`,
        wrong: [`$${Math.abs(f2 - f1) * 2}$ beats/s`, `$2$ beats/s`, `$8$ beats/s`],
        exp: `Beat frequency $f_b = |f_2 - f_1| = ${f2} - ${f1} = ${Math.abs(f2 - f1)}\\text{ beats/s}$.`
      };
    }
  ],
  'Electrostatics': [
    () => {
      const q = getRandomChoice([2, 4, 6]);
      return {
        body: `A point charge $q = +${q}\\,\\mu\\text{C}$ is placed at the center of a closed cube. Find the electric flux $\\Phi$ passing through **one face** of the cube:`,
        correct: `$\\frac{${q}\\,\\mu\\text{C}}{6\\varepsilon_0}$`,
        wrong: [`$\\frac{${q}\\,\\mu\\text{C}}{\\varepsilon_0}$`, `$\\frac{${q}\\,\\mu\\text{C}}{8\\varepsilon_0}$`, `$0$`],
        exp: `Total flux through all 6 symmetric faces is $q/\\varepsilon_0$. Flux through one face is $q/(6\\varepsilon_0)$.`
      };
    }
  ],
  'Current Electricity': [
    () => {
      const p = 4, q = 6, r = 8;
      const s = (q * r) / p;
      return {
        body: `In a balanced Wheatstone bridge, $P = ${p}\\,\\Omega, Q = ${q}\\,\\Omega$, and $R = ${r}\\,\\Omega$. Calculate unknown resistance $S$:`,
        correct: `$${s}\\,\\Omega$`,
        wrong: [`$10\\,\\Omega$`, `$16\\,\\Omega$`, `$6\\,\\Omega$`],
        exp: `$\\frac{P}{Q} = \\frac{R}{S} \\implies S = \\frac{${q} \\times ${r}}{${p}} = ${s}\\,\\Omega$.`
      };
    }
  ],
  'Magnetic Effects of Current and Magnetism': [
    () => ({
      body: `A charged particle of charge $q$ and mass $m$ moves with velocity $v$ perpendicular to a uniform magnetic field $B$. What is the radius $r$ of its circular path?`,
      correct: `$r = \\frac{m v}{q B}$`,
      wrong: [`$r = \\frac{q B}{m v}$`, `$r = \\frac{q v}{m B}$`, `$r = \\frac{m B}{q v}$`],
      exp: `Centripetal force equals magnetic Lorentz force: $\\frac{m v^2}{r} = q v B \\implies r = \\frac{m v}{q B}$.`
    })
  ],
  'Electromagnetic Induction and Alternating Currents': [
    () => {
      const l = 10, c = 10;
      return {
        body: `Calculate the resonant frequency $\\omega_0$ in an AC series LCR circuit with $L = 10\\text{ mH}$ and $C = 10\\,\\mu\\text{F}$:`,
        correct: `$3162\\text{ rad/s}$`,
        wrong: [`$1000\\text{ rad/s}$`, `$5000\\text{ rad/s}$`, `$628\\text{ rad/s}$`],
        exp: `$\\omega_0 = \\frac{1}{\\sqrt{LC}} = \\frac{1}{\\sqrt{10\\times 10^{-3} \\times 10\\times 10^{-6}}} = \\frac{1}{10^{-4}} = 10^4 / \\sqrt{10} \\approx 3162\\text{ rad/s}$.`
      };
    }
  ],
  'Electromagnetic Waves': [
    () => ({
      body: `Which of the following represents the correct ascending order of frequencies across the electromagnetic spectrum?`,
      correct: `Radio waves < Microwaves < Infrared < Visible < Ultraviolet < X-rays < $\\gamma$-rays`,
      wrong: [
        `$\\gamma$-rays < X-rays < Ultraviolet < Visible < Infrared < Microwaves < Radio waves`,
        `Microwaves < Radio waves < Infrared < Visible < X-rays`,
        `Visible < Infrared < Ultraviolet < X-rays < Radio waves`
      ],
      exp: `Frequency increases as wavelength decreases: Radio $\\to$ Micro $\\to$ IR $\\to$ Visible $\\to$ UV $\\to$ X-ray $\\to$ Gamma.`
    })
  ],
  'Optics': [
    () => {
      const mu = getRandomChoice([1.5, 1.732, 1.33, 1.414]);
      const deg = Math.round((Math.atan(mu) * 180) / Math.PI);
      return {
        body: `Unpolarized light is incident from air onto a glass surface with refractive index $\\mu = ${mu}$. Find Brewster's angle $\\theta_p$:`,
        correct: `$${deg}^\\circ$`,
        wrong: [`$${deg + 15}^\\circ$`, `$${deg - 10}^\\circ$`, `$45^\\circ$`],
        exp: `By Brewster's Law: $\\tan\\theta_p = \\mu = ${mu} \\implies \\theta_p \\approx ${deg}^\\circ$.`
      };
    }
  ],
  'Dual Nature of Matter and Radiation': [
    () => {
      const v = 100; // V
      const lam = (1.227 / Math.sqrt(v)).toFixed(3);
      return {
        body: `Calculate the de Broglie wavelength $\\lambda$ associated with an electron accelerated through a potential difference of $V = 100\\text{ V}$:`,
        correct: `$${lam}\\text{ nm}$ ($1.227\\text{ \AA}$)`,
        wrong: [`$0.123\\text{ nm}$`, `$12.27\\text{ nm}$`, `$0.054\\text{ nm}$`],
        exp: `$\\lambda = \\frac{1.227}{\\sqrt{V}}\\text{ nm} = \\frac{1.227}{10} = ${lam}\\text{ nm}$.`
      };
    }
  ],
  'Atoms and Nuclei': [
    () => ({
      body: `According to Bohr's model of hydrogen atom, what is the energy of an electron in the ground state ($n = 1$)?`,
      correct: `$-13.6\\text{ eV}$`,
      wrong: [`$-3.4\\text{ eV}$`, `$-1.51\\text{ eV}$`, `$+13.6\\text{ eV}$`],
      exp: `$E_n = -\\frac{13.6}{n^2}\\text{ eV} \\implies E_1 = -13.6\\text{ eV}$.`
    })
  ],
  'Electronic Devices': [
    () => {
      const gates = [
        { type: 'AND', expr: 'Y = A · B', exp: 'AND gate yields 1 only when both inputs are 1.' },
        { type: 'OR', expr: 'Y = A + B', exp: 'OR gate yields 1 if at least one input is 1.' },
        { type: 'NAND', expr: 'Y = \\overline{A · B}', exp: 'NAND is inverted AND.' },
        { type: 'NOR', expr: 'Y = \\overline{A + B}', exp: 'NOR is inverted OR.' },
        { type: 'XOR', expr: 'Y = A \\oplus B', exp: 'XOR outputs 1 for unequal inputs.' },
        { type: 'XNOR', expr: 'Y = \\overline{A \\oplus B}', exp: 'XNOR outputs 1 for equal inputs.' }
      ];
      const g = getRandomChoice(gates);
      return {
        body: `Identify the Boolean output expression $Y$ for the exact logic gate schematic shown below:\n${getLogicGateSvg(g.type)}`,
        correct: `$${g.expr}$`,
        wrong: ['$Y = A \\oplus B$', '$Y = A + B$', '$Y = \\overline{A}$', '$Y = A · B$', '$Y = 0$'].filter(w => w !== `$${g.expr}$`),
        exp: g.exp
      };
    }
  ],
  'Experimental Skills': [
    () => ({
      body: `A screw gauge has a pitch of $0.5\\text{ mm}$ and $50$ divisions on its circular scale. What is its least count?`,
      correct: `$0.01\\text{ mm}$`,
      wrong: [`$0.1\\text{ mm}$`, `$0.001\\text{ mm}$`, `$0.05\\text{ mm}$`],
      exp: `$\\text{Least Count} = \\frac{\\text{Pitch}}{\\text{Number of circular divisions}} = \\frac{0.5\\text{ mm}}{50} = 0.01\\text{ mm}$.`
    })
  ]
};

// ==========================================
// 🧪 ALL 19 CHEMISTRY TOPICS
// ==========================================
const chemistryChapters = {
  'Some Basic Concepts in Chemistry': [
    () => ({
      body: `Calculate the molarity of a solution prepared by dissolving $4.0\\text{ g}$ of $NaOH$ in enough water to form $250\\text{ mL}$ of solution:`,
      correct: `$0.40\\text{ M}$`,
      wrong: [`$0.10\\text{ M}$`, `$1.00\\text{ M}$`, `$0.25\\text{ M}$`],
      exp: `Moles of $NaOH = \\frac{4}{40} = 0.1\\text{ mol}$. Molarity $M = \\frac{0.1}{0.250\\text{ L}} = 0.40\\text{ M}$.`
    })
  ],
  'Atomic Structure': [
    () => ({
      body: `Which set of quantum numbers ($n, l, m_l, m_s$) is allowed for an electron in a $3d$ subshell?`,
      correct: `$n = 3, l = 2, m_l = -1, m_s = +\\frac{1}{2}$`,
      wrong: [
        `$n = 3, l = 3, m_l = 0, m_s = +\\frac{1}{2}$`,
        `$n = 3, l = 1, m_l = 2, m_s = -\\frac{1}{2}$`,
        `$n = 2, l = 2, m_l = 0, m_s = +\\frac{1}{2}$`
      ],
      exp: `For $3d$, principal quantum number $n = 3$ and azimuthal quantum number $l = 2$. $m_l$ can range from $-2$ to $+2$.`
    })
  ],
  'Chemical Bonding and Molecular Structure': [
    () => ({
      body: `According to VSEPR theory and hybridization, what is the geometry and hybridization of $SF_6$?`,
      correct: `Octahedral ($sp^3d^2$)`,
      wrong: [`Trigonal bipyramidal ($sp^3d$)`, `Tetrahedral ($sp^3$)`, `Square planar ($dsp^2$)`],
      exp: `$SF_6$ has 6 bond pairs and 0 lone pairs on sulfur, giving steric number 6, $sp^3d^2$ hybridization, and octahedral shape.`
    })
  ],
  'Chemical Thermodynamics': [
    () => ({
      body: `For a chemical process at constant temperature and pressure, what is the thermodynamic condition for spontaneous reaction?`,
      correct: `$\\Delta G < 0$ (Negative Gibbs free energy)`,
      wrong: [`$\\Delta G > 0$`, `$\\Delta H > 0$`, `$\\Delta S = 0$`],
      exp: `A process is spontaneous when Gibbs free energy change $\\Delta G = \\Delta H - T\\Delta S < 0$.`
    })
  ],
  'Solutions': [
    () => ({
      body: `What is the theoretical Van 't Hoff factor $i$ for complete dissociation of $BaCl_2$ in dilute aqueous solution?`,
      correct: `$i = 3$`,
      wrong: [`$i = 2$`, `$i = 1$`, `$i = 4$`],
      exp: `$BaCl_2 \\to Ba^{2+} + 2Cl^- \\implies n = 3$ ions. For complete dissociation $\\alpha = 1$, $i = 3$.`
    })
  ],
  'Equilibrium': [
    () => ({
      body: `What is the pH of a $10^{-3}\\text{ M } HCl$ aqueous solution at $25^\\circ\\text{C}$?`,
      correct: `$3.0$`,
      wrong: [`$11.0$`, `$7.0$`, `$1.0$`],
      exp: `$\\text{pH} = -\\log[H^+] = -\\log(10^{-3}) = 3.0$.`
    })
  ],
  'Redox Reactions and Electrochemistry': [
    () => ({
      body: `In a standard Daniell cell ($Zn | Zn^{2+} || Cu^{2+} | Cu$), given $E^\\circ(Zn^{2+}/Zn) = -0.76\\text{ V}$ and $E^\\circ(Cu^{2+}/Cu) = +0.34\\text{ V}$, calculate standard cell EMF $E^\\circ_{\\text{cell}}$:`,
      correct: `$1.10\\text{ V}$`,
      wrong: [`$0.42\\text{ V}$`, `$-1.10\\text{ V}$`, `$0.76\\text{ V}$`],
      exp: `$E^\\circ_{\\text{cell}} = E^\\circ_{\\text{cathode}} - E^\\circ_{\\text{anode}} = 0.34 - (-0.76) = 1.10\\text{ V}$.`
    })
  ],
  'Chemical Kinetics': [
    () => ({
      body: `For a first-order chemical reaction with rate constant $k = 0.0693\\text{ min}^{-1}$, what is the half-life period $t_{1/2}$?`,
      correct: `$10\\text{ minutes}$`,
      wrong: [`$5\\text{ minutes}$`, `$20\\text{ minutes}$`, `$100\\text{ minutes}$`],
      exp: `$t_{1/2} = \\frac{0.693}{k} = \\frac{0.693}{0.0693} = 10\\text{ minutes}$.`
    })
  ],
  'Classification of Elements and Periodicity': [
    () => ({
      body: `Which of the following elements exhibits the highest first ionization enthalpy?`,
      correct: `Nitrogen ($N$)`,
      wrong: [`Oxygen ($O$)`, `Carbon ($C$)`, `Boron ($B$)`],
      exp: `Nitrogen has a stable half-filled $2p^3$ configuration, giving it higher ionization enthalpy than oxygen ($2p^4$).`
    })
  ],
  'p-Block Elements': [
    () => ({
      body: `In diborane ($B_2H_6$), what type of bonds hold the two bridging hydrogen atoms with boron atoms?`,
      correct: `Three-centre two-electron ($3c-2e$) banana bonds`,
      wrong: [`Three-centre four-electron ($3c-4e$) bonds`, `Two-centre two-electron ($2c-2e$) bonds`, `Ionic bonds`],
      exp: `The two bridging B-H-B bonds in $B_2H_6$ are electron-deficient $3c-2e$ banana bonds.`
    })
  ],
  'd- and f-Block Elements': [
    () => {
      const n = getRandomChoice([1, 2, 3, 4, 5]);
      const mu = Math.sqrt(n * (n + 2)).toFixed(2);
      return {
        body: `Find the spin-only magnetic moment $\\mu_s$ for a transition metal ion with $n = ${n}$ unpaired electrons:`,
        correct: `$${mu}\\text{ BM}$`,
        wrong: [`$${(parseFloat(mu) + 1.0).toFixed(2)}\\text{ BM}$`, `$${(n * 1.5).toFixed(2)}\\text{ BM}$`, `$0.00\\text{ BM}$`],
        exp: `$\\mu_s = \\sqrt{n(n+2)} = \\sqrt{${n}(${n+2})} = ${mu}\\text{ BM}$.`
      };
    }
  ],
  'Coordination Compounds': [
    () => ({
      body: `What is the oxidation state and coordination number of Cobalt in the complex $[Co(NH_3)_6]Cl_3$?`,
      correct: `Oxidation state: $+3$, Coordination number: $6$`,
      wrong: [
        `Oxidation state: $+2$, Coordination number: $6$`,
        `Oxidation state: $+3$, Coordination number: $3$`,
        `Oxidation state: $0$, Coordination number: $6$`
      ],
      exp: `Cobalt bonds with 6 neutral $NH_3$ ligands (coord number 6), with charge balanced by $3 Cl^-$ (ox state $+3$).`
    })
  ],
  'Basic Principles and Techniques': [
    () => ({
      body: `Which carbocation is the most stable due to maximum hyperconjugation and $+I$ inductive effect?`,
      correct: `Tertiary butyl carbocation $(CH_3)_3C^+$`,
      wrong: [`Isopropyl carbocation $(CH_3)_2CH^+$`, `Ethyl carbocation $CH_3CH_2^+$`, `Methyl carbocation $CH_3^+$`],
      exp: `$(CH_3)_3C^+$ has 9 $\\alpha$-hydrogens offering maximum hyperconjugative stabilization.`
    })
  ],
  'Hydrocarbons': [
    () => ({
      body: `What is the major organic product when propene ($CH_3-CH=CH_2$) reacts with $HBr$ in the presence of benzoyl peroxide?`,
      correct: `1-Bromopropane (Anti-Markovnikov product)`,
      wrong: [`2-Bromopropane (Markovnikov product)`, `1,2-Dibromopropane`, `Propane`],
      exp: `In the presence of peroxide, $HBr$ adds via a free radical mechanism following Anti-Markovnikov's rule (Kharasch effect).`
    })
  ],
  'Organic Compounds Containing Halogens': [
    () => ({
      body: `Which haloalkane undergoes nucleophilic substitution via $S_N1$ mechanism fastest due to carbocation stability?`,
      correct: `Tert-butyl chloride $(CH_3)_3C-Cl$`,
      wrong: [`Isopropyl chloride $(CH_3)_2CH-Cl$`, `Ethyl chloride $CH_3CH_2-Cl$`, `Methyl chloride $CH_3-Cl$`],
      exp: `$S_N1$ reactivity follows carbocation stability order: $3^\\circ > 2^\\circ > 1^\\circ > \\text{methyl}$.`
    })
  ],
  'Organic Compounds Containing Oxygen': [
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
        body: `Examine the substituted aromatic ring shown below:\n${getBenzeneSvg(s.group)}\nIdentify the directive influence and nature of group **${s.group}**:`,
        correct: `${s.direct} & ${s.type}`,
        wrong: [`${s.direct === 'Meta-directing' ? 'Ortho/Para-directing' : 'Meta-directing'} & neutral`, 'Non-directing substituent', 'Ring decomposition'],
        exp: `Group **${s.group}** directs incoming electrophiles to ${s.direct} due to ${s.type}.`
      };
    }
  ],
  'Organic Compounds Containing Nitrogen': [
    () => ({
      body: `Which reaction converts a primary acid amide into a primary amine containing one carbon atom less?`,
      correct: `Hoffmann Bromamide Degradation`,
      wrong: [`Gabriel Phthalimide Synthesis`, `Carbylamine Reaction`, `Cannizzaro Reaction`],
      exp: `$R-CONH_2 + Br_2 + 4KOH \\to R-NH_2 + K_2CO_3 + 2KBr + 2H_2O$.`
    })
  ],
  'Biomolecules': [
    () => ({
      body: `Which of the following is a non-reducing disaccharide sugar?`,
      correct: `Sucrose`,
      wrong: [`Maltose`, `Lactose`, `Glucose`],
      exp: `Sucrose is non-reducing because both anomeric carbons of glucose and fructose are involved in the glycosidic linkage.`
    })
  ],
  'Practical Chemistry': [
    () => ({
      body: `During qualitative inorganic flame testing, which metal salt imparts a characteristic apple-green flame?`,
      correct: `Barium ($Ba^{2+}$)`,
      wrong: [`Calcium ($Ca^{2+}$)`, `Sodium ($Na^+$)`, `Potassium ($K^+$)`],
      exp: `$Ba^{2+}$ produces an apple-green flame, $Ca^{2+}$ produces brick-red, and $Na^+$ produces golden yellow.`
    })
  ]
};

// ==========================================
// 📐 ALL 13 MATHEMATICS TOPICS
// ==========================================
const mathChapters = {
  'Sets, Relations and Functions': [
    () => ({
      body: `Find the domain of the real-valued function $f(x) = \\sqrt{16 - x^2}$:`,
      correct: `$[-4, 4]$`,
      wrong: [`$(-\\infty, -4] \\cup [4, \\infty)$`, `$[0, 4]$`, `$(-4, 4)$`],
      exp: `For real values, $16 - x^2 \\ge 0 \\implies x^2 \\le 16 \\implies -4 \\le x \\le 4$.`
    })
  ],
  'Complex Numbers and Quadratic Equations': [
    () => ({
      body: `If $\\omega$ is a non-real complex cube root of unity, what is the value of $(1 + \\omega - \\omega^2)^2$?`,
      correct: `$4\\omega$`,
      wrong: [`$4$`, `$-4\\omega$`, `$1$`],
      exp: `$1 + \\omega = -\\omega^2 \\implies (-\\omega^2 - \\omega^2)^2 = (-2\\omega^2)^2 = 4\\omega^4 = 4\\omega$.`
    })
  ],
  'Matrices and Determinants': [
    () => {
      const detA = getRandomInt(2, 5);
      return {
        body: `For a $3 \\times 3$ matrix $A$ with $|A| = ${detA}$, calculate $|\\text{adj}(A)|$:`,
        correct: `$${detA * detA}$`,
        wrong: [`$${detA}$`, `$${Math.pow(detA, 3)}$`, `$${detA * 2}$`],
        exp: `$|\\text{adj}(A)| = |A|^{n-1} = ${detA}^{3-1} = ${detA}^2 = ${detA * detA}$.`
      };
    }
  ],
  'Permutations and Combinations': [
    () => ({
      body: `How many diagonals does a regular convex polygon with $n = 8$ sides (octagon) possess?`,
      correct: `$20$ diagonals`,
      wrong: [`$28$ diagonals`, `$24$ diagonals`, `$16$ diagonals`],
      exp: `Number of diagonals is $^nC_2 - n = \\frac{8 \\times 7}{2} - 8 = 28 - 8 = 20$.`
    })
  ],
  'Binomial Theorem and Mathematical Induction': [
    () => ({
      body: `Find the term independent of $x$ in the binomial expansion of $\\left(x + \\frac{1}{x}\\right)^{10}$:`,
      correct: `$^{10}C_5 = 252$`,
      wrong: [`$^{10}C_4 = 210$`, `$^{10}C_6 = 210$`, `$120$`],
      exp: `General term $T_{r+1} = ^{10}C_r x^{10-r}(1/x)^r = ^{10}C_r x^{10-2r}$. For independent term, $10 - 2r = 0 \\implies r = 5$.`
    })
  ],
  'Sequence and Series': [
    () => ({
      body: `Find the sum of the infinite geometric series $S = 6 + 2 + \\frac{2}{3} + \\frac{2}{9} + \\dots$:`,
      correct: `$9$`,
      wrong: [`$8$`, `$12$`, `$\\frac{27}{2}$`],
      exp: `$a = 6, r = \\frac{1}{3}$. $S_\\infty = \\frac{a}{1 - r} = \\frac{6}{1 - 1/3} = \\frac{6}{2/3} = 9$.`
    })
  ],
  'Limit, Continuity and Differentiability': [
    () => ({
      body: `Evaluate the limit $L = \\lim_{x\\to 0} \\frac{e^{2x} - 1}{\\sin x}$:`,
      correct: `$2$`,
      wrong: [`$1$`, `$0$`, `$e$`],
      exp: `Using L'Hopital's rule: $\\lim_{x\\to 0} \\frac{2e^{2x}}{\\cos x} = \\frac{2(1)}{1} = 2$.`
    })
  ],
  'Integral Calculus': [
    () => ({
      body: `Evaluate the definite integral $I = \\int_{-\\pi/2}^{\\pi/2} x^3 \\cos x \\, dx$:`,
      correct: `$0$`,
      wrong: [`$\\pi$`, `$2$`, `$\\frac{\\pi}{2}$`],
      exp: `Integrand $f(x) = x^3 \\cos x$ is odd, hence its symmetric integral is $0$.`
    })
  ],
  'Differential Equations': [
    () => ({
      body: `What is the integrating factor (IF) for the linear differential equation $\\frac{dy}{dx} + \\frac{2}{x}y = x^3$?`,
      correct: `$x^2$`,
      wrong: [`$2x$`, `$\\ln x$`, `$e^{2x}$`],
      exp: `$IF = e^{\\int P dx} = e^{\\int (2/x) dx} = e^{2\\ln x} = e^{\\ln(x^2)} = x^2$.`
    })
  ],
  'Coordinate Geometry': [
    () => {
      const a = getRandomInt(2, 6);
      return {
        body: `Find the length of the latus rectum for the parabola $y^2 = ${4 * a}x$:`,
        correct: `$${4 * a}$`,
        wrong: [`$${2 * a}$`, `$${a}$`, `$${8 * a}$`],
        exp: `For $y^2 = 4ax$, the latus rectum length is $4a = ${4 * a}$.`
      };
    }
  ],
  'Three Dimensional Geometry (3D) and Vectors': [
    () => ({
      body: `Find the scalar projection of vector $\\vec{a} = 2\\hat{i} + 3\\hat{j} + 6\\hat{k}$ along $\\vec{b} = \\hat{i} + 2\\hat{j} + 2\\hat{k}$:`,
      correct: `$${(20 / 3).toFixed(2)}$ ($20/3$)`,
      wrong: [`$14$`, `$5.00$`, `$20$`],
      exp: `Projection $= \\frac{\\vec{a} \\cdot \\vec{b}}{|\\vec{b}|} = \\frac{2(1) + 3(2) + 6(2)}{\\sqrt{1+4+4}} = \\frac{20}{3}$.`
    })
  ],
  'Statistics and Probability': [
    () => {
      const pB1 = getRandomChoice([0.5, 0.6, 0.7]);
      const pB2 = (1 - pB1).toFixed(1);
      const d1 = 0.02;
      const d2 = 0.05;
      const totD = (pB1 * d1 + pB2 * d2).toFixed(4);
      const ans = ((pB2 * d2) / totD).toFixed(3);
      return {
        body: `Machine A produces $${Math.round(pB1 * 100)}\\%$ of items with $2\\%$ defect rate, while Machine B produces $${Math.round(pB2 * 100)}\\%$ with $5\\%$ defect rate. If a randomly picked item is defective, find the probability it came from Machine B:`,
        correct: `$${ans}$`,
        wrong: [`$0.500$`, `$0.250$`, `$0.400$`, `$0.650$`],
        exp: `By Bayes' Theorem: $P(B|D) = \\frac{P(B)P(D|B)}{P(A)P(D|A) + P(B)P(D|B)} = ${ans}$.`
      };
    },
    () => {
      const n = getRandomChoice([5, 7, 9, 11]);
      const variance = ((n * n - 1) / 12).toFixed(2);
      return {
        body: `Find the variance $\\sigma^2$ of the first $n = ${n}$ natural numbers:`,
        correct: `$${variance}$`,
        wrong: [`$${(variance * 1.5).toFixed(2)}$`, `$${n}.00$`, `$${((n * n) / 12).toFixed(2)}$`],
        exp: `$\\sigma^2 = \\frac{n^2 - 1}{12} = \\frac{${n}^2 - 1}{12} = ${variance}$.`
      };
    }
  ],
  'Trigonometry': [
    () => ({
      body: `What is the maximum and minimum value of the expression $f(x) = 3\\sin x + 4\\cos x$?`,
      correct: `Max $= +5$, Min $= -5$`,
      wrong: [`Max $= +7$, Min $= -7$`, `Max $= +1$, Min $= -1$`, `Max $= +12$, Min $= -12$`],
      exp: `The range of $a\\sin x + b\\cos x$ is $[-\\sqrt{a^2+b^2}, +\\sqrt{a^2+b^2}] = [-\\sqrt{9+16}, +\\sqrt{9+16}] = [-5, +5]$.`
    })
  ]
};

// ==========================================
// 🧬 ALL 10 BIOLOGY TOPICS
// ==========================================
const bioChapters = {
  'Diversity in the Living World': [
    () => ({
      body: `Who proposed the classical Five Kingdom Classification (Monera, Protista, Fungi, Plantae, Animalia)?`,
      correct: `R. H. Whittaker (1969)`,
      wrong: [`Carolus Linnaeus`, `Aristotle`, `Carl Woese`],
      exp: `R. H. Whittaker classified living organisms into 5 kingdoms based on cell structure, body organization, and mode of nutrition.`
    })
  ],
  'Structural Organisation in Animals and Plants': [
    () => ({
      body: `Which plant vascular tissue element consists of dead cells with lignified cell walls at maturity?`,
      correct: `Xylem vessels and tracheids`,
      wrong: [`Phloem companion cells`, `Sieve tube elements`, `Parenchyma cells`],
      exp: `Xylem vessels and tracheids lose their protoplasm at maturity and form hollow, lignified conducting tubes.`
    })
  ],
  'Cell Structure and Function': [
    () => ({
      body: `During which specific stage of Meiosis I does crossing over (genetic recombination) occur between homologous chromosomes?`,
      correct: `Pachytene of Prophase I`,
      wrong: [`Leptotene`, `Zygotene`, `Diplotene`],
      exp: `Crossing over occurs during the Pachytene stage of Prophase I, catalyzed by the enzyme recombinase.`
    })
  ],
  'Plant Physiology': [
    () => ({
      body: `In $C_4$ plants (e.g. maize, sugarcane), what is the primary $CO_2$ acceptor in mesophyll cells?`,
      correct: `Phosphoenolpyruvate (PEP)`,
      wrong: [`Ribulose-1,5-bisphosphate (RuBP)`, `Oxaloacetic acid (OAA)`, `Phosphoglyceric acid (PGA)`],
      exp: `In $C_4$ plants, PEP carboxylase fixes $CO_2$ onto Phosphoenolpyruvate (PEP) to form 4-carbon Oxaloacetic acid.`
    })
  ],
  'Human Physiology': [
    () => {
      const hr = getRandomChoice([60, 72, 80]);
      const co = ((hr * 70) / 1000).toFixed(2);
      return {
        body: `Calculate Cardiac Output ($\\text{CO}$) with resting heart rate $\\text{HR} = ${hr}\\text{ bpm}$ and stroke volume $\\text{SV} = 70\\text{ mL}$:`,
        correct: `$${co}\\text{ L/min}$`,
        wrong: [`$7.00\\text{ L/min}$`, `$${(co * 1.5).toFixed(2)}\\text{ L/min}$`, `$3.50\\text{ L/min}$`],
        exp: `$\\text{CO} = \\text{HR} \\times \\text{SV} = ${hr} \\times 70\\text{ mL} = ${co}\\text{ L/min}$.`
      };
    }
  ],
  'Reproduction': [
    () => ({
      body: `In angiosperms, double fertilization produces a diploid zygote and a triploid ($3n$):`,
      correct: `Primary Endosperm Nucleus (PEN)`,
      wrong: [`Embryo`, `Synergid`, `Antipodal cell`],
      exp: `Double fertilization comprises syngamy ($2n$ zygote) and triple fusion ($3n$ primary endosperm nucleus).`
    })
  ],
  'Genetics and Evolution': [
    () => ({
      body: `What is the expected phenotypic ratio in the $F_2$ generation of a Mendelian dihybrid cross?`,
      correct: `$9 : 3 : 3 : 1$`,
      wrong: [`$1 : 2 : 1$`, `$9 : 7$`, `$1 : 1 : 1 : 1$`],
      exp: `Law of independent assortment yields the classical $9:3:3:1$ dihybrid phenotypic ratio.`
    })
  ],
  'Biology and Human Welfare': [
    () => ({
      body: `Which diagnostic test is used for the definitive laboratory confirmation of Typhoid fever caused by *Salmonella typhi*?`,
      correct: `Widal Test`,
      wrong: [`ELISA Test`, `Western Blot`, `Mantoux Test`],
      exp: `The Widal test detects agglutinating antibodies against *Salmonella typhi* antigens in typhoid fever.`
    })
  ],
  'Biotechnology and its Applications': [
    () => ({
      body: `What is the correct sequence of the three main thermal steps in Polymerase Chain Reaction (PCR)?`,
      correct: `Denaturation ($94^\\circ\\text{C}$) $\\to$ Annealing ($55^\\circ\\text{C}$) $\\to$ Extension ($72^\\circ\\text{C}$)`,
      wrong: [
        `Annealing $\\to$ Denaturation $\\to$ Extension`,
        `Extension $\\to$ Annealing $\\to$ Denaturation`,
        `Denaturation $\\to$ Extension $\\to$ Annealing`
      ],
      exp: `PCR involves 1. Denaturation (dsDNA separation), 2. Primer Annealing, 3. Extension via thermostable Taq polymerase.`
    })
  ],
  'Ecology and Environment': [
    () => ({
      body: `According to Lindeman's 10% law of trophic efficiency, what percentage of energy is transferred to the next trophic level?`,
      correct: `$10\\%$`,
      wrong: [`$1\\%$`, `$50\\%$`, `$20\\%$`],
      exp: `Only about 10% of energy stored as biomass in one trophic level is converted into biomass at the next level.`
    })
  ]
};

function buildExhaustiveQuestion(index) {
  const modSubj = index % 4;
  const isPyq = Math.random() < 0.8;
  const yr = getRandomChoice(pyqYears);

  let subj, chPool, examTag;

  if (modSubj === 0) {
    subj = 'Physics';
    chPool = physicsChapters;
    examTag = getRandomChoice(['JEE Main', 'JEE Advanced', 'NEET']);
  } else if (modSubj === 1) {
    subj = 'Chemistry';
    chPool = chemistryChapters;
    examTag = getRandomChoice(['JEE Main', 'JEE Advanced', 'NEET']);
  } else if (modSubj === 2) {
    subj = 'Mathematics';
    chPool = mathChapters;
    examTag = getRandomChoice(['JEE Main', 'JEE Advanced']);
  } else {
    subj = 'Biology';
    chPool = bioChapters;
    examTag = 'NEET';
  }

  const topicList = Object.keys(chPool);
  // Ensure uniform coverage across all chapters in the subject
  const qTopic = topicList[Math.floor(index / 4) % topicList.length];
  const genList = chPool[qTopic];
  const qItem = getRandomChoice(genList)();

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

async function startExhaustiveSeeding() {
  try {
    console.log('Clearing questionbank collection...');
    await questionBankModel.deleteMany({});

    const totalTarget = 60000;
    const chunkSize = 2500;
    const totalChunks = totalTarget / chunkSize;

    console.log(`Starting insertion of ${totalTarget} EXHAUSTIVE questions across ALL 62 CHAPTERS...`);

    for (let c = 0; c < totalChunks; c++) {
      const chunkDocs = [];
      const offset = c * chunkSize;
      for (let i = 0; i < chunkSize; i++) {
        chunkDocs.push(buildExhaustiveQuestion(offset + i));
      }

      await questionBankModel.insertMany(chunkDocs, { ordered: false });
      console.log(`Chunk ${c + 1}/${totalChunks} inserted! (${(c + 1) * chunkSize} / ${totalTarget} questions complete)`);
    }

    const totalInDb = await questionBankModel.countDocuments({});
    console.log('====================================================');
    console.log('✅ ALL 62 CHAPTERS POPULATED SUCCESSFULLY!');
    console.log(`TOTAL QUESTIONS IN MONGO DATABASE: ${totalInDb}`);
    console.log('====================================================');

    process.exit(0);
  } catch (err) {
    console.error('Error during exhaustive seeding:', err);
    process.exit(1);
  }
}

startExhaustiveSeeding();
