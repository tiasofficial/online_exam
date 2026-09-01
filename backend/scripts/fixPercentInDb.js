const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/online-exam-portal';

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB Atlas to fix percent formatting...'))
  .catch(err => console.error('MongoDB connection error:', err));

const questionBankSchema = new mongoose.Schema({
  body: { type: String, required: true },
  options: [{ type: String }],
  answer: { type: mongoose.Schema.Types.Mixed },
  explanation: { type: String }
}, { timestamps: true });

const questionBankModel = mongoose.models.questionbank || mongoose.model('questionbank', questionBankSchema);

async function fixPercent() {
  try {
    const cursor = questionBankModel.find({
      $or: [
        { options: /\\text\{\s*%\s*\}/ },
        { answer: /\\text\{\s*%\s*\}/ },
        { body: /\\text\{\s*%\s*\}/ }
      ]
    }).cursor();

    let count = 0;
    const bulkOps = [];

    for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
      const cleanOpts = doc.options.map(o => String(o).replace(/\\text\{\s*%\s*\}/g, '%').replace(/\$([0-9.]+)\\%\$/g, '$1%'));
      const cleanAns = typeof doc.answer === 'string' ? doc.answer.replace(/\\text\{\s*%\s*\}/g, '%').replace(/\$([0-9.]+)\\%\$/g, '$1%') : doc.answer;
      const cleanBody = doc.body.replace(/\\text\{\s*%\s*\}/g, '%');

      bulkOps.push({
        updateOne: {
          filter: { _id: doc._id },
          update: { $set: { options: cleanOpts, answer: cleanAns, body: cleanBody } }
        }
      });

      if (bulkOps.length >= 5000) {
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
    console.log(`✅ FIXED PERCENT FORMATTING ON ${count} QUESTIONS IN MONGODB!`);
    console.log('====================================================');
    process.exit(0);
  } catch (err) {
    console.error('Error during percent fix:', err);
    process.exit(1);
  }
}

fixPercent();
