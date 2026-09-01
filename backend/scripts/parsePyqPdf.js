const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/online-exam-portal';

// Import Schema & Model
const questionBankSchema = require('../schemas/questionBank');
const questionBankModel = mongoose.models.questionbank || mongoose.model('questionbank', questionBankSchema);

// Syllabus topics for keyword matching
const TOPICS = {
  Physics: [
    'Physics and Measurement', 'Kinematics', 'Laws of Motion', 'Work, Energy and Power',
    'Rotational Motion', 'Gravitation', 'Properties of Solids and Liquids', 'Thermodynamics',
    'Kinetic Theory of Gases', 'Oscillations and Waves', 'Electrostatics', 'Current Electricity',
    'Magnetic Effects of Current and Magnetism', 'Electromagnetic Induction and Alternating Currents',
    'Electromagnetic Waves', 'Optics', 'Dual Nature of Matter and Radiation', 'Atoms and Nuclei',
    'Electronic Devices', 'Experimental Skills'
  ],
  Chemistry: [
    'Some Basic Concepts in Chemistry', 'Atomic Structure', 'Chemical Bonding and Molecular Structure',
    'Chemical Thermodynamics', 'Solutions', 'Equilibrium', 'Redox Reactions and Electrochemistry',
    'Chemical Kinetics', 'Classification of Elements and Periodicity', 'p-Block Elements',
    'd- and f-Block Elements', 'Coordination Compounds', 'Basic Principles and Techniques',
    'Hydrocarbons', 'Organic Compounds Containing Halogens', 'Organic Compounds Containing Oxygen',
    'Organic Compounds Containing Nitrogen', 'Biomolecules', 'Practical Chemistry'
  ],
  Biology: [
    'Diversity in the Living World', 'Structural Organisation in Animals and Plants', 'Cell Structure and Function',
    'Plant Physiology', 'Human Physiology', 'Reproduction', 'Genetics and Evolution',
    'Biology and Human Welfare', 'Biotechnology and its Applications', 'Ecology and Environment'
  ]
};

// Keyword mapping for automatic topic classification
const KEYWORD_MAPS = {
  'Rotational Motion': ['rotational', 'moment of inertia', 'angular speed', 'radius of gyration', 'disc', 'pulley', 'torque', 'angular acceleration', 'fly wheel'],
  'Magnetic Effects of Current and Magnetism': ['biot-savart', 'magnetic field', 'solenoid', 'magnetic flux', 'magnetic dipole', 'permeability', 'loop of side'],
  'Dual Nature of Matter and Radiation': ['de-broglie', 'wavelength', 'photoelectric', 'stopping potential', 'work function', 'threshold frequency'],
  'Electronic Devices': ['semiconductor', 'logic circuit', 'truth table', 'p-n junction', 'diode', 'gate', 'rectification'],
  'Gravitation': ['gravitational', 'elliptical orbit', 'kepler', 'satellite'],
  'Laws of Motion': ['mass', 'tension', 'free fall', 'friction', 'pulley', 'acceleration', 'force of 3.0 n'],
  'Electrostatics': ['capacitor', 'capacitance', 'dielectric', 'equipotential', 'electric lines of force', 'potential drop'],
  'Current Electricity': ['resistance', 'resistor', 'potentiometer', 'internal resistance', 'ohm', 'galvanic', 'cell', 'electrolysis'],
  'Optics': ['refractive index', 'lens', 'biconvex', 'refracted ray', 'critical angle', 'refraction'],
  'Atoms and Nuclei': ['bohr', 'hydrogen atom', 'excited state', 'nuclear reaction', 'nucleus', 'radioactive', 'binding energy'],
  'Chemical Thermodynamics': ['entropy', 'gibbs', 'enthalpy', 'spontaneous', 'isothermal', 'adiabatic', 'isobaric', 'isochoric'],
  'Redox Reactions and Electrochemistry': ['electrolysis', 'galvanic cell', 'emf of the cell', 'standard electrode potential', 'nernst'],
  'Chemical Kinetics': ['first order', 'zero order', 'rate constant', 'activation energy', 'arrhenius'],
  'Organic Compounds Containing Oxygen': ['grignard', 'rmgx', 'ether', 'rcooh', 'phenol', 'aldehyde', 'ketone', 'carboxylic'],
  'Organic Compounds Containing Nitrogen': ['aniline', 'diazotisation', 'nitro', 'amine', 'kjeldahl'],
  'Basic Principles and Techniques': ['aromatic', 'resonance stability', 'conjugation', 'iupac name', 'chromatographic'],
  'Biomolecules': ['peptide', 'protein', 'denaturation', 'amino acid', 'glucose', 'maltose'],
  'Genetics and Evolution': ['mendelian', 'dihybrid', 'pedigree', 'hardy-webster', 'dna', 'rna', 'translation', 'transcription', 'replication', 'hybrid'],
  'Plant Physiology': ['photosynthesis', 'translocation', 'phytohormones', 'gibberellin', 'auxin', 'apoplastic', 'cytokinin'],
  'Cell Structure and Function': ['mitotic', 'chromosome', 'centrioles', 'chromatids', 'spindle'],
  'Ecology and Environment': ['ex situ conservation', 'national park', 'pollution', 'ecosystem', 'trophic']
};

function classifyTopic(subject, body) {
  const text = body.toLowerCase();
  for (const topic in KEYWORD_MAPS) {
    if (TOPICS[subject] && TOPICS[subject].includes(topic)) {
      for (const kw of KEYWORD_MAPS[topic]) {
        if (text.includes(kw.toLowerCase())) {
          return topic;
        }
      }
    }
  }
  // Return the first topic as default if no match
  return TOPICS[subject] ? TOPICS[subject][0] : '';
}

async function parseAndSeed(pdfPath, examName, isDryRun = false) {
  console.log(`Reading PDF: ${pdfPath}`);
  const dataBuffer = fs.readFileSync(pdfPath);
  
  const data = await pdf(dataBuffer);
  const text = data.text;
  console.log(`Successfully extracted ${text.length} characters from PDF.`);

  // 1. Parse Answer Key (usually has format: "1. (d) 2. (c) 3. (a)" etc.)
  const answersMap = {};
  const answerRegex = /\b(\d{1,3})\.\s*\(?([a-d])\)?/g;
  
  // Find where the Answer Key section begins
  const answersStartIndex = text.toLowerCase().indexOf('answers');
  let searchRangeForAnswers = text;
  if (answersStartIndex !== -1) {
    searchRangeForAnswers = text.substring(answersStartIndex);
  }
  
  let match;
  while ((match = answerRegex.exec(searchRangeForAnswers)) !== null) {
    const qNum = parseInt(match[1]);
    const ansOption = match[2].toUpperCase();
    if (!answersMap[qNum]) {
      answersMap[qNum] = ansOption;
    }
  }
  
  console.log(`Parsed ${Object.keys(answersMap).length} answers from Answer Key.`);

  // 2. Parse Explanations Section
  const explanationsMap = {};
  const explanationsStartIndex = text.toLowerCase().indexOf('answer with explanations');
  if (explanationsStartIndex !== -1) {
    const explanationsText = text.substring(explanationsStartIndex);
    const expRegex = /\b(\d{1,3})\.\s*\(?([a-d])\)?([\s\S]*?)(?=\b\d{1,3}\.\s*\(?[a-d]\)?|$)/g;
    let expMatch;
    while ((expMatch = expRegex.exec(explanationsText)) !== null) {
      const qNum = parseInt(expMatch[1]);
      const content = expMatch[3].trim();
      explanationsMap[qNum] = content;
    }
  }
  console.log(`Parsed ${Object.keys(explanationsMap).length} detailed explanations.`);

  // 3. Parse Questions
  const parsedQuestions = [];
  const questionsEndIndex = answersStartIndex !== -1 ? answersStartIndex : (explanationsStartIndex !== -1 ? explanationsStartIndex : text.length);
  const questionsText = text.substring(0, questionsEndIndex);

  const questionRegex = /\b(\d{1,3})\.\s+([\s\S]*?)(?=\b\d{1,3}\.\s+|$)/g;
  let qMatch;
  while ((qMatch = questionRegex.exec(questionsText)) !== null) {
    const qNum = parseInt(qMatch[1]);
    const bodyAndOpts = qMatch[2].trim();

    // Subject mapping based on standard NEET number bounds
    let subject = 'Physics';
    if (qNum >= 51 && qNum <= 100) {
      subject = 'Chemistry';
    } else if (qNum >= 101 && qNum <= 200) {
      subject = 'Biology';
    }

    // Extract options (a), (b), (c), (d)
    const options = [];
    const optRegex = /\(([a-d])\)\s+([\s\S]*?)(?=\([a-d]\)|\n\s*\d{1,3}\.|\n\s*Section-|\n\s*CHEMISTRY|\n\s*BIOLOGY|\n\s*BOTANY|\n\s*ZOOLOGY|$)/gi;
    let optMatch;
    const cleanBodyAndOpts = bodyAndOpts.replace(/\r\n/g, '\n');
    
    const foundOpts = {};
    while ((optMatch = optRegex.exec(cleanBodyAndOpts)) !== null) {
      const optLetter = optMatch[1].toLowerCase();
      const optText = optMatch[2].trim().replace(/\n+/g, ' ');
      foundOpts[optLetter] = optText;
    }

    if (foundOpts.a && foundOpts.b && foundOpts.c && foundOpts.d) {
      options.push(foundOpts.a);
      options.push(foundOpts.b);
      options.push(foundOpts.c);
      options.push(foundOpts.d);
      
      const firstOptIndex = cleanBodyAndOpts.indexOf('(a)');
      const cleanBody = cleanBodyAndOpts.substring(0, firstOptIndex).trim().replace(/\n+/g, ' ');

      const correctOptionLetter = answersMap[qNum] || 'A';
      const correctOptionIndex = ['A', 'B', 'C', 'D'].indexOf(correctOptionLetter);
      const answer = options[correctOptionIndex] || options[0];

      const explanation = explanationsMap[qNum] || 'Verified from Solved Paper.';
      const topic = classifyTopic(subject, cleanBody);

      parsedQuestions.push({
        qNum,
        subject,
        topic,
        body: cleanBody,
        options,
        answer,
        explanation,
        questionType: 'SINGLE',
        marks: 4,
        isPyq: true,
        pyqTag: examName
      });
    }
  }

  console.log(`Parsed ${parsedQuestions.length} valid MCQ questions.`);

  if (isDryRun) {
    console.log('\n--- DRY RUN PREVIEW (First 5 parsed questions) ---');
    parsedQuestions.slice(0, 5).forEach(q => {
      console.log(`\nQ${q.qNum} [${q.subject} -> ${q.topic}]`);
      console.log(`Body: ${q.body}`);
      console.log(`Options:\n  A: ${q.options[0]}\n  B: ${q.options[1]}\n  C: ${q.options[2]}\n  D: ${q.options[3]}`);
      console.log(`Answer: ${q.answer}`);
      console.log(`Explanation: ${q.explanation.substring(0, 150)}...`);
    });
    return;
  }

  // Database insertion
  if (parsedQuestions.length > 0) {
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to Database. Importing questions...');
    
    for (const q of parsedQuestions) {
      const qDoc = new questionBankModel({
        subject: q.subject,
        topic: q.topic,
        body: q.body,
        options: q.options,
        answer: q.answer,
        explanation: q.explanation,
        questionType: q.questionType,
        marks: q.marks,
        isPyq: q.isPyq,
        pyqTag: q.pyqTag
      });
      await qDoc.save();
    }
    console.log(`Successfully uploaded ${parsedQuestions.length} questions to the question bank.`);
    await mongoose.disconnect();
  }
}

// Run parser CLI
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const pdfDir = path.join(__dirname, '../pyq_pdfs');

if (!fs.existsSync(pdfDir)) {
  fs.mkdirSync(pdfDir, { recursive: true });
  console.log(`Created directory: ${pdfDir}. Please copy your solved paper PDF files there.`);
  process.exit(0);
}

const files = fs.readdirSync(pdfDir).filter(f => f.endsWith('.pdf'));
if (files.length === 0) {
  console.log(`No PDF files found in ${pdfDir}. Please copy your Solved Paper PDF files there.`);
  process.exit(0);
}

(async () => {
  try {
    for (const file of files) {
      const examName = file.replace(/_/g, ' ').replace('.pdf', '');
      await parseAndSeed(path.join(pdfDir, file), examName, dryRun);
    }
  } catch (err) {
    console.error('Error during PDF parsing and seeding:', err);
  }
})();
