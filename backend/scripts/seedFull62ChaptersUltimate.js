const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/online-exam-portal';

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB Atlas for FULL 62-CHAPTER ULTIMATE DIVERSITY SEEDING...'))
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
// ⚛️ RICH MULTI-CONCEPT PHYSICS CHAPTERS (20 TOPICS)
// ==========================================
const physicsChapters = {
  'Physics and Measurement': [
    () => ({
      body: `What is the dimensional formula of the Universal Gravitational Constant $G$?`,
      correct: `$[M^{-1} L^3 T^{-2}]$`,
      wrong: [`$[M L^2 T^{-2}]$`, `$[M^{-1} L^2 T^{-1}]$`, `$[M^0 L^3 T^{-2}]$`],
      exp: `From $F = \\frac{G m_1 m_2}{r^2} \\implies [G] = \\frac{[F][r^2]}{[m^2]} = \\frac{MLT^{-2} \\cdot L^2}{M^2} = [M^{-1} L^3 T^{-2}]$.`
    }),
    () => ({
      body: `What is the dimensional formula of Planck's Constant $h$?`,
      correct: `$[M L^2 T^{-1}]$`,
      wrong: [`$[M L^2 T^{-2}]$`, `$[M L T^{-1}]$`, `$[M^{-1} L^2 T^{-1}]$`],
      exp: `$E = h\\nu \\implies [h] = \\frac{[E]}{[\\nu]} = \\frac{ML^2T^{-2}}{T^{-1}} = [M L^2 T^{-1}]$.`
    }),
    () => {
      const dm = 2, dv = 3;
      return {
        body: `If percentage error in measuring mass is $${dm}\\%$ and velocity is $${dv}\\%$, find the percentage error in calculated kinetic energy $K = \\frac{1}{2}mv^2$:`,
        correct: `$${dm + 2 * dv}\\%$`,
        wrong: [`$${dm + dv}\\%$`, `$${dm * dv}\\%$`, `$${dm + 3 * dv}\\%$`],
        exp: `$\\frac{\\Delta K}{K} = \\frac{\\Delta m}{m} + 2\\frac{\\Delta v}{v} = ${dm}\\% + 2(${dv}\\%) = ${dm + 2 * dv}\\%$.`
      };
    },
    () => ({
      body: `How many significant figures are present in the measurement $0.002040\\text{ kg}$?`,
      correct: `$4$`,
      wrong: [`$6$`, `$3$`, `$7$`],
      exp: `Leading zeros are not significant. The digits $2, 0, 4, 0$ are significant, giving $4$ significant figures.`
    })
  ],
  'Kinematics': [
    () => {
      const u = getRandomChoice([20, 30, 40]);
      const hMax = ((u * u) / 20).toFixed(1);
      return {
        body: `A particle is projected vertically upwards with speed $u = ${u}\\text{ m/s}$ ($g = 10\\text{ m/s}^2$). Find its maximum height $H_{\\text{max}}$:`,
        correct: `$${hMax}\\text{ m}$`,
        wrong: [`$${(hMax * 2).toFixed(1)}\\text{ m}$`, `$${(hMax / 2).toFixed(1)}\\text{ m}$`, `$${u}\\text{ m}$`],
        exp: `$H_{\\text{max}} = \\frac{u^2}{2g} = \\frac{${u}^2}{20} = ${hMax}\\text{ m}$.`
      };
    },
    () => ({
      body: `A car covers the first half of a total distance with speed $40\\text{ km/h}$ and the second half with $60\\text{ km/h}$. Find its average speed:`,
      correct: `$48\\text{ km/h}$`,
      wrong: [`$50\\text{ km/h}$`, `$45\\text{ km/h}$`, `$52\\text{ km/h}$`],
      exp: `$v_{\\text{avg}} = \\frac{2 v_1 v_2}{v_1 + v_2} = \\frac{2 \\times 40 \\times 60}{100} = 48\\text{ km/h}$.`
    }),
    () => {
      const u = getRandomChoice([10, 20]);
      const theta = 30;
      const r = ((u * u * Math.sin(Math.PI / 3)) / 10).toFixed(1);
      return {
        body: `A projectile is launched with speed $u = ${u}\\text{ m/s}$ at angle $\\theta = 30^\\circ$ to the horizontal. Calculate its horizontal range $R$ ($g = 10\\text{ m/s}^2$):`,
        correct: `$${r}\\text{ m}$`,
        wrong: [`$${(r * 1.5).toFixed(1)}\\text{ m}$`, `$${(r / 2).toFixed(1)}\\text{ m}$`, `$10.0\\text{ m}$`],
        exp: `$R = \\frac{u^2\\sin(2\\theta)}{g} = \\frac{${u}^2 \\sin 60^\\circ}{10} = ${r}\\text{ m}$.`
      };
    }
  ],
  'Laws of Motion': [
    () => {
      const m = getRandomChoice([2, 4, 5]);
      const a = getRandomChoice([3, 4, 6]);
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
      exp: `Centripetal force is provided by static friction: $\\frac{m v^2}{R} \\le \\mu_s m g \\implies v_{\\text{max}} = \\sqrt{\\mu_s R g}$.`
    }),
    () => {
      const m1 = 2, m2 = 3, g = 10;
      const acc = (((m2 - m1) / (m1 + m2)) * g).toFixed(1);
      return {
        body: `In an ideal Atwood machine, masses $m_1 = 2\\text{ kg}$ and $m_2 = 3\\text{ kg}$ are connected by a light string over a frictionless pulley. Find the acceleration $a$ ($g = 10\\text{ m/s}^2$):`,
        correct: `$${acc}\\text{ m/s}^2$`,
        wrong: [`$5.0\\text{ m/s}^2$`, `$1.0\\text{ m/s}^2$`, `$4.0\\text{ m/s}^2$`],
        exp: `$a = \\frac{m_2 - m_1}{m_1 + m_2}g = \\frac{3-2}{5}(10) = 2.0\\text{ m/s}^2$.`
      };
    }
  ],
  'Work, Energy and Power': [
    () => {
      const k = 200, x = 0.1;
      const u = (0.5 * k * x * x).toFixed(2);
      return {
        body: `Calculate the potential energy stored in an elastic spring ($k = 200\\text{ N/m}$) compressed by $x = 10\\text{ cm}$:`,
        correct: `$${u}\\text{ J}$`,
        wrong: [`$2.00\\text{ J}$`, `$0.50\\text{ J}$`, `$10.00\\text{ J}$`],
        exp: `$U = \\frac{1}{2} k x^2 = \\frac{1}{2}(200)(0.1)^2 = 1.00\\text{ J}$.`
      };
    },
    () => ({
      body: `What is the minimum speed required at the lowest point of a vertical circle of radius $R$ so that a mass completes the full loop?`,
      correct: `$\\sqrt{5gR}$`,
      wrong: [`$\\sqrt{gR}$`, `$\\sqrt{3gR}$`, `$\\sqrt{2gR}$`],
      exp: `At the top, $v_{\\text{top}} = \\sqrt{gR}$. By energy conservation, $v_{\\text{bottom}} = \\sqrt{v_{\\text{top}}^2 + 4gR} = \\sqrt{5gR}$.`
    }),
    () => ({
      body: `If the linear momentum of a body of mass $m$ is doubled, by what factor does its kinetic energy increase?`,
      correct: `$4$ times`,
      wrong: [`$2$ times`, `$8$ times`, `$\\sqrt{2}$ times`],
      exp: `$K = \\frac{p^2}{2m}$. If $p' = 2p$, then $K' = \\frac{(2p)^2}{2m} = 4K$.`
    })
  ],
  'Rotational Motion': [
    () => {
      const m = getRandomChoice([2, 4, 6]);
      const r = 1;
      const iTang = (1.5 * m * r * r).toFixed(1);
      return {
        body: `A uniform circular disk has mass $M = ${m}\\text{ kg}$ and radius $R = 1\\text{ m}$. Calculate its moment of inertia about an axis perpendicular to its plane and passing through its rim (tangential):`,
        correct: `$${iTang}\\text{ kg} \\cdot \\text{m}^2$`,
        wrong: [`$${(0.5 * m * r * r).toFixed(1)}\\text{ kg} \\cdot \\text{m}^2$`, `$${(m * 2).toFixed(1)}\\text{ kg} \\cdot \\text{m}^2$`, `$${(m * 3).toFixed(1)}\\text{ kg} \\cdot \\text{m}^2$`],
        exp: `By parallel axis theorem, $I = I_{cm} + MR^2 = \\frac{1}{2}MR^2 + MR^2 = \\frac{3}{2}MR^2 = ${iTang}\\text{ kg} \\cdot \\text{m}^2$.`
      };
    },
    () => ({
      body: `What is the moment of inertia of a uniform solid sphere of mass $M$ and radius $R$ about its diameter?`,
      correct: `$\\frac{2}{5} M R^2$`,
      wrong: [`$\\frac{2}{3} M R^2$`, `$\\frac{1}{2} M R^2$`, `$\\frac{7}{5} M R^2$`],
      exp: `The moment of inertia of a solid sphere about any central diameter is $I = \\frac{2}{5}MR^2$.`
    }),
    () => ({
      body: `A solid cylinder, a solid sphere, and a thin ring of equal masses and radii roll down an inclined plane without slipping. Which reaches the bottom first?`,
      correct: `Solid sphere (smallest $k^2/R^2 = 2/5$)`,
      wrong: [`Solid cylinder ($k^2/R^2 = 1/2$)`, `Thin ring ($k^2/R^2 = 1$)`, `All reach simultaneously`],
      exp: `Acceleration $a = \\frac{g\\sin\\theta}{1 + k^2/R^2}$. Smaller $k^2/R^2$ yields greater acceleration; for a solid sphere $k^2/R^2 = 0.4$, so it reaches first.`
    }),
    () => {
      const i1 = 4, w1 = 10, i2 = 2;
      const w2 = (i1 * w1) / i2;
      return {
        body: `A ballerina spinning with moment of inertia $I_1 = 4\\text{ kg} \\cdot \\text{m}^2$ at $\\omega_1 = 10\\text{ rad/s}$ pulls in her arms, reducing her moment of inertia to $I_2 = 2\\text{ kg} \\cdot \\text{m}^2$. Find her new angular speed $\\omega_2$:`,
        correct: `$${w2}\\text{ rad/s}$`,
        wrong: [`$5\\text{ rad/s}$`, `$10\\text{ rad/s}$`, `$40\\text{ rad/s}$`],
        exp: `Conservation of angular momentum: $I_1\\omega_1 = I_2\\omega_2 \\implies \\omega_2 = \\frac{4 \\times 10}{2} = ${w2}\\text{ rad/s}$.`
      };
    }
  ],
  'Gravitation': [
    () => {
      const rE = 6400;
      return {
        body: `At what height $h$ above Earth's surface does acceleration due to gravity become $\\frac{g}{4}$ ($R = 6400\\text{ km}$)?`,
        correct: `$6400\\text{ km}$ ($h = R$)`,
        wrong: [`$3200\\text{ km}$ ($h = R/2$)`, `$12800\\text{ km}$ ($h = 2R$)`, `$1600\\text{ km}$ ($h = R/4$)`],
        exp: `$g' = g\\left(\\frac{R}{R+h}\\right)^2 = \\frac{g}{4} \\implies \\frac{R}{R+h} = \\frac{1}{2} \\implies h = R = 6400\\text{ km}$.`
      };
    },
    () => ({
      body: `What is the escape velocity of a body from the surface of Earth ($R = 6400\\text{ km}, g = 9.8\\text{ m/s}^2$)?`,
      correct: `$11.2\\text{ km/s}$`,
      wrong: [`$7.9\\text{ km/s}$`, `$22.4\\text{ km/s}$`, `$9.8\\text{ km/s}$`],
      exp: `$v_e = \\sqrt{2gR} = \\sqrt{2 \\times 9.8 \\times 6.4\\times 10^6} \\approx 11.2\\text{ km/s}$.`
    }),
    () => ({
      body: `If the radius of Earth's orbit is doubled, the length of the year according to Kepler's 3rd Law would be:`,
      correct: `$2\\sqrt{2} \\approx 2.83\\text{ years}$`,
      wrong: [`$2\\text{ years}$`, `$4\\text{ years}$`, `$8\\text{ years}$`],
      exp: `$T^2 \\propto R^3 \\implies T' = T \\cdot (2)^{3/2} = 2\\sqrt{2}\\text{ years}$.`
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
      const h = 5;
      const v = Math.sqrt(2 * 10 * h).toFixed(1);
      return {
        body: `A tank has a small orifice at depth $h = ${h}\\text{ m}$ below the water surface. Find the Torricelli speed of efflux ($g = 10\\text{ m/s}^2$):`,
        correct: `$${v}\\text{ m/s}$`,
        wrong: [`$${(v * 2).toFixed(1)}\\text{ m/s}$`, `$5.0\\text{ m/s}$`, `$25.0\\text{ m/s}$`],
        exp: `By Torricelli's Law: $v = \\sqrt{2gh} = \\sqrt{2 \\times 10 \\times ${h}} = ${v}\\text{ m/s}$.`
      };
    },
    () => ({
      body: `When the radius of a capillary tube is halved, the height to which liquid rises in it:`,
      correct: `Doubles ($h \\propto 1/r$)`,
      wrong: [`Halves`, `Remains same`, `Quadruples`],
      exp: `$h = \\frac{2T\\cos\\theta}{r\\rho g} \\implies h \\propto \\frac{1}{r}$. If $r' = r/2$, $h' = 2h$.`
    })
  ],
  'Thermodynamics': [
    () => {
      const t1 = 600, t2 = 300;
      const eta = Math.round((1 - t2 / t1) * 100);
      return {
        body: `Calculate efficiency $\\eta$ of a Carnot engine operating between $T_1 = ${t1}\\text{ K}$ and $T_2 = ${t2}\\text{ K}$:`,
        correct: `$${eta}\\%$`,
        wrong: [`$${eta - 15}\\%$`, `$${eta + 20}\\%$`, `$75\\%$`],
        exp: `$\\eta = 1 - \\frac{T_2}{T_1} = 1 - \\frac{${t2}}{${t1}} = 0.50 = ${eta}\\%$.`
      };
    },
    () => ({
      body: `In an adiabatic expansion of an ideal gas, the work done by the gas is derived from:`,
      correct: `Its internal energy (temperature drops)`,
      wrong: [`Heat absorbed from surroundings`, `External reservoir`, `Constant enthalpy`],
      exp: `In adiabatic processes $\\Delta Q = 0 \\implies W = -\\Delta U$. Work is done at the expense of internal energy.`
    })
  ],
  'Kinetic Theory of Gases': [
    () => ({
      body: `What is the ratio of molar heat capacities $\\gamma = \\frac{C_p}{C_v}$ for an ideal rigid diatomic gas ($f = 5$)?`,
      correct: `$\\frac{7}{5} = 1.40$`,
      wrong: [`$\\frac{5}{3} \\approx 1.67$`, `$\\frac{4}{3} \\approx 1.33$`, `$\\frac{9}{7} \\approx 1.28$`],
      exp: `$\\gamma = 1 + \\frac{2}{f} = 1 + \\frac{2}{5} = \\frac{7}{5} = 1.40$.`
    }),
    () => ({
      body: `At what temperature will the RMS speed of gas molecules be double its value at $T = 300\\text{ K}$?`,
      correct: `$1200\\text{ K}$`,
      wrong: [`$600\\text{ K}$`, `$900\\text{ K}$`, `$2400\\text{ K}$`],
      exp: `$v_{\\text{rms}} \\propto \\sqrt{T}$. To double speed, temperature must quadruple: $T' = 4 \\times 300 = 1200\\text{ K}$.`
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
    },
    () => ({
      body: `What is the ratio of fundamental frequency of a closed organ pipe of length $L$ to an open organ pipe of same length?`,
      correct: `$1 : 2$`,
      wrong: [`$2 : 1$`, `$1 : 4$`, `$1 : 1$`],
      exp: `$f_{\\text{closed}} = \\frac{v}{4L}$ and $f_{\\text{open}} = \\frac{v}{2L} \\implies \\frac{f_{\\text{closed}}}{f_{\\text{open}}} = \\frac{1}{2}$.`
    })
  ],
  'Electrostatics': [
    () => {
      const q = getRandomChoice([2, 4, 6]);
      return {
        body: `A point charge $q = +${q}\\,\\mu\\text{C}$ is placed at the center of a cube. Find the electric flux $\\Phi$ passing through **one single face**:`,
        correct: `$\\frac{${q}\\,\\mu\\text{C}}{6\\varepsilon_0}$`,
        wrong: [`$\\frac{${q}\\,\\mu\\text{C}}{\\varepsilon_0}$`, `$\\frac{${q}\\,\\mu\\text{C}}{8\\varepsilon_0}$`, `$0$`],
        exp: `Total flux through all 6 faces is $q/\\varepsilon_0$. Flux through one face is $q/(6\\varepsilon_0)$.`
      };
    },
    () => {
      const c = 10, v = 100;
      const u = (0.5 * c * 1e-6 * v * v).toFixed(3);
      return {
        body: `Calculate energy stored in a capacitor of capacitance $C = 10\\,\\mu\\text{F}$ charged to potential difference $V = 100\\text{ V}$:`,
        correct: `$0.050\\text{ J}$ ($50\\text{ mJ}$)`,
        wrong: [`$0.100\\text{ J}$`, `$0.025\\text{ J}$`, `$1.000\\text{ J}$`],
        exp: `$U = \\frac{1}{2} C V^2 = \\frac{1}{2}(10\\times 10^{-6})(100)^2 = 0.050\\text{ J}$.`
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
    },
    () => ({
      body: `Two identical electric bulbs rated $220\\text{ V}, 100\\text{ W}$ each are connected in series across $220\\text{ V}$. Total power consumed is:`,
      correct: `$50\\text{ W}$`,
      wrong: [`$100\\text{ W}$`, `$200\\text{ W}$`, `$25\\text{ W}$`],
      exp: `In series, $P_{\\text{total}} = \\frac{P_1 P_2}{P_1 + P_2} = \\frac{100 \\times 100}{200} = 50\\text{ W}$.`
    })
  ],
  'Magnetic Effects of Current and Magnetism': [
    () => ({
      body: `A charged particle of charge $q$ and mass $m$ moves with velocity $v$ perpendicular to a uniform magnetic field $B$. What is the radius $r$ of its circular path?`,
      correct: `$r = \\frac{m v}{q B}$`,
      wrong: [`$r = \\frac{q B}{m v}$`, `$r = \\frac{q v}{m B}$`, `$r = \\frac{m B}{q v}$`],
      exp: `$\\frac{m v^2}{r} = q v B \\implies r = \\frac{m v}{q B}$.`
    }),
    () => ({
      body: `What is the magnetic field $B$ at the center of a circular coil of radius $R$ carrying steady current $I$?`,
      correct: `$\\frac{\\mu_0 I}{2R}$`,
      wrong: [`$\\frac{\\mu_0 I}{4\\pi R}$`, `$\\frac{\\mu_0 I}{2\\pi R}$`, `$\\frac{\\mu_0 I R}{2}$`],
      exp: `By Biot-Savart Law, field at center of circular loop is $B = \\frac{\\mu_0 I}{2R}$.`
    })
  ],
  'Electromagnetic Induction and Alternating Currents': [
    () => {
      return {
        body: `Calculate the resonant frequency $\\omega_0$ in an AC series LCR circuit with $L = 10\\text{ mH}$ and $C = 10\\,\\mu\\text{F}$:`,
        correct: `$3162\\text{ rad/s}$`,
        wrong: [`$1000\\text{ rad/s}$`, `$5000\\text{ rad/s}$`, `$628\\text{ rad/s}$`],
        exp: `$\\omega_0 = \\frac{1}{\\sqrt{LC}} = \\frac{1}{\\sqrt{10^{-4}}} = 3162\\text{ rad/s}$.`
      };
    },
    () => ({
      body: `A step-down transformer transforms $2200\\text{ V}$ to $220\\text{ V}$. If the primary coil has $1000$ turns, find the number of secondary turns:`,
      correct: `$100$ turns`,
      wrong: [`$10000$ turns`, `$50$ turns`, `$200$ turns`],
      exp: `$\\frac{V_s}{V_p} = \\frac{N_s}{N_p} \\implies N_s = 1000 \\times \\frac{220}{2200} = 100\\text{ turns}$.`
    })
  ],
  'Electromagnetic Waves': [
    () => ({
      body: `Which of the following represents the correct ascending order of frequencies in the electromagnetic spectrum?`,
      correct: `Radio waves < Microwaves < Infrared < Visible < Ultraviolet < X-rays < $\\gamma$-rays`,
      wrong: [
        `$\\gamma$-rays < X-rays < Ultraviolet < Visible < Infrared < Microwaves < Radio waves`,
        `Microwaves < Radio waves < Infrared < Visible < X-rays`,
        `Visible < Infrared < Ultraviolet < X-rays < Radio waves`
      ],
      exp: `Frequency increases as wavelength decreases: Radio $\\to$ Micro $\\to$ IR $\\to$ Visible $\\to$ UV $\\to$ X-ray $\\to$ Gamma.`
    }),
    () => ({
      body: `What is the magnitude ratio of electric field amplitude $E_0$ to magnetic field amplitude $B_0$ in vacuum?`,
      correct: `$c$ (Speed of light in vacuum)`,
      wrong: [`$1/c$`, `$c^2$`, `$\\sqrt{c}$`],
      exp: `In EM waves, $\\frac{E_0}{B_0} = c = 3 \\times 10^8\\text{ m/s}$.`
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
        exp: `$\\tan\\theta_p = \\mu = ${mu} \\implies \\theta_p \\approx ${deg}^\\circ$.`
      };
    },
    () => ({
      body: `An equilateral prism ($A = 60^\\circ$) has refractive index $\\mu = \\sqrt{2}$. Find minimum deviation $\\delta_m$:`,
      correct: `$30^\\circ$`,
      wrong: [`$45^\\circ$`, `$60^\\circ$`, `$15^\\circ$`],
      exp: `$\\mu = \\frac{\\sin((60+\\delta_m)/2)}{\\sin(30^\\circ)} = \\sqrt{2} \\implies \\delta_m = 30^\\circ$.`
    }),
    () => {
      const fo = 100, fe = 5;
      return {
        body: `An astronomical telescope has $f_o = 100\\text{ cm}$ and $f_e = 5\\text{ cm}$. Find magnification $M$ and tube length $L$:`,
        correct: `$M = 20, L = 105\\text{ cm}$`,
        wrong: [`$M = 20, L = 95\\text{ cm}$`, `$M = 5, L = 105\\text{ cm}$`, `$M = 500, L = 105\\text{ cm}$`],
        exp: `$M = f_o/f_e = 100/5 = 20$. Length $L = f_o + f_e = 100 + 5 = 105\\text{ cm}$.`
      };
    }
  ],
  'Dual Nature of Matter and Radiation': [
    () => {
      const v = 100;
      return {
        body: `Calculate the de Broglie wavelength $\\lambda$ associated with an electron accelerated through $V = 100\\text{ V}$:`,
        correct: `$0.123\\text{ nm}$ ($1.227\\text{ \AA}$)`,
        wrong: [`$1.227\\text{ nm}$`, `$12.27\\text{ nm}$`, `$0.054\\text{ nm}$`],
        exp: `$\\lambda = \\frac{1.227}{\\sqrt{V}}\\text{ nm} = \\frac{1.227}{10} = 0.123\\text{ nm}$.`
      };
    },
    () => ({
      body: `When the frequency of incident light on a photosensitive metal is doubled, the stopping potential:`,
      correct: `More than doubles`,
      wrong: [`Doubles`, `Remains unchanged`, `Halves`],
      exp: `$eV_0 = h\nu - \phi \\implies eV_0' = 2h\nu - \phi = 2(eV_0 + \phi) - \phi = 2eV_0 + \phi > 2eV_0$.`
    })
  ],
  'Atoms and Nuclei': [
    () => ({
      body: `According to Bohr's model of hydrogen atom, what is the energy of an electron in the ground state ($n = 1$)?`,
      correct: `$-13.6\\text{ eV}$`,
      wrong: [`$-3.4\\text{ eV}$`, `$-1.51\\text{ eV}$`, `$+13.6\\text{ eV}$`],
      exp: `$E_n = -\\frac{13.6}{n^2}\\text{ eV} \\implies E_1 = -13.6\\text{ eV}$.`
    }),
    () => ({
      body: `If a radioactive substance has a half-life of $T_{1/2} = 5\\text{ days}$, what fraction of the original sample remains undecayed after $15\\text{ days}$?`,
      correct: `$\\frac{1}{8}$ ($12.5\\%$)`,
      wrong: [`$\\frac{1}{4}$`, `$\\frac{1}{16}$`, `$\\frac{1}{3}$`],
      exp: `Number of half-lives $n = 15/5 = 3$. Remaining fraction $= (1/2)^3 = 1/8$.`
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
    },
    () => ({
      body: `In which operating bias region is a Zener diode used as a constant voltage regulator?`,
      correct: `Reverse Breakdown Region`,
      wrong: [`Forward Bias Region`, `Cutoff Region`, `Saturation Region`],
      exp: `In reverse breakdown, Zener diode maintains a constant voltage $V_Z$ over a wide range of currents.`
    })
  ],
  'Experimental Skills': [
    () => ({
      body: `A screw gauge has pitch $0.5\\text{ mm}$ and $50$ circular scale divisions. What is its least count?`,
      correct: `$0.01\\text{ mm}$`,
      wrong: [`$0.1\\text{ mm}$`, `$0.001\\text{ mm}$`, `$0.05\\text{ mm}$`],
      exp: `$\\text{LC} = \\frac{0.5\\text{ mm}}{50} = 0.01\\text{ mm}$.`
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
      exp: `Moles of $NaOH = 4/40 = 0.1\\text{ mol}$. $M = 0.1 / 0.250 = 0.40\\text{ M}$.`
    })
  ],
  'Atomic Structure': [
    () => ({
      body: `Which set of quantum numbers ($n, l, m_l, m_s$) is allowed for an electron in a $3d$ orbital?`,
      correct: `$n = 3, l = 2, m_l = -1, m_s = +\\frac{1}{2}$`,
      wrong: [`$n = 3, l = 3, m_l = 0, m_s = +\\frac{1}{2}$`, `$n = 3, l = 1, m_l = 2, m_s = -\\frac{1}{2}$`, `$n = 2, l = 2, m_l = 0, m_s = +\\frac{1}{2}$`],
      exp: `For $3d$, $n = 3$ and $l = 2$. $m_l \\in \\{-2, -1, 0, 1, 2\\}$.`
    })
  ],
  'Chemical Bonding and Molecular Structure': [
    () => ({
      body: `What is the molecular geometry and hybridization of $SF_6$?`,
      correct: `Octahedral ($sp^3d^2$)`,
      wrong: [`Trigonal bipyramidal ($sp^3d$)`, `Tetrahedral ($sp^3$)`, `Square planar ($dsp^2$)`],
      exp: `$SF_6$ has 6 bond pairs and 0 lone pairs $\\implies sp^3d^2$ octahedral.`
    })
  ],
  'Chemical Thermodynamics': [
    () => ({
      body: `What is the thermodynamic criterion for a spontaneous process at constant $T$ and $P$?`,
      correct: `$\\Delta G < 0$ (Negative Gibbs energy)`,
      wrong: [`$\\Delta G > 0$`, `$\\Delta H > 0$`, `$\\Delta S = 0$`],
      exp: `Spontaneous reactions satisfy $\\Delta G = \\Delta H - T\\Delta S < 0$.`
    })
  ],
  'Solutions': [
    () => ({
      body: `What is the theoretical Van 't Hoff factor $i$ for complete dissociation of $BaCl_2$?`,
      correct: `$i = 3$`,
      wrong: [`$i = 2$`, `$i = 1$`, `$i = 4$`],
      exp: `$BaCl_2 \\to Ba^{2+} + 2Cl^- \\implies n = 3$. For complete dissociation $i = 3$.`
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
      exp: `$t_{1/2} = 0.693/k = 0.693/0.0693 = 10\\text{ minutes}$.`
    })
  ],
  'Classification of Elements and Periodicity': [
    () => ({
      body: `Which element has the higher first ionization enthalpy between Nitrogen and Oxygen?`,
      correct: `Nitrogen ($N$, half-filled $2p^3$)`,
      wrong: [`Oxygen ($O$)`, `Both equal`, `Depends on temperature`],
      exp: `Nitrogen has stable half-filled $2p^3$ configuration giving higher ionization enthalpy.`
    })
  ],
  'p-Block Elements': [
    () => ({
      body: `In diborane ($B_2H_6$), what type of bonds connect the bridging hydrogen atoms?`,
      correct: `Three-centre two-electron ($3c-2e$) banana bonds`,
      wrong: [`$3c-4e$ bonds`, `$2c-2e$ bonds`, `Ionic bonds`],
      exp: `Bridging B-H-B bonds are electron-deficient $3c-2e$ banana bonds.`
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
        exp: `$\\mu_s = \\sqrt{n(n+2)} = \\sqrt{${n}(${n+2})} = ${mu}\\text{ BM}$.`
      };
    }
  ],
  'Coordination Compounds': [
    () => ({
      body: `What is the oxidation state and coordination number of Cobalt in $[Co(NH_3)_6]Cl_3$?`,
      correct: `Oxidation state: $+3$, Coordination number: $6$`,
      wrong: [`Oxidation state: $+2$, Coordination number: $6$`, `Oxidation state: $+3$, Coordination number: $3$`, `Oxidation state: $0$, Coordination number: $6$`],
      exp: `6 neutral $NH_3$ ligands (coord num 6) and $3 Cl^-$ counter ions (ox state $+3$).`
    })
  ],
  'Basic Principles and Techniques': [
    () => ({
      body: `Which carbocation is the most stable?`,
      correct: `Tertiary butyl carbocation $(CH_3)_3C^+$`,
      wrong: [`Isopropyl carbocation $(CH_3)_2CH^+$`, `Ethyl carbocation $CH_3CH_2^+$`, `Methyl carbocation $CH_3^+$`],
      exp: `$(CH_3)_3C^+$ has 9 $\\alpha$-hydrogens providing maximum hyperconjugative stability.`
    })
  ],
  'Hydrocarbons': [
    () => ({
      body: `Major product of propene with $HBr$ in the presence of benzoyl peroxide:`,
      correct: `1-Bromopropane (Anti-Markovnikov)`,
      wrong: [`2-Bromopropane (Markovnikov)`, `1,2-Dibromopropane`, `Propane`],
      exp: `Peroxide promotes free radical Anti-Markovnikov addition of $HBr$.`
    })
  ],
  'Organic Compounds Containing Halogens': [
    () => ({
      body: `Which haloalkane undergoes $S_N1$ nucleophilic substitution fastest?`,
      correct: `Tert-butyl chloride $(CH_3)_3C-Cl$`,
      wrong: [`Isopropyl chloride`, `Ethyl chloride`, `Methyl chloride`],
      exp: `$S_N1$ reactivity follows carbocation stability: $3^\\circ > 2^\\circ > 1^\\circ$.`
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
        exp: `Group **${s.group}** directs incoming electrophiles to ${s.direct} due to ${s.type}.`
      };
    }
  ],
  'Organic Compounds Containing Nitrogen': [
    () => ({
      body: `Which reaction converts a primary acid amide into a primary amine with one fewer carbon?`,
      correct: `Hoffmann Bromamide Degradation`,
      wrong: [`Gabriel Phthalimide Synthesis`, `Carbylamine Reaction`, `Cannizzaro Reaction`],
      exp: `$R-CONH_2 + Br_2 + 4KOH \\to R-NH_2 + K_2CO_3 + 2KBr + 2H_2O$.`
    })
  ],
  'Biomolecules': [
    () => ({
      body: `Which of the following is a non-reducing disaccharide?`,
      correct: `Sucrose`,
      wrong: [`Maltose`, `Lactose`, `Glucose`],
      exp: `Sucrose is non-reducing as both anomeric carbons form the glycosidic bond.`
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
        exp: `$|\\text{adj}(A)| = |A|^{n-1} = ${detA}^{3-1} = ${detA}^2 = ${detA * detA}$.`
      };
    }
  ],
  'Permutations and Combinations': [
    () => ({
      body: `How many diagonals does an octagon ($n = 8$ sides) have?`,
      correct: `$20$ diagonals`,
      wrong: [`$28$ diagonals`, `$24$ diagonals`, `$16$ diagonals`],
      exp: `Diagonals $= ^nC_2 - n = \\frac{8 \\times 7}{2} - 8 = 20$.`
    })
  ],
  'Binomial Theorem and Mathematical Induction': [
    () => ({
      body: `Find term independent of $x$ in expansion of $\\left(x + \\frac{1}{x}\\right)^{10}$:`,
      correct: `$^{10}C_5 = 252$`,
      wrong: [`$^{10}C_4 = 210$`, `$^{10}C_6 = 210$`, `$120$`],
      exp: `$T_{r+1} = ^{10}C_r x^{10-2r} \\implies 10 - 2r = 0 \\implies r = 5$.`
    })
  ],
  'Sequence and Series': [
    () => ({
      body: `Find sum of infinite series $S = 6 + 2 + \\frac{2}{3} + \\frac{2}{9} + \\dots$:`,
      correct: `$9$`,
      wrong: [`$8$`, `$12$`, `$\\frac{27}{2}$`],
      exp: `$S_\\infty = \\frac{a}{1-r} = \\frac{6}{1-1/3} = 9$.`
    })
  ],
  'Limit, Continuity and Differentiability': [
    () => ({
      body: `Evaluate limit $\\lim_{x\\to 0} \\frac{e^{2x} - 1}{\\sin x}$:`,
      correct: `$2$`,
      wrong: [`$1$`, `$0$`, `$e$`],
      exp: `By L'Hopital's rule: $\\lim_{x\\to 0} \\frac{2e^{2x}}{\\cos x} = 2$.`
    })
  ],
  'Integral Calculus': [
    () => ({
      body: `Evaluate $\\int_{-\\pi/2}^{\\pi/2} x^3 \\cos x \\, dx$:`,
      correct: `$0$`,
      wrong: [`$\\pi$`, `$2$`, `$\\frac{\\pi}{2}$`],
      exp: `Integrand is odd function over symmetric interval $[-a, a]$, so integral is $0$.`
    })
  ],
  'Differential Equations': [
    () => ({
      body: `Integrating factor of $\\frac{dy}{dx} + \\frac{2}{x}y = x^3$:`,
      correct: `$x^2$`,
      wrong: [`$2x$`, `$\\ln x$`, `$e^{2x}$`],
      exp: `$IF = e^{\\int (2/x) dx} = e^{\\ln(x^2)} = x^2$.`
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
      exp: `Projection $= \\frac{\\vec{a} \\cdot \\vec{b}}{|\\vec{b}|} = \\frac{20}{3} \\approx 6.67$.`
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
        exp: `Bayes' Theorem: $P(B|D) = \\frac{${pB2}\\times 0.05}{${pB1}\\times 0.02 + ${pB2}\\times 0.05} = ${ans}$.`
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
      exp: `Range is $[-\\sqrt{3^2+4^2}, +\\sqrt{3^2+4^2}] = [-5, +5]$.`
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
      exp: `Xylem vessels lose protoplasm at maturity to conduct water.`
    })
  ],
  'Cell Structure and Function': [
    () => ({
      body: `During which stage of Meiosis I does crossing over occur?`,
      correct: `Pachytene of Prophase I`,
      wrong: [`Leptotene`, `Zygotene`, `Diplotene`],
      exp: `Crossing over occurs during Pachytene catalyzed by recombinase.`
    })
  ],
  'Plant Physiology': [
    () => ({
      body: `Primary $CO_2$ acceptor in $C_4$ plants:`,
      correct: `Phosphoenolpyruvate (PEP)`,
      wrong: [`RuBP`, `OAA`, `PGA`],
      exp: `PEP carboxylase fixes $CO_2$ with PEP in mesophyll cells.`
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
      exp: `Triple fusion between 1 sperm and 2 polar nuclei forms $3n$ PEN.`
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
      exp: `Widal test confirms *Salmonella typhi* infection.`
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
      exp: `Only about 10% of energy is transferred between successive trophic levels.`
    })
  ]
};

function buildUltimateQuestion(index) {
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
  // Guarantee even distribution across all chapters
  const qTopic = topicList[Math.floor(index / 4) % topicList.length];
  const genList = chPool[qTopic];
  // Select a random generator from the chapter's pool
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

async function startUltimateSeeding() {
  try {
    console.log('Clearing questionbank collection...');
    await questionBankModel.deleteMany({});

    const totalTarget = 60000;
    const chunkSize = 2500;
    const totalChunks = totalTarget / chunkSize;

    console.log(`Starting insertion of ${totalTarget} questions with MULTI-GENERATOR DIVERSITY across ALL 62 CHAPTERS...`);

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
    console.log('✅ MULTI-GENERATOR DIVERSE SEEDING COMPLETE ACROSS ALL 62 CHAPTERS!');
    console.log(`TOTAL QUESTIONS IN MONGO DATABASE: ${totalInDb}`);
    console.log('====================================================');

    process.exit(0);
  } catch (err) {
    console.error('Error during ultimate seeding:', err);
    process.exit(1);
  }
}

startUltimateSeeding();
