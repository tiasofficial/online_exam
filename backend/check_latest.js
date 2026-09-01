const mongoose = require('mongoose');
require('dotenv').config({path: './.env'});

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(async () => {
    const Answersheet = require('./models/answersheet');
    const Test = require('./models/test');
    const Question = require('./models/question');
    
    const sheets = await Answersheet.find({completed: true}).sort({updatedAt:-1}).limit(1);
    if(sheets.length===0) {
        console.log('no sheet');
        mongoose.disconnect();
        return;
    }
    const sheet = sheets[0];
    const test = await Test.findById(sheet.test);
    const questions = await Question.find({_id:{$in:test.questions}});
    
    console.log('Score:', sheet.score);
    
    const questionids = test.questions;
    for(let i in questions) {
        let index = -1;
        for(let j in questionids) {
            if(questions[i]._id.toString() === questionids[j].toString()) {
                index = j;
                break;
            }
        }
        console.log('Q'+(parseInt(i)+1), 'Type:', questions[i].questionType, 'Marks:', questions[i].marks, 'Actual:', questions[i].answer);
        console.log('User Ans:', sheet.answers[index]);
    }
    
    mongoose.disconnect();
})
.catch(e => console.log(e));
