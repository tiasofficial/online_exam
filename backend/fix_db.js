const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://admin:dBpassword@cluster0.f685bve.mongodb.net/Online-Exam-Portal?retryWrites=true&w=majority').then(async () => {
  const db = mongoose.connection;
  await db.collection('questions').updateMany({ difficulty: { $exists: false } }, { $set: { difficulty: 'MEDIUM' } });
  console.log('Fixed difficulty for past questions');
  process.exit();
});
