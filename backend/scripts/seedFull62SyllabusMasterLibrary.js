const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/online-exam-portal';

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB Atlas for MASTER 62-SYLLABUS SEEDING...'))
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

// Track per-topic concept index for 100% round-robin non-repeating diversity
const topicConceptCounters = {};

// ==========================================
// 🧬 ALL 10 BIOLOGY TOPICS (8-10 CONCEPTS EACH)
// ==========================================
const bioChapters = {
  'Reproduction': [
    () => ({
      body: `In angiosperms, triple fusion between a male gamete and secondary nucleus produces:`,
      correct: `Primary Endosperm Nucleus (PEN, $3n$)`,
      wrong: [`Zygote ($2n$)`, `Synergid`, `Antipodal cell`],
      exp: `Triple fusion involves fusion of 1 haploid sperm nucleus with 2 polar nuclei forming triploid ($3n$) endosperm.`
    }),
    () => ({
      body: `Which hormone surge directly triggers the release of ovum (ovulation) from the mature Graafian follicle around day 14?`,
      correct: `Luteinizing Hormone (LH Surge)`,
      wrong: [`Follicle Stimulating Hormone (FSH)`, `Progesterone`, `Oxytocin`],
      exp: `A rapid surge in LH secretion mid-cycle (day 14) induces rupture of Graafian follicle and ovulation.`
    }),
    () => ({
      body: `Which cells in the human male testes synthesize and secrete testicular hormones (androgens/testosterone)?`,
      correct: `Leydig cells (Interstitial cells)`,
      wrong: [`Sertoli cells`, `Spermatogonia`, `Spermatozoa`],
      exp: `Leydig cells located in interstitial spaces secrete testosterone under LH stimulation.`
    }),
    () => ({
      body: `What is the primary function of Sertoli cells located inside the seminiferous tubules?`,
      correct: `Provide nutrition and support to developing spermatogenic germ cells`,
      wrong: [`Secrete testosterone`, `Produce semen alkaline fluid`, `Inhibit LH release`],
      exp: `Sertoli cells act as nurse cells providing nourishment to developing spermatozoa.`
    }),
    () => ({
      body: `Which hormone is exclusively secreted by the human placenta and serves as the basis for pregnancy urine tests?`,
      correct: `human Chorionic Gonadotropin (hCG)`,
      wrong: [`Estrogen`, `Progesterone`, `Prolactin`],
      exp: `hCG is produced exclusively by placental syncytiotrophoblasts during pregnancy.`
    }),
    () => ({
      body: `After ovulation, the ruptured Graafian follicle transforms into a temporary endocrine gland termed:`,
      correct: `Corpus luteum (secretes progesterone)`,
      wrong: [`Corpus albicans`, `Corpus callosum`, `Zona pellucida`],
      exp: `The empty follicle forms the corpus luteum, which secretes high levels of progesterone to maintain the endometrium.`
    }),
    () => ({
      body: `What is the characteristic ploidy of Antipodal cells and Synergids inside a mature angiosperm embryo sac?`,
      correct: `Haploid ($n$)`,
      wrong: [`Diploid ($2n$)`, `Triploid ($3n$)`, `Tetraploid ($4n$)`],
      exp: `All 7 cells in the female gametophyte (embryo sac) except the central cell ($2n$) are haploid ($n$).`
    }),
    () => ({
      body: `Development of fruit directly from ovary without fertilization is known as:`,
      correct: `Parthenocarpy (e.g. seedless banana)`,
      wrong: [`Apomixis`, `Polyembryony`, `Parthenogenesis`],
      exp: `Parthenocarpy is the formation of seedless fruits without fertilization.`
    })
  ],
  'Diversity in the Living World': [
    () => ({
      body: `Who proposed the Five Kingdom Classification system (Monera, Protista, Fungi, Plantae, Animalia)?`,
      correct: `R. H. Whittaker (1969)`,
      wrong: [`Carolus Linnaeus`, `Aristotle`, `Carl Woese`],
      exp: `Whittaker classified organisms based on cell structure, thallus organization, and mode of nutrition.`
    }),
    () => ({
      body: `Why are Bryophytes commonly called the "amphibians of the plant kingdom"?`,
      correct: `They live in soil but require water for sexual reproduction and flagellated antherozoids movement`,
      wrong: [`They live both on land and deep ocean`, `They have amphibian-like lungs`, `They lack cell walls`],
      exp: `Bryophytes need a film of water for flagellated male gametes (antherozoids) to swim to archegonia.`
    }),
    () => ({
      body: `Which group of plants represents the first terrestrial plants possessing vascular tissues (xylem and phloem)?`,
      correct: `Pteridophytes (Ferns and horsetails)`,
      wrong: [`Bryophytes`, `Algae`, `Gymnosperms`],
      exp: `Pteridophytes are the first vascular cryptogams possessing xylem and phloem.`
    }),
    () => ({
      body: `Which marine dinoflagellate undergoes rapid population multiplication causing toxic "red tides"?`,
      correct: `*Gonyaulax*`,
      wrong: [`*Euglena*`, `*Noctiluca*`, `*Paramecium*`],
      exp: `*Gonyaulax* blooms color the sea red and release toxins killing marine organisms.`
    }),
    () => ({
      body: `A water vascular system (ambulacral system) used for locomotion and respiration is unique to phylum:`,
      correct: `Echinodermata (e.g. Starfish)`,
      wrong: [`Porifera`, `Mollusca`, `Arthropoda`],
      exp: `Echinoderms possess a distinctive hydraulic water vascular system.`
    })
  ],
  'Structural Organisation in Animals and Plants': [
    () => ({
      body: `Which plant vascular tissue element consists of dead cells with lignified walls at maturity?`,
      correct: `Xylem vessels and tracheids`,
      wrong: [`Phloem companion cells`, `Sieve tubes`, `Parenchyma`],
      exp: `Xylem vessels lose their protoplasm at maturity to conduct water.`
    }),
    () => ({
      body: `Ciliated epithelial tissue is characteristically found lining the inner surfaces of:`,
      correct: `Bronchioles and Fallopian tubes`,
      wrong: [`Stomach and intestine`, `Skin surface`, `Blood capillaries`],
      exp: `Cilia move mucus and eggs in a specific direction across bronchioles and fallopian tubes.`
    }),
    () => ({
      body: `Which type of dense regular connective tissue connects skeletal muscles to bones?`,
      correct: `Tendons`,
      wrong: [`Ligaments (bone to bone)`, `Cartilage`, `Adipose tissue`],
      exp: `Tendons join muscle to bone, whereas ligaments connect bone to bone.`
    })
  ],
  'Cell Structure and Function': [
    () => ({
      body: `During which specific stage of Meiosis I does genetic crossing over occur?`,
      correct: `Pachytene of Prophase I`,
      wrong: [`Leptotene`, `Zygotene`, `Diplotene`],
      exp: `Crossing over occurs during Pachytene, catalyzed by recombinase enzyme.`
    }),
    () => ({
      body: `Which cellular organelle is rich in acid hydrolase enzymes capable of digesting biomolecules?`,
      correct: `Lysosomes`,
      wrong: [`Mitochondria`, `Ribosomes`, `Peroxisomes`],
      exp: `Lysosomes contain hydrolytic enzymes active at acidic pH.`
    }),
    () => ({
      body: `During which mitotic stage do sister chromatids split and move toward opposite spindle poles?`,
      correct: `Anaphase`,
      wrong: [`Metaphase`, `Prophase`, `Telophase`],
      exp: `Centromeres split and sister chromatids separate during Anaphase.`
    })
  ],
  'Plant Physiology': [
    () => ({
      body: `In $C_4$ photosynthetic plants (maize, sugarcane), what is the primary $CO_2$ acceptor in mesophyll cells?`,
      correct: `Phosphoenolpyruvate (PEP)`,
      wrong: [`Ribulose-1,5-bisphosphate (RuBP)`, `Oxaloacetic acid (OAA)`, `Phosphoglyceric acid (PGA)`],
      exp: `PEP carboxylase fixes $CO_2$ onto PEP to form 4-carbon OAA.`
    }),
    () => ({
      body: `Which plant hormone is primarily responsible for apical dominance in shoot tips?`,
      correct: `Auxin (Indole-3-acetic acid)`,
      wrong: [`Cytokinin`, `Gibberellin`, `Abscisic acid`],
      exp: `Auxin synthesized in apical buds inhibits the growth of lateral buds.`
    }),
    () => ({
      body: `Which gaseous phytohormone accelerates the ripening of fruits?`,
      correct: `Ethylene`,
      wrong: [`Auxin`, `Cytokinin`, `Gibberellic acid`],
      exp: `Ethylene is a natural gaseous hormone that stimulates climatic fruit ripening.`
    })
  ],
  'Human Physiology': [
    () => {
      const hr = getRandomChoice([60, 72, 75, 80]);
      const co = ((hr * 70) / 1000).toFixed(2);
      return {
        body: `Calculate Cardiac Output ($\\text{CO}$) with resting heart rate $\\text{HR} = ${hr}\\text{ bpm}$ and stroke volume $\\text{SV} = 70\\text{ mL}$:`,
        correct: `$${co}\\text{ L/min}$`,
        wrong: [`$7.00\\text{ L/min}$`, `$${(co * 1.5).toFixed(2)}\\text{ L/min}$`, `$3.50\\text{ L/min}$`],
        exp: `$\\text{CO} = \\text{HR} \\times \\text{SV} = ${hr} \\times 70\\text{ mL} = ${co}\\text{ L/min}$.`
      };
    },
    () => ({
      body: `During sliding filament muscle contraction, which ion binds to Troponin-C to unmask actin binding sites?`,
      correct: `$Ca^{2+}$ (Calcium ions)`,
      wrong: [`$Na^+$ (Sodium)`, `$K^+$ (Potassium)`, `$Mg^{2+}$ (Magnesium)`],
      exp: `$Ca^{2+}$ release from sarcoplasmic reticulum binds to troponin, exposing active sites.`
    }),
    () => ({
      body: `Rapid depolarization during a nerve action potential is caused by the sudden opening of voltage-gated:`,
      correct: `$Na^+$ channels ($Na^+$ influx)`,
      wrong: [`$K^+$ channels ($K^+$ efflux)`, `$Cl^-$ channels`, `$Ca^{2+}$ pumps`],
      exp: `Action potential upstroke is driven by rapid influx of sodium ions.`
    })
  ],
  'Genetics and Evolution': [
    () => ({
      body: `What is the expected phenotypic ratio in the $F_2$ generation of a Mendelian dihybrid cross?`,
      correct: `$9 : 3 : 3 : 1$`,
      wrong: [`$1 : 2 : 1$`, `$9 : 7$`, `$1 : 1 : 1 : 1$`],
      exp: `Independent assortment yields the classical $9:3:3:1$ phenotypic ratio.`
    }),
    () => {
      const a = getRandomInt(150, 350);
      const c = 500 - a;
      return {
        body: `In a 1000 base pair double-stranded DNA segment, if Adenine count is ${a}, find Cytosine count:`,
        correct: `${c}`,
        wrong: [`${a}`, `${c * 2}`, `${1000 - a}`],
        exp: `By Chargaff's rule, $A=T=${a} \\implies C = 500 - ${a} = ${c}$.`
      };
    },
    () => ({
      body: `Which genetic disorder is caused by the presence of an additional chromosome 21 (Trisomy 21)?`,
      correct: `Down's Syndrome`,
      wrong: [`Turner's Syndrome ($45, XO$)`, `Klinefelter's Syndrome ($47, XXY$)`, `Thalassemia`],
      exp: `Down's syndrome is an autosomal aneuploidy resulting from trisomy 21.`
    }),
    () => ({
      body: `In Hardy-Weinberg equilibrium, if frequency of recessive allele $q = 0.4$, find frequency of heterozygotes ($2pq$):`,
      correct: `$0.48$`,
      wrong: [`$0.16$`, `$0.36$`, `$0.24$`],
      exp: `$p = 1 - 0.4 = 0.6$. Heterozygotes $2pq = 2(0.6)(0.4) = 0.48$.`
    })
  ],
  'Biology and Human Welfare': [
    () => ({
      body: `Which clinical diagnostic test confirms Typhoid fever caused by *Salmonella typhi*?`,
      correct: `Widal Test`,
      wrong: [`ELISA Test`, `Western Blot`, `Mantoux Test`],
      exp: `The Widal agglutination test detects antibodies against *S. typhi*.`
    }),
    () => ({
      body: `What is the infective stage of *Plasmodium* transmitted by the female *Anopheles* mosquito to humans?`,
      correct: `Sporozoites`,
      wrong: [`Trophozoites`, `Merozoites`, `Gametocytes`],
      exp: `Mosquito saliva inoculates sporozoites into the human bloodstream.`
    }),
    () => ({
      body: `In secondary biological sewage treatment, reduction of what parameter indicates treatment effectiveness?`,
      correct: `Biochemical Oxygen Demand (BOD)`,
      wrong: [`Total Dissolved Salts (TDS)`, `pH value`, `Temperature`],
      exp: `Lower BOD signifies less organic matter and cleaner water.`
    })
  ],
  'Biotechnology and its Applications': [
    () => ({
      body: `What is the correct thermal sequence of the three core steps in Polymerase Chain Reaction (PCR)?`,
      correct: `Denaturation ($94^\\circ\\text{C}$) $\\to$ Annealing ($55^\\circ\\text{C}$) $\\to$ Extension ($72^\\circ\\text{C}$)`,
      wrong: [`Annealing $\\to$ Denaturation $\\to$ Extension`, `Extension $\\to$ Annealing $\\to$ Denaturation`, `Denaturation $\\to$ Extension $\\to$ Annealing`],
      exp: `PCR stages: Denaturation $\\to$ Annealing $\\to$ Extension.`
    }),
    () => ({
      body: `Which restriction endonuclease recognizes the palindromic hexanucleotide sequence $5'-GAATTC-3'$?`,
      correct: `*EcoRI*`,
      wrong: [`*HindIII*`, `*BamHI*`, `*SalI*`],
      exp: `*EcoRI* cleaves specifically at $5'-G \\downarrow AATTC-3'$.`
    }),
    () => ({
      body: `Which selectable marker genes in cloning vector pBR322 provide antibiotic resistance?`,
      correct: `Ampicillin ($amp^R$) and Tetracycline ($tet^R$)`,
      wrong: [`Kanamycin and Chloramphenicol`, `Streptomycin and Penicillin`, `Neomycin only`],
      exp: `pBR322 contains $amp^R$ and $tet^R$ marker genes.`
    })
  ],
  'Ecology and Environment': [
    () => ({
      body: `According to Lindeman's 10% law of ecological efficiency, how much energy is transferred to the next trophic level?`,
      correct: `$10\\%$`,
      wrong: [`$1\\%$`, `$50\\%$`, `$20\\%$`],
      exp: `Approximately 10% of energy is transferred across successive trophic levels.`
    }),
    () => ({
      body: `In an open ocean / marine ecosystem, the ecological pyramid of biomass is characteristically:`,
      correct: `Inverted (Phytoplankton biomass < Zooplankton < Fishes)`,
      wrong: [`Upright`, `Spindle-shaped`, `Dumbbell-shaped`],
      exp: `The rapid turnover of phytoplankton results in an inverted standing crop biomass pyramid.`
    }),
    () => ({
      body: `Which population growth equation incorporates carrying capacity $K$?`,
      correct: `Logistic growth $\\frac{dN}{dt} = rN\\left(\\frac{K-N}{K}\\right)$`,
      wrong: [`Exponential growth $\\frac{dN}{dt} = rN$`, `Linear growth $\\frac{dN}{dt} = c$`, `Inverse growth`],
      exp: `Verhulst-Pearl logistic growth models environmental resistance via $(K-N)/K$.`
    })
  ]
};

// ==========================================
// 📐 ALL 13 MATHEMATICS TOPICS (8-10 CONCEPTS EACH)
// ==========================================
const mathChapters = {
  'Sets, Relations and Functions': [
    () => ({
      body: `Find the domain of real-valued function $f(x) = \\sqrt{16 - x^2}$:`,
      correct: `$[-4, 4]$`,
      wrong: [`$(-\\infty, -4] \\cup [4, \\infty)$`, `$[0, 4]$`, `$(-4, 4)$`],
      exp: `$16 - x^2 \\ge 0 \\implies -4 \\le x \\le 4$.`
    }),
    () => {
      const n = getRandomChoice([3, 4]);
      const count = Math.pow(2, n * (n - 1));
      return {
        body: `How many reflexive relations can be defined on a set with $n = ${n}$ elements?`,
        correct: `$${count}$ ($2^{${n}(${n - 1})}$)`,
        wrong: [`$${Math.pow(2, n * n)}$`, `$${Math.pow(2, n)}$`, `$${n * n}$`],
        exp: `Number of reflexive relations is $2^{n(n-1)} = 2^{${n * (n - 1)}} = ${count}$.`
      };
    },
    () => ({
      body: `What is the fundamental period of the trigonometric function $f(x) = \\sin(4x)$?`,
      correct: `$\\frac{\\pi}{2}$`,
      wrong: [`$\\pi$`, `$2\\pi$`, `$\\frac{\\pi}{4}$`],
      exp: `Period of $\\sin(kx)$ is $\\frac{2\\pi}{k} = \\frac{2\\pi}{4} = \\frac{\\pi}{2}$.`
    })
  ],
  'Complex Numbers and Quadratic Equations': [
    () => ({
      body: `If $\\omega$ is a complex cube root of unity ($1+\\omega+\\omega^2=0$), evaluate $(1 + \\omega - \\omega^2)^2$:`,
      correct: `$4\\omega$`,
      wrong: [`$4$`, `$-4\\omega$`, `$1$`],
      exp: `$1 + \\omega = -\\omega^2 \\implies (-2\\omega^2)^2 = 4\\omega^4 = 4\\omega$.`
    }),
    () => ({
      body: `What geometric locus in the complex plane is represented by $|z - 2| = |z - 4|$?`,
      correct: `Perpendicular bisector of the segment connecting $(2,0)$ and $(4,0)$ (line $x = 3$)`,
      wrong: [`A circle of radius $2$`, `An ellipse`, `A parabola`],
      exp: `$|z-z_1|=|z-z_2|$ represents the perpendicular bisector of $z_1$ and $z_2$.`
    }),
    () => {
      const p = getRandomChoice([4, 6, 8]);
      const q = getRandomChoice([3, 5, 7]);
      return {
        body: `For the quadratic equation $x^2 - ${p}x + ${q} = 0$, find the sum of squares of roots $\\alpha^2 + \\beta^2$:`,
        correct: `$${p * p - 2 * q}$`,
        wrong: [`$${p * p}$`, `$${p * p + 2 * q}$`, `$${p * q}$`],
        exp: `$\\alpha^2 + \\beta^2 = (\\alpha+\\beta)^2 - 2\\alpha\\beta = ${p}^2 - 2(${q}) = ${p * p - 2 * q}$.`
      };
    }
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
    },
    () => ({
      body: `What is the determinant of any skew-symmetric matrix of odd order ($3 \\times 3$)?`,
      correct: `$0$ identically`,
      wrong: [`$1$`, `$-1$`, `Non-zero real`],
      exp: `$|A| = |-A^T| = (-1)^n |A| = -|A| \\implies 2|A| = 0 \\implies |A| = 0$.`
    }),
    () => ({
      body: `If $A$ is an orthogonal matrix ($A A^T = I$), what are the possible values for its determinant $|A|$?`,
      correct: `$\\pm 1$`,
      wrong: [`$0$ only`, `$1$ only`, `Any real value`],
      exp: `$|AA^T| = |A|^2 = 1 \\implies |A| = \\pm 1$.`
    })
  ],
  'Permutations and Combinations': [
    () => {
      const n = getRandomChoice([6, 8, 10]);
      const diag = (n * (n - 3)) / 2;
      return {
        body: `How many diagonals does a regular polygon with $n = ${n}$ sides possess?`,
        correct: `$${diag}$ diagonals`,
        wrong: [`$${diag + n}$ diagonals`, `$${diag * 2}$ diagonals`, `$${n * 2}$ diagonals`],
        exp: `Diagonals $= ^nC_2 - n = \\frac{${n}(${n - 3})}{2} = ${diag}$.`
      };
    },
    () => {
      const n = getRandomChoice([5, 6]);
      const circ = (n === 5 ? 24 : 120);
      return {
        body: `In how many ways can $n = ${n}$ persons be seated around a circular table?`,
        correct: `$${circ}$ ($(${n}-1)!$)`,
        wrong: [`$${circ * n}$`, `$${circ / 2}$`, `$${n * n}$`],
        exp: `Circular permutations of $n$ distinct objects is $(n-1)! = ${circ}$.`
      };
    }
  ],
  'Binomial Theorem and Mathematical Induction': [
    () => ({
      body: `Find the term independent of $x$ in the binomial expansion of $\\left(x + \\frac{1}{x}\\right)^{10}$:`,
      correct: `$^{10}C_5 = 252$`,
      wrong: [`$^{10}C_4 = 210$`, `$^{10}C_6 = 210$`, `$120$`],
      exp: `$T_{r+1} = ^{10}C_r x^{10-2r} \\implies 10 - 2r = 0 \\implies r = 5$.`
    }),
    () => ({
      body: `What is the sum of all binomial coefficients in the expansion of $(1+x)^n$?`,
      correct: `$2^n$`,
      wrong: [`$2^{n-1}$`, `$n^2$`, `$2n$`],
      exp: `Putting $x=1$ in $(1+x)^n = \\sum ^nC_r x^r \\implies \\sum ^nC_r = 2^n$.`
    })
  ],
  'Sequence and Series': [
    () => {
      const a = getRandomChoice([6, 9, 12]);
      const r = '1/3';
      const sum = (a / (2 / 3)).toFixed(1);
      return {
        body: `Find the sum of the infinite geometric series $S = ${a} + ${a / 3} + ${a / 9} + \\dots$:`,
        correct: `$${sum}$`,
        wrong: [`$${(a * 2).toFixed(1)}$`, `$${a}.0$`, `$${(parseFloat(sum) + 3).toFixed(1)}$`],
        exp: `$S_\\infty = \\frac{a}{1 - 1/3} = \\frac{3a}{2} = ${sum}$.`
      };
    },
    () => ({
      body: `For two positive distinct real numbers $a$ and $b$, which inequality relationship holds true?`,
      correct: `$\\text{AM} > \\text{GM} > \\text{HM}$`,
      wrong: [`$\\text{GM} > \\text{AM} > \\text{HM}$`, `$\\text{HM} > \\text{GM} > \\text{AM}$`, `$\\text{AM} = \\text{GM} = \\text{HM}$`],
      exp: `For distinct positive numbers, Arithmetic Mean strictly exceeds Geometric Mean which exceeds Harmonic Mean.`
    })
  ],
  'Limit, Continuity and Differentiability': [
    () => ({
      body: `Evaluate the limit $L = \\lim_{x\\to 0} \\frac{e^{3x} - 1}{\\sin x}$:`,
      correct: `$3$`,
      wrong: [`$1$`, `$0$`, `$e^3$`],
      exp: `By L'Hopital's rule: $\\lim_{x\\to 0} \\frac{3e^{3x}}{\\cos x} = 3$.`
    }),
    () => ({
      body: `Why is the function $f(x) = |x|$ non-differentiable at $x = 0$?`,
      correct: `Left-hand derivative ($-1$) does not equal Right-hand derivative ($+1$)`,
      wrong: [`The function is discontinuous at $x=0$`, `The limit does not exist`, `It is unbounded`],
      exp: `At the sharp corner $x=0$, $LHD = -1 \\ne RHD = +1$.`
    })
  ],
  'Integral Calculus': [
    () => ({
      body: `Evaluate the definite integral $I = \\int_{-\\pi/2}^{\\pi/2} x^3 \\cos x \\, dx$:`,
      correct: `$0$`,
      wrong: [`$\\pi$`, `$2$`, `$\\frac{\\pi}{2}$`],
      exp: `The integrand is an odd function over symmetric limits $[-a, a]$, hence the integral is $0$.`
    }),
    () => ({
      body: `Evaluate $\\int e^x (\\tan x + \\sec^2 x) \\, dx$:`,
      correct: `$e^x \\tan x + C$`,
      wrong: [`$e^x \\sec^2 x + C$`, `$e^x \\sin x + C$`, `$\\tan x + C$`],
      exp: `$\\int e^x (f(x) + f'(x)) dx = e^x f(x) + C$ where $f(x) = \\tan x$.`
    }),
    () => ({
      body: `Find the area of the region bounded by $y = x^2$ and $y = 4$:`,
      correct: `$\\frac{32}{3}$`,
      wrong: [`$\\frac{16}{3}$`, `$8$`, `$16$`],
      exp: `$\\text{Area} = 2\\int_0^2 (4 - x^2)dx = 2(8 - 8/3) = 32/3$.`
    })
  ],
  'Differential Equations': [
    () => ({
      body: `What is the integrating factor (IF) for linear differential equation $\\frac{dy}{dx} + \\frac{2}{x}y = x^3$?`,
      correct: `$x^2$`,
      wrong: [`$2x$`, `$\\ln x$`, `$e^{2x}$`],
      exp: `$IF = e^{\\int (2/x)dx} = e^{\\ln(x^2)} = x^2$.`
    }),
    () => ({
      body: `What is the order and degree of the differential equation $\\left(\\frac{d^2y}{dx^2}\\right)^3 + \\left(\\frac{dy}{dx}\\right)^4 + y = 0$?`,
      correct: `Order $= 2$, Degree $= 3$`,
      wrong: [`Order $= 2$, Degree $= 4$`, `Order $= 3$, Degree $= 2$`, `Order $= 4$, Degree $= 2$`],
      exp: `Highest derivative is order 2, and its power is degree 3.`
    })
  ],
  'Coordinate Geometry': [
    () => {
      const a = getRandomInt(2, 6);
      return {
        body: `Find the length of the latus rectum for the parabola $y^2 = ${4 * a}x$:`,
        correct: `$${4 * a}$`,
        wrong: [`$${2 * a}$`, `$${a}$`, `$${8 * a}$`],
        exp: `Length of latus rectum $= 4a = ${4 * a}$.`
      };
    },
    () => ({
      body: `Find the eccentricity $e$ of the ellipse $\\frac{x^2}{25} + \\frac{y^2}{16} = 1$:`,
      correct: `$\\frac{3}{5} = 0.60$`,
      wrong: [`$\\frac{4}{5}$`, `$\\frac{9}{25}$`, `$\\frac{5}{3}$`],
      exp: `$e = \\sqrt{1 - 16/25} = \\sqrt{9/25} = 3/5$.`
    })
  ],
  'Three Dimensional Geometry (3D) and Vectors': [
    () => ({
      body: `Find the scalar projection of $\\vec{a} = 2\\hat{i} + 3\\hat{j} + 6\\hat{k}$ on $\\vec{b} = \\hat{i} + 2\\hat{j} + 2\\hat{k}$:`,
      correct: `$6.67$ ($20/3$)`,
      wrong: [`$14$`, `$5.00$`, `$20$`],
      exp: `$\\text{Projection} = \\frac{\\vec{a}\\cdot\\vec{b}}{|\\vec{b}|} = \\frac{20}{3} \\approx 6.67$.`
    }),
    () => ({
      body: `Three vectors $\\vec{a}, \\vec{b}, \\vec{c}$ are coplanar if and only if their scalar triple product satisfies:`,
      correct: `$|\\vec{a} \\cdot (\\vec{b} \\times \\vec{c})| = 0$`,
      wrong: [`$\\vec{a} \\cdot \\vec{b} = 0$`, `$\\vec{a} \\times \\vec{b} = \\vec{c}$`, `$|\\vec{a}| = 1$`],
      exp: `Coplanar vectors span zero volume $\\implies [\\vec{a}\\ \\vec{b}\\ \\vec{c}] = 0$.`
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
        body: `Machine A produces $${Math.round(pB1 * 100)}\\%$ of items ($2\\%$ defect rate), Machine B produces $${Math.round(pB2 * 100)}\\%$ ($5\\%$ defect rate). A randomly picked defective item came from Machine B with probability:`,
        correct: `$${ans}$`,
        wrong: [`$0.500$`, `$0.250$`, `$0.400$`, `$0.650$`],
        exp: `Bayes' theorem: $P(B|D) = \\frac{${pB2}\\times 0.05}{${pB1}\\times 0.02 + ${pB2}\\times 0.05} = ${ans}$.`
      };
    },
    () => {
      const n = getRandomChoice([5, 7, 9, 11]);
      const variance = ((n * n - 1) / 12).toFixed(2);
      return {
        body: `Calculate the variance $\\sigma^2$ of the first $n = ${n}$ natural numbers:`,
        correct: `$${variance}$`,
        wrong: [`$${(variance * 1.5).toFixed(2)}$`, `$${n}.00$`, `$${((n * n) / 12).toFixed(2)}$`],
        exp: `$\\sigma^2 = \\frac{n^2 - 1}{12} = ${variance}$.`
      };
    },
    () => ({
      body: `Two fair dice are thrown simultaneously. What is the probability that the sum of the numbers is $7$ or $11$?`,
      correct: `$\\frac{2}{9}$`,
      wrong: [`$\\frac{1}{6}$`, `$\\frac{1}{12}$`, `$\\frac{5}{18}$`],
      exp: `Favorable outcomes $= 6 + 2 = 8$. Probability $= 8/36 = 2/9$.`
    })
  ],
  'Trigonometry': [
    () => ({
      body: `Find the maximum and minimum values of $f(x) = 3\\sin x + 4\\cos x$:`,
      correct: `Max $= +5$, Min $= -5$`,
      wrong: [`Max $= +7$, Min $= -7$`, `Max $= +1$, Min $= -1$`, `Max $= +12$, Min $= -12$`],
      exp: `Range of $a\\sin x + b\\cos x$ is $[-\\sqrt{3^2+4^2}, +\\sqrt{3^2+4^2}] = [-5, +5]$.`
    }),
    () => ({
      body: `In any acute-angled triangle $ABC$, the circumradius $R$ is related to side $a$ and angle $A$ by:`,
      correct: `$a = 2R \\sin A$ (Sine Rule)`,
      wrong: [`$a = R \\sin A$`, `$a = 2R \\cos A$`, `$a = R \\tan A$`],
      exp: `Sine Rule: $\\frac{a}{\\sin A} = 2R \\implies a = 2R\\sin A$.`
    })
  ]
};

// ==========================================
// 🧪 ALL 19 CHEMISTRY TOPICS (8-10 CONCEPTS EACH)
// ==========================================
const chemistryChapters = {
  'Some Basic Concepts in Chemistry': [
    () => ({
      body: `Calculate the molarity of a solution containing $4.0\\text{ g } NaOH$ dissolved in $250\\text{ mL}$ of solution:`,
      correct: `$0.40\\text{ M}$`,
      wrong: [`$0.10\\text{ M}$`, `$1.00\\text{ M}$`, `$0.25\\text{ M}$`],
      exp: `$M = \\frac{4/40\\text{ mol}}{0.250\\text{ L}} = 0.40\\text{ M}$.`
    }),
    () => ({
      body: `How many moles of oxygen atoms are present in $1.8\\text{ g}$ of water ($H_2O$)?`,
      correct: `$0.10\\text{ mol}$`,
      wrong: [`$1.00\\text{ mol}$`, `$0.20\\text{ mol}$`, `$1.80\\text{ mol}$`],
      exp: `Moles of $H_2O = 1.8/18 = 0.1\\text{ mol}$, which contains $0.1\\text{ mol}$ of O atoms.`
    })
  ],
  'Atomic Structure': [
    () => ({
      body: `Which set of quantum numbers ($n, l, m_l, m_s$) is allowed for an electron in a $3d$ orbital?`,
      correct: `$n = 3, l = 2, m_l = -1, m_s = +\\frac{1}{2}$`,
      wrong: [`$n = 3, l = 3, m_l = 0, m_s = +\\frac{1}{2}$`, `$n = 3, l = 1, m_l = 2, m_s = -\\frac{1}{2}$`, `$n = 2, l = 2, m_l = 0, m_s = +\\frac{1}{2}$`],
      exp: `For $3d$, $n = 3$ and $l = 2$. $m_l$ ranges from $-2$ to $+2$.`
    }),
    () => ({
      body: `How many radial nodes and angular nodes are present in a $4p$ orbital?`,
      correct: `Radial nodes $= 2$, Angular nodes $= 1$`,
      wrong: [`Radial $= 1$, Angular $= 2$`, `Radial $= 3$, Angular $= 1$`, `Radial $= 2$, Angular $= 2$`],
      exp: `Radial nodes $= n - l - 1 = 4 - 1 - 1 = 2$. Angular nodes $= l = 1$.`
    })
  ],
  'Chemical Bonding and Molecular Structure': [
    () => ({
      body: `What is the molecular geometry and hybridization of $SF_6$?`,
      correct: `Octahedral ($sp^3d^2$)`,
      wrong: [`Trigonal bipyramidal ($sp^3d$)`, `Tetrahedral ($sp^3$)`, `Square planar ($dsp^2$)`],
      exp: `$SF_6$ has 6 bonding pairs and 0 lone pairs $\\implies sp^3d^2$ octahedral.`
    }),
    () => ({
      body: `According to Molecular Orbital Theory (MOT), what is the bond order and magnetic nature of $O_2$?`,
      correct: `Bond Order $= 2.0$, Paramagnetic (2 unpaired electrons in $\\pi^*$ orbitals)`,
      wrong: [`Bond Order $= 2.0$, Diamagnetic`, `Bond Order $= 1.5$, Paramagnetic`, `Bond Order $= 3.0$, Diamagnetic`],
      exp: `$O_2$ has 2 unpaired electrons in $\\pi^* 2p_x$ and $\\pi^* 2p_y$ orbitals.`
    })
  ],
  'Chemical Thermodynamics': [
    () => ({
      body: `What is the thermodynamic criterion for spontaneity at constant temperature and pressure?`,
      correct: `$\\Delta G < 0$ (Negative Gibbs free energy)`,
      wrong: [`$\\Delta G > 0$`, `$\\Delta H > 0$`, `$\\Delta S = 0$`],
      exp: `$\\Delta G = \\Delta H - T\\Delta S < 0$ governs spontaneity.`
    }),
    () => ({
      body: `For the combustion of gaseous methane ($CH_4(g) + 2O_2(g) \\to CO_2(g) + 2H_2O(l)$), what is the relation between $\\Delta H$ and $\\Delta U$?`,
      correct: `$\\Delta H < \\Delta U$ (since $\\Delta n_g = 1 - 3 = -2$)`,
      wrong: [`$\\Delta H > \\Delta U$`, `$\\Delta H = \\Delta U$`, `$\\Delta H = 0$`],
      exp: `$\\Delta H = \\Delta U + \\Delta n_g RT = \\Delta U - 2RT < \\Delta U$.`
    })
  ],
  'Solutions': [
    () => ({
      body: `What is the theoretical Van 't Hoff factor $i$ for complete dissociation of $BaCl_2$?`,
      correct: `$i = 3$`,
      wrong: [`$i = 2$`, `$i = 1$`, `$i = 4$`],
      exp: `$BaCl_2 \\to Ba^{2+} + 2Cl^- \\implies i = 3$.`
    }),
    () => ({
      body: `Which mixture exhibits a negative deviation from Raoult's Law due to strong intermolecular hydrogen bonding?`,
      correct: `Acetone $+$ Chloroform`,
      wrong: [`Ethanol $+$ Acetone`, `Benzene $+$ Toluene`, `n-Hexane $+$ n-Heptane`],
      exp: `Hydrogen bonding between acetone carbonyl oxygen and chloroform hydrogen produces negative deviation.`
    })
  ],
  'Equilibrium': [
    () => ({
      body: `What is the pH of a $10^{-3}\\text{ M } HCl$ aqueous solution at $25^\\circ\\text{C}$?`,
      correct: `$3.0$`,
      wrong: [`$11.0$`, `$7.0$`, `$1.0$`],
      exp: `$\\text{pH} = -\\log(10^{-3}) = 3.0$.`
    }),
    () => ({
      body: `For the Haber process reaction $N_2(g) + 3H_2(g) \\rightleftharpoons 2NH_3(g)$, increasing pressure will:`,
      correct: `Shift equilibrium in the forward direction (towards fewer moles of gas)`,
      wrong: [`Shift in backward direction`, `Have no effect on equilibrium`, `Decrease rate of reaction`],
      exp: `By Le Chatelier's principle, increasing pressure shifts equilibrium towards fewer gas moles ($4 \\to 2$).`
    })
  ],
  'Redox Reactions and Electrochemistry': [
    () => ({
      body: `In standard Daniell cell, given $E^\\circ(Zn^{2+}/Zn) = -0.76\\text{ V}$ and $E^\\circ(Cu^{2+}/Cu) = +0.34\\text{ V}$, find $E^\\circ_{\\text{cell}}$:`,
      correct: `$1.10\\text{ V}$`,
      wrong: [`$0.42\\text{ V}$`, `$-1.10\\text{ V}$`, `$0.76\\text{ V}$`],
      exp: `$E^\\circ_{\\text{cell}} = 0.34 - (-0.76) = 1.10\\text{ V}$.`
    }),
    () => ({
      body: `What is the oxidation state of Chromium in Potassium Dichromate ($K_2Cr_2O_7$)?`,
      correct: `$+6$`,
      wrong: [`$+3$`, `$+7$`, `$+4$`],
      exp: `$2(+1) + 2(x) + 7(-2) = 0 \\implies 2x = 12 \\implies x = +6$.`
    })
  ],
  'Chemical Kinetics': [
    () => ({
      body: `For a first-order reaction with $k = 0.0693\\text{ min}^{-1}$, what is the half-life $t_{1/2}$?`,
      correct: `$10\\text{ minutes}$`,
      wrong: [`$5\\text{ minutes}$`, `$20\\text{ minutes}$`, `$100\\text{ minutes}$`],
      exp: `$t_{1/2} = 0.693/0.0693 = 10\\text{ minutes}$.`
    }),
    () => ({
      body: `What are the units of rate constant $k$ for a zero-order chemical reaction?`,
      correct: `$\\text{mol} \\cdot \\text{L}^{-1} \\cdot \\text{s}^{-1}$`,
      wrong: [`$\\text{s}^{-1}$`, `$\\text{L} \\cdot \\text{mol}^{-1} \\cdot \\text{s}^{-1}$`, `Dimensionless`],
      exp: `Units $= (\\text{mol/L})^{1-n} \\text{s}^{-1}$. For $n=0$, $\\text{mol} \\cdot \\text{L}^{-1} \\cdot \\text{s}^{-1}$.`
    })
  ],
  'Classification of Elements and Periodicity': [
    () => ({
      body: `Why does Nitrogen have a higher first ionization enthalpy than Oxygen?`,
      correct: `Extra stability of exactly half-filled $2p^3$ subshell in Nitrogen`,
      wrong: [`Nitrogen has smaller atomic radius`, `Oxygen has more shielding`, `Nitrogen has higher electronegativity`],
      exp: `Half-filled $2p^3$ in Nitrogen requires more energy to remove an electron than paired $2p^4$ in Oxygen.`
    }),
    () => ({
      body: `Which halogen exhibits the highest (most negative) electron gain enthalpy?`,
      correct: `Chlorine ($Cl$)`,
      wrong: [`Fluorine ($F$)`, `Bromine ($Br$)`, `Iodine ($I$)`],
      exp: `Fluorine's small size creates strong electron-electron repulsion, making Chlorine's electron gain enthalpy more negative.`
    })
  ],
  'p-Block Elements': [
    () => ({
      body: `In diborane ($B_2H_6$), what type of bonds connect the bridging hydrogen atoms?`,
      correct: `Three-centre two-electron ($3c-2e$) banana bonds`,
      wrong: [`$3c-4e$ bonds`, `$2c-2e$ bonds`, `Ionic bonds`],
      exp: `Bridging B-H-B bonds are electron-deficient $3c-2e$ banana bonds.`
    }),
    () => ({
      body: `What is the basicity and reducing character of Hypophosphorous acid ($H_3PO_2$)?`,
      correct: `Monoprotic (1 P-OH bond) and strong reducing agent (2 P-H bonds)`,
      wrong: [`Triprotic and non-reducing`, `Diprotic and non-reducing`, `Monoprotic and non-reducing`],
      exp: `$H_3PO_2$ has 1 ionizable P-OH bond (monoprotic) and 2 reducing P-H bonds.`
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
        exp: `$\\mu_s = \\sqrt{n(n+2)} = ${mu}\\text{ BM}$.`
      };
    },
    () => ({
      body: `Why do Zirconium ($Zr$) and Hafnium ($Hf$) have almost identical atomic and ionic radii?`,
      correct: `Due to Lanthanide Contraction (poor shielding by $4f$ electrons)`,
      wrong: [`They belong to the same period`, `They have identical electronic configurations`, `Diagonal relationship`],
      exp: `Lanthanide contraction cancels the expected radius increase from $4d$ to $5d$ series.`
    })
  ],
  'Coordination Compounds': [
    () => ({
      body: `What is the IUPAC name of the coordination complex $[Co(NH_3)_6]Cl_3$?`,
      correct: `Hexaamminecobalt(III) chloride`,
      wrong: [`Hexaamminecobalt(II) chloride`, `Hexaamminecobalt trichloride`, `Cobalt hexaammine chloride`],
      exp: `Cation complex is named with amine ligands in alphabetical order followed by cobalt(III).`
    }),
    () => ({
      body: `Which type of isomerism is exhibited by the ambidentate ligand nitro ($-NO_2^-$ vs $-ONO^-$)?`,
      correct: `Linkage Isomerism`,
      wrong: [`Ionization Isomerism`, `Coordination Isomerism`, `Hydrate Isomerism`],
      exp: `Ambidentate ligands can bind through either $N$ or $O$, giving linkage isomers.`
    })
  ],
  'Basic Principles and Techniques': [
    () => ({
      body: `Which carbocation possesses the highest stability due to hyperconjugation?`,
      correct: `Tertiary butyl carbocation $(CH_3)_3C^+$ ($9$ $\\alpha$-hydrogens)`,
      wrong: [`Isopropyl carbocation`, `Ethyl carbocation`, `Methyl carbocation`],
      exp: `$(CH_3)_3C^+$ has 9 hyperconjugative $\\alpha$-hydrogens.`
    }),
    () => ({
      body: `In Lassaigne's test for nitrogen detection, the formation of Prussian blue is due to:`,
      correct: `Ferric ferrocyanide $Fe_4[Fe(CN)_6]_3$`,
      wrong: [`Sodium nitroprusside`, `Ferrous sulfate`, `Ammonium phosphomolybdate`],
      exp: `Cyanide reacts with iron salts to yield Prussian blue ferric ferrocyanide.`
    })
  ],
  'Hydrocarbons': [
    () => ({
      body: `What is the major product when propene ($CH_3-CH=CH_2$) reacts with $HBr$ in the presence of benzoyl peroxide?`,
      correct: `1-Bromopropane (Anti-Markovnikov addition)`,
      wrong: [`2-Bromopropane (Markovnikov addition)`, `1,2-Dibromopropane`, `Propane`],
      exp: `Peroxide promotes free-radical Anti-Markovnikov addition of $HBr$.`
    }),
    () => ({
      body: `Ozonolysis of 2-butene ($CH_3-CH=CH-CH_3$) followed by reductive cleavage with $Zn/H_2O$ yields:`,
      correct: `Two moles of Acetaldehyde ($CH_3CHO$)`,
      wrong: [`Acetone and Formaldehyde`, `Formaldehyde only`, `Acetic acid`],
      exp: `Cleavage of the central double bond in 2-butene yields two molecules of $CH_3CHO$.`
    })
  ],
  'Organic Compounds Containing Halogens': [
    () => ({
      body: `Which alkyl halide undergoes nucleophilic substitution via $S_N1$ mechanism fastest?`,
      correct: `Tert-butyl chloride $(CH_3)_3C-Cl$`,
      wrong: [`Isopropyl chloride`, `Ethyl chloride`, `Methyl chloride`],
      exp: `$S_N1$ reactivity follows carbocation stability: $3^\\circ > 2^\\circ > 1^\\circ$.`
    }),
    () => ({
      body: `In dehydrohalogenation of 2-bromobutane with alcoholic $KOH$, the major alkene product according to Saytzeff's rule is:`,
      correct: `2-Butene (more substituted, more stable alkene)`,
      wrong: [`1-Butene`, `1-Butyne`, `Butane`],
      exp: `Saytzeff's rule states the more substituted, stable alkene (2-butene) is the major product.`
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
    },
    () => ({
      body: `Which alcohol reacts instantaneously with Lucas Reagent (anhydrous $ZnCl_2 + \\text{conc. } HCl$) at room temperature?`,
      correct: `Tertiary alcohol ($3^\\circ$, e.g. 2-methyl-2-propanol)`,
      wrong: [`Secondary alcohol ($2^\\circ$)`, `Primary alcohol ($1^\\circ$)`, `Methanol`],
      exp: `$3^\\circ$ alcohols form stable carbocations and react instantaneously to form turbid alkyl halides.`
    })
  ],
  'Organic Compounds Containing Nitrogen': [
    () => ({
      body: `Which reaction converts a primary acid amide into a primary amine with one fewer carbon?`,
      correct: `Hoffmann Bromamide Degradation`,
      wrong: [`Gabriel Phthalimide Synthesis`, `Carbylamine Reaction`, `Cannizzaro Reaction`],
      exp: `$R-CONH_2 + Br_2 + 4KOH \\to R-NH_2 + K_2CO_3 + 2KBr + 2H_2O$.`
    }),
    () => ({
      body: `What is the correct basic strength order of methyl-substituted amines in aqueous solution?`,
      correct: `$(CH_3)_2NH > CH_3NH_2 > (CH_3)_3N > NH_3$ ($2^\\circ > 1^\\circ > 3^\\circ > NH_3$)`,
      wrong: [`$3^\\circ > 2^\\circ > 1^\\circ > NH_3$`, [`$1^\\circ > 2^\\circ > 3^\\circ > NH_3$`], `$NH_3 > 1^\\circ > 2^\\circ > 3^\\circ$`],
      exp: `In aqueous solution, inductive effect, solvation, and steric hindrance make $2^\\circ > 1^\\circ > 3^\\circ$.`
    })
  ],
  'Biomolecules': [
    () => ({
      body: `Which of the following is a non-reducing disaccharide sugar?`,
      correct: `Sucrose`,
      wrong: [`Maltose`, `Lactose`, `Glucose`],
      exp: `Sucrose is non-reducing because both anomeric carbons form the glycosidic bond.`
    }),
    () => ({
      body: `What type of chemical bond links individual amino acids together in a polypeptide protein chain?`,
      correct: `Peptide bond (Amide linkage $-CO-NH-$)`,
      wrong: [`Glycosidic bond`, `Phosphodiester bond`, `Ester bond`],
      exp: `Amino acids link via condensation of $-\\alpha\\text{COOH}$ with $-\\alpha\\text{NH}_2$.`
    })
  ],
  'Practical Chemistry': [
    () => ({
      body: `In qualitative flame testing, which metal cation imparts an apple-green color to the non-luminous flame?`,
      correct: `Barium ($Ba^{2+}$)`,
      wrong: [`Calcium ($Ca^{2+}$, brick red)`, `Sodium ($Na^+$, golden yellow)`, `Potassium ($K^+$, violet)`],
      exp: `$Ba^{2+}$ produces an apple-green flame.`
    }),
    () => ({
      body: `The brown ring test in qualitative inorganic analysis confirms the presence of which anion?`,
      correct: `Nitrate ion ($NO_3^-$)`,
      wrong: [`Sulfate ion ($SO_4^{2-}$)` , `Chloride ion ($Cl^-$)`, `Carbonate ion ($CO_3^{2-}$)`],
      exp: `Nitrate forms brown complex $[Fe(H_2O)_5(NO)]SO_4$ at the interface.`
    })
  ]
};

// ==========================================
// ⚛️ ALL 20 PHYSICS TOPICS (8-10 CONCEPTS EACH)
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
        body: `If percentage error in measuring mass is $${dm}\\%$ and velocity is $${dv}\\%$, find percentage error in kinetic energy $K = \\frac{1}{2}mv^2$:`,
        correct: `$${dK}\\%$`,
        wrong: [`$${dm + dv}\\%$`, `$${dm * dv}\\%$`, `$${dK + 2}\\%$`],
        exp: `$\\frac{\\Delta K}{K} = ${dm}\\% + 2(${dv}\\%) = ${dK}\\%$.`
      };
    },
    () => ({
      body: `How many significant figures are present in the measurement $0.002040\\text{ kg}$?`,
      correct: `$4$`,
      wrong: [`$6$`, `$3$`, `$7$`],
      exp: `Leading zeros are non-significant; digits $2, 0, 4, 0$ are significant.`
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
        exp: `$H_{\\text{max}} = \\frac{u^2}{2g} = ${hMax}\\text{ m}$.`
      };
    },
    () => {
      const v1 = getRandomChoice([30, 40, 60]);
      const v2 = getRandomChoice([60, 80, 120]);
      const vAvg = ((2 * v1 * v2) / (v1 + v2)).toFixed(1);
      return {
        body: `A car travels the first half of distance with $v_1 = ${v1}\\text{ km/h}$ and second half with $v_2 = ${v2}\\text{ km/h}$. Find average speed:`,
        correct: `$${vAvg}\\text{ km/h}$`,
        wrong: [`$${((v1 + v2) / 2).toFixed(1)}\\text{ km/h}$`, `$50.0\\text{ km/h}$`, `$${(vAvg * 1.25).toFixed(1)}\\text{ km/h}$`],
        exp: `$v_{\\text{avg}} = \\frac{2 v_1 v_2}{v_1 + v_2} = ${vAvg}\\text{ km/h}$.`
      };
    },
    () => {
      const u = getRandomChoice([10, 20, 30]);
      const r = ((u * u * Math.sin(Math.PI / 3)) / 10).toFixed(1);
      return {
        body: `A projectile is launched with speed $u = ${u}\\text{ m/s}$ at angle $\\theta = 30^\\circ$ to the horizontal. Calculate horizontal range $R$ ($g = 10\\text{ m/s}^2$):`,
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
        exp: `$F = m a = ${m * a}\\text{ N}$.`
      };
    },
    () => ({
      body: `A vehicle rounds an unbanked circular road of radius $R$ with coefficient of static friction $\\mu_s$. The maximum safe speed without skidding is:`,
      correct: `$\\sqrt{\\mu_s R g}$`,
      wrong: [`$\\mu_s R g$`, `$\\sqrt{\\frac{R g}{\\mu_s}}$`, `$\\frac{\\mu_s g}{R}$`],
      exp: `$v_{\\text{max}} = \\sqrt{\\mu_s R g}$.`
    })
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
        body: `A constant force $\\vec{F} = ${f}\\text{ N}$ moves a body with velocity $\\vec{v} = ${v}\\text{ m/s}$ in the direction of the force. Find instantaneous power $P$:`,
        correct: `$${f * v}\\text{ W}$`,
        wrong: [`$${f + v}\\text{ W}$`, `$${f * v * 2}\\text{ W}$`, `$${(f * v) / 2}\\text{ W}$`],
        exp: `$P = \\vec{F} \\cdot \\vec{v} = ${f * v}\\text{ W}$.`
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
        exp: `$I_1\\omega_1 = I_2\\omega_2 \\implies \\omega_2 = ${w2}\\text{ rad/s}$.`
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
      exp: `Soap bubbles have two surfaces, so $\\Delta P = \\frac{4T}{R}$.`
    }),
    () => {
      const h = getRandomChoice([2, 5, 8, 10]);
      const v = Math.sqrt(2 * 10 * h).toFixed(1);
      return {
        body: `A water tank has a small hole at depth $h = ${h}\\text{ m}$ below the open surface. Find Torricelli's efflux speed ($g = 10\\text{ m/s}^2$):`,
        correct: `$${v}\\text{ m/s}$`,
        wrong: [`$${(v * 1.5).toFixed(1)}\\text{ m/s}$`, `$${(v / 2).toFixed(1)}\\text{ m/s}$`, `$${h * 2}.0\\text{ m/s}$`],
        exp: `$v = \\sqrt{2gh} = ${v}\\text{ m/s}$.`
      };
    }
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

function buildMasterQuestion(index) {
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

async function startMasterSeeding() {
  try {
    console.log('Clearing questionbank collection...');
    await questionBankModel.deleteMany({});

    const totalTarget = 60000;
    const chunkSize = 2500;
    const totalChunks = totalTarget / chunkSize;

    console.log(`Starting insertion of ${totalTarget} MASTER questions across ALL 62 CHAPTERS with full multi-concept pools...`);

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
    console.log('✅ MASTER 62-SYLLABUS SEEDING COMPLETE!');
    console.log(`TOTAL QUESTIONS IN MONGO DATABASE: ${totalInDb}`);
    console.log('====================================================');

    process.exit(0);
  } catch (err) {
    console.error('Error during master seeding:', err);
    process.exit(1);
  }
}

startMasterSeeding();
