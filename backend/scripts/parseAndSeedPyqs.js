const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const { PDFParse: PDFParser } = require('c:/Users/sayan/Downloads/exam_online/backend/node_modules/pdf-parse');
const { createWorker } = require('c:/Users/sayan/Downloads/exam_online/backend/node_modules/tesseract.js');
const { createCanvas, loadImage } = require('c:/Users/sayan/Downloads/exam_online/backend/node_modules/@napi-rs/canvas');

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/online-exam-portal';

const questionBankSchema = require('../schemas/questionBank');
const questionBankModel = mongoose.models.questionbank || mongoose.model('questionbank', questionBankSchema);

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

const KEYWORD_MAPS = {
  'Rotational Motion': ['rotational', 'moment of inertia', 'angular speed', 'radius of gyration', 'disc', 'torque', 'angular acceleration'],
  'Magnetic Effects of Current and Magnetism': ['biot-savart', 'magnetic field', 'solenoid', 'magnetic flux', 'magnetic dipole', 'permeability'],
  'Dual Nature of Matter and Radiation': ['de-broglie', 'wavelength', 'photoelectric', 'stopping potential', 'work function', 'threshold frequency'],
  'Electronic Devices': ['semiconductor', 'logic circuit', 'truth table', 'p-n junction', 'diode', 'gate', 'rectification'],
  'Gravitation': ['gravitational', 'elliptical orbit', 'kepler', 'satellite'],
  'Laws of Motion': ['tension', 'free fall', 'friction', 'acceleration', 'newton'],
  'Electrostatics': ['capacitor', 'capacitance', 'dielectric', 'equipotential', 'electric lines of force'],
  'Current Electricity': ['resistance', 'resistor', 'potentiometer', 'internal resistance', 'ohm', 'galvanic', 'electrolysis'],
  'Optics': ['refractive index', 'lens', 'biconvex', 'refracted ray', 'critical angle', 'refraction'],
  'Atoms and Nuclei': ['bohr', 'hydrogen atom', 'excited state', 'nuclear reaction', 'nucleus', 'radioactive', 'binding energy'],
  'Thermodynamics': ['adiabatic', 'isothermal', 'isobaric', 'isochoric', 'carnot', 'entropy', 'heat engine'],
  'Oscillations and Waves': ['simple harmonic', 'oscillat', 'amplitude', 'frequency', 'wavelength', 'resonance'],
  'Kinematics': ['velocity', 'projectile', 'displacement', 'uniform motion'],
  'Chemical Thermodynamics': ['gibbs', 'enthalpy', 'spontaneous'],
  'Redox Reactions and Electrochemistry': ['electrolysis', 'galvanic cell', 'emf of the cell', 'standard electrode potential', 'nernst'],
  'Chemical Kinetics': ['first order', 'zero order', 'rate constant', 'activation energy', 'arrhenius'],
  'Organic Compounds Containing Oxygen': ['grignard', 'rmgx', 'ether', 'phenol', 'aldehyde', 'ketone', 'carboxylic'],
  'Organic Compounds Containing Nitrogen': ['aniline', 'diazotisation', 'nitro', 'amine', 'kjeldahl'],
  'Basic Principles and Techniques': ['aromatic', 'resonance stability', 'iupac name', 'chromatographic'],
  'Biomolecules': ['peptide', 'protein', 'denaturation', 'amino acid', 'glucose', 'maltose'],
  'Genetics and Evolution': ['mendelian', 'dihybrid', 'pedigree', 'dna', 'rna', 'translation', 'transcription', 'replication'],
  'Plant Physiology': ['photosynthesis', 'translocation', 'phytohormones', 'gibberellin', 'auxin', 'cytokinin'],
  'Cell Structure and Function': ['mitotic', 'chromosome', 'centrioles', 'chromatids', 'spindle'],
  'Ecology and Environment': ['ex situ conservation', 'national park', 'pollution', 'ecosystem', 'trophic']
};

function classifyTopic(subject, body) {
  const text = body.toLowerCase();
  for (const topic in KEYWORD_MAPS) {
    if (TOPICS[subject] && TOPICS[subject].includes(topic)) {
      for (const kw of KEYWORD_MAPS[topic]) {
        if (text.includes(kw.toLowerCase())) return topic;
      }
    }
  }
  return TOPICS[subject] ? TOPICS[subject][0] : 'General';
}

// FIX 1: Correct number-to-option mapping
// For numbered options: (1)=A, (2)=B, (3)=C, (4)=D
// For lettered options: (a)=A, (b)=B, (c)=C, (d)=D
// Common OCR misreads: 'e','o','0' for 'c'; 'y' for 'd'
function mapOption(code) {
  code = code.toUpperCase();
  if (code === 'A' || code === '1') return 'A';
  if (code === 'B' || code === '2') return 'B';
  if (code === 'C' || code === '3' || code === '0' || code === 'O' || code === 'E') return 'C';
  if (code === 'D' || code === '4' || code === 'Y') return 'D';
  return null;
}

function parseExplanations(text, map) {
  const parts = text.split(/(?=\b\d{1,3}[\.\s\,0\-]+\(?[\w\d]\)?)/i);
  for (const part of parts) {
    const match = part.match(/^\b(\d{1,3})[\.\s\,0\-]+\(?([a-d0-9oO])\)?\s*([\s\S]*)/i);
    if (match) {
      const qNum = parseInt(match[1]);
      const optionLetter = mapOption(match[2]);
      if (optionLetter) {
        const explanation = match[3].trim().replace(/\n+/g, ' ');
        if (explanation.length > 5) {
          if (!map[qNum] || map[qNum].explanation.length < explanation.length) {
            map[qNum] = { option: optionLetter, explanation };
          }
        }
      }
    }
  }
}

// FIX 2: Strict bracket-based option detection
// Only match (a), {b), [c), (d) OR (1), (2), (3), (4) with EXPLICIT brackets
// This prevents matching single letters inside question body text
function extractOptionsRobust(text) {
  const MIN_BODY_LENGTH = 30; // skip false matches in the first 30 chars

  // Opening chars: (, {, [, and OCR misreads: f, l, t  (never plain \b or space)
  // Captured: a-d (letters), 1-4 (numbers), e/o (OCR misreads of 'c')
  // Closing: ), }, ], and OCR misreads: /, \, -, y, .  (not bare space)
  const regex = /[\(\{\[flt]([a-d1-4eo])[\)\}\]\/\\\-y\.]\s*/gi;

  const matches = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index < MIN_BODY_LENGTH) continue;
    const optionType = mapOption(match[1]);
    if (optionType) {
      matches.push({ index: match.index, length: match[0].length, type: optionType });
    }
  }

  // Find the first valid A -> B -> C -> D sequence
  let aM = null, bM = null, cM = null, dM = null;
  for (const m of matches) {
    if (m.type === 'A' && !aM) aM = m;
    else if (m.type === 'B' && aM && !bM && m.index > aM.index) bM = m;
    else if (m.type === 'C' && bM && !cM && m.index > bM.index) cM = m;
    else if (m.type === 'D' && cM && !dM && m.index > cM.index) dM = m;
  }

  // Fallback: find any markers in index order (one per type)
  if (!aM || !bM || !cM || !dM) {
    aM = matches.find(m => m.type === 'A');
    bM = matches.find(m => m.type === 'B' && (!aM || m.index > aM.index));
    cM = matches.find(m => m.type === 'C' && (!bM || m.index > bM.index));
    dM = matches.find(m => m.type === 'D' && (!cM || m.index > cM.index));
  }

  // Fallback: split the text by newlines and take last 4 non-empty lines as options
  if (!aM || !bM || !cM || !dM) {
    const lines = text.split(/\n+/).map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length >= 5) {
      return {
        body: lines.slice(0, lines.length - 4).join(' '),
        options: lines.slice(lines.length - 4)
      };
    }
    // Last resort: proportional split
    return {
      body: text.substring(0, Math.floor(text.length * 0.55)).trim(),
      options: [
        text.substring(Math.floor(text.length * 0.55), Math.floor(text.length * 0.7)).trim(),
        text.substring(Math.floor(text.length * 0.7), Math.floor(text.length * 0.8)).trim(),
        text.substring(Math.floor(text.length * 0.8), Math.floor(text.length * 0.9)).trim(),
        text.substring(Math.floor(text.length * 0.9)).trim()
      ]
    };
  }

  return {
    body: text.substring(0, aM.index).trim(),
    options: [
      text.substring(aM.index + aM.length, bM.index).trim(),
      text.substring(bM.index + bM.length, cM.index).trim(),
      text.substring(cM.index + cM.length, dM.index).trim(),
      text.substring(dM.index + dM.length).trim()
    ]
  };
}

function parseQuestions(text, answersMap, examName, examYear) {
  const parsed = [];
  const parts = text.split(/(?=\b\d{1,3}\.\s+)/);

  for (const part of parts) {
    const match = part.match(/^\s*(\d{1,3})\.\s+([\s\S]+)/);
    if (match) {
      const qNum = parseInt(match[1]);
      const content = match[2].trim();
      const { body, options } = extractOptionsRobust(content);

      if (body.length > 5 && options.every(opt => opt.length > 0)) {
        // Determine subject by question number
        let subject = 'Physics';
        if (qNum >= 51 && qNum <= 100) subject = 'Chemistry';
        else if (qNum >= 101) subject = 'Biology';

        const ansObj = answersMap[qNum];
        let correctOptionLetter = 'A';
        let explanation = 'Verified from Solved Paper.';
        if (ansObj) {
          correctOptionLetter = ansObj.option;
          explanation = ansObj.explanation;
        }

        const correctIndex = ['A', 'B', 'C', 'D'].indexOf(correctOptionLetter);
        const answer = options[correctIndex] || options[0];
        const topic = classifyTopic(subject, body);

        parsed.push({
          qNum, body, options, answer, subject, topic, explanation,
          questionType: 'SINGLE',
          examType: 'NEET',        // FIX 3: set examType (was defaulting to 'BOTH')
          source_type: 'PYQ',
          source_exam: 'NEET',
          source_year: examYear,
          marks: 4,
          isPyq: true,
          pyqTag: examName
        });
      }
    }
  }
  return parsed;
}

async function processPdf(pdfPath, examName, examYear, worker) {
  console.log(`\n============================================================`);
  console.log(`Processing: ${pdfPath}`);
  console.log(`============================================================`);

  const fileData = fs.readFileSync(pdfPath);
  const p = new PDFParser(new Uint8Array(fileData));
  const doc = await p.load();
  const totalPages = doc.numPages;
  console.log(`Total Pages: ${totalPages}`);

  const explStartPage = Math.floor(totalPages * 0.6);
  const explPages = [];
  for (let i = explStartPage; i <= totalPages; i++) explPages.push(i);

  console.log(`[Pass 1] Scanning explanations pages ${explStartPage}–${totalPages}...`);
  const explScreenshots = await p.getScreenshot({ partial: explPages, imageBuffer: true, scale: 2.5 });

  const answersMap = {};
  for (const pageNum of explPages) {
    const pageObj = explScreenshots.pages.find(pg => pg.pageNumber === pageNum);
    if (!pageObj) continue;
    console.log(`  Explanation page ${pageNum}...`);
    const img = await loadImage(pageObj.data);
    const W = img.width, H = img.height;

    const leftCanvas = createCanvas(W / 2, H);
    leftCanvas.getContext('2d').drawImage(img, 0, 0);
    const rightCanvas = createCanvas(W / 2, H);
    rightCanvas.getContext('2d').drawImage(img, -W / 2, 0);

    const leftOcr = await worker.recognize(leftCanvas.toBuffer('image/png'));
    const rightOcr = await worker.recognize(rightCanvas.toBuffer('image/png'));
    parseExplanations(leftOcr.data.text, answersMap);
    parseExplanations(rightOcr.data.text, answersMap);
  }
  console.log(`[Pass 1] Done. Answers found: ${Object.keys(answersMap).length}`);

  const questionPages = [];
  for (let i = 1; i < explStartPage; i++) questionPages.push(i);

  console.log(`[Pass 2] Scanning question pages 1–${explStartPage - 1}...`);
  const questionScreenshots = await p.getScreenshot({ partial: questionPages, imageBuffer: true, scale: 2.5 });

  let allParsedQuestions = [];
  for (const pageNum of questionPages) {
    const pageObj = questionScreenshots.pages.find(pg => pg.pageNumber === pageNum);
    if (!pageObj) continue;
    console.log(`  Question page ${pageNum}...`);
    const img = await loadImage(pageObj.data);
    const W = img.width, H = img.height;

    const leftCanvas = createCanvas(W / 2, H);
    leftCanvas.getContext('2d').drawImage(img, 0, 0);
    const rightCanvas = createCanvas(W / 2, H);
    rightCanvas.getContext('2d').drawImage(img, -W / 2, 0);

    const leftOcr = await worker.recognize(leftCanvas.toBuffer('image/png'));
    const rightOcr = await worker.recognize(rightCanvas.toBuffer('image/png'));

    allParsedQuestions = allParsedQuestions
      .concat(parseQuestions(leftOcr.data.text, answersMap, examName, examYear))
      .concat(parseQuestions(rightOcr.data.text, answersMap, examName, examYear));
  }
  console.log(`[Pass 2] Done. Valid MCQs parsed: ${allParsedQuestions.length}`);
  return allParsedQuestions;
}

(async () => {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const fileArg = args.find(arg => arg.startsWith('--file='));
  const pdfDir = path.join(__dirname, '../pyq_pdfs');

  let files = fs.readdirSync(pdfDir).filter(f => f.endsWith('.pdf'));
  if (fileArg) {
    const targetFile = fileArg.split('=')[1];
    files = files.filter(f => f === targetFile);
  }

  if (files.length === 0) {
    console.log(`No PDF files found in ${pdfDir}.`);
    process.exit(0);
  }

  console.log('Initializing Tesseract Worker...');
  const worker = await createWorker('eng');

  try {
    let allExtractedQuestions = [];
    for (const file of files) {
      const examName = file.replace(/_/g, ' ').replace('.pdf', '');
      // Extract year from filename, e.g. "NEET_Solved_Paper_2022.pdf" -> 2022
      const yearMatch = file.match(/(\d{4})/);
      const examYear = yearMatch ? parseInt(yearMatch[1]) : null;
      const pdfPath = path.join(pdfDir, file);
      const questions = await processPdf(pdfPath, examName, examYear, worker);
      allExtractedQuestions = allExtractedQuestions.concat(questions);
    }

    console.log(`\n============================================================`);
    console.log(`Grand total extracted questions: ${allExtractedQuestions.length}`);
    console.log(`============================================================`);

    if (dryRun) {
      console.log('\n--- DRY RUN PREVIEW (First 5 parsed questions) ---');
      allExtractedQuestions.slice(0, 5).forEach(q => {
        console.log(`\nQ${q.qNum} [${q.subject} -> ${q.topic}] (${q.pyqTag})`);
        console.log(`Body: ${q.body}`);
        console.log(`A: ${q.options[0]}`);
        console.log(`B: ${q.options[1]}`);
        console.log(`C: ${q.options[2]}`);
        console.log(`D: ${q.options[3]}`);
        console.log(`Answer: ${q.answer}`);
        console.log(`examType: ${q.examType} | source_year: ${q.source_year}`);
      });
    } else {
      console.log('Connecting to MongoDB...');
      await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log('Connected! Clearing question bank...');
      await questionBankModel.deleteMany({});
      console.log('Cleared. Inserting questions...');

      let insertedCount = 0;
      for (const q of allExtractedQuestions) {
        const qDoc = new questionBankModel({
          body: q.body,
          options: q.options,
          answer: q.answer,
          subject: q.subject,
          topic: q.topic,
          explanation: q.explanation,
          questionType: q.questionType,
          examType: q.examType,
          source_type: q.source_type,
          source_exam: q.source_exam,
          source_year: q.source_year,
          marks: q.marks,
          isPyq: q.isPyq,
          pyqTag: q.pyqTag
        });
        await qDoc.save();
        insertedCount++;
      }
      console.log(`\nSuccessfully uploaded ${insertedCount} PYQ questions to the database.`);
      await mongoose.disconnect();
      console.log('MongoDB disconnected.');
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await worker.terminate();
    console.log('Tesseract Worker terminated.');
  }
})();
