const mongoose = require('mongoose');
const testSchema = require('./schemas/test');
const testModel = mongoose.model('test', testSchema);
mongoose.connect('mongodb+srv://admin:dBpassword@cluster0.f685bve.mongodb.net/Online-Exam-Portal?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const updated = await testModel.updateOne(
      { title: 'week 1' },
      { $set: { targetSubject: '6a43fe64ba8dde3524f46352' } }
    );
    console.log(updated);
    process.exit(0);
  });
