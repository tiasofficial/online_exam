const answersheetModel = require("../models/answersheet");
const testModel = require("../models/test");
const subjectModel = require("../models/subject");
const testService = require("./test");

const getAllCompletedTest = (req,res,next) => {
  var creator = req.user || null;
  if(creator == null || req.user.usertype != 'STUDENT') {
    res.status(401).json({
      success : false,
      message : "Permissions not granted!"
    })
  } 

  answersheetModel.find({student:creator._id, completed:true},{test:1})
  .then(result => {
    var testids = result.map(x => (x.test))
    testModel.find({_id:{$in:testids}}).sort({resultTime:-1})
    .then(tests => {
      for(var i in tests) {
        var correctStatus = testService.getTestStatus(tests[i]);
        if(correctStatus !== tests[i].status) {
          testService.updateStatus(tests[i],correctStatus);
          tests[i].status = correctStatus;
        }
      }

      res.json({
        success : true,
        completedtestlist : tests.map(t => ({
          _id: t._id,
          title:t.title,
          status : t.status,
          maxmarks : t.maxmarks,
          subjects : t.subjects
        }))
      })
    })
    .catch(err => {
      console.log(err);
      res.json({
        success : false,
        message : 'Internal server error in test'
      })
    })
  }).catch(err => {
    console.log(err);
    res.json({
      success : false,
      message : 'Internal server error in answersheet'
    })
  })
}

const getResultMainDetailsByTestId = async (req, res, next) => {
  var creator = req.user || null;
  if(creator == null || req.user.usertype != 'STUDENT') {
    res.status(401).json({
      success : false,
      message : "Permissions not granted!"
    })
  }

  req.check('testid','Test id not found').notEmpty();

  var errors = req.validationErrors()
  if(errors) {
    console.log(errors);
    res.json({
      success:false,
      message: 'Invalid inputs',
      errors : errors
    })
    return;
  }

  try {
    const testRegistrationModel = require('../models/testRegistration');
    const answersheets = await answersheetModel.find({student:creator._id, test:req.body.testid, completed:true});
    
    if (!answersheets[0]) {
      return res.json({ success: false, message: 'Answer sheet not found' });
    }

    const test = await testModel.findById(req.body.testid).populate('targetClass');
    if (!test) {
      return res.json({ success: false, message: 'Test not found' });
    }

    var correctStatus = testService.getTestStatus(test);
    if(correctStatus !== test.status) {
      testService.updateStatus(test, correctStatus);
      test.status = correctStatus;
    }

    // Check if this student was reassigned — if so, result is available immediately after completion
    const reg = await testRegistrationModel.findOne({ test: test._id, user: creator._id });
    const isReassigned = !!(reg && reg.reassignEndTime);
    const effectiveResultDeclared = (test.status === 'RESULT_DECLARED') || isReassigned;

    let subjectIds = [...(test.subjects || [])];
    if (test.targetSubject) subjectIds.push(test.targetSubject);
    const subjects = await subjectModel.find({_id:{$in:subjectIds}},{name:1});
    const subs = subjects.map(sub => sub.name).join(', ');

    let studentRank = null;
    let leaderboard = [];
    if (test.status === 'RESULT_DECLARED') {
      // Full leaderboard only when globally declared
      const allAnswersheets = await answersheetModel.find({ test: test._id, completed: true }).populate('student', 'username email');
      allAnswersheets.sort((a, b) => b.score - a.score);
      leaderboard = allAnswersheets.map((sheet, index) => {
        if (sheet.student._id.toString() === creator._id.toString()) {
          studentRank = index + 1;
        }
        return {
          rank: index + 1,
          studentName: sheet.student.username,
          score: sheet.score,
          isCurrentUser: sheet.student._id.toString() === creator._id.toString()
        };
      });
    }

    res.json({
      success: true,
      result: {
        title: test.title,
        status: effectiveResultDeclared ? 'RESULT_DECLARED' : test.status,
        maxmarks: test.maxmarks,
        subjects: subs,
        score: answersheets[0].score,
        questions: test.questions,
        answers: answersheets[0].answers,
        timeSpent: answersheets[0].timeSpent,
        revisitCounts: answersheets[0].revisitCounts,
        rank: studentRank,
        leaderboard: leaderboard,
        className: test.targetClass ? test.targetClass.name : '',
        examType: test.targetClass ? test.targetClass.examType : ''
      }
    });
  } catch(err) {
    console.log(err);
    res.json({ success: false, message: 'Internal server error' });
  }

}

const classModel = require("../models/class");
const userModel = require("../models/user");

const getTestResultsForTeacher = async (req, res, next) => {
  var creator = req.user || null;
  if(creator == null || req.user.usertype != 'TEACHER') {
    return res.status(401).json({ success: false, message: "Permissions not granted!" });
  }
  
  const testid = req.body.testid;
  try {
    const answersheets = await answersheetModel.find({ test: testid, completed: true }).populate('student', 'username email');
    const test = await testModel.findById(testid).populate('targetClass');
    
    // Sort answersheets by score descending
    answersheets.sort((a, b) => b.score - a.score);
    
    let rankedResults = answersheets.map((sheet, index) => ({
      _id: sheet._id,
      studentName: sheet.student.username,
      studentEmail: sheet.student.email,
      score: sheet.score,
      rank: index + 1
    }));
    
    res.json({ success: true, results: rankedResults, testTitle: test.title, targetClass: test.targetClass ? test.targetClass.name : 'All Classes' });
  } catch(err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
const questionModel = require("../models/question");

const getStudentResultDetailsForTeacher = async (req, res, next) => {
  var creator = req.user || null;
  if(creator == null || req.user.usertype != 'TEACHER') {
    return res.status(401).json({ success: false, message: "Permissions not granted!" });
  }
  
  const answersheetId = req.body.answersheetId;
  try {
    const answersheet = await answersheetModel.findById(answersheetId).populate('student', 'username email');
    if (!answersheet) {
      return res.status(404).json({ success: false, message: "Answersheet not found" });
    }
    
    const test = await testModel.findById(answersheet.test);
    if (!test) {
      return res.status(404).json({ success: false, message: "Test not found" });
    }
    
    // Fetch the actual questions to get their text, options, correct answers
    const questions = await questionModel.find({ _id: { $in: test.questions } });
    
    // Create an ordered array of questions matching the test's question array order
    const orderedQuestions = test.questions.map(qId => 
      questions.find(q => q._id.toString() === qId.toString())
    );

    res.json({
      success: true,
      result: {
        studentName: answersheet.student.username,
        studentEmail: answersheet.student.email,
        score: answersheet.score,
        testTitle: test.title,
        questions: orderedQuestions, // Detailed question objects
        answers: answersheet.answers, // Array of strings (Student's answers)
        timeSpent: answersheet.timeSpent,
        revisitCounts: answersheet.revisitCounts
      }
    });
  } catch(err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

module.exports = {
  getAllCompletedTest,
  getResultMainDetailsByTestId,
  getTestResultsForTeacher,
  getStudentResultDetailsForTeacher
}