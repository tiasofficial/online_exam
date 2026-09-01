const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/online-exam-portal';

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB Atlas for 60,000 Question Bank Seeding...'))
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

const subjects = [
  { name: 'Physics', exam: 'BOTH', topics: [
    'Kinematics & Motion', 'Laws of Motion & Friction', 'Work Power Energy', 'Rotational Dynamics', 
    'Gravitation', 'Properties of Matter & Fluids', 'Thermodynamics & Kinetic Theory', 'Oscillations & Waves',
    'Electrostatics & Capacitance', 'Current Electricity & Circuits', 'Magnetic Effects & Magnetism',
    'Electromagnetic Induction & AC', 'Ray Optics & Wave Optics', 'Dual Nature & Modern Physics', 'Semiconductors & Electronics'
  ]},
  { name: 'Chemistry', exam: 'BOTH', topics: [
    'Atomic Structure & Periodicity', 'Chemical Bonding & VSEPR', 'Thermodynamics & Thermochemistry', 
    'Chemical & Ionic Equilibrium', 'Redox Reactions & Electrochemistry', 'Chemical Kinetics & Surface Chemistry',
    'General Organic Chemistry (GOC)', 'Hydrocarbons & Alkynes', 'Haloalkanes & Alcohols', 'Aldehydes Ketones & Carboxylic Acids',
    'Amines & Nitrogen Compounds', 'Coordination Compounds & d-Block', 'p-Block & s-Block Elements', 'Biomolecules & Polymers'
  ]},
  { name: 'Mathematics', exam: 'JEE-Mains', topics: [
    'Sets Relations & Functions', 'Complex Numbers & Quadratic Equations', 'Matrices & Determinants',
    'Permutations Combinations & Probability', 'Binomial Theorem & Sequences', 'Limits Continuity & Differentiability',
    'Application of Derivatives & Maxima-Minima', 'Indefinite & Definite Integrals', 'Differential Equations',
    'Vector Algebra & 3D Geometry', 'Straight Lines & Circles', 'Conic Sections (Parabola Ellipse Hyperbola)'
  ]},
  { name: 'Biology', exam: 'NEET', topics: [
    'Diversity in Living World & Taxonomy', 'Structural Organisation in Plants & Animals', 'Cell Structure & Biomolecules',
    'Plant Physiology & Photosynthesis', 'Respiration & Plant Growth', 'Human Digestion & Respiration',
    'Human Circulation & Excretion', 'Nervous & Endocrine System', 'Reproduction in Organisms & Plants',
    'Human Reproduction & Health', 'Genetics & Inheritance', 'Molecular Basis of Inheritance',
    'Biotechnology Principles & Applications', 'Ecology Ecosystem & Biodiversity'
  ]}
];

const pyqExams = ['JEE Main', 'NEET', 'JEE Advanced', 'AIPMT'];
const pyqYearsList = ['2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'];

function generateChunk(startIndex, count) {
  const chunk = [];
  for (let i = 0; i < count; i++) {
    const qNum = startIndex + i + 1;
    const subjObj = subjects[qNum % subjects.length];
    const topic = subjObj.topics[qNum % subjObj.topics.length];
    const isPyq = qNum % 3 !== 0; // ~66% PYQs
    const yr = pyqYearsList[qNum % pyqYearsList.length];
    const examTag = subjObj.name === 'Biology' ? 'NEET' : (subjObj.name === 'Mathematics' ? 'JEE Main' : pyqExams[qNum % pyqExams.length]);

    const isNumerical = (subjObj.name === 'Physics' || subjObj.name === 'Mathematics') && (qNum % 6 === 0);

    const valA = (qNum * 7) % 99 + 1;
    const valB = (qNum * 13) % 49 + 1;
    const ansVal = isNumerical ? String(valA * valB) : `Option A: ${valA} units / (Standard ${topic} relation)`;

    chunk.push({
      body: `Q${qNum}: [${subjObj.name} - ${topic}] Consider the problem statement regarding ${topic.toLowerCase()} with input parameters P1 = ${valA} and P2 = ${valB}. Determine the exact resultant value:`,
      options: isNumerical ? [' ', '  ', '   ', '    '] : [
        `Option A: ${valA} units / (Standard ${topic} relation)`,
        `Option B: ${(valA + 15)} units / (Alternative ${topic} form)`,
        `Option C: ${valB} units / (Inverse ${topic} relation)`,
        `Option D: None of the above`
      ],
      answer: ansVal,
      subject: subjObj.name,
      examType: subjObj.exam,
      topic: topic,
      questionType: isNumerical ? 'NUMERICAL' : 'SINGLE',
      marks: 4,
      explanation: `Step-by-step resolution for Q${qNum}: Apply core ${subjObj.name} equations for ${topic}. Substitute P1 = ${valA}, P2 = ${valB} to evaluate the final magnitude.`,
      isPyq: isPyq,
      pyqTag: isPyq ? `${examTag} ${yr}` : ''
    });
  }
  return chunk;
}

async function seed60k() {
  try {
    console.log('Clearing existing Question Bank...');
    await questionBankModel.deleteMany({});

    const totalToGenerate = 60000;
    const batchSize = 5000;
    const totalBatches = totalToGenerate / batchSize;

    console.log(`Starting insertion of ${totalToGenerate} questions in ${totalBatches} batches of ${batchSize}...`);

    let insertedSoFar = 0;
    for (let b = 0; b < totalBatches; b++) {
      const chunk = generateChunk(insertedSoFar, batchSize);
      await questionBankModel.insertMany(chunk, { ordered: false });
      insertedSoFar += chunk.length;
      console.log(`Batch ${b + 1}/${totalBatches} inserted! (${insertedSoFar} / ${totalToGenerate} questions complete)`);
    }

    const physics = await questionBankModel.countDocuments({ subject: 'Physics' });
    const chemistry = await questionBankModel.countDocuments({ subject: 'Chemistry' });
    const maths = await questionBankModel.countDocuments({ subject: 'Mathematics' });
    const biology = await questionBankModel.countDocuments({ subject: 'Biology' });
    const pyqs = await questionBankModel.countDocuments({ isPyq: true });

    console.log('====================================================');
    console.log('✅ 60,000+ QUESTION BANK SEEDING COMPLETE!');
    console.log('====================================================');
    console.log(`TOTAL QUESTIONS IN DATABASE : ${insertedSoFar}`);
    console.log(`TOTAL PYQs TAGGED           : ${pyqs}`);
    console.log(`PHYSICS QUESTIONS           : ${physics}`);
    console.log(`CHEMISTRY QUESTIONS         : ${chemistry}`);
    console.log(`MATHEMATICS QUESTIONS       : ${maths}`);
    console.log(`BIOLOGY QUESTIONS           : ${biology}`);
    console.log('====================================================');

    process.exit(0);
  } catch (err) {
    console.error('Error during 60k question bank seeding:', err);
    process.exit(1);
  }
}

seed60k();
