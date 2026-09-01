const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://user1:user1@cluster0.p7x7j.mongodb.net/Online-Exam-Portal', { useNewUrlParser: true, useUnifiedTopology: true })
.then(async () => {
  const answersheetModel = require('./backend/models/answersheet');
  const testModel = require('./backend/models/test');
  const classModel = require('./backend/models/class');
  const questionModel = require('./backend/models/question');
  const subjectModel = require('./backend/models/subject');

  const sheets = await answersheetModel.find({ completed: true });
  if(sheets.length === 0) { console.log("NO COMPLETED SHEETS!"); process.exit(); }
  
  const creatorId = sheets[0].student;
  console.log("Using student ID:", creatorId);

  const answersheets = await answersheetModel.find({ student: creatorId, completed: true }).populate({
    path: 'test',
    populate: { path: 'targetClass' }
  });

  console.log("Found answersheets:", answersheets.length);

  const testItemPromises = answersheets.map(async (answersheet) => {
    const test = answersheet.test;
    if (!test) { console.log("NO TEST FOR ANSWERSHEET", answersheet._id); return null; }
    
    console.log("Test title:", test.title);
    return test.title;
  });

  const testItems = await Promise.all(testItemPromises);
  const validTestItems = testItems.filter(t => t !== null);

  console.log("Valid test items:", validTestItems.length);
  process.exit();
}).catch(e => console.log(e));
