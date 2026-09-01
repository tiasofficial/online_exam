const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/online-exam-portal';

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB Atlas to clean all remaining UID tags...'))
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

async function cleanRemainingUids() {
  try {
    const questions = await questionBankModel.find({
      body: { $regex: /UID:/i }
    });

    console.log(`Found ${questions.length} questions containing UID text.`);

    const bulkOps = [];

    questions.forEach(q => {
      // Regex matches: " (UID: <anything except close parenthesis>)" optionally followed by ":"
      let cleanedBody = q.body.replace(/\s*\(UID:[^)]+\):?/gi, '');

      if (cleanedBody !== q.body) {
        bulkOps.push({
          updateOne: {
            filter: { _id: q._id },
            update: { $set: { body: cleanedBody } }
          }
        });
      }
    });

    if (bulkOps.length > 0) {
      console.log(`Executing bulk updates for ${bulkOps.length} questions...`);
      const result = await questionBankModel.bulkWrite(bulkOps);
      console.log(`Successfully cleaned ${result.modifiedCount} questions!`);
    } else {
      console.log('No modifications needed.');
    }

    const remaining = await questionBankModel.countDocuments({
      body: { $regex: /UID:[^G]/i } // ignore SVGs comments like "Gate UID" / "Benzene UID"
    });
    console.log(`Remaining text-level UID tags: ${remaining}`);

    process.exit(0);
  } catch (err) {
    console.error('Error during cleaning:', err);
    process.exit(1);
  }
}

cleanRemainingUids();
