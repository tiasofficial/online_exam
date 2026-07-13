const mongoose = require('mongoose');
const testModel = require('./backend/models/test');

mongoose.connect('mongodb://localhost:27017/online-exam-portal', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const tests = await testModel.find({});
    console.log(tests.map(t => ({ title: t.title, status: t.status, startTime: t.startTime, endTime: t.endTime })));
    process.exit(0);
  });
