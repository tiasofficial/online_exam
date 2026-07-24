const mongoose = require('mongoose');
const questionSchema = require('./schemas/question');
const questionModel = mongoose.model('question', questionSchema);
mongoose.connect('mongodb+srv://admin:dBpassword@cluster0.f685bve.mongodb.net/Online-Exam-Portal?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const qs = await questionModel.find({ body: { $in: ['gngn', 'gtfn', 'fhhh'] } });
    console.log(JSON.stringify(qs, null, 2));
    process.exit(0);
  });
