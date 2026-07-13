const subjectModel = require("../models/subject")


var getAllSubject = (req, res, next) => {
  var orgId = req.user && req.user.usertype === 'TEACHER' ? (req.user.organizationId || null) : null;
  var query = req.user && req.user.usertype === 'TEACHER' ? { organizationId: orgId } : {};
  subjectModel.find(query, (err, sub)=>{
    if(err) {
      res.status(500).json({
        success:false,
        message : 'Internal server error'
      })
    } else {
      var subjects = []
      sub.forEach((subject)=>{
        subjects.push({
          "id" : subject._id,
          "subject" : subject.name,
          "status" : subject.status
        })
      })
      res.json({
        success : true,
        subjects : subjects
      })
    }
  })
}

var getAllActiveSubject = (req, res, next) => {
  var orgId = req.user && req.user.usertype === 'TEACHER' ? (req.user.organizationId || null) : null;
  var query = req.user && req.user.usertype === 'TEACHER' ? { status:true, organizationId: orgId } : { status:true };
  subjectModel.find(query, (err, sub)=>{
    if(err) {
      res.status(500).json({
        success:false,
        message : 'Internal server error'
      })
    } else {
      var subjects = []
      sub.forEach((subject)=>{
        subjects.push({
          "id" : subject._id,
          "subject" : subject.name,
          "status" : subject.status
        })
      })
      res.json({
        success : true,
        subjects : subjects
      })
    }
  })
}

var getStatusCount = (req,res,next) => {
  subjectModel.aggregate(
    [
      {$match:{}},
      {$group: {_id:"$status",count:{$sum:1}} }
    ]
  )
  .then((result)=>{
      var trueCount = 0
      var falseCount = 0
      result.forEach((x)=>{
        if(x._id == true) {
          trueCount = x.count
        }
        if(x._id == false) {
          falseCount = x.count
        }
      })
      res.json({
        success:true,
        active : trueCount,
        blocked : falseCount
      })
    })
    .catch((err)=>{
      console.log(err)
      res.status(500).json({
        success:false,
        message:'Internal server error'
      })
    })
}

var createSubject = async (req, res, next) => {
  if(!req.user || req.user.usertype != 'TEACHER') {
    return res.status(401).json({ success: false, message: "Permissions not granted!" });
  }
  const { name } = req.body;
  try {
    const existing = await subjectModel.findOne({ name: name, organizationId: req.user.organizationId || null });
    if (existing) {
      return res.json({ success: false, message: "Subject already exists" });
    }
    const newSub = await subjectModel.create({ 
      name: name, 
      status: true, 
      createdBy: req.user._id,
      organizationId: req.user.organizationId || undefined 
    });
    res.json({ success: true, message: "Subject created", subject: { id: newSub._id, subject: newSub.name, status: newSub.status } });
  } catch(err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Error creating subject" });
  }
}

var updateSubject = async (req, res, next) => {
  if(!req.user || req.user.usertype != 'TEACHER') {
    return res.status(401).json({ success: false, message: "Permissions not granted!" });
  }
  const { subjectId, name, status } = req.body;
  try {
    await subjectModel.findByIdAndUpdate(subjectId, { name: name, status: status !== undefined ? status : true });
    res.json({ success: true, message: "Subject updated" });
  } catch(err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Error updating subject" });
  }
}

var deleteSubject = async (req, res, next) => {
  if(!req.user || req.user.usertype != 'TEACHER') {
    return res.status(401).json({ success: false, message: "Permissions not granted!" });
  }
  const { subjectId } = req.body;
  try {
    await subjectModel.findByIdAndDelete(subjectId);
    res.json({ success: true, message: "Subject deleted" });
  } catch(err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Error deleting subject" });
  }
}

module.exports = {
  getAllSubject,
  getStatusCount,
  getAllActiveSubject,
  createSubject,
  updateSubject,
  deleteSubject
}