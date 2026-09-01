var subjectModel = require('../models/subject')
var questionModel = require('../models/question');
var testModel = require('../models/test');
const { uploadFile, deleteFile } = require('./cloudinary');

var addQuestion = (req,res,next)=>{
  var creator = req.user || null;
  if(creator == null || req.user.usertype != 'TEACHER') {
    res.status(401).json({
      success : false,
      message : "Permissions not granted!"
    })
  }
  req.check('body','Empty Question').notEmpty();
  req.check('marks','Invalid marks').isNumeric({min:1,max:4});
  req.check('options','Invalid length of list of options').isArray({min:1,max:4})
  req.check('options.*','Invalid Null option').isLength({min:1,max:256})
  req.check('subject','Invalid Subject').notEmpty()
  req.check('answer','Invalid Answer').notEmpty()
  var errors = req.validationErrors()
  if(errors) {
    console.log(errors);
    res.json({
      success : false,
      message : 'Invalid inputs',
      errors : errors
    })
  } 
  else {
    if(req.body.questionType !== 'NUMERICAL' && req.body.questionType !== 'MULTIPLE' && req.body.options.includes(req.body.answer) == false) {
      res.json({
        success : false,
        message : 'Invalid inputs',
        error : 'Answer is not in list of options'
      })
    }
    else {
    // check for valid subject
      subjectModel.findOne({_id:req.body.subject, status: true}).then((subject)=>{
        //subject found
        if(subject) {
          var explanation = req.body.explanation || null;
          var tempdata = new questionModel({
            body : req.body.body,
            explanation : explanation,
            options : req.body.options,
            subject : subject._id,
            questionType : req.body.questionType || 'SINGLE',
            marks : req.body.marks,
            answer : req.body.answer,
            difficulty: req.body.difficulty || 'MEDIUM',
            status : true,
            createdBy : creator._id,
            organizationId : creator.organizationId
          })
          tempdata.save((err, que)=>{
            if (err){
              console.log(err);
              res.status(500).json({
                success : false,
                message : "Unable to add question"
              })
            } else {
              res.json({
                success : true,
                message : 'Question created successfully!'
              })
            }  
          })
        }
        else {
          res.json({
            success : false,
            message : 'Subject not found'
          })
        }
      })
    }
  }
}


// search questions from body
var searchQuestion = (req,res,next)=>{
  var creator = req.user || null
  if(creator == null || req.user.usertype != 'TEACHER') {
    res.status(401).json({
      success : false,
      message : "Permissions not granted!"
    })
  }

  req.check('query','Empty Query');
  var errors = req.validationErrors();

  if(errors) {
    console.log(errors);
    res.json({
      success : false,
      message : 'Invalid Inputs',
      errors : errors
    })
  }
  else {
    questionModel.find({organizationId: creator.organizationId, body : new RegExp(req.body.query)}).limit(20).then((questions)=>{
      result = questions.map((que)=>({_id:que._id,body:que.body,status:que.status}));
      res.json({
        success : true,
        list : result
      })
    })
    .catch((err)=>{
      console.log(err);
      res.status(500).json({
        success : false,
        message : "error"
      })
    })
  }
}

//update question and ans
var updateQuestion = async (req,res,next)=>{
  var creator = req.user || null
  if(creator == null || req.user.usertype != 'TEACHER') {
    return res.status(401).json({
      success : false,
      message : "Permissions not granted!"
    })
  }
  req.check('id','Id not found').notEmpty();
  req.check('body','Empty Question').notEmpty();
  req.check('marks','Invalid marks').isNumeric({min:1,max:4});
  req.check('options','Invalid length of list of options').isArray({min:1,max:4})
  req.check('options.*','Invalid Null option').isLength({min:1,max:256})
  req.check('subject','Invalid Subject').notEmpty()
  req.check('answer','Invalid Answer').notEmpty()
  var errors = req.validationErrors()
  if(errors) {
    console.log(errors);
    return res.json({
      success : false,
      message : 'Invalid inputs',
      errors : errors
    })
  }
  if(req.body.questionType !== 'NUMERICAL' && req.body.questionType !== 'MULTIPLE' && req.body.options.includes(req.body.answer) == false) {
    return res.json({
      success : false,
      message : 'Invalid inputs',
      error : 'Answer is not in list of options'
    })
  }
  var explanation = req.body.explanation || null;
  
  try {
      const question = await questionModel.findById(req.body.id);
      if (!question) {
        return res.json({ success: false, message: "Question not found" });
      }
      
      let bodyImage = question.bodyImage || '';
      let explanationImage = question.explanationImage || '';
      let optionImages = question.optionImages || ['', '', '', ''];
      
      if (req.body.delete_bodyImage === 'true') {
        if (question.bodyImage && question.bodyImage.includes('res.cloudinary.com')) {
          await deleteFile(question.bodyImage);
        } else if (question.bodyImage && question.bodyImage.startsWith('/uploads/')) {
          const fs = require('fs');
          const path = require('path');
          const filePath = path.join(__dirname, '../public', question.bodyImage);
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
        bodyImage = '';
      }

      if (req.body.delete_explanationImage === 'true') {
        if (question.explanationImage && question.explanationImage.includes('res.cloudinary.com')) {
          await deleteFile(question.explanationImage);
        } else if (question.explanationImage && question.explanationImage.startsWith('/uploads/')) {
          const fs = require('fs');
          const path = require('path');
          const filePath = path.join(__dirname, '../public', question.explanationImage);
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
        explanationImage = '';
      }

      for (let i = 1; i <= 4; i++) {
        if (req.body[`delete_optImg${i}`] === 'true') {
          if (question.optionImages && question.optionImages[i-1] && question.optionImages[i-1].includes('res.cloudinary.com')) {
            await deleteFile(question.optionImages[i-1]);
          } else if (question.optionImages && question.optionImages[i-1] && question.optionImages[i-1].startsWith('/uploads/')) {
            const fs = require('fs');
            const path = require('path');
            const filePath = path.join(__dirname, '../public', question.optionImages[i-1]);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
          }
          optionImages[i-1] = '';
        }
      }

      if (req.files) {
        if (req.files['bodyImage']) {
          if (question.bodyImage && question.bodyImage.includes('res.cloudinary.com')) {
            await deleteFile(question.bodyImage);
          } else if (question.bodyImage && question.bodyImage.startsWith('/uploads/')) {
            const fs = require('fs');
            const path = require('path');
            const filePath = path.join(__dirname, '../public', question.bodyImage);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
          }
          bodyImage = await uploadFile(req.files['bodyImage'][0].buffer, req.files['bodyImage'][0].originalname, req.files['bodyImage'][0].mimetype);
        }
        if (req.files['explanationImage']) {
          if (question.explanationImage && question.explanationImage.includes('res.cloudinary.com')) {
            await deleteFile(question.explanationImage);
          } else if (question.explanationImage && question.explanationImage.startsWith('/uploads/')) {
            const fs = require('fs');
            const path = require('path');
            const filePath = path.join(__dirname, '../public', question.explanationImage);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
          }
          explanationImage = await uploadFile(req.files['explanationImage'][0].buffer, req.files['explanationImage'][0].originalname, req.files['explanationImage'][0].mimetype);
        }
        if (req.files['optImg1']) {
          if (question.optionImages && question.optionImages[0] && question.optionImages[0].includes('res.cloudinary.com')) {
            await deleteFile(question.optionImages[0]);
          } else if (question.optionImages && question.optionImages[0] && question.optionImages[0].startsWith('/uploads/')) {
            const fs = require('fs');
            const path = require('path');
            const filePath = path.join(__dirname, '../public', question.optionImages[0]);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
          }
          optionImages[0] = await uploadFile(req.files['optImg1'][0].buffer, req.files['optImg1'][0].originalname, req.files['optImg1'][0].mimetype);
        }
        if (req.files['optImg2']) {
          if (question.optionImages && question.optionImages[1] && question.optionImages[1].includes('res.cloudinary.com')) {
            await deleteFile(question.optionImages[1]);
          } else if (question.optionImages && question.optionImages[1] && question.optionImages[1].startsWith('/uploads/')) {
            const fs = require('fs');
            const path = require('path');
            const filePath = path.join(__dirname, '../public', question.optionImages[1]);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
          }
          optionImages[1] = await uploadFile(req.files['optImg2'][0].buffer, req.files['optImg2'][0].originalname, req.files['optImg2'][0].mimetype);
        }
        if (req.files['optImg3']) {
          if (question.optionImages && question.optionImages[2] && question.optionImages[2].includes('res.cloudinary.com')) {
            await deleteFile(question.optionImages[2]);
          } else if (question.optionImages && question.optionImages[2] && question.optionImages[2].startsWith('/uploads/')) {
            const fs = require('fs');
            const path = require('path');
            const filePath = path.join(__dirname, '../public', question.optionImages[2]);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
          }
          optionImages[2] = await uploadFile(req.files['optImg3'][0].buffer, req.files['optImg3'][0].originalname, req.files['optImg3'][0].mimetype);
        }
        if (req.files['optImg4']) {
          if (question.optionImages && question.optionImages[3] && question.optionImages[3].includes('res.cloudinary.com')) {
            await deleteFile(question.optionImages[3]);
          } else if (question.optionImages && question.optionImages[3] && question.optionImages[3].startsWith('/uploads/')) {
            const fs = require('fs');
            const path = require('path');
            const filePath = path.join(__dirname, '../public', question.optionImages[3]);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
          }
          optionImages[3] = await uploadFile(req.files['optImg4'][0].buffer, req.files['optImg4'][0].originalname, req.files['optImg4'][0].mimetype);
        }
      }

      const result = await questionModel.findByIdAndUpdate(req.body.id,{
        body : req.body.body,
        explanation : explanation,
        options : req.body.options,
        subject : req.body.subject,
        questionType : req.body.questionType || 'SINGLE',
        marks : req.body.marks,
        answer : req.body.answer,
        difficulty: req.body.difficulty || 'MEDIUM',
        createdBy : creator._id,
        bodyImage: bodyImage,
        explanationImage: explanationImage,
        optionImages: optionImages
      });
      
      if(result) {
        res.json({
          success:true,
          message : 'success'
        })
      } else {
        res.json({
          success : false,
          message : 'not updated'
        })
      }
  } catch(err) {
      console.log(err);
      res.status(500).json({
        success : false,
        message : "server error"
      })
  }
}


// get question by id
var getQuestionById = (req,res,next)=>{
  var creator = req.user || null
  if(creator == null || req.user.usertype != 'TEACHER') {
    res.status(401).json({
      success : false,
      message : "Permissions not granted!"
    })
  }

  req.check('id','ID not found').notEmpty();
  var errors = req.validationErrors()

  if(errors) {
    console.log(errors);
    res.json({
      success : false,
      message : 'Invalid Inputs',
      errors : errors
    })
  }
  else {
    questionModel.findById({_id:req.body.id})
    .then((result)=>{
      if(result) {
        res.json({
          success:true,
          question: result
        })
      } else {
        res.json({
          success: false,
          message : 'not found'
        })
      }
    })
    .catch((err)=>{
      console.log(err);
      res.status(500).json({
        success : false,
        message : "error"
      })
    })
  }
}

var getQuestionAnswerById = (req,res,next)=>{
  var creator = req.user || null
  if(creator == null || req.user.usertype != 'TEACHER') {
    res.status(401).json({
      success : false,
      message : "Permissions not granted!"
    })
  }

  req.check('id','ID not found').notEmpty();
  var errors = req.validationErrors()

  if(errors) {
    console.log(errors);
    res.json({
      success : false,
      message : 'Invalid Inputs',
      errors : errors
    })
  }
  else {
    questionModel.findById({_id:req.body.id})
    .then(async (result)=>{
      if(result) {
            var exams = await testModel.find({questions: result._id}, 'title status');
            res.json({
              success:true,
              question : result,
              answer: result.answer,
              exams: exams
            })
      } else {
        res.json({
          success: false,
          message : 'not found'
        })
      }
    })
    .catch((err)=>{
      console.log(err);
      res.status(500).json({
        success : false,
        message : "error"
      })
    })
  }
}

// disable/enable question with ans
var changeQuestionStatus = (req,res,next)=> {
  var creator = req.user || null
  if(creator == null || req.user.usertype != 'TEACHER') {
    res.status(401).json({
      success : false,
      message : "Permissions not granted!"
    })
  }
  req.check('id','Id not found').notEmpty();
  req.check('status','Status not found').isBoolean();

  var errors = req.validationErrors()
  if(errors) {
    console.log(errors);
    res.json({
      success : false,
      message : 'Invalid inputs',
      errors : errors
    })
  } else {
    questionModel.findByIdAndUpdate(req.body.id,{
      status:req.body.status,
      createdBy : creator._id
    }).then((result)=>{
      if(result) {
        res.json({
          success:true,
          message : 'success'
        })
      }
    }).catch((err)=>{
      console.log(err);
      res.status(500).json({
        success : false,
        message : 'Internal server error'
      })
    })
  }
}

var getAnsByQuestionId = (req,res,next)=>{
  var creator = req.user || null
  if(creator == null || req.user.usertype != 'TEACHER') {
    res.status(401).json({
      success : false,
      message : "Permissions not granted!"
    })
  }

  req.check('id','ID not found').notEmpty();
  var errors = req.validationErrors()

  if(errors) {
    console.log(errors);
    res.json({
      success : false,
      message : 'Invalid Inputs',
      errors : errors
    })
  } else {
    questionModel.findById({_id:req.body.id})
    .then((result)=> {
      if(result) {
        res.json({
          success:true,
          answer: result.answer
        })
      } else {
        res.json({
          success: false,
          message : 'not found'
        })
      }
    })
    .catch((err)=>{
      console.log(err);
      res.status(500).json({
        success : false,
        message : "error"
      })
    })
  }
}

var getQuestionAnswerByIds = (req,res,next) => {
  var creator = req.user || null
  if(creator == null) {
    res.json({
      success : false,
      message : "Permissions not granted!"
    })
  }

  req.check('queids','no question ids').isArray({min:1});
  var errors = req.validationErrors();
  if(errors) {
    console.log(errors);
    res.json({
      success : false,
      message : 'Invalid Inputs',
      errors : errors
    })
    return;
  }

  questionModel.find({_id:{$in:req.body.queids}})
  .then(ques=> {
    if(ques.length < req.body.queids) {
      res.json({
        success : false,
        message : 'not all question found'
      })
    } else {
      var questions = [];
      for(var id in req.body.queids) {
        for(var q in ques) {
          if(ques[q]._id.toString() === req.body.queids[id].toString()) {
            questions.push({
              _id : ques[q]._id,
              body : ques[q].body,
              options : ques[q].options,
              marks : ques[q].marks,
              questionType : ques[q].questionType,
              answer : ques[q].answer,
              explanation : ques[q].explanation,
              difficulty : ques[q].difficulty,
              bodyImage: ques[q].bodyImage,
              explanationImage: ques[q].explanationImage,
              optionImages: ques[q].optionImages
            })
            break;
          }
        }
      }
      res.json({
        success : true,
        questions : questions
      })
    }
  })
  .catch(err=>{
    console.log(err);
    res.json({
      success : false,
      message : 'internal server error'
    })
  })
}

module.exports = {
  addQuestion,
  searchQuestion,
  updateQuestion,
  getQuestionById,
  changeQuestionStatus,
  getAnsByQuestionId,
  getQuestionAnswerById,
  getQuestionAnswerByIds
}