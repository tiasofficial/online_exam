var express = require('express');
var router = express.Router();
var classService = require('../services/class');
var passport = require('passport');
var checkauth = passport.authenticate('jwt',{session:false});

router.post('/seed', classService.seedClasses);
router.get('/all', classService.getAllClasses);
router.post('/addStudent', classService.addStudentToClass);
router.post('/removeStudent', classService.removeStudentFromClass);
router.post('/addSubject', classService.addSubjectToClass);
router.post('/removeSubject', classService.removeSubjectFromClass);
router.post('/create', classService.createClass);
router.post('/update', classService.updateClass);
router.post('/delete', classService.deleteClass);

module.exports = router;
