const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/online-exam-portal';

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB Atlas for Question Bank Deduplication...'))
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

async function deduplicate() {
  try {
    const totalBefore = await questionBankModel.countDocuments({});
    console.log(`Total questions in Question Bank before deduplication: ${totalBefore}`);

    console.log('Finding duplicate questions grouped by body content...');
    const groups = await questionBankModel.aggregate([
      {
        $group: {
          _id: "$body",
          ids: { $push: "$_id" },
          count: { $sum: 1 }
        }
      },
      {
        $match: {
          count: { $gt: 1 }
        }
      }
    ]);

    console.log(`Found ${groups.length} unique question statements with repeated copies.`);

    let idsToDelete = [];
    groups.forEach(g => {
      // Keep the first document, queue the rest for deletion
      const toDelete = g.ids.slice(1);
      idsToDelete.push(...toDelete);
    });

    console.log(`Identified ${idsToDelete.length} total duplicate documents to remove.`);

    if (idsToDelete.length > 0) {
      const chunkSize = 5000;
      let deletedSoFar = 0;
      for (let i = 0; i < idsToDelete.length; i += chunkSize) {
        const chunk = idsToDelete.slice(i, i + chunkSize);
        await questionBankModel.deleteMany({ _id: { $in: chunk } });
        deletedSoFar += chunk.length;
        console.log(`Deleted chunk: ${deletedSoFar} / ${idsToDelete.length} duplicates removed...`);
      }
    }

    const totalAfter = await questionBankModel.countDocuments({});

    console.log('====================================================');
    console.log('✅ DEDUPLICATION COMPLETE!');
    console.log(`INITIAL QUESTIONS : ${totalBefore}`);
    console.log(`REPEATED DELETED  : ${idsToDelete.length}`);
    console.log(`UNIQUE REMAINING  : ${totalAfter}`);
    console.log('====================================================');

    process.exit(0);
  } catch (err) {
    console.error('Error during deduplication:', err);
    process.exit(1);
  }
}

deduplicate();
