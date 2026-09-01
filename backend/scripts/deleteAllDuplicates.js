const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/online-exam-portal';

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB Atlas to delete all repetitive questions...'))
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

async function removeAllDuplicates() {
  try {
    const initialCount = await questionBankModel.countDocuments({});
    console.log(`Initial total questions in database: ${initialCount}`);

    console.log('Finding all unique questions by body...');
    // Aggregate to get only the first _id for each unique body
    const uniqueDocs = await questionBankModel.aggregate([
      {
        $group: {
          _id: "$body",
          docId: { $first: "$_id" }
        }
      }
    ]);

    const uniqueIds = uniqueDocs.map(d => d.docId);
    console.log(`Found ${uniqueIds.length} unique questions.`);

    console.log('Deleting all repetitive duplicate questions...');
    const deleteResult = await questionBankModel.deleteMany({
      _id: { $nin: uniqueIds }
    });

    console.log(`Deleted ${deleteResult.deletedCount} repetitive duplicate questions!`);

    const finalCount = await questionBankModel.countDocuments({});
    const distinctCount = (await questionBankModel.distinct('body')).length;

    console.log('====================================================');
    console.log(`✅ FINAL TOTAL QUESTIONS: ${finalCount}`);
    console.log(`✅ DISTINCT QUESTIONS: ${distinctCount}`);
    console.log(`Repetitive duplicate count: ${finalCount - distinctCount} (ZERO DUPLICATES!)`);
    console.log('====================================================');

    process.exit(0);
  } catch (err) {
    console.error('Error during duplicate removal:', err);
    process.exit(1);
  }
}

removeAllDuplicates();
