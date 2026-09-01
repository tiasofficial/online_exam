var mongoose = require('mongoose')

var testSchema = new mongoose.Schema({
  title : {
    type : String,
    required : true
  },
  subjects : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : 'subject'
  }],
  targetClass : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'classModel'
  },
  targetSubject : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'subject'
  },
  questions : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : 'question'
  }],
  maxmarks : {
    type : Number,
    required : true
  },
  queTypes : [{
    type : Number
  }],
  startTime : {
    type : Date
  },
  endTime : {
    type : Date,
    required : true
  },
  duration : {
    type : Number,
    required : true
  },
  regStartTime : {
    type : Date
  },
  regEndTime : {
    type : Date
  },
  resultTime : {
    type : Date,
    required : true
  },
  status : {
    type : String,
    enum : ['CREATED','REGISTRATION_STARTED','REGISTRATION_COMPLETE','TEST_STARTED','TEST_COMPLETE','RESULT_DECLARED','CANCELLED'],
    default : 'CREATED'
  },
  createdBy : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'user',
    required : true
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'organization',
    required: false
  }
},
{
  timestamps : true
})

module.exports = testSchema