const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
require('../services/connection');

const questionBankModel = require('../models/questionBank');

const sampleQuestions = [
  // PHYSICS - JEE & NEET
  {
    body: 'A particle moves in a straight line with uniform acceleration. If it covers distances a and b in contiguous equal intervals of time t, then its acceleration is given by:',
    options: ['(b - a)/t²', '(b + a)/t²', '(b - a)/(2t²)', '(b + a)/(2t²)'],
    answer: '(b - a)/t²',
    subject: 'Physics',
    examType: 'JEE-Mains',
    topic: 'Kinematics',
    questionType: 'SINGLE',
    marks: 4,
    explanation: 'Let initial velocity be u and acceleration be a. Distance in first interval t: a = ut + 0.5 a_acc t^2. Distance in second interval: b = (u + a_acc t)t + 0.5 a_acc t^2. Subtracting gives (b - a) = a_acc t^2 => a_acc = (b - a)/t^2.',
    isPyq: true,
    pyqTag: 'JEE Main 2023'
  },
  {
    body: 'Two capacitors of capacities C1 and C2 are charged to potential V1 and V2 respectively. When connected in parallel, the common potential V will be:',
    options: ['(C1V1 + C2V2)/(C1 + C2)', '(C1V1 - C2V2)/(C1 + C2)', '(C1 + C2)/(V1 + V2)', 'C1V1 / C2V2'],
    answer: '(C1V1 + C2V2)/(C1 + C2)',
    subject: 'Physics',
    examType: 'BOTH',
    topic: 'Electrostatics',
    questionType: 'SINGLE',
    marks: 4,
    explanation: 'Total charge Q = C1V1 + C2V2. Total capacitance C = C1 + C2. Common potential V = Q/C = (C1V1 + C2V2)/(C1 + C2).',
    isPyq: true,
    pyqTag: 'NEET 2022'
  },
  {
    body: 'A wire of resistance R is stretched to double its original length. What is its new resistance?',
    options: ['R', '2 R', '4 R', 'R / 2'],
    answer: '4 R',
    subject: 'Physics',
    examType: 'BOTH',
    topic: 'Current Electricity',
    questionType: 'SINGLE',
    marks: 4,
    explanation: 'Volume remains constant: A1 L1 = A2 L2 => L2 = 2 L1 => A2 = A1 / 2. Resistance R = rho L / A. R_new = rho (2 L1) / (A1 / 2) = 4 R.',
    isPyq: true,
    pyqTag: 'JEE Main 2022'
  },
  {
    body: 'An ideal gas undergoes an isothermal expansion from volume V1 to V2. The work done by the gas is:',
    options: ['nRT ln(V2/V1)', 'nRT (V2 - V1)', 'P(V2 - V1)', 'Zero'],
    answer: 'nRT ln(V2/V1)',
    subject: 'Physics',
    examType: 'BOTH',
    topic: 'Thermodynamics',
    questionType: 'SINGLE',
    marks: 4,
    explanation: 'For an isothermal process, T = constant. W = integral P dV = integral (nRT/V) dV = nRT ln(V2/V1).',
    isPyq: true,
    pyqTag: 'NEET 2023'
  },
  {
    body: 'Calculate the de Broglie wavelength of an electron accelerated through a potential difference of 100 V.',
    options: ['1.227 Å', '0.123 Å', '12.27 Å', '122.7 Å'],
    answer: '1.227 Å',
    subject: 'Physics',
    examType: 'JEE-Mains',
    topic: 'Modern Physics',
    questionType: 'SINGLE',
    marks: 4,
    explanation: 'lambda = 12.27 / sqrt(V) Angstrom = 12.27 / sqrt(100) = 1.227 Å.',
    isPyq: true,
    pyqTag: 'JEE Main 2024'
  },
  {
    body: 'If a body of mass 5 kg is thrown vertically upwards with a velocity of 20 m/s, the maximum height attained by the body is (take g = 10 m/s²):',
    options: ['20 m', '10 m', '40 m', '15 m'],
    answer: '20 m',
    subject: 'Physics',
    examType: 'BOTH',
    topic: 'Gravitation & Motion',
    questionType: 'NUMERICAL',
    marks: 4,
    explanation: 'H_max = u² / (2g) = 20² / (2 * 10) = 400 / 20 = 20 m.',
    isPyq: false,
    pyqTag: ''
  },

  // CHEMISTRY - JEE & NEET
  {
    body: 'Which of the following molecules has zero dipole moment?',
    options: ['NH3', 'NF3', 'BF3', 'H2O'],
    answer: 'BF3',
    subject: 'Chemistry',
    examType: 'BOTH',
    topic: 'Chemical Bonding',
    questionType: 'SINGLE',
    marks: 4,
    explanation: 'BF3 has a trigonal planar geometry with bond angles of 120 degrees. The vector sum of the three B-F bond dipoles cancels out to zero.',
    isPyq: true,
    pyqTag: 'NEET 2023'
  },
  {
    body: 'The oxidation state of Chromium in K2Cr2O7 is:',
    options: ['+3', '+6', '+5', '+4'],
    answer: '+6',
    subject: 'Chemistry',
    examType: 'BOTH',
    topic: 'Redox Reactions',
    questionType: 'SINGLE',
    marks: 4,
    explanation: '2(+1) + 2(x) + 7(-2) = 0 => 2 + 2x - 14 = 0 => 2x = 12 => x = +6.',
    isPyq: true,
    pyqTag: 'JEE Main 2021'
  },
  {
    body: 'Which of the following organic compounds will give positive Fehling test?',
    options: ['Acetaldehyde', 'Benzaldehyde', 'Acetone', 'Benzophenone'],
    answer: 'Acetaldehyde',
    subject: 'Chemistry',
    examType: 'NEET',
    topic: 'Organic Chemistry',
    questionType: 'SINGLE',
    marks: 4,
    explanation: 'Aliphatic aldehydes like Acetaldehyde reduce Fehling solution to give a reddish-brown precipitate of Cu2O. Aromatic aldehydes like Benzaldehyde do not give Fehling test.',
    isPyq: true,
    pyqTag: 'NEET 2021'
  },
  {
    body: 'What is the pH of a 10⁻² M solution of HCl at 25°C?',
    options: ['2', '12', '7', '1'],
    answer: '2',
    subject: 'Chemistry',
    examType: 'BOTH',
    topic: 'Ionic Equilibrium',
    questionType: 'SINGLE',
    marks: 4,
    explanation: 'pH = -log[H+] = -log(10^-2) = 2.',
    isPyq: true,
    pyqTag: 'JEE Main 2020'
  },
  {
    body: 'According to IUPAC nomenclature, the correct name of CH3-CH(OH)-CH2-COOH is:',
    options: ['3-hydroxybutanoic acid', '2-hydroxybutanoic acid', '3-hydroxybutyric acid', 'beta-hydroxybutyric acid'],
    answer: '3-hydroxybutanoic acid',
    subject: 'Chemistry',
    examType: 'BOTH',
    topic: 'IUPAC Nomenclature',
    questionType: 'SINGLE',
    marks: 4,
    explanation: 'Principal functional group is -COOH at carbon 1. Hydroxyl group is at carbon 3. Name: 3-hydroxybutanoic acid.',
    isPyq: true,
    pyqTag: 'NEET 2024'
  },

  // MATHEMATICS - JEE
  {
    body: 'If A and B are square matrices of order 3 such that |A| = 4 and |B| = 5, then the value of |3AB| is:',
    options: ['60', '540', '180', '20'],
    answer: '540',
    subject: 'Mathematics',
    examType: 'JEE-Mains',
    topic: 'Matrices and Determinants',
    questionType: 'SINGLE',
    marks: 4,
    explanation: '|3AB| = 3³ |A| |B| = 27 * 4 * 5 = 540.',
    isPyq: true,
    pyqTag: 'JEE Main 2023'
  },
  {
    body: 'The derivative of sin⁻¹(2x / (1 + x²)) with respect to tan⁻¹(2x / (1 - x²)) is:',
    options: ['1', '0', '2', '1/2'],
    answer: '1',
    subject: 'Mathematics',
    examType: 'JEE-Mains',
    topic: 'Differential Calculus',
    questionType: 'SINGLE',
    marks: 4,
    explanation: 'Put x = tan theta. u = sin^-1(sin 2theta) = 2theta. v = tan^-1(tan 2theta) = 2theta. Therefore du/dv = d(2theta)/d(2theta) = 1.',
    isPyq: true,
    pyqTag: 'JEE Main 2022'
  },
  {
    body: 'Evaluate the integral: ∫ (1 / (x * (ln x)²)) dx',
    options: ['-1 / ln x + C', 'ln(ln x) + C', '1 / ln x + C', '(ln x)³ / 3 + C'],
    answer: '-1 / ln x + C',
    subject: 'Mathematics',
    examType: 'JEE-Mains',
    topic: 'Integral Calculus',
    questionType: 'SINGLE',
    marks: 4,
    explanation: 'Let u = ln x => du = (1/x) dx. Integral = integral (1 / u²) du = -1/u + C = -1 / ln x + C.',
    isPyq: true,
    pyqTag: 'JEE Main 2024'
  },
  {
    body: 'The number of terms in the expansion of (x + y + z)^10 is:',
    options: ['66', '55', '11', '121'],
    answer: '66',
    subject: 'Mathematics',
    examType: 'JEE-Mains',
    topic: 'Binomial Theorem',
    questionType: 'SINGLE',
    marks: 4,
    explanation: 'Number of terms in expansion of (x1 + x2 + ... + xr)^n is (n + r - 1) C (r - 1). Here n = 10, r = 3 => 12 C 2 = (12 * 11) / 2 = 66.',
    isPyq: true,
    pyqTag: 'JEE Main 2021'
  },
  {
    body: 'Find the distance of the point (1, -2, 3) from the plane x - y + z = 5.',
    options: ['1 / √3', '5 / √3', '2 / √3', 'sqrt(3)'],
    answer: '1 / √3',
    subject: 'Mathematics',
    examType: 'JEE-Mains',
    topic: '3D Geometry',
    questionType: 'SINGLE',
    marks: 4,
    explanation: 'Distance d = |ax1 + by1 + cz1 - d| / sqrt(a² + b² + c²) = |1(1) - 1(-2) + 1(3) - 5| / sqrt(1² + (-1)² + 1²) = |1 + 2 + 3 - 5| / sqrt(3) = 1 / sqrt(3).',
    isPyq: true,
    pyqTag: 'JEE Main 2023'
  },

  // BIOLOGY - NEET
  {
    body: 'Which organelle is known as the "Powerhouse of the Cell"?',
    options: ['Mitochondria', 'Chloroplast', 'Ribosome', 'Golgi Apparatus'],
    answer: 'Mitochondria',
    subject: 'Biology',
    examType: 'NEET',
    topic: 'Cell Biology',
    questionType: 'SINGLE',
    marks: 4,
    explanation: 'Mitochondria generate most of the chemical energy needed to power the cell in the form of ATP (adenosine triphosphate).',
    isPyq: true,
    pyqTag: 'NEET 2020'
  },
  {
    body: 'The process of formation of mRNA from DNA is called:',
    options: ['Transcription', 'Translation', 'Replication', 'Transduction'],
    answer: 'Transcription',
    subject: 'Biology',
    examType: 'NEET',
    topic: 'Molecular Biology',
    questionType: 'SINGLE',
    marks: 4,
    explanation: 'Transcription is the first step of gene expression, where a particular segment of DNA is copied into RNA (especially mRNA) by the enzyme RNA polymerase.',
    isPyq: true,
    pyqTag: 'NEET 2023'
  },
  {
    body: 'Which of the following phytohormones is responsible for fruit ripening?',
    options: ['Ethylene', 'Auxin', 'Gibberellin', 'Abscisic Acid'],
    answer: 'Ethylene',
    subject: 'Biology',
    examType: 'NEET',
    topic: 'Plant Physiology',
    questionType: 'SINGLE',
    marks: 4,
    explanation: 'Ethylene is a gaseous plant hormone that promotes fruit ripening, triple response in seedlings, and abscission of plant organs.',
    isPyq: true,
    pyqTag: 'NEET 2022'
  },
  {
    body: 'In human heart, the pacemaker is situated in:',
    options: ['Sino-atrial node (SAN)', 'Atrio-ventricular node (AVN)', 'Bundle of His', 'Purkinje fibers'],
    answer: 'Sino-atrial node (SAN)',
    subject: 'Biology',
    examType: 'NEET',
    topic: 'Human Physiology',
    questionType: 'SINGLE',
    marks: 4,
    explanation: 'The Sino-atrial node (SAN) generates action potentials spontaneously (70-75 per minute) and initiates heart contraction. Hence it is called the natural pacemaker.',
    isPyq: true,
    pyqTag: 'NEET 2024'
  },
  {
    body: 'The functional unit of human kidney is:',
    options: ['Nephron', 'Neuron', 'Glomerulus', 'Loop of Henle'],
    answer: 'Nephron',
    subject: 'Biology',
    examType: 'NEET',
    topic: 'Excretory System',
    questionType: 'SINGLE',
    marks: 4,
    explanation: 'Each kidney contains around 1 million nephrons, which are the structural and functional units responsible for filtering blood and producing urine.',
    isPyq: true,
    pyqTag: 'NEET 2021'
  }
];

// Generate additional 100 questions procedurally to seed a solid 120+ Question Bank
function generateBulkQuestions() {
  const subjects = ['Physics', 'Chemistry', 'Mathematics', 'Biology'];
  const extraDocs = [];

  const physicsTopics = ['Optics', 'Thermodynamics', 'Electromagnetism', 'Work Power Energy', 'Fluids', 'Oscillations'];
  const chemTopics = ['Organic Mechanism', 'Inorganic Chemistry', 'Physical Chemistry', 'Thermodynamics', 'Electrochemistry'];
  const mathTopics = ['Probability', 'Vector Algebra', 'Complex Numbers', 'Coordinate Geometry', 'Permutations & Combinations'];
  const bioTopics = ['Genetics', 'Ecology', 'Human Anatomy', 'Biotechnology', 'Plant Kingdom', 'Reproduction'];

  const years = ['2019', '2020', '2021', '2022', '2023', '2024'];

  for (let s of subjects) {
    let examType = s === 'Biology' ? 'NEET' : (s === 'Mathematics' ? 'JEE-Mains' : 'BOTH');
    let topics = s === 'Physics' ? physicsTopics : (s === 'Chemistry' ? chemTopics : (s === 'Mathematics' ? mathTopics : bioTopics));

    for (let i = 1; i <= 30; i++) {
      let isPyq = i % 2 === 0;
      let yr = years[i % years.length];
      let topic = topics[i % topics.length];
      let examName = examType === 'NEET' ? 'NEET' : 'JEE Main';

      let bodyText = `[${s} - ${topic}] Sample Question #${i}: Solve the problem regarding ${topic.toLowerCase()} concepts in standard ${examName} syllabus.`;
      
      let isNumerical = (s === 'Physics' || s === 'Mathematics') && (i % 4 === 0);

      extraDocs.push({
        body: bodyText,
        options: isNumerical ? [' ', '  ', '   ', '    '] : [`Option A value for Q${i}`, `Option B value for Q${i}`, `Option C value for Q${i}`, `Option D value for Q${i}`],
        answer: isNumerical ? String(i * 5) : `Option A value for Q${i}`,
        subject: s,
        examType: examType,
        topic: topic,
        questionType: isNumerical ? 'NUMERICAL' : 'SINGLE',
        marks: 4,
        explanation: `Step-by-step conceptual explanation for ${topic} question #${i}. Apply fundamental formulas and simplify.`,
        isPyq: isPyq,
        pyqTag: isPyq ? `${examName} ${yr}` : ''
      });
    }
  }

  return extraDocs;
}

async function seed() {
  try {
    console.log('Seeding Question Bank...');
    await questionBankModel.deleteMany({});
    
    const bulkExtra = generateBulkQuestions();
    const allToInsert = [...sampleQuestions, ...bulkExtra];

    await questionBankModel.insertMany(allToInsert);
    console.log(`Successfully seeded ${allToInsert.length} questions into Question Bank!`);

    const stats = {
      total: allToInsert.length,
      physics: allToInsert.filter(q => q.subject === 'Physics').length,
      chemistry: allToInsert.filter(q => q.subject === 'Chemistry').length,
      mathematics: allToInsert.filter(q => q.subject === 'Mathematics').length,
      biology: allToInsert.filter(q => q.subject === 'Biology').length,
      pyqs: allToInsert.filter(q => q.isPyq).length
    };

    console.log('Question Bank Breakdown:', stats);
    process.exit(0);
  } catch (err) {
    console.error('Error seeding Question Bank:', err);
    process.exit(1);
  }
}

seed();
