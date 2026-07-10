var mongoose = require('mongoose')

var answersheetSchema = new mongoose.Schema({
  test : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'test',
    required : true
  },
  student : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'user',
    required : true
  },
  score : {
    type : Number,
    default : 0,
    required : true
  },
  answers : [{
    type : String
  }],
  startTime : {
    type : Date
  },
  completed : {
    type : Boolean,
    required : true,
    default : false
  }
},{
  timestamps : true
})

module.exports = answersheetSchema;