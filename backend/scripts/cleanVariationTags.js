const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/online-exam-portal';

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB Atlas to strip Variation tags...'))
  .catch(err => console.error('MongoDB connection error:', err));

const questionBankSchema = new mongoose.Schema({
  body: { type: String, required: true },
  options: [{ type: String }],
  answer: { type: mongoose.Schema.Types.Mixed },
  subject: { type: String },
  examType: { type: String },
  topic: { type: String },
  questionType: { type: String },
  marks: { type: Number },
  explanation: { type: String },
  isPyq: { type: Boolean },
  pyqTag: { type: String }
}, { timestamps: true });

const questionBankModel = mongoose.models.questionbank || mongoose.model('questionbank', questionBankSchema);

async function removeVariationTags() {
  try {
    console.log('Finding all questions with (Variation #...) in body...');
    const questions = await questionBankModel.find({ body: /\\\(Variation #\d+\\\)/ });

    console.log(`Found ${questions.length} questions to clean.`);

    let updatedCount = 0;
    const bulkOps = [];

    const cursor = questionBankModel.find({ body: /\(Variation #\d+\)/ }).cursor();

    for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
      const cleanBody = doc.body.replace(/\s*\(Variation #\d+\)/gi, '').trim();
      bulkOps.push({
        updateOne: {
          filter: { _id: doc._id },
          update: { $set: { body: cleanBody } }
        }
      });

      if (bulkOps.length >= 5000) {
        await questionBankModel.bulkWrite(bulkOps);
        updatedCount += bulkOps.length;
        console.log(`Updated ${updatedCount} questions so far...`);
        bulkOps.length = 0;
      }
    }

    if (bulkOps.length > 0) {
      await questionBankModel.bulkWrite(bulkOps);
      updatedCount += bulkOps.length;
    }

    console.log('====================================================');
    console.log(`✅ CLEANUP COMPLETE! Stripped (Variation #...) tags from ${updatedCount} questions!`);
    console.log('====================================================');
    process.exit(0);
  } catch (err) {
    console.error('Error during cleanup:', err);
    process.exit(1);
  }
}

removeVariationTags();
