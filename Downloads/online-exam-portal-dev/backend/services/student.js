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
          "password" : student.password,
          "status" : student.status,
          "createdAt" : student.createdAt,
          "organization" : student.organizationId ? student.organizationId.name : null
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

module.exports = {
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent
}