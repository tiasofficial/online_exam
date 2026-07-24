var mongoose = require('mongoose')

var questionSchema = new mongoose.Schema({
  body : {
    type : String,
    required : true
  },
  bodyImage: {
    type: String
  },
  explanation : {
    type : String
  },
  explanationImage: {
    type: String
  },
  options : [ {
    type : String,
    required : true
  }],
  optionImages: [{
    type: String
  }],
  subject : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'subject',
    required : true
  },
  answer : {
    type : mongoose.Schema.Types.Mixed,
    required : true
  },
  questionType: {
    type: String,
    enum: ['SINGLE', 'MULTIPLE', 'NUMERICAL'],
    default: 'SINGLE'
  },
  marks : {
    type : Number,
    required : true
  },
  status : {
    type : Boolean,
    required : true,
    default : true
  },
  createdBy : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'user'
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'organization',
    required: false
  }
}, 
{
  timestamps: true
})

module.exports = questionSchema;