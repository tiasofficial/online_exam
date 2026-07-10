const mongoose = require('mongoose');
const testSchema = require('./schemas/test');
const testModel = mongoose.model('test', testSchema);
mongoose.connect('mongodb+srv://admin:dBpassword@cluster0.f685bve.mongodb.net/Online-Exam-Portal?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const qs = await testModel.find({ title: 'week 1' });
    console.log(JSON.stringify(qs, null, 2));
    process.exit(0);
  });
