var mongoose = require('mongoose');

var organizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: Boolean,
    default: true
  }
},
{
  timestamps: true
});

module.exports = organizationSchema;
