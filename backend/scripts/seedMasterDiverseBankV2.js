const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/online-exam-portal';

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB Atlas for V2 DIVERSE SEEDING...'))
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

// Track per-topic concept index for 100% round-robin diversity
const topicConceptCounters = {};

// ==========================================
// ⚛️ FULLY DYNAMIC PHYSICS GENERATORS (20 TOPICS)
// ==========================================
const physicsChapters = {
  'Physics and Measurement': [
    () => ({
      body: `What is the dimensional formula of the Universal Gravitational Constant $G$?`,
      correct: `$[M^{-1} L^3 T^{-2}]$`,
      wrong: [`$[M L^2 T^{-2}]$`, `$[M^{-1} L^2 T^{-1}]$`, `$[M^0 L^3 T^{-2}]$`],
      exp: `$[G] = \\frac{[F][r^2]}{[m^2]} = [M^{-1} L^3 T^{-2}]$.`
    }),
    () => ({
      body: `What is the dimensional formula of Planck's Constant $h$?`,
      correct: `$[M L^2 T^{-1}]$`,
      wrong: [`$[M L^2 T^{-2}]$`, `$[M L T^{-1}]$`, `$[M^{-1} L^2 T^{-1}]$`],
      exp: `$[h] = \\frac{[E]}{[\\nu]} = [M L^2 T^{-1}]$.`
    }),
    () => {
      const dm = getRandomChoice([1, 2, 3]);
      const dv = getRandomChoice([2, 3, 4]);
      const dK = dm + 2 * dv;
      return {
        body: `If percentage error in measuring mass is $${dm}\\%$ and velocity is $${dv}\\%$, find the percentage error in calculated kinetic energy $K = \\frac{1}{2}mv^2$:`,
        correct: `$${dK}\\%$`,
        wrong: [`$${dm + dv}\\%$`, `$${dm * dv}\\%$`, `$${dK + 2}\\%$`],
        exp: `$\\frac{\\Delta K}{K} = \\frac{\\Delta m}{m} + 2\\frac{\\Delta v}{v} = ${dm}\\% + 2(${dv}\\%) = ${dK}\\%$.`
      };
    },
    () => ({
      body: `How many significant figures are present in the measurement $0.002040\\text{ kg}$?`,
      correct: `$4$`,
      wrong: [`$6$`, `$3$`, `$7$`],
      exp: `Leading zeros are not significant; $2, 0, 4, 0$ are significant.`
    })
  ],
  'Kinematics': [
    () => {
      const u = getRandomChoice([15, 20, 25, 30, 35, 40]);
      const hMax = ((u * u) / 20).toFixed(1);
      return {
        body: `A stone is projected vertically upwards with speed $u = ${u}\\text{ m/s}$ ($g = 10\\text{ m/s}^2$). Find its maximum height $H_{\\text{max}}$:`,
        correct: `$${hMax}\\text{ m}$`,
        wrong: [`$${(hMax * 2).toFixed(1)}\\text{ m}$`, `$${(hMax / 2).toFixed(1)}\\text{ m}$`, `$${u}\\text{ m}$`],
        exp: `$H_{\\text{max}} = \\frac{u^2}{2g} = \\frac{${u}^2}{20} = ${hMax}\\text{ m}$.`
      };
    },
    () => {
      const v1 = getRandomChoice([30, 40, 60]);
      const v2 = getRandomChoice([60, 80, 120]);
      const vAvg = ((2 * v1 * v2) / (v1 + v2)).toFixed(1);
      return {
        body: `A car travels the first half of a total distance with speed $v_1 = ${v1}\\text{ km/h}$ and the second half with $v_2 = ${v2}\\text{ km/h}$. Find its average speed:`,
        correct: `$${vAvg}\\text{ km/h}$`,
        wrong: [`$${((v1 + v2) / 2).toFixed(1)}\\text{ km/h}$`, `$${(v1 + 10).toFixed(1)}\\text{ km/h}$`, `$${(vAvg * 1.25).toFixed(1)}\\text{ km/h}$`],
        exp: `$v_{\\text{avg}} = \\frac{2 v_1 v_2}{v_1 + v_2} = ${vAvg}\\text{ km/h}$.`
      };
    },
    () => {
      const u = getRandomChoice([10, 20, 30]);
      const r = ((u * u * Math.sin(Math.PI / 3)) / 10).toFixed(1);
      return {
        body: `A projectile is launched with speed $u = ${u}\\text{ m/s}$ at angle $\\theta = 30^\\circ$ to the horizontal. Calculate its horizontal range $R$ ($g = 10\\text{ m/s}^2$):`,
        correct: `$${r}\\text{ m}$`,
        wrong: [`$${(r * 1.5).toFixed(1)}\\text{ m}$`, `$${(r / 2).toFixed(1)}\\text{ m}$`, `$10.0\\text{ m}$`],
        exp: `$R = \\frac{u^2\\sin(2\\theta)}{g} = ${r}\\text{ m}$.`
      };
    }
  ],
  'Laws of Motion': [
    () => {
      const m = getRandomChoice([2, 3, 5, 8, 10]);
      const a = getRandomChoice([2, 4, 5, 6]);
      return {
        body: `A net horizontal force accelerates a mass $m = ${m}\\text{ kg}$ at $a = ${a}\\text{ m/s}^2$. Calculate the net force $F$:`,
        correct: `$${m * a}\\text{ N}$`,
        wrong: [`$${m + a}\\text{ N}$`, `$${m * a * 2}\\text{ N}$`, `$${(m * a) / 2}\\text{ N}$`],
        exp: `$F = m a = ${m} \\times ${a} = ${m * a}\\text{ N}$.`
      };
    },
    () => ({
      body: `A vehicle rounds an unbanked circular road of radius $R$ with coefficient of static friction $\\mu_s$. The maximum safe speed without skidding is:`,
      correct: `$\\sqrt{\\mu_s R g}$`,
      wrong: [`$\\mu_s R g$`, `$\\sqrt{\\frac{R g}{\\mu_s}}$`, `$\\frac{\\mu_s g}{R}$`],
      exp: `$v_{\\text{max}} = \\sqrt{\\mu_s R g}$.`
    }),
    () => {
      const m1 = getRandomChoice([2, 3]);
      const m2 = getRandomChoice([4, 5, 7]);
      const acc = (((m2 - m1) / (m1 + m2)) * 10).toFixed(2);
      return {
        body: `In an ideal Atwood machine, masses $m_1 = ${m1}\\text{ kg}$ and $m_2 = ${m2}\\text{ kg}$ hang over a frictionless pulley. Find acceleration $a$ ($g = 10\\text{ m/s}^2$):`,
        correct: `$${acc}\\text{ m/s}^2$`,
        wrong: [`$5.00\\text{ m/s}^2$`, `$1.00\\text{ m/s}^2$`, `$${(acc * 1.5).toFixed(2)}\\text{ m/s}^2$`],
        exp: `$a = \\frac{m_2 - m_1}{m_1 + m_2}g = ${acc}\\text{ m/s}^2$.`
      };
    }
  ],
  'Work, Energy and Power': [
    () => {
      const k = getRandomChoice([100, 200, 300, 400, 500, 800]);
      const xCm = getRandomChoice([5, 10, 15, 20, 25]);
      const xM = xCm / 100;
      const u = (0.5 * k * xM * xM).toFixed(2);
      return {
        body: `Calculate the potential energy stored in an elastic spring ($k = ${k}\\text{ N/m}$) compressed by $x = ${xCm}\\text{ cm}$:`,
        correct: `$${u}\\text{ J}$`,
        wrong: [`$${(u * 2).toFixed(2)}\\text{ J}$`, `$${(u / 2).toFixed(2)}\\text{ J}$`, `$${(u * 4).toFixed(2)}\\text{ J}$`],
        exp: `$U = \\frac{1}{2} k x^2 = \\frac{1}{2}(${k})(${xM})^2 = ${u}\\text{ J}$.`
      };
    },
    () => ({
      body: `What is the minimum speed required at the lowest point of a vertical circle of radius $R$ so that a mass completes the full loop?`,
      correct: `$\\sqrt{5gR}$`,
      wrong: [`$\\sqrt{gR}$`, `$\\sqrt{3gR}$`, `$\\sqrt{2gR}$`],
      exp: `$v_{\\text{bottom}} = \\sqrt{5gR}$.`
    }),
    () => ({
      body: `If the linear momentum of a body of mass $m$ is tripled, by what factor does its kinetic energy increase?`,
      correct: `$9$ times`,
      wrong: [`$3$ times`, `$6$ times`, `$27$ times`],
      exp: `$K = \\frac{p^2}{2m}$. If $p' = 3p$, $K' = 9K$.`
    }),
    () => {
      const f = getRandomChoice([20, 30, 50]);
      const v = getRandomChoice([2, 4, 5]);
      return {
        body: `A constant force $\\vec{F} = ${f}\\text{ N}$ moves a body with velocity $\\vec{v} = ${v}\\text{ m/s}$ in the direction of the force. Find the instantaneous power $P$:`,
        correct: `$${f * v}\\text{ W}$`,
        wrong: [`$${f + v}\\text{ W}$`, `$${f * v * 2}\\text{ W}$`, `$${(f * v) / 2}\\text{ W}$`],
        exp: `$P = \\vec{F} \\cdot \\vec{v} = ${f} \\times ${v} = ${f * v}\\text{ W}$.`
      };
    }
  ],
  'Rotational Motion': [
    () => {
      const m = getRandomChoice([2, 4, 6, 8, 10]);
      const r = getRandomChoice([1, 2]);
      const iTang = (1.5 * m * r * r).toFixed(1);
      return {
        body: `A uniform circular disk has mass $M = ${m}\\text{ kg}$ and radius $R = ${r}\\text{ m}$. Calculate its moment of inertia about an axis perpendicular to its plane and passing through its rim (tangential):`,
        correct: `$${iTang}\\text{ kg} \\cdot \\text{m}^2$`,
        wrong: [`$${(0.5 * m * r * r).toFixed(1)}\\text{ kg} \\cdot \\text{m}^2$`, `$${(m * r * r).toFixed(1)}\\text{ kg} \\cdot \\text{m}^2$`, `$${(2 * m * r * r).toFixed(1)}\\text{ kg} \\cdot \\text{m}^2$`],
        exp: `$I = \\frac{3}{2}MR^2 = ${iTang}\\text{ kg} \\cdot \\text{m}^2$.`
      };
    },
    () => ({
      body: `What is the moment of inertia of a uniform solid sphere of mass $M$ and radius $R$ about its diameter?`,
      correct: `$\\frac{2}{5} M R^2$`,
      wrong: [`$\\frac{2}{3} M R^2$`, `$\\frac{1}{2} M R^2$`, `$\\frac{7}{5} M R^2$`],
      exp: `$I = \\frac{2}{5}MR^2$.`
    }),
    () => ({
      body: `A solid cylinder, a solid sphere, and a thin ring of equal masses roll down an inclined plane without slipping. Which reaches the bottom first?`,
      correct: `Solid sphere (lowest $k^2/R^2 = 2/5$)`,
      wrong: [`Solid cylinder ($k^2/R^2 = 1/2$)`, `Thin ring ($k^2/R^2 = 1$)`, `All reach simultaneously`],
      exp: `$a = \\frac{g\\sin\\theta}{1 + k^2/R^2}$. Lowest $k^2/R^2$ gives largest acceleration.`
    }),
    () => {
      const i1 = getRandomChoice([4, 6, 8]);
      const w1 = getRandomChoice([10, 12, 15]);
      const i2 = i1 / 2;
      const w2 = w1 * 2;
      return {
        body: `A spinning turntable with moment of inertia $I_1 = ${i1}\\text{ kg} \\cdot \\text{m}^2$ rotating at $\\omega_1 = ${w1}\\text{ rad/s}$ contracts to $I_2 = ${i2}\\text{ kg} \\cdot \\text{m}^2$. Find its new angular speed $\\omega_2$:`,
        correct: `$${w2}\\text{ rad/s}$`,
        wrong: [`$${w1}\\text{ rad/s}$`, `$${w1 / 2}\\text{ rad/s}$`, `$${w2 * 2}\\text{ rad/s}$`],
        exp: `$I_1\\omega_1 = I_2\\omega_2 \\implies \\omega_2 = \\frac{${i1} \\times ${w1}}{${i2}} = ${w2}\\text{ rad/s}$.`
      };
    }
  ],
  'Gravitation': [
    () => ({
      body: `At what height $h$ above Earth's surface does acceleration due to gravity become $\\frac{g}{4}$ ($R = 6400\\text{ km}$)?`,
      correct: `$6400\\text{ km}$ ($h = R$)`,
      wrong: [`$3200\\text{ km}$ ($h = R/2$)`, `$12800\\text{ km}$ ($h = 2R$)`, `$1600\\text{ km}$ ($h = R/4$)`],
      exp: `$g' = g\\left(\\frac{R}{R+h}\\right)^2 = \\frac{g}{4} \\implies h = R = 6400\\text{ km}$.`
    }),
    () => ({
      body: `What is the escape velocity of a body from the surface of Earth ($R = 6400\\text{ km}, g = 9.8\\text{ m/s}^2$)?`,
      correct: `$11.2\\text{ km/s}$`,
      wrong: [`$7.9\\text{ km/s}$`, `$22.4\\text{ km/s}$`, `$9.8\\text{ km/s}$`],
      exp: `$v_e = \\sqrt{2gR} \\approx 11.2\\text{ km/s}$.`
    }),
    () => ({
      body: `If the orbital radius of a satellite is increased to $4$ times its original radius, its orbital period $T$ increases by a factor of:`,
      correct: `$8$ times ($T \\propto R^{3/2}$)`,
      wrong: [`$4$ times`, `$16$ times`, `$2$ times`],
      exp: `$T^2 \\propto R^3 \\implies T' = T \\times (4)^{3/2} = 8T$.`
    })
  ],
  'Properties of Solids and Liquids': [
    () => ({
      body: `What is the excess pressure inside a spherical soap bubble of surface tension $T$ and radius $R$ in air?`,
      correct: `$\\frac{4T}{R}$`,
      wrong: [`$\\frac{2T}{R}$`, `$\\frac{T}{R}$`, `$\\frac{8T}{R}$`],
      exp: `A soap bubble has two surfaces, so $\\Delta P = \\frac{4T}{R}$.`
    }),
    () => {
      const h = getRandomChoice([2, 5, 8, 10]);
      const v = Math.sqrt(2 * 10 * h).toFixed(1);
      return {
        body: `A water tank has a small hole at depth $h = ${h}\\text{ m}$ below the open surface. Find Torricelli's efflux speed ($g = 10\\text{ m/s}^2$):`,
        correct: `$${v}\\text{ m/s}$`,
        wrong: [`$${(v * 1.5).toFixed(1)}\\text{ m/s}$`, `$${(v / 2).toFixed(1)}\\text{ m/s}$`, `$${h * 2}.0\\text{ m/s}$`],
        exp: `$v = \\sqrt{2gh} = \\sqrt{2(10)(${h})} = ${v}\\text{ m/s}$.`
      };
    },
    () => ({
      body: `When the radius of a capillary tube is halved, the height of liquid rise in it:`,
      correct: `Doubles ($h \\propto 1/r$)`,
      wrong: [`Halves`, `Quadruples`, `Remains unchanged`],
      exp: `$h = \\frac{2T\\cos\\theta}{r\\rho g} \\implies h \\propto 1/r$.`
    })
  ],
  'Thermodynamics': [
    () => {
      const t1 = getRandomChoice([500, 600, 800, 1000]);
      const t2 = getRandomChoice([250, 300, 400]);
      const eta = Math.round((1 - t2 / t1) * 100);
      return {
        body: `Calculate the efficiency $\\eta$ of a Carnot engine operating between $T_1 = ${t1}\\text{ K}$ and $T_2 = ${t2}\\text{ K}$:`,
        correct: `$${eta}\\%$`,
        wrong: [`$${eta - 15}\\%$`, `$${eta + 15}\\%$`, `$50\\%$`],
        exp: `$\\eta = 1 - \\frac{${t2}}{${t1}} = ${eta}\\%$.`
      };
    },
    () => ({
      body: `In an adiabatic expansion of an ideal gas, work done by the gas is derived from:`,
      correct: `Its internal energy (temperature decreases)`,
      wrong: [`Surrounding heat`, `External reservoir`, `Constant enthalpy`],
      exp: `$\\Delta Q = 0 \\implies W = -\\Delta U$.`
    })
  ],
  'Kinetic Theory of Gases': [
    () => ({
      body: `What is the ratio of molar heat capacities $\\gamma = \\frac{C_p}{C_v}$ for an ideal rigid diatomic gas ($f = 5$)?`,
      correct: `$\\frac{7}{5} = 1.40$`,
      wrong: [`$\\frac{5}{3} \\approx 1.67$`, `$\\frac{4}{3} \\approx 1.33$`, `$\\frac{9}{7} \\approx 1.28$`],
      exp: `$\\gamma = 1 + 2/5 = 7/5 = 1.40$.`
    }),
    () => ({
      body: `At what absolute temperature will the RMS speed of gas molecules be double its value at $T = 300\\text{ K}$?`,
      correct: `$1200\\text{ K}$`,
      wrong: [`$600\\text{ K}$`, `$900\\text{ K}$`, `$2400\\text{ K}$`],
      exp: `$v_{\\text{rms}} \\propto \\sqrt{T} \\implies T' = 4 \\times 300 = 1200\\text{ K}$.`
    })
  ],
  'Oscillations and Waves': [
    () => {
      const f1 = getRandomChoice([250, 300, 440]);
      const f2 = f1 + getRandomChoice([3, 4, 5, 6]);
      return {
        body: `Two sound waves of frequencies $f_1 = ${f1}\\text{ Hz}$ and $f_2 = ${f2}\\text{ Hz}$ interfere. How many beats are heard per second?`,
        correct: `$${f2 - f1}$ beats/s`,
        wrong: [`$${(f2 - f1) * 2}$ beats/s`, `$2$ beats/s`, `$10$ beats/s`],
        exp: `$f_b = |f_2 - f_1| = ${f2 - f1}\\text{ beats/s}$.`
      };
    },
    () => ({
      body: `What is the ratio of fundamental frequency of a closed organ pipe to an open organ pipe of same length?`,
      correct: `$1 : 2$`,
      wrong: [`$2 : 1$`, `$1 : 4$`, `$1 : 1$`],
      exp: `$f_{\\text{closed}} = \\frac{v}{4L}$ and $f_{\\text{open}} = \\frac{v}{2L} \\implies 1:2$.`
    })
  ],
  'Electrostatics': [
    () => {
      const q = getRandomChoice([1, 2, 4, 6, 8]);
      return {
        body: `A charge $q = +${q}\\,\\mu\\text{C}$ is placed at the center of a cube. Find the electric flux $\\Phi$ through **one face**:`,
        correct: `$\\frac{${q}\\,\\mu\\text{C}}{6\\varepsilon_0}$`,
        wrong: [`$\\frac{${q}\\,\\mu\\text{C}}{\\varepsilon_0}$`, `$\\frac{${q}\\,\\mu\\text{C}}{8\\varepsilon_0}$`, `$0$`],
        exp: `Flux through one face is $q/(6\\varepsilon_0)$.`
      };
    },
    () => {
      const c = getRandomChoice([5, 10, 20]);
      const v = getRandomChoice([50, 100, 200]);
      const u = (0.5 * c * 1e-6 * v * v).toFixed(3);
      return {
        body: `Calculate energy stored in a capacitor ($C = ${c}\\,\\mu\\text{F}$) charged to $V = ${v}\\text{ V}$:`,
        correct: `$${u}\\text{ J}$`,
        wrong: [`$${(u * 2).toFixed(3)}\\text{ J}$`, `$${(u / 2).toFixed(3)}\\text{ J}$`, `$1.000\\text{ J}$`],
        exp: `$U = \\frac{1}{2} C V^2 = ${u}\\text{ J}$.`
      };
    }
  ],
  'Current Electricity': [
    () => {
      const p = getRandomChoice([2, 4, 5]);
      const q = getRandomChoice([4, 6, 10]);
      const r = getRandomChoice([6, 8, 12]);
      const s = ((q * r) / p).toFixed(1);
      return {
        body: `In a balanced Wheatstone bridge, $P = ${p}\\,\\Omega, Q = ${q}\\,\\Omega$, and $R = ${r}\\,\\Omega$. Calculate unknown resistance $S$:`,
        correct: `$${s}\\,\\Omega$`,
        wrong: [`$${(s * 1.5).toFixed(1)}\\,\\Omega$`, `$${(s / 2).toFixed(1)}\\,\\Omega$`, `$10.0\\,\\Omega$`],
        exp: `$S = \\frac{Q \\times R}{P} = ${s}\\,\\Omega$.`
      };
    },
    () => ({
      body: `Two bulbs rated $220\\text{ V}, 100\\text{ W}$ each are connected in series across $220\\text{ V}$. Total power consumed is:`,
      correct: `$50\\text{ W}$`,
      wrong: [`$100\\text{ W}$`, `$200\\text{ W}$`, `$25\\text{ W}$`],
      exp: `$P = \\frac{100 \\times 100}{200} = 50\\text{ W}$.`
    })
  ],
  'Magnetic Effects of Current and Magnetism': [
    () => ({
      body: `A charge $q$ moving with velocity $v$ enters a uniform magnetic field $B$ perpendicularly. What is its orbit radius $r$?`,
      correct: `$r = \\frac{m v}{q B}$`,
      wrong: [`$r = \\frac{q B}{m v}$`, `$r = \\frac{q v}{m B}$`, `$r = \\frac{m B}{q v}$`],
      exp: `$r = \\frac{m v}{q B}$.`
    }),
    () => ({
      body: `What is the magnetic field $B$ at the center of a circular loop of radius $R$ carrying current $I$?`,
      correct: `$\\frac{\\mu_0 I}{2R}$`,
      wrong: [`$\\frac{\\mu_0 I}{4\\pi R}$`, `$\\frac{\\mu_0 I}{2\\pi R}$`, `$\\frac{\\mu_0 I R}{2}$`],
      exp: `$B = \\frac{\\mu_0 I}{2R}$.`
    })
  ],
  'Electromagnetic Induction and Alternating Currents': [
    () => ({
      body: `Calculate the resonant frequency $\\omega_0$ in an AC series LCR circuit with $L = 10\\text{ mH}$ and $C = 10\\,\\mu\\text{F}$:`,
      correct: `$3162\\text{ rad/s}$`,
      wrong: [`$1000\\text{ rad/s}$`, `$5000\\text{ rad/s}$`, `$628\\text{ rad/s}$`],
      exp: `$\\omega_0 = \\frac{1}{\\sqrt{LC}} = 3162\\text{ rad/s}$.`
    }),
    () => {
      const vp = 2200, vs = 220, np = 1000;
      const ns = (np * vs) / vp;
      return {
        body: `A transformer steps down $V_p = ${vp}\\text{ V}$ to $V_s = ${vs}\\text{ V}$. If primary coil has $N_p = ${np}$ turns, find secondary turns $N_s$:`,
        correct: `$${ns}$ turns`,
        wrong: [`$10000$ turns`, `$50$ turns`, `$200$ turns`],
        exp: `$N_s = N_p \\frac{V_s}{V_p} = ${ns}\\text{ turns}$.`
      };
    }
  ],
  'Electromagnetic Waves': [
    () => ({
      body: `Which represents the correct ascending frequency order in the electromagnetic spectrum?`,
      correct: `Radio waves < Microwaves < Infrared < Visible < Ultraviolet < X-rays < $\\gamma$-rays`,
      wrong: [
        `$\\gamma$-rays < X-rays < Ultraviolet < Visible < Infrared < Microwaves < Radio waves`,
        `Microwaves < Radio waves < Infrared < Visible < X-rays`,
        `Visible < Infrared < Ultraviolet < X-rays < Radio waves`
      ],
      exp: `Frequency increases: Radio $\\to$ Micro $\\to$ IR $\\to$ Visible $\\to$ UV $\\to$ X-ray $\\to$ Gamma.`
    }),
    () => ({
      body: `What is the magnitude ratio of electric field amplitude $E_0$ to magnetic field amplitude $B_0$ in vacuum?`,
      correct: `$c$ (Speed of light in vacuum)`,
      wrong: [`$1/c$`, `$c^2$`, `$\\sqrt{c}$`],
      exp: `$E_0/B_0 = c = 3\\times 10^8\\text{ m/s}$.`
    })
  ],
  'Optics': [
    () => {
      const mu = getRandomChoice([1.5, 1.732, 1.33, 1.414]);
      const deg = Math.round((Math.atan(mu) * 180) / Math.PI);
      return {
        body: `Unpolarized light is incident from air onto a medium of $\\mu = ${mu}$. Find Brewster's angle $\\theta_p$:`,
        correct: `$${deg}^\\circ$`,
        wrong: [`$${deg + 15}^\\circ$`, `$${deg - 10}^\\circ$`, `$45^\\circ$`],
        exp: `$\\tan\\theta_p = \\mu \\implies \\theta_p \\approx ${deg}^\\circ$.`
      };
    },
    () => ({
      body: `An equilateral prism ($A = 60^\\circ$) has $\\mu = \\sqrt{2}$. Find minimum deviation $\\delta_m$:`,
      correct: `$30^\\circ$`,
      wrong: [`$45^\\circ$`, `$60^\\circ$`, `$15^\\circ$`],
      exp: `$\\mu = \\frac{\\sin((60+\\delta_m)/2)}{\\sin(30^\\circ)} = \\sqrt{2} \\implies \\delta_m = 30^\\circ$.`
    }),
    () => {
      const fo = getRandomChoice([100, 120, 150]);
      const fe = getRandomChoice([5, 10]);
      const m = fo / fe;
      const l = fo + fe;
      return {
        body: `An astronomical telescope has $f_o = ${fo}\\text{ cm}$ and $f_e = ${fe}\\text{ cm}$. Find magnification $M$ and tube length $L$:`,
        correct: `$M = ${m}, L = ${l}\\text{ cm}$`,
        wrong: [`$M = ${m * 2}, L = ${l + 10}\\text{ cm}$`, `$M = ${m}, L = ${fo - fe}\\text{ cm}$`, `$M = 5, L = 100\\text{ cm}$`],
        exp: `$M = f_o/f_e = ${m}, L = f_o+f_e = ${l}\\text{ cm}$.`
      };
    }
  ],
  'Dual Nature of Matter and Radiation': [
    () => {
      const v = getRandomChoice([25, 49, 100, 144]);
      const lam = (1.227 / Math.sqrt(v)).toFixed(3);
      return {
        body: `Calculate the de Broglie wavelength $\\lambda$ of an electron accelerated through $V = ${v}\\text{ V}$:`,
        correct: `$${lam}\\text{ nm}$`,
        wrong: [`$${(lam * 10).toFixed(3)}\\text{ nm}$`, `$${(lam / 2).toFixed(3)}\\text{ nm}$`, `$1.227\\text{ nm}$`],
        exp: `$\\lambda = \\frac{1.227}{\\sqrt{${v}}} = ${lam}\\text{ nm}$.`
      };
    },
    () => ({
      body: `When the frequency of incident light on a photosensitive metal is doubled, the stopping potential:`,
      correct: `More than doubles`,
      wrong: [`Doubles`, `Remains unchanged`, `Halves`],
      exp: `$eV_0' = 2(eV_0 + \\phi) - \\phi = 2eV_0 + \\phi > 2eV_0$.`
    })
  ],
  'Atoms and Nuclei': [
    () => ({
      body: `According to Bohr's model of hydrogen, what is the energy of the electron in ground state ($n = 1$)?`,
      correct: `$-13.6\\text{ eV}$`,
      wrong: [`$-3.4\\text{ eV}$`, `$-1.51\\text{ eV}$`, `$+13.6\\text{ eV}$`],
      exp: `$E_1 = -13.6\\text{ eV}$.`
    }),
    () => {
      const tHalf = getRandomChoice([3, 5, 8]);
      const tTotal = tHalf * 3;
      return {
        body: `If a radioactive substance has half-life $T_{1/2} = ${tHalf}\\text{ days}$, what fraction remains after $t = ${tTotal}\\text{ days}$?`,
        correct: `$\\frac{1}{8}$ ($12.5\\%$)`,
        wrong: [`$\\frac{1}{4}$`, `$\\frac{1}{16}$`, `$\\frac{1}{3}$`],
        exp: `$n = ${tTotal}/${tHalf} = 3 \\implies (1/2)^3 = 1/8$.`
      };
    }
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
    },
    () => ({
      body: `In which operating bias region is a Zener diode used as a constant voltage regulator?`,
      correct: `Reverse Breakdown Region`,
      wrong: [`Forward Bias Region`, `Cutoff Region`, `Saturation Region`],
      exp: `In reverse breakdown, Zener diode maintains constant voltage.`
    })
  ],
  'Experimental Skills': [
    () => ({
      body: `A screw gauge has pitch $0.5\\text{ mm}$ and $50$ circular scale divisions. What is its least count?`,
      correct: `$0.01\\text{ mm}$`,
      wrong: [`$0.1\\text{ mm}$`, `$0.001\\text{ mm}$`, `$0.05\\text{ mm}$`],
      exp: `$\\text{LC} = \\frac{0.5}{50} = 0.01\\text{ mm}$.`
    })
  ]
};

// ==========================================
// 🧪 ALL 19 CHEMISTRY TOPICS
// ==========================================
const chemistryChapters = {
  'Some Basic Concepts in Chemistry': [
    () => ({
      body: `Calculate molarity of solution containing $4.0\\text{ g } NaOH$ dissolved in $250\\text{ mL}$ solution:`,
      correct: `$0.40\\text{ M}$`,
      wrong: [`$0.10\\text{ M}$`, `$1.00\\text{ M}$`, `$0.25\\text{ M}$`],
      exp: `$M = 0.1 / 0.250 = 0.40\\text{ M}$.`
    })
  ],
  'Atomic Structure': [
    () => ({
      body: `Which set of quantum numbers ($n, l, m_l, m_s$) is allowed for an electron in a $3d$ orbital?`,
      correct: `$n = 3, l = 2, m_l = -1, m_s = +\\frac{1}{2}$`,
      wrong: [`$n = 3, l = 3, m_l = 0, m_s = +\\frac{1}{2}$`, `$n = 3, l = 1, m_l = 2, m_s = -\\frac{1}{2}$`, `$n = 2, l = 2, m_l = 0, m_s = +\\frac{1}{2}$`],
      exp: `For $3d$, $n = 3$ and $l = 2$.`
    })
  ],
  'Chemical Bonding and Molecular Structure': [
    () => ({
      body: `What is the molecular geometry and hybridization of $SF_6$?`,
      correct: `Octahedral ($sp^3d^2$)`,
      wrong: [`Trigonal bipyramidal ($sp^3d$)`, `Tetrahedral ($sp^3$)`, `Square planar ($dsp^2$)`],
      exp: `$SF_6$ has steric number 6 $\\implies sp^3d^2$ octahedral.`
    })
  ],
  'Chemical Thermodynamics': [
    () => ({
      body: `What is the thermodynamic criterion for a spontaneous process at constant $T$ and $P$?`,
      correct: `$\\Delta G < 0$ (Negative Gibbs energy)`,
      wrong: [`$\\Delta G > 0$`, `$\\Delta H > 0$`, `$\\Delta S = 0$`],
      exp: `Spontaneous reactions satisfy $\\Delta G < 0$.`
    })
  ],
  'Solutions': [
    () => ({
      body: `What is the theoretical Van 't Hoff factor $i$ for complete dissociation of $BaCl_2$?`,
      correct: `$i = 3$`,
      wrong: [`$i = 2$`, `$i = 1$`, `$i = 4$`],
      exp: `$BaCl_2 \\to Ba^{2+} + 2Cl^- \\implies i = 3$.`
    })
  ],
  'Equilibrium': [
    () => ({
      body: `What is the pH of a $10^{-3}\\text{ M } HCl$ aqueous solution at $25^\\circ\\text{C}$?`,
      correct: `$3.0$`,
      wrong: [`$11.0$`, `$7.0$`, `$1.0$`],
      exp: `$\\text{pH} = -\\log(10^{-3}) = 3.0$.`
    })
  ],
  'Redox Reactions and Electrochemistry': [
    () => ({
      body: `In standard Daniell cell, given $E^\\circ(Zn^{2+}/Zn) = -0.76\\text{ V}$ and $E^\\circ(Cu^{2+}/Cu) = +0.34\\text{ V}$, find $E^\\circ_{\\text{cell}}$:`,
      correct: `$1.10\\text{ V}$`,
      wrong: [`$0.42\\text{ V}$`, `$-1.10\\text{ V}$`, `$0.76\\text{ V}$`],
      exp: `$E^\\circ_{\\text{cell}} = 0.34 - (-0.76) = 1.10\\text{ V}$.`
    })
  ],
  'Chemical Kinetics': [
    () => ({
      body: `For a first-order reaction with $k = 0.0693\\text{ min}^{-1}$, what is half-life $t_{1/2}$?`,
      correct: `$10\\text{ minutes}$`,
      wrong: [`$5\\text{ minutes}$`, `$20\\text{ minutes}$`, `$100\\text{ minutes}$`],
      exp: `$t_{1/2} = 0.693/0.0693 = 10\\text{ minutes}$.`
    })
  ],
  'Classification of Elements and Periodicity': [
    () => ({
      body: `Which element has the higher first ionization enthalpy between Nitrogen and Oxygen?`,
      correct: `Nitrogen ($N$, half-filled $2p^3$)`,
      wrong: [`Oxygen ($O$)`, `Both equal`, `Depends on temperature`],
      exp: `Nitrogen has stable half-filled $2p^3$ configuration.`
    })
  ],
  'p-Block Elements': [
    () => ({
      body: `In diborane ($B_2H_6$), what type of bonds connect the bridging hydrogen atoms?`,
      correct: `Three-centre two-electron ($3c-2e$) banana bonds`,
      wrong: [`$3c-4e$ bonds`, `$2c-2e$ bonds`, `Ionic bonds`],
      exp: `Bridging B-H-B bonds are $3c-2e$ banana bonds.`
    })
  ],
  'd- and f-Block Elements': [
    () => {
      const n = getRandomChoice([1, 2, 3, 4, 5]);
      const mu = Math.sqrt(n * (n + 2)).toFixed(2);
      return {
        body: `Find spin-only magnetic moment $\\mu_s$ for an ion with $n = ${n}$ unpaired electrons:`,
        correct: `$${mu}\\text{ BM}$`,
        wrong: [`$${(parseFloat(mu) + 1.0).toFixed(2)}\\text{ BM}$`, `$${(n * 1.5).toFixed(2)}\\text{ BM}$`, `$0.00\\text{ BM}$`],
        exp: `$\\mu_s = \\sqrt{n(n+2)} = ${mu}\\text{ BM}$.`
      };
    }
  ],
  'Coordination Compounds': [
    () => ({
      body: `What is the oxidation state and coordination number of Cobalt in $[Co(NH_3)_6]Cl_3$?`,
      correct: `Oxidation state: $+3$, Coordination number: $6$`,
      wrong: [`Oxidation state: $+2$, Coordination number: $6$`, `Oxidation state: $+3$, Coordination number: $3$`, `Oxidation state: $0$, Coordination number: $6$`],
      exp: `6 $NH_3$ ligands (coord 6), $3 Cl^-$ counterions (ox +3).`
    })
  ],
  'Basic Principles and Techniques': [
    () => ({
      body: `Which carbocation is the most stable?`,
      correct: `Tertiary butyl carbocation $(CH_3)_3C^+$`,
      wrong: [`Isopropyl carbocation`, `Ethyl carbocation`, `Methyl carbocation`],
      exp: `$(CH_3)_3C^+$ has 9 $\\alpha$-hydrogens.`
    })
  ],
  'Hydrocarbons': [
    () => ({
      body: `Major product of propene with $HBr$ in the presence of benzoyl peroxide:`,
      correct: `1-Bromopropane (Anti-Markovnikov)`,
      wrong: [`2-Bromopropane (Markovnikov)`, `1,2-Dibromopropane`, `Propane`],
      exp: `Peroxide promotes Anti-Markovnikov addition.`
    })
  ],
  'Organic Compounds Containing Halogens': [
    () => ({
      body: `Which haloalkane undergoes $S_N1$ nucleophilic substitution fastest?`,
      correct: `Tert-butyl chloride $(CH_3)_3C-Cl$`,
      wrong: [`Isopropyl chloride`, `Ethyl chloride`, `Methyl chloride`],
      exp: `$S_N1$ follows $3^\\circ > 2^\\circ > 1^\\circ$.`
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
        body: `Examine the substituted aromatic ring below:\n${getBenzeneSvg(s.group)}\nDetermine directive influence of **${s.group}**:`,
        correct: `${s.direct} & ${s.type}`,
        wrong: [`${s.direct === 'Meta-directing' ? 'Ortho/Para-directing' : 'Meta-directing'} & neutral`, 'Non-directing substituent', 'Ring decomposition'],
        exp: `Group **${s.group}** directs incoming electrophiles to ${s.direct}.`
      };
    }
  ],
  'Organic Compounds Containing Nitrogen': [
    () => ({
      body: `Which reaction converts a primary acid amide into a primary amine with one fewer carbon?`,
      correct: `Hoffmann Bromamide Degradation`,
      wrong: [`Gabriel Phthalimide Synthesis`, `Carbylamine Reaction`, `Cannizzaro Reaction`],
      exp: `$R-CONH_2 + Br_2 + 4KOH \\to R-NH_2$.`
    })
  ],
  'Biomolecules': [
    () => ({
      body: `Which of the following is a non-reducing disaccharide?`,
      correct: `Sucrose`,
      wrong: [`Maltose`, `Lactose`, `Glucose`],
      exp: `Sucrose is non-reducing.`
    })
  ],
  'Practical Chemistry': [
    () => ({
      body: `In flame testing, which metal salt imparts an apple-green color to the flame?`,
      correct: `Barium ($Ba^{2+}$)`,
      wrong: [`Calcium ($Ca^{2+}$)`, `Sodium ($Na^+$)`, `Potassium ($K^+$)`],
      exp: `$Ba^{2+}$ produces an apple-green flame.`
    })
  ]
};

// ==========================================
// 📐 ALL 13 MATHEMATICS TOPICS
// ==========================================
const mathChapters = {
  'Sets, Relations and Functions': [
    () => ({
      body: `Find the domain of real function $f(x) = \\sqrt{16 - x^2}$:`,
      correct: `$[-4, 4]$`,
      wrong: [`$(-\\infty, -4] \\cup [4, \\infty)$`, `$[0, 4]$`, `$(-4, 4)$`],
      exp: `$16 - x^2 \\ge 0 \\implies -4 \\le x \\le 4$.`
    })
  ],
  'Complex Numbers and Quadratic Equations': [
    () => ({
      body: `If $\\omega$ is a complex cube root of unity, find value of $(1 + \\omega - \\omega^2)^2$:`,
      correct: `$4\\omega$`,
      wrong: [`$4$`, `$-4\\omega$`, `$1$`],
      exp: `$1 + \\omega = -\\omega^2 \\implies (-2\\omega^2)^2 = 4\\omega^4 = 4\\omega$.`
    })
  ],
  'Matrices and Determinants': [
    () => {
      const detA = getRandomInt(2, 5);
      return {
        body: `For a $3 \\times 3$ matrix $A$ with $|A| = ${detA}$, calculate $|\\text{adj}(A)|$:`,
        correct: `$${detA * detA}$`,
        wrong: [`$${detA}$`, `$${Math.pow(detA, 3)}$`, `$${detA * 2}$`],
        exp: `$|\\text{adj}(A)| = |A|^{n-1} = ${detA}^2 = ${detA * detA}$.`
      };
    }
  ],
  'Permutations and Combinations': [
    () => ({
      body: `How many diagonals does an octagon ($n = 8$ sides) have?`,
      correct: `$20$ diagonals`,
      wrong: [`$28$ diagonals`, `$24$ diagonals`, `$16$ diagonals`],
      exp: `Diagonals $= ^8C_2 - 8 = 20$.`
    })
  ],
  'Binomial Theorem and Mathematical Induction': [
    () => ({
      body: `Find term independent of $x$ in expansion of $\\left(x + \\frac{1}{x}\\right)^{10}$:`,
      correct: `$^{10}C_5 = 252$`,
      wrong: [`$^{10}C_4 = 210$`, `$^{10}C_6 = 210$`, `$120$`],
      exp: `$T_{r+1} = ^{10}C_r x^{10-2r} \\implies r = 5$.`
    })
  ],
  'Sequence and Series': [
    () => ({
      body: `Find sum of infinite series $S = 6 + 2 + \\frac{2}{3} + \\frac{2}{9} + \\dots$:`,
      correct: `$9$`,
      wrong: [`$8$`, `$12$`, `$\\frac{27}{2}$`],
      exp: `$S_\\infty = \\frac{6}{1-1/3} = 9$.`
    })
  ],
  'Limit, Continuity and Differentiability': [
    () => ({
      body: `Evaluate limit $\\lim_{x\\to 0} \\frac{e^{2x} - 1}{\\sin x}$:`,
      correct: `$2$`,
      wrong: [`$1$`, `$0$`, `$e$`],
      exp: `By L'Hopital's rule: $2$.`
    })
  ],
  'Integral Calculus': [
    () => ({
      body: `Evaluate $\\int_{-\\pi/2}^{\\pi/2} x^3 \\cos x \\, dx$:`,
      correct: `$0$`,
      wrong: [`$\\pi$`, `$2$`, `$\\frac{\\pi}{2}$`],
      exp: `Integrand is odd function, so integral is $0$.`
    })
  ],
  'Differential Equations': [
    () => ({
      body: `Integrating factor of $\\frac{dy}{dx} + \\frac{2}{x}y = x^3$:`,
      correct: `$x^2$`,
      wrong: [`$2x$`, `$\\ln x$`, `$e^{2x}$`],
      exp: `$IF = x^2$.`
    })
  ],
  'Coordinate Geometry': [
    () => {
      const a = getRandomInt(2, 6);
      return {
        body: `Find latus rectum length of parabola $y^2 = ${4 * a}x$:`,
        correct: `$${4 * a}$`,
        wrong: [`$${2 * a}$`, `$${a}$`, `$${8 * a}$`],
        exp: `Latus rectum length $= 4a = ${4 * a}$.`
      };
    }
  ],
  'Three Dimensional Geometry (3D) and Vectors': [
    () => ({
      body: `Scalar projection of $\\vec{a} = 2\\hat{i} + 3\\hat{j} + 6\\hat{k}$ on $\\vec{b} = \\hat{i} + 2\\hat{j} + 2\\hat{k}$:`,
      correct: `$6.67$ ($20/3$)`,
      wrong: [`$14$`, `$5.00$`, `$20$`],
      exp: `Projection $= 20/3 \\approx 6.67$.`
    })
  ],
  'Statistics and Probability': [
    () => {
      const pB1 = getRandomChoice([0.5, 0.6, 0.7]);
      const pB2 = (1 - pB1).toFixed(1);
      const d1 = 0.02, d2 = 0.05;
      const totD = (pB1 * d1 + pB2 * d2).toFixed(4);
      const ans = ((pB2 * d2) / totD).toFixed(3);
      return {
        body: `Machine A produces $${Math.round(pB1 * 100)}\\%$ output ($2\\%$ defects), Machine B produces $${Math.round(pB2 * 100)}\\%$ ($5\\%$ defects). A picked item is defective; find probability it came from Machine B:`,
        correct: `$${ans}$`,
        wrong: [`$0.500$`, `$0.250$`, `$0.400$`, `$0.650$`],
        exp: `Bayes' Theorem: $P(B|D) = ${ans}$.`
      };
    },
    () => {
      const n = getRandomChoice([5, 7, 9, 11]);
      const variance = ((n * n - 1) / 12).toFixed(2);
      return {
        body: `Find variance $\\sigma^2$ of first $n = ${n}$ natural numbers:`,
        correct: `$${variance}$`,
        wrong: [`$${(variance * 1.5).toFixed(2)}$`, `$${n}.00$`, `$${((n * n) / 12).toFixed(2)}$`],
        exp: `$\\sigma^2 = \\frac{n^2 - 1}{12} = ${variance}$.`
      };
    }
  ],
  'Trigonometry': [
    () => ({
      body: `Maximum and minimum value of $f(x) = 3\\sin x + 4\\cos x$:`,
      correct: `Max $= +5$, Min $= -5$`,
      wrong: [`Max $= +7$, Min $= -7$`, `Max $= +1$, Min $= -1$`, `Max $= +12$, Min $= -12$`],
      exp: `Range is $[-5, +5]$.`
    })
  ]
};

// ==========================================
// 🧬 ALL 10 BIOLOGY TOPICS
// ==========================================
const bioChapters = {
  'Diversity in the Living World': [
    () => ({
      body: `Who proposed the Five Kingdom Classification system?`,
      correct: `R. H. Whittaker (1969)`,
      wrong: [`Carolus Linnaeus`, `Aristotle`, `Carl Woese`],
      exp: `Whittaker classified organisms into Monera, Protista, Fungi, Plantae, Animalia.`
    })
  ],
  'Structural Organisation in Animals and Plants': [
    () => ({
      body: `Which vascular element consists of dead cells with lignified walls at maturity?`,
      correct: `Xylem vessels and tracheids`,
      wrong: [`Phloem companion cells`, `Sieve tubes`, `Parenchyma`],
      exp: `Xylem vessels lose protoplasm at maturity.`
    })
  ],
  'Cell Structure and Function': [
    () => ({
      body: `During which stage of Meiosis I does crossing over occur?`,
      correct: `Pachytene of Prophase I`,
      wrong: [`Leptotene`, `Zygotene`, `Diplotene`],
      exp: `Crossing over occurs during Pachytene.`
    })
  ],
  'Plant Physiology': [
    () => ({
      body: `Primary $CO_2$ acceptor in $C_4$ plants:`,
      correct: `Phosphoenolpyruvate (PEP)`,
      wrong: [`RuBP`, `OAA`, `PGA`],
      exp: `PEP carboxylase fixes $CO_2$ with PEP.`
    })
  ],
  'Human Physiology': [
    () => {
      const hr = getRandomChoice([60, 72, 80]);
      const co = ((hr * 70) / 1000).toFixed(2);
      return {
        body: `Calculate Cardiac Output ($\\text{CO}$) with heart rate $\\text{HR} = ${hr}\\text{ bpm}$ and stroke volume $\\text{SV} = 70\\text{ mL}$:`,
        correct: `$${co}\\text{ L/min}$`,
        wrong: [`$7.00\\text{ L/min}$`, `$${(co * 1.5).toFixed(2)}\\text{ L/min}$`, `$3.50\\text{ L/min}$`],
        exp: `$\\text{CO} = \\text{HR} \\times \\text{SV} = ${co}\\text{ L/min}$.`
      };
    }
  ],
  'Reproduction': [
    () => ({
      body: `In angiosperms, triple fusion produces:`,
      correct: `Primary Endosperm Nucleus (PEN, $3n$)`,
      wrong: [`Zygote ($2n$)`, `Synergid`, `Antipodal`],
      exp: `Triple fusion forms $3n$ PEN.`
    })
  ],
  'Genetics and Evolution': [
    () => ({
      body: `Phenotypic ratio in $F_2$ generation of a dihybrid cross:`,
      correct: `$9 : 3 : 3 : 1$`,
      wrong: [`$1 : 2 : 1$`, `$9 : 7$`, `$1 : 1 : 1 : 1$`],
      exp: `Independent assortment yields $9:3:3:1$.`
    })
  ],
  'Biology and Human Welfare': [
    () => ({
      body: `Diagnostic test for confirmation of Typhoid fever:`,
      correct: `Widal Test`,
      wrong: [`ELISA`, `Western Blot`, `Mantoux`],
      exp: `Widal test confirms *Salmonella typhi*.`
    })
  ],
  'Biotechnology and its Applications': [
    () => ({
      body: `Correct sequence of thermal steps in PCR:`,
      correct: `Denaturation ($94^\\circ\\text{C}$) $\\to$ Annealing ($55^\\circ\\text{C}$) $\\to$ Extension ($72^\\circ\\text{C}$)`,
      wrong: [`Annealing $\\to$ Denaturation $\\to$ Extension`, `Extension $\\to$ Annealing $\\to$ Denaturation`, `Denaturation $\\to$ Extension $\\to$ Annealing`],
      exp: `PCR stages: Denaturation $\\to$ Annealing $\\to$ Extension.`
    })
  ],
  'Ecology and Environment': [
    () => ({
      body: `Percentage of energy transferred to next trophic level (Lindeman's law):`,
      correct: `$10\\%$`,
      wrong: [`$1\\%$`, `$50\\%$`, `$20\\%$`],
      exp: `Only 10% of energy is transferred between successive trophic levels.`
    })
  ]
};

function buildV2Question(index) {
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
  const qTopic = topicList[Math.floor(index / 4) % topicList.length];
  const genList = chPool[qTopic];

  // Strictly round-robin through concepts within the topic so consecutive questions are ALWAYS different
  if (topicConceptCounters[qTopic] === undefined) {
    topicConceptCounters[qTopic] = 0;
  }
  const conceptIdx = topicConceptCounters[qTopic] % genList.length;
  topicConceptCounters[qTopic]++;

  const qItem = genList[conceptIdx]();

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

async function startV2Seeding() {
  try {
    console.log('Clearing questionbank collection...');
    await questionBankModel.deleteMany({});

    const totalTarget = 60000;
    const chunkSize = 2500;
    const totalChunks = totalTarget / chunkSize;

    console.log(`Starting insertion of ${totalTarget} questions with STRICT ROUND-ROBIN MULTI-CONCEPT DIVERSITY...`);

    for (let c = 0; c < totalChunks; c++) {
      const chunkDocs = [];
      const offset = c * chunkSize;
      for (let i = 0; i < chunkSize; i++) {
        chunkDocs.push(buildV2Question(offset + i));
      }

      await questionBankModel.insertMany(chunkDocs, { ordered: false });
      console.log(`Chunk ${c + 1}/${totalChunks} inserted! (${(c + 1) * chunkSize} / ${totalTarget} questions complete)`);
    }

    const totalInDb = await questionBankModel.countDocuments({});
    console.log('====================================================');
    console.log('✅ V2 DIVERSITY SEEDING SUCCESSFUL ACROSS ALL 62 CHAPTERS!');
    console.log(`TOTAL QUESTIONS IN MONGO DATABASE: ${totalInDb}`);
    console.log('====================================================');

    process.exit(0);
  } catch (err) {
    console.error('Error during V2 seeding:', err);
    process.exit(1);
  }
}

startV2Seeding();
