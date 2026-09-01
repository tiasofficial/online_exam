var mongoose = require('mongoose');
var classSchema = require('../schemas/class');

var classModel = mongoose.model('classModel', classSchema);

module.exports = classModel;
