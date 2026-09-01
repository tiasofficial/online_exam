var mongoose = require("mongoose");

var testRegistrationSchema = new mongoose.Schema({
  user : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'user'
  },
  test : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'test'
  },
  reassignEndTime: {
    type: Date
  }
},{
  timestamps:true
})

module.exports = testRegistrationSchema