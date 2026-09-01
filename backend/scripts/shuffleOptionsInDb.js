const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/online-exam-portal';

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB Atlas to shuffle question options...'))
  .catch(err => console.error('MongoDB connection error:', err));

const questionBankSchema = new mongoose.Schema({
  body: { type: String, required: true },
  options: [{ type: String }],
  answer: { type: mongoose.Schema.Types.Mixed },
  explanation: { type: String }
}, { timestamps: true });

const questionBankModel = mongoose.models.questionbank || mongoose.model('questionbank', questionBankSchema);

// Fisher-Yates Shuffle helper
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function cleanString(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/\\circC/gi, '°C')
    .replace(/\^\\circ C/gi, '°C')
    .replace(/\^\\circ/gi, '°');
}

async function shuffleOptions() {
  try {
    const cursor = questionBankModel.find({}).cursor();

    let count = 0;
    const bulkOps = [];

    for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
      const cleanBody = cleanString(doc.body);
      const cleanOpts = doc.options.map(o => cleanString(o));
      const cleanAns = cleanString(doc.answer);
      const cleanExp = cleanString(doc.explanation);

      // Randomly shuffle options so Option A is NOT always the correct answer!
      const shuffledOpts = shuffleArray(cleanOpts);

      bulkOps.push({
        updateOne: {
          filter: { _id: doc._id },
          update: {
            $set: {
              body: cleanBody,
              options: shuffledOpts,
              answer: cleanAns,
              explanation: cleanExp
            }
          }
        }
      });

      if (bulkOps.length >= 5000) {
        await questionBankModel.bulkWrite(bulkOps);
        count += bulkOps.length;
        console.log(`Shuffled options for ${count} questions...`);
        bulkOps.length = 0;
      }
    }

    if (bulkOps.length > 0) {
      await questionBankModel.bulkWrite(bulkOps);
      count += bulkOps.length;
    }

    console.log('====================================================');
    console.log(`✅ OPTIONS SHUFFLED SUCCESSFULLY FOR ${count} QUESTIONS!`);
    console.log('====================================================');
    process.exit(0);
  } catch (err) {
    console.error('Error during options shuffling:', err);
    process.exit(1);
  }
}

shuffleOptions();
