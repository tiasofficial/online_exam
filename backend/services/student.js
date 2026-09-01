const userModel = require("../models/user")
const tool = require("./tool");

var getAllStudents = (req, res, next) => {
  var query = {usertype: "STUDENT"};
  if (req.user && req.user.usertype === 'TEACHER') {
    query.organizationId = req.user.organizationId || null;
  }
  userModel.find(query).populate('organizationId').exec((err, users)=>{
    if(err) {
      res.status(500).json({
        success:false,
        message : 'Internal server error'
      })
    } else {
      var students = []
      users.forEach((student)=>{
        students.push({
          "id" : student._id,
          "name" : student.username,
          "email" : student.email,
          "password" : student.plainPassword || student.password,
          "status" : student.status,
          "createdAt" : student.createdAt,
          "organization" : student.organizationId ? student.organizationId.name : null,
          "loginTimestamps" : student.loginTimestamps
        })
      })
      res.json({
        success : true,
        students
      })
    }
  })
}

var createStudent = async (req, res, next) => {
  if(!req.user || req.user.usertype != 'TEACHER') {
    return res.status(401).json({ success: false, message: "Permissions not granted!" });
  }
  const { username, email, password } = req.body;
  try {
    const existing = await userModel.findOne({ email: email });
    if(existing) {
      return res.json({ success: false, message: "Email already exists" });
    }
    const hash = await tool.hashPassword(password);
    const newStudent = await userModel.create({
      username: username,
      email: email,
      password: hash,
      plainPassword: password, // store plain text so teacher can view
      usertype: 'STUDENT',
      organizationId: req.user.organizationId || undefined
    });
    res.json({ success: true, message: "Student created", student: { id: newStudent._id, name: newStudent.username, email: newStudent.email, status: newStudent.status } });
  } catch(err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Error creating student" });
  }
}

var updateStudent = async (req, res, next) => {
  if(!req.user || req.user.usertype != 'TEACHER') {
    return res.status(401).json({ success: false, message: "Permissions not granted!" });
  }
  const { studentId, username, email, password, status } = req.body;
  try {
    let updateData = { username, email };
    if(status !== undefined) updateData.status = status;
    if(password) {
      updateData.password = await tool.hashPassword(password);
      updateData.plainPassword = password; // update plain text too
    }
    const updated = await userModel.findOneAndUpdate({ _id: studentId, organizationId: req.user.organizationId }, updateData);
    if (!updated) {
      return res.status(404).json({ success: false, message: "Student not found in your organization" });
    }
    res.json({ success: true, message: "Student updated" });
  } catch(err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Error updating student" });
  }
}

var deleteStudent = async (req, res, next) => {
  if(!req.user || req.user.usertype != 'TEACHER') {
    return res.status(401).json({ success: false, message: "Permissions not granted!" });
  }
  const { studentId } = req.body;
  try {
    const deleted = await userModel.findOneAndDelete({ _id: studentId, organizationId: req.user.organizationId });
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Student not found in your organization" });
    }
    res.json({ success: true, message: "Student deleted" });
  } catch(err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Error deleting student" });
  }
}

// Student changes their own password
var changeOwnPassword = async (req, res, next) => {
  const creator = req.user || null;
  if (!creator || creator.usertype !== 'STUDENT') {
    return res.status(401).json({ success: false, message: "Permissions not granted!" });
  }
  const { currentPassword, newPassword } = req.body;
  if (!newPassword || newPassword.length < 4) {
    return res.json({ success: false, message: "New password must be at least 4 characters" });
  }
  try {
    const bcrypt = require('bcrypt');
    const user = await userModel.findById(creator._id);
    if (!user) return res.json({ success: false, message: "User not found" });

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Current password is incorrect" });
    }

    const hash = await tool.hashPassword(newPassword);
    await userModel.findByIdAndUpdate(creator._id, {
      password: hash,
      plainPassword: newPassword // teacher can see updated password
    });
    res.json({ success: true, message: "Password changed successfully!" });
  } catch(err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Error changing password" });
  }
}

module.exports = {
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  changeOwnPassword
}