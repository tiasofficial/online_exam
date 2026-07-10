var testModel = require('../models/test');
var questionModel = require('../models/question');
const testRegistrationModel = require('../models/testRegistration');
const classModel = require('../models/class');
const { uploadFile } = require('./cloudinary');

var getTestStatus = (test) => {
  if(test.status === 'CANCELLED')
    return test.status;
  var status = 'CREATED'
  var now = new Date();
  if(Date.parse(test.resultTime) < now) {
    status = 'RESULT_DECLARED';
  } else if(Date.parse(test.endTime) < now) {
    status = 'TEST_COMPLETE';
  } else if(Date.parse(test.startTime) < now) {
    status = 'TEST_STARTED';
  } else if(Date.parse(test.regEndTime) < now) {
    status = 'REGISTRATION_COMPLETE'
  } else if(Date.parse(test.regStartTime) < now) {
    status = 'REGISTRATION_STARTED';
  }


  return status;
}

var generateTestpaper =  async(subjects, maxmarks, queTypes) => {
  templist = [];
  quelist = [];
  anslist = [];
  totalMarks = 0;
  try {
    const allQuestions = await questionModel.find({status:true,subject:{$in:subjects},marks:{$in:queTypes}});
    for(var x in allQuestions) {
      totalMarks += allQuestions[x].marks;
    }
    if(totalMarks<maxmarks) {
      console.log('not enough question for subjects');
    } else {
      var remaining = maxmarks;
      var qIndexSet = new Set();
      while(remaining>0) {
        var i = Math.floor(Math.random()*allQuestions.length);
        if(qIndexSet.has(i) || allQuestions[i].marks > remaining) {
          continue;
        } else {
          qIndexSet.add(i);
          quelist.push(allQuestions[i]._id);
          anslist.push(allQuestions[i].answer);
          remaining -= allQuestions[i].marks;
        }
      }
    }
    return {quelist,anslist};
  } catch(err) {
    console.log(err);
    return {quelist,anslist};
  }
  
}

var createTest = async (req,res,next) => {
  var creator = req.user || null;
  if(creator == null || req.user.usertype != 'TEACHER') {
    res.status(401).json({
      success : false,
      message : "Permissions not granted!"
    })
  }

  req.check('title','Empty Title').notEmpty();
  req.check('startTime','Invalid Start Time').notEmpty();
  req.check('endTime','Invalid End Time').notEmpty();
  req.check('duration','Invalid duration').notEmpty();
  if (req.body.regStartTime || req.body.regEndTime) {
    req.check('regStartTime','Invalid registration start time').notEmpty();
    req.check('regEndTime','Invalid registration end time').notEmpty();
  }
  req.check('resultTime','Invalid result time').notEmpty();


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

  var tempdata = new testModel({
    title : req.body.title,
    maxmarks : 0, // Will be updated as questions are added
    questions : [],
    subjects : req.body.subjects,
    startTime : req.body.startTime,
    endTime : req.body.endTime,
    duration : req.body.duration,
    regStartTime : req.body.regStartTime,
    regEndTime : req.body.regEndTime,
    resultTime : req.body.resultTime,
    targetClass : req.body.targetClass,
    targetSubject : req.body.targetSubject,
    createdBy : creator._id
  })
  if (creator.organizationId) {
    tempdata.organizationId = creator.organizationId;
  }
  tempdata.save(async (err, savedTest)=>{
    if (err){
      console.log(err);
      res.status(500).json({
        success : false,
        message : "Unable to create test"
      })
    } else {
      if (req.body.assignedStudents && req.body.assignedStudents.length > 0) {
        const assignments = req.body.assignedStudents.map(studentId => ({
          test: savedTest._id,
          user: studentId
        }));
        try {
          await testRegistrationModel.insertMany(assignments);
        } catch (regErr) {
          console.log("Error registering students:", regErr);
        }
      }
      res.json({
        success : true,
        message : 'Test created successfully!',
        testId: savedTest._id
      })
    }
  })
}

var updateStatus = (test,correctStatus) => {
  
  if(correctStatus !== test.status) {
    console.log(correctStatus + " "+ test.status)

    testModel.findByIdAndUpdate({_id:test._id},{status : correctStatus})
    .then((updated)=>{
      console.log("updated status of test "+updated._id+" to "+correctStatus);
    }).catch((err)=>{
      console.log('Error in status update');
      console.log(err);
    })
  }
}

var getAllTest = (req,res,next) => {
  var creator = req.user || null;
  if(creator == null) {
    res.status(401).json({
      success : false,
      message : "Permissions not granted!"
    })
  }

  try {
    var orgId = req.user && req.user.usertype === 'TEACHER' ? (req.user.organizationId || null) : null;
    var query = req.user && req.user.usertype === 'TEACHER' ? { organizationId: orgId } : {};
    testModel.find(query).sort({startTime:-1})
    .then((result)=>{
      for(x in result) {
        var correctStatus = getTestStatus(result[x]);
        if (correctStatus !== result[x].status) {
          updateStatus(result[x],correctStatus);
          result[x].status = correctStatus;
        }
      }
      res.json({
        success : true,
        testlist : result.map(v=>({_id:v._id,title:v.title,status: v.status, subjects: v.subjects}))
      })
    })

  } catch(err) {
    console.log(err);
    res.json({
      success : false,
      testlist : []
    })
  }
  
}

var testRegistration = (req,res,next) => {
  var creator = req.user || null;
  if(creator == null || req.user.usertype != 'STUDENT') {
    res.status(401).json({
      success : false,
      message : "Permissions not granted!"
    })
  } 

  req.check('testid','empty test id').notEmpty();

  var errors = req.validationErrors()
  if(errors) {
    console.log(errors);
    res.json({
      success : false,
      message : 'Invalid inputs',
      errors : errors
    })
    return;
  }

    testModel.findById({_id:req.body.testid})
    .then(result => {
      var correctStatus = getTestStatus(result);
      if(correctStatus !== result.status) {
        updateStatus(result,correctStatus);
        result.status = correctStatus;
      }
      if(result.status !== 'REGISTRATION_STARTED') {
        res.json({
          success : false,
          message : 'Test Registration are not open'
        })
      } else {
        testRegistrationModel.find({user:creator._id,test:req.body.testid})
        .then(testRegFind=>{
          if(testRegFind.length > 0) {
            console.log(testRegFind);
            res.json({
              success : false,
              message : 'your registration for test is done'
            })
          } else {
            var tempdata = new testRegistrationModel({
              test : req.body.testid,
              user : creator._id
            })
            tempdata.save().then(()=>{
              res.json({
                success : true,
                message : 'Test Registration success'
              })})
              .catch(err=>{
                res.json({
                  success : false,
                  message : 'Test Registration failed'
                })
              })
            
          }
        })
      }

    }).catch(err=> {
      console.log(err);
      res.json({
        success : false
      })
    })
}

var getAllTestWithStudentRegisterCheck = async(req,res,next) => {
  var creator = req.user || null;
  if(creator == null || req.user.usertype != 'STUDENT') {
    res.status(401).json({
      success : false,
      message : "Permissions not granted!"
    })
    return;
  }

  var studentClasses = await classModel.find({ students: creator._id }, { _id: 1 });
  var classIds = studentClasses.map(c => c._id);

  var tests = await testModel.find({ organizationId: creator.organizationId, $or: [{ targetClass: { $in: classIds } }, { targetClass: null }] }).sort({startTime:1}).catch(err=>{
    console.log(err);
    res.json({
      success : false,
      message : 'Internal server error'
    });
    return;
  });

  var testlist = new Array(tests.length);
  var registeredList = await testRegistrationModel.find({user:creator._id},{test:1}).catch(err=>{
    console.log(err);
    res.json({
      success : false,
      message : 'Internal server error'
    });
    return;
  });


  for(x in tests) {
    var correctStatus = getTestStatus(tests[x]);
    if (correctStatus !== tests[x].status) {
      updateStatus(tests[x],correctStatus);
      tests[x].status = correctStatus;
    }
    var isReg = registeredList.find((test,index)=>(test.test.toString() == tests[x]._id.toString()));
    testlist[x] = {
      _id : tests[x]._id,
      title : tests[x].title,
      status : tests[x].status,
      isRegistered : (isReg!==undefined) || !tests[x].regStartTime,
      startTime : tests[x].startTime,
      endTime : tests[x].endTime,
      regStartTime : tests[x].regStartTime,
      regEndTime : tests[x].regEndTime,
      resultTime : tests[x].resultTime,
      maxmarks : tests[x].maxmarks,
      duration : tests[x].duration
    };
  }

  
  res.json({
    success : true,
    testlist : testlist
  })
  
}

var getUpcomingTestforStudent = async(req,res,next) => {
  var creator = req.user || null;
  if(creator == null || req.user.usertype != 'STUDENT') {
    res.status(401).json({
      success : false,
      message : "Permissions not granted!"
    })
    return;
  }

  var studentClasses = await classModel.find({ students: creator._id }, { _id: 1 });
  var classIds = studentClasses.map(c => c._id);

  var tests = await testModel.find({ organizationId: creator.organizationId, endTime:{$gt:Date.now()}, $or: [{ targetClass: { $in: classIds } }, { targetClass: null }] }).sort({startTime:1}).catch(err=>{
    console.log(err);
    res.json({
      success : false,
      message : 'Internal server error'
    });
    return;
  });

  var testlist = [];
  var registeredList = await testRegistrationModel.find({user:creator._id},{test:1}).catch(err=>{
    console.log(err);
    res.json({
      success : false,
      message : 'Internal server error'
    });
    return;
  });


  for(x in tests) {
    var correctStatus = getTestStatus(tests[x]);
    if (correctStatus !== tests[x].status) {
      updateStatus(tests[x],correctStatus);
      tests[x].status = correctStatus;
    }
    var isReg = registeredList.find((test,index)=>(test.test.toString() == tests[x]._id.toString()));
    if(isReg || !tests[x].regStartTime) {
      testlist.push({
        _id : tests[x]._id,
        title : tests[x].title,
        status : tests[x].status,
        startTime : tests[x].startTime,
        endTime : tests[x].endTime,
        resultTime : tests[x].resultTime,
        maxmarks : tests[x].maxmarks,
        duration : tests[x].duration
      });
    }
  }

  
  res.json({
    success : true,
    upcomingtestlist : testlist
  })
  
}

var getTestDetailsFromId = (req,res,next) => {
  var creator = req.user || null;
  if(creator == null) {
    res.status(401).json({
      success : false,
      message : "Permissions not granted!"
    })
    return;
  }

  req.check('testid','empty test id').notEmpty();
  var errors = req.validationErrors()
  if(errors) {
    console.log(errors);
    res.json({
      success : false,
      message : 'Invalid inputs',
      errors : errors
    })
    return;
  }

  testModel.findById({_id:req.body.testid})
  .then(test => {
    if(test) {
      var correctStatus = getTestStatus(test);
      if(correctStatus !== test.status) {
        updateStatus(test,correctStatus);
        test.status = correctStatus;
      }
      if(req.user.usertype == 'STUDENT') {
        res.json({
          success : true,
          test : {
            _id : test._id,
            title : test.title,
            status : test.status,
            startTime : test.startTime,
            endTime : test.endTime,
            regStartTime : test.regStartTime,
            regEndTime : test.regEndTime,
            resultTime : test.resultTime,
            maxmarks : test.maxmarks,
            duration : test.duration
          }
        })
      } else {
        res.json({
          success : true,
          test : {
            _id : test._id,
            title : test.title,
            status : test.status,
            startTime : test.startTime,
            endTime : test.endTime,
            regStartTime : test.regStartTime,
            regEndTime : test.regEndTime,
            resultTime : test.resultTime,
            maxmarks : test.maxmarks,
            duration : test.duration,
            subjects : test.subjects,
            queTypes : test.queTypes
          }
        })
      }
    } else {
      res.json({
        success : false,
        message : 'test id not found'
      })
    }
  })
  .catch(err=>{
    console.log(err);
    res.json({
      success : false,
      message : 'Internal server error'
    });
    return;
  });

  
}



var getTestQuestionsForTeacher = async(req,res,next) => {
  var creator = req.user || null;
  if(creator == null || req.user.usertype != 'TEACHER') {
    res.status(401).json({
      success : false,
      message : "Permissions not granted!"
    })
    return;
  }

  req.check('testid','empty test id').notEmpty();
  var errors = req.validationErrors()
  if(errors) {
    res.json({
      success : false,
      message : 'Invalid inputs',
      errors : errors
    })
    return;
  }

  try {
    var test = await testModel.findById({_id:req.body.testid});
    if(test) {
      var ques = await questionModel.find({_id:{$in:test.questions}});
      var questions = [];
      for(var i in test.questions) {
        for(var j in ques) {
          if(test.questions[i].toString() === ques[j]._id.toString()) {
            questions.push(ques[j]);
            break;
          }
        }
      }
      res.json({
        success : true,
        totalQuestions : questions.length,
        questions : questions.map(x=>({ 
          _id:x._id,
          body:x.body,
          bodyImage: x.bodyImage,
          options:x.options,
          optionImages: x.optionImages,
          answer:x.answer,
          marks : x.marks,
          subject: x.subject
        }))
      });
    } else {
      res.json({
        success : false,
        message : 'test id not found'
      });
    }
  } catch(err) {
    console.log(err);
    res.json({
      success : false,
      message : 'Internal server error'
    });
  }
}

var deleteTest = async (req, res, next) => {
  if(!req.user || req.user.usertype != 'TEACHER') {
    return res.status(401).json({ success: false, message: "Permissions not granted!" });
  }
  try {
    const testid = req.body.testid;
    const test = await testModel.findById(testid);
    if (!test) {
      return res.status(404).json({ success: false, message: "Test not found" });
    }

    const fs = require('fs');
    const path = require('path');
    const questions = await questionModel.find({ _id: { $in: test.questions } });

    for (const q of questions) {
      if (q.bodyImage && q.bodyImage.startsWith('/uploads/')) {
        const filePath = path.join(__dirname, '../public', q.bodyImage);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      if (q.optionImages && q.optionImages.length > 0) {
        for (const optImg of q.optionImages) {
          if (optImg && optImg.startsWith('/uploads/')) {
            const filePath = path.join(__dirname, '../public', optImg);
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          }
        }
      }
    }

    await questionModel.deleteMany({ _id: { $in: test.questions } });
    await testModel.findByIdAndDelete(testid);
    await testRegistrationModel.deleteMany({ test: testid });
    res.json({ success: true, message: "Test and all associated files deleted successfully" });
  } catch(err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Error deleting test" });
  }
}

var assignStudentsToTest = async (req, res, next) => {
  if(!req.user || req.user.usertype != 'TEACHER') {
    return res.status(401).json({ success: false, message: "Permissions not granted!" });
  }
  try {
    const { testid, studentIds } = req.body;
    // Clear existing assignments for this test
    await testRegistrationModel.deleteMany({ test: testid });
    
    // Insert new assignments
    const assignments = studentIds.map(studentId => ({
      test: testid,
      user: studentId
    }));
    if (assignments.length > 0) {
      await testRegistrationModel.insertMany(assignments);
    }
    res.json({ success: true, message: "Students assigned successfully" });
  } catch(err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Error assigning students" });
  }
}

var getAssignedStudents = async (req, res, next) => {
  if(!req.user || req.user.usertype != 'TEACHER') {
    return res.status(401).json({ success: false, message: "Permissions not granted!" });
  }
  try {
    const testid = req.body.testid;
    const registrations = await testRegistrationModel.find({ test: testid });
    const studentIds = registrations.map(reg => reg.user);
    res.json({ success: true, studentIds: studentIds });
  } catch(err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Error fetching assigned students" });
  }
}

var addExamQuestion = async (req, res, next) => {
  if(!req.user || req.user.usertype != 'TEACHER') {
    return res.status(401).json({ success: false, message: "Permissions not granted!" });
  }

  try {
    const { testId, body, option1, option2, option3, option4, answer, marks, targetSubject, explanation } = req.body;
    
    // Process uploaded images
    let bodyImage = null;
    let optionImages = ['', '', '', ''];
    
    if (req.files) {
      if (req.files['bodyImage']) bodyImage = await uploadFile(req.files['bodyImage'][0].buffer, req.files['bodyImage'][0].originalname, req.files['bodyImage'][0].mimetype);
      if (req.files['optImg1']) optionImages[0] = await uploadFile(req.files['optImg1'][0].buffer, req.files['optImg1'][0].originalname, req.files['optImg1'][0].mimetype);
      if (req.files['optImg2']) optionImages[1] = await uploadFile(req.files['optImg2'][0].buffer, req.files['optImg2'][0].originalname, req.files['optImg2'][0].mimetype);
      if (req.files['optImg3']) optionImages[2] = await uploadFile(req.files['optImg3'][0].buffer, req.files['optImg3'][0].originalname, req.files['optImg3'][0].mimetype);
      if (req.files['optImg4']) optionImages[3] = await uploadFile(req.files['optImg4'][0].buffer, req.files['optImg4'][0].originalname, req.files['optImg4'][0].mimetype);
    }

    // Create the new question
    const newQuestion = new questionModel({
      body: body || ' ', // ensure it's not empty if there's only an image
      bodyImage: bodyImage || '',
      options: [option1 || ' ', option2 || ' ', option3 || ' ', option4 || ' '],
      optionImages: optionImages,
      answer: answer,
      marks: parseInt(marks),
      subject: targetSubject, // Need a subject for schema validation
      explanation: explanation || '',
      createdBy: req.user._id,
      status: true
    });

    const savedQuestion = await newQuestion.save();

    // Update the test
    const test = await testModel.findById(testId);
    if (!test) {
      return res.status(404).json({ success: false, message: "Test not found" });
    }

    test.questions.push(savedQuestion._id);
    test.maxmarks += savedQuestion.marks;
    await test.save();

    res.json({ success: true, message: "Question added successfully", question: savedQuestion });
  } catch(err) {
    console.log(err);
    res.status(500).json({ success: false, message: "DB Error: " + err.message });
  }
}

var editExamQuestion = async (req, res, next) => {
  if(!req.user || req.user.usertype != 'TEACHER') {
    return res.status(401).json({ success: false, message: "Permissions not granted!" });
  }

  try {
    const { questionId, testId, body, option1, option2, option3, option4, answer, marks, explanation } = req.body;
    
    const question = await questionModel.findById(questionId);
    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found" });
    }

    const test = await testModel.findById(testId);
    if (!test) {
      return res.status(404).json({ success: false, message: "Test not found" });
    }

    let diffMarks = parseInt(marks) - question.marks;
    
    if (!question.optionImages || question.optionImages.length < 4) {
      question.optionImages = [
        question.optionImages?.[0] || '', 
        question.optionImages?.[1] || '', 
        question.optionImages?.[2] || '', 
        question.optionImages?.[3] || ''
      ];
    }

    // Process uploaded images
    if (req.files) {
      let imagesModified = false;
      if (req.files['bodyImage']) {
        question.bodyImage = await uploadFile(req.files['bodyImage'][0].buffer, req.files['bodyImage'][0].originalname, req.files['bodyImage'][0].mimetype);
      }
      if (req.files['optImg1']) {
        question.optionImages[0] = await uploadFile(req.files['optImg1'][0].buffer, req.files['optImg1'][0].originalname, req.files['optImg1'][0].mimetype);
        imagesModified = true;
      }
      if (req.files['optImg2']) {
        question.optionImages[1] = await uploadFile(req.files['optImg2'][0].buffer, req.files['optImg2'][0].originalname, req.files['optImg2'][0].mimetype);
        imagesModified = true;
      }
      if (req.files['optImg3']) {
        question.optionImages[2] = await uploadFile(req.files['optImg3'][0].buffer, req.files['optImg3'][0].originalname, req.files['optImg3'][0].mimetype);
        imagesModified = true;
      }
      if (req.files['optImg4']) {
        question.optionImages[3] = await uploadFile(req.files['optImg4'][0].buffer, req.files['optImg4'][0].originalname, req.files['optImg4'][0].mimetype);
        imagesModified = true;
      }
      if (imagesModified) {
        question.markModified('optionImages');
      }
    }

    question.body = body || ' ';
    question.options = [option1 || ' ', option2 || ' ', option3 || ' ', option4 || ' '];
    question.answer = answer;
    question.marks = parseInt(marks);
    if (explanation !== undefined) {
      question.explanation = explanation;
    }

    await question.save();

    if (diffMarks !== 0) {
      test.maxmarks += diffMarks;
    }
    
    
    await test.save();

    res.json({ success: true, message: "Question updated successfully" });
  } catch(err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Error updating question" });
  }
}

var deleteExamQuestion = async (req, res, next) => {
  if(!req.user || req.user.usertype != 'TEACHER') {
    return res.status(401).json({ success: false, message: "Permissions not granted!" });
  }

  try {
    const { questionId, testId } = req.body;
    
    const question = await questionModel.findById(questionId);
    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found" });
    }

    const test = await testModel.findById(testId);
    if (!test) {
      return res.status(404).json({ success: false, message: "Test not found" });
    }

    const fs = require('fs');
    const path = require('path');
    
    // check and delete bodyImage
    if (question.bodyImage && question.bodyImage.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '../public', question.bodyImage);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    // check and delete optionImages
    if (question.optionImages && question.optionImages.length > 0) {
      for (const optImg of question.optionImages) {
        if (optImg && optImg.startsWith('/uploads/')) {
          const filePath = path.join(__dirname, '../public', optImg);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
      }
    }

    test.maxmarks -= question.marks;
    
    const qIndex = test.questions.indexOf(questionId);
    if (qIndex !== -1) {
      test.questions.splice(qIndex, 1);
    }
    
    await test.save();
    await questionModel.findByIdAndDelete(questionId);

    res.json({ success: true, message: "Question deleted successfully" });
  } catch(err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Error deleting question" });
  }
}

var uploadPoster = async(req, res, next) => {
  try {
    const testId = req.body.testId;
    
    if (!req.file) {
      return res.json({ success: false, message: 'No file uploaded' });
    }

    const posterUrl = await uploadFile(req.file.buffer, req.file.originalname, req.file.mimetype);
    
    await testModel.updateOne({ _id: testId }, { $set: { poster: posterUrl } });

    res.json({ success: true, message: "Poster uploaded successfully", posterUrl: posterUrl });
  } catch(err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Error uploading poster" });
  }
}

module.exports = {
  createTest,
  getAllTest,
  testRegistration,
  getAllTestWithStudentRegisterCheck,
  getUpcomingTestforStudent,
  getTestDetailsFromId,
  getTestStatus,
  updateStatus,
  getTestQuestionsForTeacher,
  deleteTest,
  assignStudentsToTest,
  getAssignedStudents,
  addExamQuestion,
  editExamQuestion,
  deleteExamQuestion,
  uploadPoster
}