import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { getAllClasses, addStudentToClass, removeStudentFromClass, addSubjectToClass, removeSubjectFromClass } from '../../../redux/actions/classAction';
import { getSubjectDetails } from '../../../redux/actions/subjectAction';
import { Typography, Paper, Grid, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import axios from 'axios';
import apis from '../../../helper/Apis';
import Auth from '../../../helper/Auth';

const ClassManagement = ({ classes, getAllClasses, subjects, getSubjectDetails, addStudentToClass, removeStudentFromClass, addSubjectToClass, removeSubjectFromClass }) => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [openAddStudent, setOpenAddStudent] = useState(false);
  const [openAddSubject, setOpenAddSubject] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  useEffect(() => {
    getAllClasses();
    getSubjectDetails();
    fetchStudents();
  }, [getAllClasses, getSubjectDetails]);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(apis.BASE + apis.GET_ALL_STUDENTS_TEACHER, {
        headers: { 'Authorization': `Bearer ${Auth.retriveToken()}` }
      });
      if (response.data.success) {
        setStudents(response.data.students);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddStudent = () => {
    if(selectedClass && selectedStudent) {
      addStudentToClass(selectedClass._id, selectedStudent);
      setOpenAddStudent(false);
      setSelectedStudent('');
      // Force refresh of selected class after small delay to let redux update
      setTimeout(() => {
        getAllClasses();
      }, 500);
    }
  };

  const handleAddSubject = () => {
    if(selectedClass && selectedSubject) {
      addSubjectToClass(selectedClass._id, selectedSubject);
      setOpenAddSubject(false);
      setSelectedSubject('');
      setTimeout(() => {
        getAllClasses();
      }, 500);
    }
  };

  // Find the fully populated selected class from the classes array
  const currentClassObj = classes.find(c => selectedClass && c._id === selectedClass._id);

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>Class Management</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper style={{ padding: 10 }}>
            <Typography variant="h6">Classes</Typography>
            <List>
              {classes.map(c => (
                <ListItem button key={c._id} selected={selectedClass && selectedClass._id === c._id} onClick={() => setSelectedClass(c)}>
                  <ListItemText primary={c.name} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        
        {currentClassObj && (
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper style={{ padding: 10 }}>
                  <Typography variant="h6">Students in {currentClassObj.name}</Typography>
                  <Button variant="outlined" color="primary" onClick={() => setOpenAddStudent(true)}>Add Student</Button>
                  <List>
                    {currentClassObj.students.map(s => (
                      <ListItem key={s._id}>
                        <ListItemText primary={s.username} secondary={s.email} />
                        <ListItemSecondaryAction>
                          <IconButton edge="end" onClick={() => { removeStudentFromClass(currentClassObj._id, s._id); setTimeout(() => getAllClasses(), 500); }}>
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper style={{ padding: 10 }}>
                  <Typography variant="h6">Subjects for {currentClassObj.name}</Typography>
                  <Button variant="outlined" color="primary" onClick={() => setOpenAddSubject(true)}>Add Subject</Button>
                  <List>
                    {currentClassObj.subjects.map(s => (
                      <ListItem key={s._id}>
                        <ListItemText primary={s.name} />
                        <ListItemSecondaryAction>
                          <IconButton edge="end" onClick={() => { removeSubjectFromClass(currentClassObj._id, s._id); setTimeout(() => getAllClasses(), 500); }}>
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>

      {/* Add Student Dialog */}
      <Dialog open={openAddStudent} onClose={() => setOpenAddStudent(false)}>
        <DialogTitle>Add Student to Class</DialogTitle>
        <DialogContent>
          <Select fullWidth value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
            {students.map(s => (
              <MenuItem key={s.id} value={s.id}>{s.name} ({s.email})</MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddStudent(false)}>Cancel</Button>
          <Button onClick={handleAddStudent} color="primary">Add</Button>
        </DialogActions>
      </Dialog>

      {/* Add Subject Dialog */}
      <Dialog open={openAddSubject} onClose={() => setOpenAddSubject(false)}>
        <DialogTitle>Add Subject to Class</DialogTitle>
        <DialogContent>
          <Select fullWidth value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
            {subjects.map(s => (
              <MenuItem key={s.id} value={s.id}>{s.subject}</MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddSubject(false)}>Cancel</Button>
          <Button onClick={handleAddSubject} color="primary">Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const mapStateToProps = state => ({
  classes: state.classes.classes || [],
  subjects: state.subjectDetails.list || []
});

export default connect(mapStateToProps, { getAllClasses, getSubjectDetails, addStudentToClass, removeStudentFromClass, addSubjectToClass, removeSubjectFromClass })(ClassManagement);
