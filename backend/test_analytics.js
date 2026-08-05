const mongoose = require('mongoose');
const answersheetModel = require('./models/answersheet');
const testModel = require('./models/test');
const questionModel = require('./models/question');
const subjectModel = require('./models/subject');
const classModel = require('./models/class');

mongoose.connect('mongodb+srv://admin:dBpassword@cluster0.f685bve.mongodb.net/Online-Exam-Portal?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to DB');
    try {
      const answersheets = await answersheetModel.find({ completed: true })
        .populate({
          path: 'test',
          populate: { path: 'targetClass' }
        })
        .sort({ createdAt: -1 });
        
      console.log('Found completed answersheets:', answersheets.length);
      
      const validTestItems = [];

      for (const answersheet of answersheets) {
        const test = answersheet.test;
        if (!test || !test.questions) {
            console.log('Skipping answersheet', answersheet._id, 'because test or test.questions missing');
            continue;
        }

        const questions = await questionModel.find({ _id: { $in: test.questions } }).populate('subject');
        
        let totalPossibleMarks = 0;
        let totalTimeSpent = 0;
        let questionTimeAnalytics = [];
        let subjects = {};
        
        for (let i = 0; i < test.questions.length; i++) {
          let qId = test.questions[i];
          let q = questions.find(x => x._id.toString() === qId.toString());
          if (!q) {
             console.log('Question not found for qId:', qId);
             continue;
          }
          let subName = q.subject ? q.subject.name : 'Uncategorized';
          if (!subjects[subName]) {
            subjects[subName] = {
              subjectName: subName,
              obtainedMarks: 0,
              totalPossibleMarks: 0,
              difficultyStats: {
                EASY: { correct: 0, attempted: 0 },
                MEDIUM: { correct: 0, attempted: 0 },
                HARD: { correct: 0, attempted: 0 }
              },
              totalTime: 0,
              totalRevisits: 0,
              questionCount: 0
            };
          }
  
          let diff = q.difficulty || 'MEDIUM';
          if (!subjects[subName].difficultyStats[diff]) {
            subjects[subName].difficultyStats[diff] = { correct: 0, attempted: 0 };
          }
  
          let timeSpent = answersheet.timeSpent && answersheet.timeSpent[i] ? parseFloat(answersheet.timeSpent[i]) : 0;
          let revisit = answersheet.revisitCounts && answersheet.revisitCounts[i] ? parseInt(answersheet.revisitCounts[i]) : 0;
          
          questionTimeAnalytics.push({
            name: "Q" + (i + 1),
            Time: timeSpent
          });
          
          totalTimeSpent += timeSpent;
          subjects[subName].totalTime += timeSpent;
          subjects[subName].totalRevisits += revisit;
          subjects[subName].questionCount += 1;
  
          let ans = answersheet.answers && answersheet.answers[i] ? answersheet.answers[i] : null;
          let isAttempted = false;
          let isCorrect = false;
  
          if (ans != null) {
            if (q.questionType === 'MULTIPLE') {
              let rawAns = Array.isArray(ans) ? ans : (typeof ans === 'string' && ans !== '' ? ans.split(',') : [ans]);
              let userAns = rawAns.map(a => a != null ? a.toString().trim() : '');
              isAttempted = userAns.length > 0;
              let actualAns = Array.isArray(q.answer) ? q.answer : (typeof q.answer === 'string' && q.answer !== '' ? q.answer.split(',') : [q.answer]);
              actualAns = actualAns.map(a => a != null ? a.toString().trim() : '');
              
              let correctCount = 0;
              let incorrectCount = 0;
              userAns.forEach(a => {
                if (actualAns.includes(a)) correctCount++;
                else incorrectCount++;
              });
              
              if (incorrectCount === 0 && correctCount === actualAns.length) {
                 isCorrect = true;
              }
            } else if (q.questionType === 'NUMERICAL') {
              isAttempted = ans.toString().trim() !== '';
              if (isAttempted) {
                 if (q.answer != null && parseFloat(ans).toFixed(2) === parseFloat(q.answer).toFixed(2)) isCorrect = true;
              }
            } else {
              isAttempted = ans.toString().trim() !== '';
              if (isAttempted && q.answer != null && q.answer.toString().trim() === ans.toString().trim()) {
                isCorrect = true;
              }
            }
          }
  
          subjects[subName].totalPossibleMarks += q.marks;
          totalPossibleMarks += q.marks;
  
          if (isAttempted) {
            subjects[subName].difficultyStats[diff].attempted++;
            if (isCorrect) {
              subjects[subName].obtainedMarks += q.marks;
              subjects[subName].difficultyStats[diff].correct++;
            } else {
              subjects[subName].obtainedMarks -= 1; // Standard -1
            }
          }
        }
      }
      
      console.log('Analytics test finished without throwing');
    } catch (err) {
      console.error('Error during analytics test:', err);
    }
    process.exit(0);
  });
