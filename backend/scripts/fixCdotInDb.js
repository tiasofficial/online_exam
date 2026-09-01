const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/online-exam-portal';

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB Atlas to fix LaTeX cdot rendering...'))
  .catch(err => console.error('MongoDB connection error:', err));

const questionBankSchema = new mongoose.Schema({
  body: { type: String, required: true },
  options: [{ type: String }],
  answer: { type: mongoose.Schema.Types.Mixed },
  explanation: { type: String }
}, { timestamps: true });

const questionBankModel = mongoose.models.questionbank || mongoose.model('questionbank', questionBankSchema);

function cleanString(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/\\cdotm/gi, ' · m')
    .replace(/\\cdot([a-zA-Z0-9])/gi, ' · $1')
    .replace(/\\cdot\b/gi, ' · ');
}

async function fixCdot() {
  try {
    const cursor = questionBankModel.find({
      $or: [
        { body: /\\cdot/i },
        { options: /\\cdot/i },
        { answer: /\\cdot/i },
        { explanation: /\\cdot/i }
      ]
    }).cursor();

    let count = 0;
    const bulkOps = [];

    for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
      const cleanBody = cleanString(doc.body);
      const cleanOpts = doc.options.map(o => cleanString(o));
      const cleanAns = cleanString(doc.answer);
      const cleanExp = cleanString(doc.explanation);

      bulkOps.push({
        updateOne: {
          filter: { _id: doc._id },
          update: {
            $set: {
              body: cleanBody,
              options: cleanOpts,
              answer: cleanAns,
              explanation: cleanExp
            }
          }
        }
      });

      if (bulkOps.length >= 2000) {
        await questionBankModel.bulkWrite(bulkOps);
        count += bulkOps.length;
        console.log(`Updated ${count} questions...`);
        bulkOps.length = 0;
      }
    }

    if (bulkOps.length > 0) {
      await questionBankModel.bulkWrite(bulkOps);
      count += bulkOps.length;
    }

    console.log('====================================================');
    console.log(`✅ CDOT CLEANED IN DATABASE FOR ${count} QUESTIONS!`);
    console.log('====================================================');
    process.exit(0);
  } catch (err) {
    console.error('Error during cleanup:', err);
    process.exit(1);
  }
}

fixCdot();
