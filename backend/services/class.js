var classModel = require('../models/class');
var userModel = require('../models/user');
var subjectModel = require('../models/subject');

// Seeded fixed classes with their exam types
const SEEDED_CLASSES = [
  { name: "Class 6", examType: null },
  { name: "Class 7", examType: null },
  { name: "Class 8", examType: null },
  { name: "Class 9", examType: null },
  { name: "Class 10", examType: null },
  { name: "Class 11", examType: null },
  { name: "Class 12", examType: null },
  { name: "Crash Course", examType: null },
  { name: "JEE-Mains", examType: "JEE-Mains" },
  { name: "NEET", examType: "NEET" }
];

var seedClasses = async (req, res, next) => {
  try {
    const orgId = req.user.organizationId;
    for (const cls of SEEDED_CLASSES) {
      const existing = await classModel.findOne({ name: cls.name, organizationId: orgId });
      if (!existing) {
        await classModel.create({ name: cls.name, examType: cls.examType, organizationId: orgId });
      } else if (cls.examType && existing.examType !== cls.examType) {
        // Backfill examType for existing seeded classes
        await classModel.findByIdAndUpdate(existing._id, { examType: cls.examType });
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
    
    // Auto seed missing seeded classes
    let created = false;
    for (const cls of SEEDED_CLASSES) {
      const existing = classes.find(c => c.name === cls.name);
      if (!existing) {
        await classModel.create({ name: cls.name, examType: cls.examType, organizationId: orgId });
        created = true;
      } else if (cls.examType && existing.examType !== cls.examType) {
        // Backfill examType
        await classModel.findByIdAndUpdate(existing._id, { examType: cls.examType });
        created = true;
      }
    }
    
    if (created) {
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
  const { name, examType } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, message: "Class name is required" });
  }
  // Validate examType
  const validExamTypes = ['JEE-Mains', 'NEET', null, undefined, ''];
  if (examType && !['JEE-Mains', 'NEET'].includes(examType)) {
    return res.status(400).json({ success: false, message: "Invalid exam type. Must be JEE-Mains, NEET, or empty." });
  }

  try {
    const orgId = req.user.organizationId || null;
    const existing = await classModel.findOne({ name: name.trim(), organizationId: orgId });
    if (existing) {
      return res.json({ success: false, message: "A class with this name already exists" });
    }
    const newClass = await classModel.create({
      name: name.trim(),
      examType: examType || null,
      organizationId: orgId,
      createdBy: req.user._id
    });
    const populated = await classModel.findById(newClass._id).populate('students', 'username email _id').populate('subjects', 'name _id');
    res.json({ success: true, message: "Class created successfully", class: populated });
  } catch(err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Error creating class" });
  }
}

var updateClass = async (req, res, next) => {
  if(!req.user || req.user.usertype != 'TEACHER') {
    return res.status(401).json({ success: false, message: "Permissions not granted!" });
  }
  const { classId, name, examType } = req.body;
  try {
    const classToUpdate = await classModel.findById(classId);
    if (!classToUpdate) {
      return res.status(404).json({ success: false, message: "Class not found" });
    }
    // Prevent renaming seeded base classes (JEE-Mains, NEET, Class X etc.)
    const isSeeded = SEEDED_CLASSES.some(c => c.name === classToUpdate.name);
    if (isSeeded && name && name.trim() !== classToUpdate.name) {
      return res.json({ success: false, message: "Cannot rename a seeded class" });
    }
    const updates = {};
    if (name && name.trim()) updates.name = name.trim();
    if (examType !== undefined) updates.examType = examType || null;
    await classModel.findByIdAndUpdate(classId, updates);
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
    const classToDelete = await classModel.findById(classId);
    if (!classToDelete) {
      return res.status(404).json({ success: false, message: "Class not found" });
    }
    // Prevent deleting seeded base classes
    const isSeeded = SEEDED_CLASSES.some(c => c.name === classToDelete.name);
    if (isSeeded) {
      return res.json({ success: false, message: "Cannot delete a default class. You can only delete custom batches you created." });
    }
    await classModel.findByIdAndDelete(classId);
    res.json({ success: true, message: "Class deleted successfully" });
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
