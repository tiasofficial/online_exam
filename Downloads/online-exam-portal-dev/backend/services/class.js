var classModel = require('../models/class');
var userModel = require('../models/user');
var subjectModel = require('../models/subject');

var seedClasses = async (req, res, next) => {
  const classNames = ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12", "Crash Course"];
  try {
    const orgId = req.user.organizationId;
    for (const name of classNames) {
      const existing = await classModel.findOne({ name: name, organizationId: orgId });
      if (!existing) {
        await classModel.create({ name: name, organizationId: orgId });
      }
    }
    res.json({ success: true, message: "Classes seeded successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Error seeding classes" });
  }
}

var getAllClasses = async (req, res, next) => {
  if(!req.user || req.user.usertype != 'TEACHER') {
    return res.status(401).json({ success: false, message: "Permissions not granted!" });
  }
  try {
    const orgId = req.user.organizationId || null;
    let classes = await classModel.find({ organizationId: orgId }).populate('students', 'username email _id').populate('subjects', 'name _id');
    
    // Auto seed if empty
    if(classes.length === 0) {
      const classNames = ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12", "Crash Course"];
      for (const name of classNames) {
        await classModel.create({ name: name, organizationId: orgId });
      }
      classes = await classModel.find({ organizationId: orgId }).populate('students', 'username email _id').populate('subjects', 'name _id');
    }

    res.json({ success: true, classes: classes });
  } catch(err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Error fetching classes" });
  }
}

var addStudentToClass = async (req, res, next) => {
  if(!req.user || req.user.usertype != 'TEACHER') {
    return res.status(401).json({ success: false, message: "Permissions not granted!" });
  }
  const { classId, studentId } = req.body;
  try {
    const classObj = await classModel.findById(classId);
    if(classObj.students.some(s => s.toString() === studentId)) {
      return res.json({ success: false, message: "Student already in class" });
    }
    classObj.students.push(studentId);
    await classObj.save();
    res.json({ success: true, message: "Student added to class" });
  } catch(err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Error adding student" });
  }
}

var removeStudentFromClass = async (req, res, next) => {
  if(!req.user || req.user.usertype != 'TEACHER') {
    return res.status(401).json({ success: false, message: "Permissions not granted!" });
  }
  const { classId, studentId } = req.body;
  try {
    const classObj = await classModel.findById(classId);
    classObj.students = classObj.students.filter(id => id.toString() !== studentId);
    await classObj.save();
    res.json({ success: true, message: "Student removed from class" });
  } catch(err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Error removing student" });
  }
}

var addSubjectToClass = async (req, res, next) => {
  if(!req.user || req.user.usertype != 'TEACHER') {
    return res.status(401).json({ success: false, message: "Permissions not granted!" });
  }
  const { classId, subjectId } = req.body;
  try {
    const classObj = await classModel.findById(classId);
    if(classObj.subjects.some(s => s.toString() === subjectId)) {
      return res.json({ success: false, message: "Subject already in class" });
    }
    classObj.subjects.push(subjectId);
    await classObj.save();
    res.json({ success: true, message: "Subject added to class" });
  } catch(err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Error adding subject" });
  }
}

var removeSubjectFromClass = async (req, res, next) => {
  if(!req.user || req.user.usertype != 'TEACHER') {
    return res.status(401).json({ success: false, message: "Permissions not granted!" });
  }
  const { classId, subjectId } = req.body;
  try {
    const classObj = await classModel.findById(classId);
    classObj.subjects = classObj.subjects.filter(id => id.toString() !== subjectId);
    await classObj.save();
    res.json({ success: true, message: "Subject removed from class" });
  } catch(err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Error removing subject" });
  }
}

var createClass = async (req, res, next) => {
  if(!req.user || req.user.usertype != 'TEACHER') {
    return res.status(401).json({ success: false, message: "Permissions not granted!" });
  }
  const { name } = req.body;
  try {
    const existing = await classModel.findOne({ name: name });
    if (existing) {
      return res.json({ success: false, message: "Class already exists" });
    }
    const newClass = await classModel.create({ name: name });
    res.json({ success: true, message: "Class created", class: newClass });
  } catch(err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Error creating class" });
  }
}

var updateClass = async (req, res, next) => {
  if(!req.user || req.user.usertype != 'TEACHER') {
    return res.status(401).json({ success: false, message: "Permissions not granted!" });
  }
  const { classId, name } = req.body;
  try {
    await classModel.findByIdAndUpdate(classId, { name: name });
    res.json({ success: true, message: "Class updated" });
  } catch(err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Error updating class" });
  }
}

var deleteClass = async (req, res, next) => {
  if(!req.user || req.user.usertype != 'TEACHER') {
    return res.status(401).json({ success: false, message: "Permissions not granted!" });
  }
  const { classId } = req.body;
  try {
    await classModel.findByIdAndDelete(classId);
    res.json({ success: true, message: "Class deleted" });
  } catch(err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Error deleting class" });
  }
}

module.exports = {
  seedClasses,
  getAllClasses,
  addStudentToClass,
  removeStudentFromClass,
  addSubjectToClass,
  removeSubjectFromClass,
  createClass,
  updateClass,
  deleteClass
}
