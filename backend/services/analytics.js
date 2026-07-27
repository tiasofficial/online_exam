const answersheetModel = require("../models/answersheet");
const testModel = require("../models/test");
const classModel = require("../models/class");
const questionModel = require("../models/question");
const subjectModel = require("../models/subject");



const getStudentDashboardAnalytics = async (req, res, next) => {
  console.log("=== getStudentDashboardAnalytics called ===");
  var creator = req.user || null;
  if(creator == null || req.user.usertype != 'STUDENT') {
    console.log("Unauthorized or not a student");
    return res.status(401).json({ success: false, message: "Permissions not granted!" });
  }

  try {
    console.log("Fetching answersheets for student:", creator._id);
    const answersheets = await answersheetModel.find({ student: creator._id, completed: true });
    console.log("Answersheets found:", answersheets.length);

    if (!answersheets || answersheets.length === 0) {
      console.log("Returning empty data (no answersheets)");
      return res.json({ success: true, data: [] });
    }

    const testItemPromises = answersheets.map(async (answersheet) => {
      console.log("Processing answersheet:", answersheet._id, "Test ID:", answersheet.test);
      const test = await testModel.findById(answersheet.test).populate('targetClass');
      if (!test) {
        console.log("Test not found in DB for ID:", answersheet.test);
        return null;
      }
      console.log("Test found:", test.title, "Questions length:", test.questions ? test.questions.length : 0);

      const questions = await questionModel.find({ _id: { $in: test.questions } }).populate('subject');
      
      let totalPossibleMarks = 0;
      let totalTimeSpent = 0;
      let questionTimeAnalytics = [];
      
      let subjects = {};

      for (let i = 0; i < test.questions.length; i++) {
        let qId = test.questions[i];
        let q = questions.find(x => x._id.toString() === qId.toString());
        if (!q) continue;

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
          name: `Q${i + 1}`,
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
               if (parseFloat(ans).toFixed(2) === parseFloat(q.answer).toFixed(2)) isCorrect = true;
            }
          } else {
            isAttempted = ans.toString().trim() !== '';
            if (isAttempted && q.answer.toString().trim() === ans.toString().trim()) {
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

      console.log("Finished questions loop for test", test.title);
      console.log("Total Possible Marks:", totalPossibleMarks);

      for (let sub in subjects) {
        let stat = subjects[sub];
        stat.accuracy = stat.totalPossibleMarks > 0 ? (stat.obtainedMarks / stat.totalPossibleMarks) : 0;
        
        let percentage = (stat.obtainedMarks / stat.totalPossibleMarks) * 100;
        if (percentage > 75) stat.zone = 'STRONG';
        else if (percentage >= 40) stat.zone = 'MEDIUM';
        else stat.zone = 'WEAK';

        stat.avgTimeSpent = stat.questionCount > 0 ? (stat.totalTime / stat.questionCount) : 0;
        stat.avgRevisits = stat.questionCount > 0 ? (stat.totalRevisits / stat.questionCount) : 0;
      }

      return {
        testId: test._id,
        testTitle: test.title,
        className: test.targetClass ? test.targetClass.name : 'Unknown',
        overallScore: answersheet.score,
        totalPossibleMarks: totalPossibleMarks,
        totalTimeSpent: totalTimeSpent,
        subjects: subjects,
        questionTimeAnalytics: questionTimeAnalytics
      };
    });

    const testItems = await Promise.all(testItemPromises);
    const validTestItems = testItems.filter(t => t !== null);
    
    console.log("Final validTestItems length:", validTestItems.length);

    res.json({ success: true, data: validTestItems });

  } catch(err) {
    console.error("Error in getStudentDashboardAnalytics:", err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

module.exports = {
  getStudentDashboardAnalytics
}
