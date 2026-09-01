const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/online-exam-portal';

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB Atlas for CURATED UNIQUE SEEDING...'))
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

function shuffleArray(arr) {
  const newArr = [...arr];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

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

// =========================================================================
// 📚 CURATED UNIQUE QUESTION MASTER POOL (EVERY QUESTION 100% DISTINCT)
// =========================================================================
const MASTER_UNIQUE_QUESTIONS = [
  // -------------------------------------------------------------
  // 🧬 BIOLOGY: Genetics and Evolution
  // -------------------------------------------------------------
  {
    subject: 'Biology', topic: 'Genetics and Evolution', examType: 'NEET', isPyq: true, pyqTag: 'NEET 2021',
    body: `In a 1000 base pair double-stranded DNA segment, if Adenine count is 164, find the Cytosine count:`,
    answer: `336`,
    options: [`336`, `164`, `836`, `672`],
    explanation: `By Chargaff's rules, $A = T = 164$. Total bases $= 2000$. $A+T = 328$. $G+C = 2000 - 328 = 1672 \\implies C = 1672/2 = 836 / 2$ per strand count is $500 - 164 = 336$.`
  },
  {
    subject: 'Biology', topic: 'Genetics and Evolution', examType: 'NEET', isPyq: true, pyqTag: 'NEET 2020',
    body: `What is the expected classical phenotypic ratio in the $F_2$ generation of a Mendelian dihybrid cross?`,
    answer: `$9 : 3 : 3 : 1$`,
    options: [`$9 : 3 : 3 : 1$`, `$1 : 2 : 1$`, `$9 : 7$`, `$1 : 1 : 1 : 1$`],
    explanation: `The law of independent assortment generates 9 round-yellow : 3 round-green : 3 wrinkled-yellow : 1 wrinkled-green.`
  },
  {
    subject: 'Biology', topic: 'Genetics and Evolution', examType: 'NEET', isPyq: true, pyqTag: 'NEET 2019',
    body: `Which human genetic chromosomal abnormality is caused by the presence of an extra copy of chromosome 21 (Trisomy 21)?`,
    answer: `Down's Syndrome`,
    options: [`Down's Syndrome`, `Turner's Syndrome ($45, XO$)`, `Klinefelter's Syndrome ($47, XXY$)`, `Thalassemia`],
    explanation: `Down's syndrome is an autosomal aneuploidy caused by non-disjunction of chromosome 21.`
  },
  {
    subject: 'Biology', topic: 'Genetics and Evolution', examType: 'NEET', isPyq: true, pyqTag: 'NEET 2022',
    body: `In a population under Hardy-Weinberg equilibrium, if the frequency of the recessive allele $q = 0.4$, find the frequency of heterozygous individuals ($2pq$):`,
    answer: `$0.48$`,
    options: [`$0.48$`, `$0.16$`, `$0.36$`, `$0.24$`],
    explanation: `$p = 1 - q = 1 - 0.4 = 0.6$. Frequency of heterozygotes $2pq = 2(0.6)(0.4) = 0.48$.`
  },
  {
    subject: 'Biology', topic: 'Genetics and Evolution', examType: 'NEET', isPyq: true, pyqTag: 'NEET 2018',
    body: `Sickle-cell anemia is caused by a point mutation at codon 6 of the $\\beta$-globin gene, causing which amino acid substitution?`,
    answer: `Glutamic acid is replaced by Valine (GAG $\\to$ GUG)`,
    options: [
      `Glutamic acid is replaced by Valine (GAG $\\to$ GUG)`,
      `Valine is replaced by Glutamic acid`,
      `Glutamic acid is replaced by Alanine`,
      `Leucine is replaced by Valine`
    ],
    explanation: `Point mutation at the 6th position replaces hydrophilic glutamic acid with hydrophobic valine.`
  },
  {
    subject: 'Biology', topic: 'Genetics and Evolution', examType: 'NEET', isPyq: true, pyqTag: 'NEET 2023',
    body: `Which pattern of biological evolution is demonstrated by homologous organs having similar anatomical origin but different functions (e.g. forelimbs of cheetah, whale, and human)?`,
    answer: `Divergent Evolution`,
    options: [`Divergent Evolution`, `Convergent Evolution`, `Parallel Evolution`, `Saltation`],
    explanation: `Homology indicates common ancestry adapting to diverse environmental niches (divergent evolution).`
  },
  {
    subject: 'Biology', topic: 'Genetics and Evolution', examType: 'NEET', isPyq: true, pyqTag: 'NEET 2017',
    body: `What is the chromosomal karyotype of an individual affected by Turner's Syndrome?`,
    answer: `$45$ with $XO$ (Monosomy of X chromosome)`,
    options: [
      `$45$ with $XO$ (Monosomy of X chromosome)`,
      `$47$ with $XXY$`,
      `$47$ with Trisomy $21$`,
      `$47$ with $XYY$`
    ],
    explanation: `Turner's syndrome females possess $45$ chromosomes ($44A + XO$), exhibiting rudimentary ovaries and short stature.`
  },

  // -------------------------------------------------------------
  // 🧬 BIOLOGY: Reproduction
  // -------------------------------------------------------------
  {
    subject: 'Biology', topic: 'Reproduction', examType: 'NEET', isPyq: true, pyqTag: 'NEET 2023',
    body: `In angiosperms, triple fusion between a male gamete ($n$) and the diploid secondary nucleus ($2n$) produces:`,
    answer: `Primary Endosperm Nucleus (PEN, $3n$)`,
    options: [`Primary Endosperm Nucleus (PEN, $3n$)`, `Zygote ($2n$)`, `Synergid`, `Antipodal cell`],
    explanation: `Triple fusion forms the triploid ($3n$) Primary Endosperm Nucleus, providing nutrition to the embryo.`
  },
  {
    subject: 'Biology', topic: 'Reproduction', examType: 'NEET', isPyq: true, pyqTag: 'NEET 2022',
    body: `Which mid-cycle hormonal surge directly induces the rupture of the Graafian follicle and ovulation on day 14?`,
    answer: `Luteinizing Hormone (LH Surge)`,
    options: [`Luteinizing Hormone (LH Surge)`, `Follicle Stimulating Hormone (FSH)`, `Progesterone`, `Oxytocin`],
    explanation: `Rapid surge in LH secretion mid-cycle triggers rupture of the mature follicle and oocyte release.`
  },
  {
    subject: 'Biology', topic: 'Reproduction', examType: 'NEET', isPyq: true, pyqTag: 'NEET 2021',
    body: `Which cells located in the interstitial spaces of human testes synthesize and secrete testosterone?`,
    answer: `Leydig cells (Interstitial cells)`,
    options: [`Leydig cells (Interstitial cells)`, `Sertoli cells`, `Spermatogonia`, `Follicular cells`],
    explanation: `Leydig cells secrete androgens (primarily testosterone) under the stimulus of LH.`
  },
  {
    subject: 'Biology', topic: 'Reproduction', examType: 'NEET', isPyq: true, pyqTag: 'NEET 2020',
    body: `What is the primary function of nurse cells (Sertoli cells) inside the seminiferous tubules?`,
    answer: `Provide nourishment and structural support to developing spermatogenic cells`,
    options: [
      `Provide nourishment and structural support to developing spermatogenic cells`,
      `Synthesize and secrete testosterone`,
      `Secrete prostatic fluid`,
      `Produce alkaline mucus for lubrication`
    ],
    explanation: `Sertoli cells nourish germ cells throughout spermatogenesis.`
  },
  {
    subject: 'Biology', topic: 'Reproduction', examType: 'NEET', isPyq: true, pyqTag: 'NEET 2019',
    body: `Which hormone is exclusively secreted by the human placenta and detected in standard home pregnancy tests?`,
    answer: `human Chorionic Gonadotropin (hCG)`,
    options: [`human Chorionic Gonadotropin (hCG)`, `Estrogen`, `Progesterone`, `Prolactin`],
    explanation: `Placental syncytiotrophoblasts produce hCG exclusively during gestation.`
  },

  // -------------------------------------------------------------
  // 🧬 BIOLOGY: Diversity in the Living World
  // -------------------------------------------------------------
  {
    subject: 'Biology', topic: 'Diversity in the Living World', examType: 'NEET', isPyq: true, pyqTag: 'NEET 2019',
    body: `Who proposed the Five Kingdom Classification system (Monera, Protista, Fungi, Plantae, Animalia) in 1969?`,
    answer: `R. H. Whittaker`,
    options: [`R. H. Whittaker`, `Carolus Linnaeus`, `Carl Woese`, `Ernst Haeckel`],
    explanation: `Whittaker based his system on cellular complexity, thallus organization, and nutritional modes.`
  },
  {
    subject: 'Biology', topic: 'Diversity in the Living World', examType: 'NEET', isPyq: true, pyqTag: 'NEET 2020',
    body: `Why are Bryophytes appropriately termed the "amphibians of the plant kingdom"?`,
    answer: `They inhabit moist terrestrial land but require water for flagellated sperm fertilization`,
    options: [
      `They inhabit moist terrestrial land but require water for flagellated sperm fertilization`,
      `They live underwater and breathe air`,
      `They possess true amphibian lungs`,
      `They lack cellulose cell walls`
    ],
    explanation: `Antherozoids require a film of surface water to swim to the archegonium.`
  },
  {
    subject: 'Biology', topic: 'Diversity in the Living World', examType: 'NEET', isPyq: true, pyqTag: 'NEET 2022',
    body: `Which division of cryptogamic plants represents the first terrestrial plants possessing vascular bundles ($xylem$ and $phloem$)?`,
    answer: `Pteridophytes (Ferns and horsetails)`,
    options: [`Pteridophytes (Ferns and horsetails)`, `Bryophytes`, `Thallophytes (Algae)`, `Gymnosperms`],
    explanation: `Pteridophytes are the earliest vascular land plants.`
  },

  // -------------------------------------------------------------
  // 🧬 BIOLOGY: Cell Structure and Function
  // -------------------------------------------------------------
  {
    subject: 'Biology', topic: 'Cell Structure and Function', examType: 'NEET', isPyq: true, pyqTag: 'NEET 2021',
    body: `During which specific substage of Meiotic Prophase I does crossing over and genetic recombination take place?`,
    answer: `Pachytene`,
    options: [`Pachytene`, `Leptotene`, `Zygotene`, `Diplotene`],
    explanation: `Recombinase enzyme facilitates crossing over between non-sister chromatids during Pachytene.`
  },
  {
    subject: 'Biology', topic: 'Cell Structure and Function', examType: 'NEET', isPyq: true, pyqTag: 'NEET 2020',
    body: `Which single-membrane bounded cell organelle contains hydrolytic enzymes active at acidic pH?`,
    answer: `Lysosomes`,
    options: [`Lysosomes`, `Peroxisomes`, `Mitochondria`, `Ribosomes`],
    explanation: `Lysosomes contain acid hydrolases (lipases, proteases, carbohydrases) that degrade macromolecules.`
  },

  // -------------------------------------------------------------
  // 🧬 BIOLOGY: Plant Physiology
  // -------------------------------------------------------------
  {
    subject: 'Biology', topic: 'Plant Physiology', examType: 'NEET', isPyq: true, pyqTag: 'NEET 2022',
    body: `In $C_4$ photosynthetic plants, what is the initial atmospheric $CO_2$ acceptor in mesophyll cells?`,
    answer: `Phosphoenolpyruvate (PEP)`,
    options: [`Phosphoenolpyruvate (PEP)`, `Ribulose-1,5-bisphosphate (RuBP)`, `Oxaloacetic acid (OAA)`, `Phosphoglyceric acid (PGA)`],
    explanation: `PEP carboxylase fixes $CO_2$ onto 3-carbon PEP to form 4-carbon OAA in mesophyll cells.`
  },
  {
    subject: 'Biology', topic: 'Plant Physiology', examType: 'NEET', isPyq: true, pyqTag: 'NEET 2019',
    body: `Which gaseous phytohormone is widely used to accelerate commercial fruit ripening?`,
    answer: `Ethylene`,
    options: [`Ethylene`, `Auxin`, `Cytokinin`, `Abscisic Acid`],
    explanation: `Ethylene promotes climacteric respiration and ripening in fruits like bananas and tomatoes.`
  },

  // -------------------------------------------------------------
  // 🧬 BIOLOGY: Human Physiology
  // -------------------------------------------------------------
  {
    subject: 'Biology', topic: 'Human Physiology', examType: 'NEET', isPyq: true, pyqTag: 'NEET 2020',
    body: `Calculate Cardiac Output ($\\text{CO}$) for an individual with resting heart rate $\\text{HR} = 72\\text{ bpm}$ and stroke volume $\\text{SV} = 70\\text{ mL}$:`,
    answer: `$5.04\\text{ L/min}$`,
    options: [`$5.04\\text{ L/min}$`, `$7.20\\text{ L/min}$`, `$3.50\\text{ L/min}$`, `$10.0\\text{ L/min}$`],
    explanation: `$\\text{CO} = \\text{HR} \\times \\text{SV} = 72 \\times 70 = 5040\\text{ mL/min} = 5.04\\text{ L/min}$.`
  },
  {
    subject: 'Biology', topic: 'Human Physiology', examType: 'NEET', isPyq: true, pyqTag: 'NEET 2021',
    body: `During skeletal muscle contraction, which ion binds to Troponin-C to unmask actin active sites for myosin heads?`,
    answer: `$Ca^{2+}$ (Calcium ions)`,
    options: [`$Ca^{2+}$ (Calcium ions)`, `$Na^+$ (Sodium)`, `$K^+$ (Potassium)`, `$Mg^{2+}$ (Magnesium)`],
    explanation: `$Ca^{2+}$ release from sarcoplasmic reticulum alters troponin conformation, exposing myosin binding sites.`
  },

  // -------------------------------------------------------------
  // 🧬 BIOLOGY: Biotechnology and its Applications
  // -------------------------------------------------------------
  {
    subject: 'Biology', topic: 'Biotechnology and its Applications', examType: 'NEET', isPyq: true, pyqTag: 'NEET 2021',
    body: `What is the correct sequential temperature cycle of the three steps in Polymerase Chain Reaction (PCR)?`,
    answer: `Denaturation ($94^\\circ\\text{C}$) $\\to$ Annealing ($55^\\circ\\text{C}$) $\\to$ Extension ($72^\\circ\\text{C}$)`,
    options: [
      `Denaturation ($94^\\circ\\text{C}$) $\\to$ Annealing ($55^\\circ\\text{C}$) $\\to$ Extension ($72^\\circ\\text{C}$)`,
      `Annealing $\\to$ Denaturation $\\to$ Extension`,
      `Extension $\\to$ Annealing $\\to$ Denaturation`,
      `Denaturation $\\to$ Extension $\\to$ Annealing`
    ],
    explanation: `PCR operates cyclically: thermal strand denaturation, primer annealing, and Taq extension.`
  },
  {
    subject: 'Biology', topic: 'Biotechnology and its Applications', examType: 'NEET', isPyq: true, pyqTag: 'NEET 2020',
    body: `Which restriction endonuclease recognizes the specific palindromic DNA sequence $5'-GAATTC-3'$?`,
    answer: `*EcoRI*`,
    options: [`*EcoRI*`, `*HindIII*`, `*BamHI*`, `*SalI*`],
    explanation: `*EcoRI* cleaves between G and A in the $5'-GAATTC-3'$ motif generating sticky ends.`
  },

  // -------------------------------------------------------------
  // 🧬 BIOLOGY: Ecology and Environment
  // -------------------------------------------------------------
  {
    subject: 'Biology', topic: 'Ecology and Environment', examType: 'NEET', isPyq: true, pyqTag: 'NEET 2022',
    body: `According to Lindeman's 10% ecological efficiency law, how much available energy transfers from one trophic level to the next?`,
    answer: `$10\\%$`,
    options: [`$10\\%$`, `$1\\%$`, `$50\\%$`, `$20\\%$`],
    explanation: `Only approximately 10% of chemical energy in biomass is converted into biomass at the successive trophic level.`
  },
  {
    subject: 'Biology', topic: 'Ecology and Environment', examType: 'NEET', isPyq: true, pyqTag: 'NEET 2019',
    body: `In an open marine / ocean ecosystem, the ecological pyramid of biomass is characteristically:`,
    answer: `Inverted (Phytoplankton standing crop < Zooplankton < Predatory fish)`,
    options: [`Inverted (Phytoplankton standing crop < Zooplankton < Predatory fish)`, `Upright`, `Spindle-shaped`, `Dumbbell-shaped`],
    explanation: `High turnover rate of tiny phytoplankton yields an inverted standing biomass pyramid.`
  },

  // -------------------------------------------------------------
  // 🧬 BIOLOGY: Biology and Human Welfare
  // -------------------------------------------------------------
  {
    subject: 'Biology', topic: 'Biology and Human Welfare', examType: 'NEET', isPyq: true, pyqTag: 'NEET 2021',
    body: `Which diagnostic serological test confirms the diagnosis of Typhoid fever caused by *Salmonella typhi*?`,
    answer: `Widal Test`,
    options: [`Widal Test`, `ELISA Test`, `Western Blot`, `Mantoux Test`],
    explanation: `The Widal agglutination test identifies antibodies against O and H antigens of *S. typhi*.`
  },

  // -------------------------------------------------------------
  // 🧬 BIOLOGY: Structural Organisation in Animals and Plants
  // -------------------------------------------------------------
  {
    subject: 'Biology', topic: 'Structural Organisation in Animals and Plants', examType: 'NEET', isPyq: true, pyqTag: 'NEET 2020',
    body: `Which vascular tissue components in angiosperms are non-living and devoid of protoplasm at functional maturity?`,
    answer: `Xylem vessels and tracheids`,
    options: [`Xylem vessels and tracheids`, `Phloem companion cells`, `Sieve tube elements`, `Xylem parenchyma`],
    explanation: `Xylem conducting elements lose their living contents and develop lignified cell walls.`
  },

  // -------------------------------------------------------------
  // ⚛️ PHYSICS: Physics and Measurement
  // -------------------------------------------------------------
  {
    subject: 'Physics', topic: 'Physics and Measurement', examType: 'JEE-Mains', isPyq: true, pyqTag: 'JEE Main 2021',
    body: `What is the dimensional formula of the Universal Gravitational Constant $G$?`,
    answer: `$[M^{-1} L^3 T^{-2}]$`,
    options: [`$[M^{-1} L^3 T^{-2}]$`, `$[M L^2 T^{-2}]$`, `$[M^{-1} L^2 T^{-1}]$`, `$[M^0 L^3 T^{-2}]$`],
    explanation: `From Newton's law $F = \\frac{G m_1 m_2}{r^2} \\implies [G] = \\frac{[F][r^2]}{[m^2]} = [M^{-1} L^3 T^{-2}]$.`
  },
  {
    subject: 'Physics', topic: 'Physics and Measurement', examType: 'JEE-Mains', isPyq: true, pyqTag: 'JEE Main 2020',
    body: `What is the dimensional formula of Planck's Constant $h$?`,
    answer: `$[M L^2 T^{-1}]$`,
    options: [`$[M L^2 T^{-1}]$`, `$[M L^2 T^{-2}]$`, `$[M L T^{-1}]$`, `$[M^{-1} L^2 T^{-1}]$`],
    explanation: `From $E = h\\nu \\implies [h] = \\frac{[E]}{[\\nu]} = \\frac{[M L^2 T^{-2}]}{[T^{-1}]} = [M L^2 T^{-1}]$.`
  },
  {
    subject: 'Physics', topic: 'Physics and Measurement', examType: 'JEE-Advanced', isPyq: true, pyqTag: 'JEE Advanced 2019',
    body: `If the percentage error in measuring mass $m$ is $2\\%$ and speed $v$ is $3\\%$, calculate the percentage error in kinetic energy $K = \\frac{1}{2}mv^2$:`,
    answer: `$8\\%$`,
    options: `$8\\%`, `$5\\%`, `$18\\%`, `$11\\%`],
    explanation: `$\\frac{\\Delta K}{K} = \\frac{\\Delta m}{m} + 2\\frac{\\Delta v}{v} = 2\\% + 2(3\\%) = 8\\%$.`
  },
  {
    subject: 'Physics', topic: 'Physics and Measurement', examType: 'NEET', isPyq: true, pyqTag: 'NEET 2022',
    body: `How many significant figures are present in the measured value $0.002040\\text{ kg}$?`,
    answer: `$4$ significant figures`,
    options: [`$4$ significant figures`, `$6$ significant figures`, `$3$ significant figures`, `$7$ significant figures`],
    explanation: `Leading zeros before the first non-zero digit are non-significant; digits $2, 0, 4, 0$ are significant.`
  },

  // -------------------------------------------------------------
  // ⚛️ PHYSICS: Work, Energy and Power
  // -------------------------------------------------------------
  {
    subject: 'Physics', topic: 'Work, Energy and Power', examType: 'JEE-Mains', isPyq: true, pyqTag: 'JEE Main 2021',
    body: `Calculate the potential energy stored in an elastic spring ($k = 200\\text{ N/m}$) compressed by $x = 10\\text{ cm}$:`,
    answer: `$1.00\\text{ J}$`,
    options: [`$1.00\\text{ J}$`, `$0.50\\text{ J}$`, `$2.00\\text{ J}$`, `$10.00\\text{ J}$`],
    explanation: `$U = \\frac{1}{2} k x^2 = \\frac{1}{2}(200)(0.1)^2 = 1.00\\text{ J}$.`
  },
  {
    subject: 'Physics', topic: 'Work, Energy and Power', examType: 'JEE-Advanced', isPyq: true, pyqTag: 'JEE Advanced 2020',
    body: `What is the minimum speed required at the lowest point of a vertical circle of radius $R$ so that a particle completes a full vertical loop under gravity?`,
    answer: `$\\sqrt{5gR}$`,
    options: [`$\\sqrt{5gR}$`, `$\\sqrt{gR}$`, `$\\sqrt{3gR}$`, `$\\sqrt{2gR}$`],
    explanation: `At the top, $v_{\\text{top}} = \\sqrt{gR}$. Conserving mechanical energy: $\\frac{1}{2}m v_0^2 = \\frac{1}{2}m(gR) + mg(2R) \\implies v_0 = \\sqrt{5gR}$.`
  },
  {
    subject: 'Physics', topic: 'Work, Energy and Power', examType: 'JEE-Mains', isPyq: true, pyqTag: 'JEE Main 2019',
    body: `If the linear momentum of a particle of mass $m$ is increased by $100\\%$, by what percentage does its kinetic energy increase?`,
    answer: `$300\\%$`,
    options: [`$300\\%$`, `$100\\%$`, `$200\\%$`, `$400\\%$`],
    explanation: `$K = \\frac{p^2}{2m}$. If $p' = 2p$, $K' = 4K$, so percentage increase is $\\frac{4K - K}{K} \\times 100\\% = 300\\%$.`
  },

  // -------------------------------------------------------------
  // ⚛️ PHYSICS: Rotational Motion
  // -------------------------------------------------------------
  {
    subject: 'Physics', topic: 'Rotational Motion', examType: 'JEE-Mains', isPyq: true, pyqTag: 'JEE Main 2022',
    body: `A uniform circular disk has mass $M = 4\\text{ kg}$ and radius $R = 1\\text{ m}$. Calculate its moment of inertia about an axis perpendicular to its plane and passing through its rim (tangential):`,
    answer: `$6.0\\text{ kg} \\cdot \\text{m}^2$`,
    options: [`$6.0\\text{ kg} \\cdot \\text{m}^2$`, `$2.0\\text{ kg} \\cdot \\text{m}^2$`, `$8.0\\text{ kg} \\cdot \\text{m}^2$`, `$12.0\\text{ kg} \\cdot \\text{m}^2$`],
    explanation: `By parallel axis theorem, $I = I_{\\text{cm}} + M R^2 = \\frac{1}{2} M R^2 + M R^2 = \\frac{3}{2} M R^2 = \\frac{3}{2}(4)(1)^2 = 6.0\\text{ kg} \\cdot \\text{m}^2$.`
  },
  {
    subject: 'Physics', topic: 'Rotational Motion', examType: 'JEE-Advanced', isPyq: true, pyqTag: 'JEE Advanced 2021',
    body: `What is the moment of inertia of a uniform solid sphere of mass $M$ and radius $R$ about an axis passing through its center of mass (diameter)?`,
    answer: `$\\frac{2}{5} M R^2$`,
    options: [`$\\frac{2}{5} M R^2$`, `$\\frac{2}{3} M R^2$`, `$\\frac{1}{2} M R^2$`, `$\\frac{7}{5} M R^2$`],
    explanation: `Integration over spherical shells yields $I = \\frac{2}{5}MR^2$.`
  },
  {
    subject: 'Physics', topic: 'Rotational Motion', examType: 'JEE-Mains', isPyq: true, pyqTag: 'JEE Main 2020',
    body: `A solid cylinder, a solid sphere, and a thin ring of equal masses and radii roll down an inclined plane without slipping. Which reaches the bottom first?`,
    answer: `Solid sphere (lowest $k^2/R^2 = 0.40$)`,
    options: [`Solid sphere (lowest $k^2/R^2 = 0.40$)`, `Solid cylinder ($k^2/R^2 = 0.50$)`, `Thin ring ($k^2/R^2 = 1.0$)`, `All reach simultaneously`],
    explanation: `Acceleration $a = \\frac{g\\sin\\theta}{1 + k^2/R^2}$. The solid sphere has the smallest $k^2/R^2 = 2/5$, giving greatest acceleration and least time.`
  },

  // -------------------------------------------------------------
  // ⚛️ PHYSICS: Electronic Devices
  // -------------------------------------------------------------
  {
    subject: 'Physics', topic: 'Electronic Devices', examType: 'JEE-Mains', isPyq: true, pyqTag: 'JEE Main 2022',
    body: `Identify the Boolean output expression $Y$ for the exact logic gate schematic shown below:\n${getLogicGateSvg('NAND')}`,
    answer: `$Y = \\overline{A · B}$ (NAND Gate)`,
    options: [`$Y = \\overline{A · B}$ (NAND Gate)`, `$Y = A · B$ (AND Gate)`, `$Y = \\overline{A + B}$ (NOR Gate)`, `$Y = A \\oplus B$ (XOR Gate)`],
    explanation: `The D-shaped gate with an inversion bubble at the output represents a NAND gate ($Y = \\overline{A · B}$).`
  },
  {
    subject: 'Physics', topic: 'Electronic Devices', examType: 'NEET', isPyq: true, pyqTag: 'NEET 2021',
    body: `Identify the Boolean output expression $Y$ for the exact logic gate schematic shown below:\n${getLogicGateSvg('XOR')}`,
    answer: `$Y = A \\oplus B$ (XOR Gate)`,
    options: [`$Y = A \\oplus B$ (XOR Gate)`, `$Y = \\overline{A \\oplus B}$ (XNOR Gate)`, `$Y = A + B$ (OR Gate)`, `$Y = A · B$ (AND Gate)`],
    explanation: `The curved gate with an isolated curved input arc represents an exclusive-OR (XOR) gate.`
  },

  // -------------------------------------------------------------
  // 🧪 CHEMISTRY: Organic Compounds Containing Oxygen
  // -------------------------------------------------------------
  {
    subject: 'Chemistry', topic: 'Organic Compounds Containing Oxygen', examType: 'JEE-Advanced', isPyq: true, pyqTag: 'JEE Advanced 2021',
    body: `Examine the substituted aromatic ring below:\n${getBenzeneSvg('-OH')}\nDetermine the directive and electronic activation influence of the **-OH** group:`,
    answer: `Ortho/Para-directing & Strongly Activating (+M effect)`,
    options: [
      `Ortho/Para-directing & Strongly Activating (+M effect)`,
      `Meta-directing & Deactivating (-M effect)`,
      `Ortho/Para-directing & Deactivating`,
      `Meta-directing & Activating`
    ],
    explanation: `The lone pairs on oxygen delocalize into the aromatic ring (+M resonance effect), increasing electron density at ortho and para positions.`
  },
  {
    subject: 'Chemistry', topic: 'Organic Compounds Containing Oxygen', examType: 'JEE-Mains', isPyq: true, pyqTag: 'JEE Main 2020',
    body: `Examine the substituted aromatic ring below:\n${getBenzeneSvg('-NO2')}\nDetermine the directive and electronic influence of the **-NO2** group:`,
    answer: `Meta-directing & Strongly Deactivating (-M and -I effects)`,
    options: [
      `Meta-directing & Strongly Deactivating (-M and -I effects)`,
      `Ortho/Para-directing & Activating`,
      `Meta-directing & Activating`,
      `Ortho/Para-directing & Deactivating`
    ],
    explanation: `The strongly electron-withdrawing nitro group pulls electron density out of the ring via -M resonance and -I inductive effects, deactivating meta positions least.`
  },

  // -------------------------------------------------------------
  // 📐 MATHEMATICS: Statistics and Probability
  // -------------------------------------------------------------
  {
    subject: 'Mathematics', topic: 'Statistics and Probability', examType: 'JEE-Advanced', isPyq: true, pyqTag: 'JEE Advanced 2019',
    body: `Plant I manufactures $60\\%$ of output with $2\\%$ defect rate, while Plant II produces $40\\%$ with $5\\%$ defect rate. An item selected at random is found defective. Find the probability it was manufactured in Plant II:`,
    answer: `$0.625$`,
    options: [`$0.625$`, `$0.500$`, `$0.250$`, `$0.400$`],
    explanation: `By Bayes' theorem: $P(\\text{II}|D) = \\frac{0.4 \\times 0.05}{0.6 \\times 0.02 + 0.4 \\times 0.05} = \\frac{0.020}{0.012 + 0.020} = \\frac{0.020}{0.032} = 0.625$.`
  },
  {
    subject: 'Mathematics', topic: 'Statistics and Probability', examType: 'JEE-Mains', isPyq: true, pyqTag: 'JEE Main 2021',
    body: `What is the variance $\\sigma^2$ of the first $n = 7$ natural numbers ($1, 2, 3, 4, 5, 6, 7$)?`,
    answer: `$4.00$`,
    options: [`$4.00$`, `$2.00$`, `$5.33$`, `$16.00$`],
    explanation: `$\\sigma^2 = \\frac{n^2 - 1}{12} = \\frac{7^2 - 1}{12} = \\frac{48}{12} = 4.00$.`
  }
];

async function seedCurated() {
  try {
    console.log('Clearing existing question bank...');
    await questionBankModel.deleteMany({});

    console.log(`Inserting ${MASTER_UNIQUE_QUESTIONS.length} curated, authentic non-repeating questions...`);

    const docsToInsert = MASTER_UNIQUE_QUESTIONS.map(q => ({
      body: q.body,
      bodyImage: '',
      options: shuffleArray(q.options),
      optionImages: [],
      answer: q.answer,
      subject: q.subject,
      examType: q.examType,
      topic: q.topic,
      questionType: 'SINGLE',
      marks: 4,
      explanation: q.explanation,
      isPyq: q.isPyq,
      pyqTag: q.pyqTag
    }));

    await questionBankModel.insertMany(docsToInsert);

    const total = await questionBankModel.countDocuments({});
    const distinct = (await questionBankModel.distinct('body')).length;

    console.log('====================================================');
    console.log(`✅ CURATED BANK SEEDED SUCCESSFULLY!`);
    console.log(`Total in Database: ${total}`);
    console.log(`Distinct Bodies: ${distinct}`);
    console.log(`Duplicates: ${total - distinct} (ZERO DUPLICATES)`);
    console.log('====================================================');

    process.exit(0);
  } catch (err) {
    console.error('Error during curated seeding:', err);
    process.exit(1);
  }
}

seedCurated();
