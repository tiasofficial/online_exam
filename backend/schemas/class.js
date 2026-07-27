var mongoose = require('mongoose')

var classSchema = new mongoose.Schema({
  name : {
    type : String,
    required : true
  },
  examType: {
    type: String,
    enum: ['JEE-Mains', 'NEET', null],
    default: null
  },
  students : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : 'user'
  }],
  subjects : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : 'subject'
  }],
  createdBy : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'userModel'
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'organization',
    required: true
  }
},
{
  timestamps : true
})

module.exports = classSchema
