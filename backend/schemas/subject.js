var mongoose = require('mongoose')

var subjectSchema = new mongoose.Schema({
  name : {
    type : String,
    required : true
  },
  status : {
    type : Boolean,
    required : true,
    default : true
  },
  createdBy : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'admin'
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'organization'
  }
},
{
  timestamps : true
})

module.exports = subjectSchema