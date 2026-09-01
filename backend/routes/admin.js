var express = require('express');
var router = express.Router();

var adminService = require('../services/admin');
var subjectService = require('../services/subject');
var teacherService = require('../services/teacher');
var studentService = require('../services/student');

router.get('/details',adminService.adminDetails);

router.post('/register',adminService.teacherRegister);
router.post('/removeUser',adminService.userRemove);
router.post('/deleteUser',adminService.userDelete);
router.post('/unblockUser',adminService.unblockUser);
router.post('/addSubject', adminService.addSubject);
router.post('/removeSubject',adminService.subjectRemove);
router.post('/unblockSubject',adminService.unblockSubject);

router.post('/organizations', adminService.createOrganization);
router.get('/organizations', adminService.getOrganizations);
router.post('/changeOrganizationStatus', adminService.changeOrganizationStatus);
router.post('/deleteOrganization', adminService.deleteOrganization);

router.get('/getDashboardCount',adminService.getDashboardCount);
router.get('/getAllSubjects',subjectService.getAllSubject);
router.get('/getSubjectCount',subjectService.getStatusCount);
router.get('/getAllTeachers',teacherService.getAllTeacher);
router.get('/getTeacherStatusCount',teacherService.getTeacherStatusCount);
router.get('/getAllStudent',studentService.getAllStudents);
module.exports = router;