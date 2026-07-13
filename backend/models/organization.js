var mongoose = require('mongoose');
var organizationSchema = require('../schemas/organization');

var organizationModel = mongoose.model('organization', organizationSchema);

module.exports = organizationModel;
