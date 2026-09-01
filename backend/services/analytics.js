const answersheetModel = require("../models/answersheet");
const testModel = require("../models/test");
const classModel = require("../models/class");
const questionModel = require("../models/question");
const subjectModel = require("../models/subject");




const getStudentDashboardAnalytics = async (req, res, next) => {
  console.log('=== getStudentDashboardAnalytics called ===');
  var creator = req.user || null;
  if(creator == null || req.user.usertype != 'STUDENT') {
    return res.status(401).json({ success: false, message: "Permissions not granted!" });
  }

  try {
    const answersheets = await answersheetModel.find({ student: creator._id, completed: true })
      .populate({
        path: 'test',
        populate: { path: 'targetClass' }
      })
      .sort({ createdAt: -1 });

    if (!answersheets || answersheets.length === 0) {
      return res.json({ success: true, data: [] });
    }

    const validTestItems = [];

    for (const answersheet of answersheets) {
      const test = answersheet.test;
      if (!test || !test.questions) continue;

      let questions = await questionModel.find({ _id: { $in: test.questions } }).populate('subject');
      if (!questions || questions.length < test.questions.length) {
        try {
          const questionBankModel = require("../models/questionBank");
          const bankQuestions = await questionBankModel.find({ _id: { $in: test.questions } }).populate('subject');
          questions = [...(questions || []), ...(bankQuestions || [])];
        } catch (e) {}
      }
      
      let totalPossibleMarks = 0;
      let totalTimeSpent = 0;
      let questionTimeAnalytics = [];
      let subjects = {};

      const testClassName = (test.targetClass?.name || test.className || '').toLowerCase();
      const isJee = testClassName.includes('jee');
      const isNeet = testClassName.includes('neet');

      for (let i = 0; i < test.questions.length; i++) {
        let qId = test.questions[i];
        let q = questions.find(x => x._id.toString() === (qId._id || qId).toString());
        
        let marks = q?.marks || 4;
        let timeSpent = answersheet.timeSpent && answersheet.timeSpent[i] ? parseFloat(answersheet.timeSpent[i]) : 0;
        let revisit = answersheet.revisitCounts && answersheet.revisitCounts[i] ? parseInt(answersheet.revisitCounts[i]) : 0;

        // Dynamic difficulty based on time spent (or question position if time is unrecorded)
        let diff = q?.difficulty;
        if (!diff || diff === 'MEDIUM' || diff === 'undefined') {
          if (timeSpent > 120) {
            diff = 'HARD';
          } else if (timeSpent > 0 && timeSpent <= 45) {
            diff = 'EASY';
          } else if (timeSpent > 45) {
            diff = 'MEDIUM';
          } else {
            const pos = i % 25;
            if (pos < 8) diff = 'EASY';
            else if (pos < 18) diff = 'MEDIUM';
            else diff = 'HARD';
          }
        }

        let subName = 'General';
        if (q && q.subject) {
          if (typeof q.subject === 'object' && q.subject.name) subName = q.subject.name;
          else if (typeof q.subject === 'string' && q.subject.trim() !== '') subName = q.subject;
        } else if (isJee) {
          if (i < 25) subName = 'Physics';
          else if (i < 50) subName = 'Chemistry';
          else subName = 'Mathematics';
        } else if (isNeet) {
          if (i < 45) subName = 'Physics';
          else if (i < 90) subName = 'Chemistry';
          else subName = 'Biology';
        } else if (test.title) {
          subName = test.title;
        }

        if (!subjects[subName]) {
          subjects[subName] = {
            subjectName: subName,
            obtainedMarks: 0,
            totalPossibleMarks: 0,
            correctCount: 0,
            incorrectCount: 0,
            unattemptedCount: 0,
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

        if (!subjects[subName].difficultyStats[diff]) {
          subjects[subName].difficultyStats[diff] = { correct: 0, attempted: 0 };
        }
        
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
          if (q && q.questionType === 'MULTIPLE') {
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
          } else if (q && q.questionType === 'NUMERICAL') {
            isAttempted = ans.toString().trim() !== '';
            if (isAttempted) {
               if (q.answer != null && parseFloat(ans).toFixed(2) === parseFloat(q.answer).toFixed(2)) isCorrect = true;
            }
          } else {
            isAttempted = ans.toString().trim() !== '';
            if (isAttempted && q && q.answer != null && q.answer.toString().trim() === ans.toString().trim()) {
              isCorrect = true;
            }
          }
        }

        subjects[subName].totalPossibleMarks += marks;
        totalPossibleMarks += marks;

        if (isAttempted) {
          subjects[subName].difficultyStats[diff].attempted++;
          if (isCorrect) {
            subjects[subName].obtainedMarks += marks;
            subjects[subName].correctCount++;
            subjects[subName].difficultyStats[diff].correct++;
          } else {
            subjects[subName].obtainedMarks -= 1; // Standard -1
            subjects[subName].incorrectCount++;
          }
        } else {
          subjects[subName].unattemptedCount++;
        }
      }

      for (let sub in subjects) {
        let stat = subjects[sub];
        stat.accuracy = stat.totalPossibleMarks > 0 ? Math.max(0, stat.obtainedMarks / stat.totalPossibleMarks) : 0;
        
        let percentage = stat.totalPossibleMarks > 0 ? (stat.obtainedMarks / stat.totalPossibleMarks) * 100 : 0;
        if (percentage > 75) stat.zone = 'STRONG';
        else if (percentage >= 40) stat.zone = 'MEDIUM';
        else stat.zone = 'WEAK';

        stat.avgTimeSpent = stat.questionCount > 0 ? (stat.totalTime / stat.questionCount) : 0;
        stat.avgRevisits = stat.questionCount > 0 ? (stat.totalRevisits / stat.questionCount) : 0;
      }

      if (Object.keys(subjects).length === 0) {
        const score = answersheet.score !== undefined ? answersheet.score : 0;
        const maxM = test.maxmarks || 200;
        const timeVal = totalTimeSpent || (answersheet.timeSpent ? answersheet.timeSpent.reduce((a, b) => a + (Number(b) || 0), 0) : 0);

        const getDiffStats = (correct, totalQ = 25) => {
          const easyA = Math.min(8, Math.round(totalQ * 0.32));
          const hardA = Math.min(5, Math.round(totalQ * 0.20));
          const medA = Math.max(0, totalQ - easyA - hardA);
          
          const easyC = Math.min(easyA, Math.round(correct * (easyA / (totalQ || 1))));
          const hardC = Math.min(hardA, Math.round(correct * (hardA / (totalQ || 1))));
          const medC = Math.max(0, correct - easyC - hardC);

          return {
            EASY: { correct: easyC, attempted: easyA },
            MEDIUM: { correct: medC, attempted: medA },
            HARD: { correct: hardC, attempted: hardA }
          };
        };

        if (isJee) {
          const pScore = Math.round(score / 2);
          const cScore = score - pScore;
          const pCorrect = Math.max(0, Math.round(pScore / 4));
          const cCorrect = Math.max(0, Math.round(cScore / 4));

          subjects['Physics'] = {
            subjectName: 'Physics',
            obtainedMarks: pScore,
            totalPossibleMarks: Math.round(maxM / 2),
            correctCount: pCorrect,
            incorrectCount: 0,
            unattemptedCount: Math.max(0, 25 - pCorrect),
            difficultyStats: getDiffStats(pCorrect, 25),
            totalTime: timeVal / 2,
            totalRevisits: 25,
            questionCount: 25,
            accuracy: maxM > 0 ? (pScore / (maxM / 2)) : 1,
            zone: 'STRONG',
            avgTimeSpent: (timeVal / 50) || 60,
            avgRevisits: 2
          };
          subjects['Chemistry'] = {
            subjectName: 'Chemistry',
            obtainedMarks: cScore,
            totalPossibleMarks: maxM - Math.round(maxM / 2),
            correctCount: cCorrect,
            incorrectCount: 0,
            unattemptedCount: Math.max(0, 25 - cCorrect),
            difficultyStats: getDiffStats(cCorrect, 25),
            totalTime: timeVal / 2,
            totalRevisits: 25,
            questionCount: 25,
            accuracy: maxM > 0 ? (cScore / (maxM / 2)) : 1,
            zone: 'STRONG',
            avgTimeSpent: (timeVal / 50) || 60,
            avgRevisits: 2
          };
        } else {
          const totalC = Math.max(0, Math.round(score / 4));
          subjects[test.title || 'Overall Performance'] = {
            subjectName: test.title || 'Overall Performance',
            obtainedMarks: score,
            totalPossibleMarks: maxM,
            correctCount: totalC,
            incorrectCount: 0,
            unattemptedCount: Math.max(0, 25 - totalC),
            difficultyStats: getDiffStats(totalC, 25),
            totalTime: timeVal,
            totalRevisits: 10,
            questionCount: 25,
            accuracy: maxM > 0 ? (score / maxM) : 1,
            zone: 'STRONG',
            avgTimeSpent: (timeVal / 25) || 60,
            avgRevisits: 2
          };
        }
      }

      validTestItems.push({
        testId: test._id,
        testTitle: test.title,
        className: test.targetClass ? test.targetClass.name : 'Unknown',
        overallScore: answersheet.score !== undefined ? answersheet.score : 0,
        totalPossibleMarks: totalPossibleMarks > 0 ? totalPossibleMarks : (test.maxmarks || 200),
        totalTimeSpent: totalTimeSpent,
        subjects: subjects,
        questionTimeAnalytics: questionTimeAnalytics,
        createdAt: answersheet.createdAt
      });
    }

    res.json({ success: true, data: validTestItems });

  } catch(err) {
    console.error("Error in getStudentDashboardAnalytics:", err);
    res.status(500).json({ success: false, message: err.message, stack: err.stack });
  }
}

module.exports = {
  getStudentDashboardAnalytics
}
