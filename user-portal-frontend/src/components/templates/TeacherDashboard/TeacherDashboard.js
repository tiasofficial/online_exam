import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { 
  Tabs, Tab, Typography, Box, Button, Paper, List, ListItem, ListItemText, ListItemSecondaryAction, 
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField 
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import axios from 'axios';
import apis from '../../../helper/Apis';
import Auth from '../../../helper/Auth';
import { setAlert } from '../../../redux/actions/alertAction';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

const TeacherDashboard = ({ setAlert }) => {
  const [tabValue, setTabValue] = useState(0);
  
  // Data State
  const [students, setStudents] = useState([]);
  const [classesList, setClassesList] = useState([]);
  const [subjects, setSubjects] = useState([]);

  // Dialog State
  const [openStudent, setOpenStudent] = useState(false);
  const [openClass, setOpenClass] = useState(false);
  const [openSubject, setOpenSubject] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');

  useEffect(() => {
    fetchStudents();
    fetchClasses();
    fetchSubjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const headers = { 'Authorization': `Bearer ${Auth.retriveToken()}` };

  // Fetch Methods
  const fetchStudents = async () => {
    try {
      const res = await axios.get(apis.BASE + apis.GET_ALL_STUDENTS_TEACHER, { headers });
      if(res.data.success) setStudents(res.data.students);
    } catch(err) { console.log(err); }
  };
  const fetchClasses = async () => {
    try {
      const res = await axios.get(apis.BASE + apis.GET_CLASSES, { headers });
      if(res.data.success) setClassesList(res.data.classes);
    } catch(err) { console.log(err); }
  };
  const fetchSubjects = async () => {
    try {
      const res = await axios.get(apis.BASE + apis.GET_ALL_SUBJECT, { headers });
      if(res.data.success) setSubjects(res.data.subjects);
    } catch(err) { console.log(err); }
  };

  // Open Dialogs
  const handleAddStudent = () => {
    setEditingId(null);
    setFormName('');
    setFormEmail('');
    setFormPassword('');
    setOpenStudent(true);
  };

  const handleEditStudent = (student) => {
    setEditingId(student.id);
    setFormName(student.name);
    setFormEmail(student.email);
    setFormPassword('');
    setOpenStudent(true);
  };

  const handleAddClass = () => {
    setEditingId(null);
    setFormName('');
    setOpenClass(true);
  };

  const handleEditClass = (cls) => {
    setEditingId(cls._id);
    setFormName(cls.name);
    setOpenClass(true);
  };

  const handleAddSubject = () => {
    setEditingId(null);
    setFormName('');
    setOpenSubject(true);
  };

  const handleEditSubject = (sub) => {
    setEditingId(sub.id);
    setFormName(sub.subject);
    setOpenSubject(true);
  };

  // Save Methods
  const saveStudent = async () => {
    try {
      const payload = { username: formName, email: formEmail, password: formPassword };
      let res;
      if(editingId) {
        payload.studentId = editingId;
        res = await axios.post(apis.BASE + apis.UPDATE_STUDENT, payload, { headers });
      } else {
        res = await axios.post(apis.BASE + apis.CREATE_STUDENT, payload, { headers });
      }
      if(res.data.success) {
        setAlert({ isAlert: true, type: 'success', title: 'Success', message: res.data.message });
        setOpenStudent(false);
        fetchStudents();
      } else {
        setAlert({ isAlert: true, type: 'error', title: 'Error', message: res.data.message });
      }
    } catch(err) { setAlert({ isAlert: true, type: 'error', title: 'Error', message: 'Failed to save student' }); }
  };

  const saveClass = async () => {
    try {
      const payload = { name: formName };
      let res;
      if(editingId) {
        payload.classId = editingId;
        res = await axios.post(apis.BASE + apis.UPDATE_CLASS, payload, { headers });
      } else {
        res = await axios.post(apis.BASE + apis.CREATE_CLASS, payload, { headers });
      }
      if(res.data.success) {
        setAlert({ isAlert: true, type: 'success', title: 'Success', message: res.data.message });
        setOpenClass(false);
        fetchClasses();
      } else {
        setAlert({ isAlert: true, type: 'error', title: 'Error', message: res.data.message });
      }
    } catch(err) { setAlert({ isAlert: true, type: 'error', title: 'Error', message: 'Failed to save class' }); }
  };

  const saveSubject = async () => {
    try {
      const payload = { name: formName };
      let res;
      if(editingId) {
        payload.subjectId = editingId;
        res = await axios.post(apis.BASE + apis.UPDATE_SUBJECT, payload, { headers });
      } else {
        res = await axios.post(apis.BASE + apis.CREATE_SUBJECT, payload, { headers });
      }
      if(res.data.success) {
        setAlert({ isAlert: true, type: 'success', title: 'Success', message: res.data.message });
        setOpenSubject(false);
        fetchSubjects();
      } else {
        setAlert({ isAlert: true, type: 'error', title: 'Error', message: res.data.message });
      }
    } catch(err) { setAlert({ isAlert: true, type: 'error', title: 'Error', message: 'Failed to save subject' }); }
  };

  // Delete Methods
  const deleteStudent = async (id) => {
    try {
      const res = await axios.post(apis.BASE + apis.DELETE_STUDENT, { studentId: id }, { headers });
      if(res.data.success) { fetchStudents(); setAlert({ isAlert: true, type: 'success', title: 'Success', message: res.data.message }); }
    } catch(err) { console.log(err); }
  };

  const deleteClass = async (id) => {
    try {
      const res = await axios.post(apis.BASE + apis.DELETE_CLASS, { classId: id }, { headers });
      if(res.data.success) { fetchClasses(); setAlert({ isAlert: true, type: 'success', title: 'Success', message: res.data.message }); }
    } catch(err) { console.log(err); }
  };

  const deleteSubject = async (id) => {
    try {
      const res = await axios.post(apis.BASE + apis.DELETE_SUBJECT, { subjectId: id }, { headers });
      if(res.data.success) { fetchSubjects(); setAlert({ isAlert: true, type: 'success', title: 'Success', message: res.data.message }); }
    } catch(err) { console.log(err); }
  };

  return (
    <div style={{ width: '100%', minWidth: '600px', padding: '20px' }}>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      
      <Paper>
        <Tabs value={tabValue} onChange={handleTabChange} indicatorColor="primary" textColor="primary" centered>
          <Tab label="Students" />
          <Tab label="Classes" />
          <Tab label="Subjects" />
        </Tabs>
      </Paper>

      {/* STUDENTS TAB */}
      <TabPanel value={tabValue} index={0}>
        <Button variant="contained" color="primary" onClick={handleAddStudent} style={{ marginBottom: 15 }}>Add Student</Button>
        <Paper>
          <List>
            {students.map(s => (
              <ListItem key={s.id} divider>
                <ListItemText primary={s.name} secondary={s.email} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => handleEditStudent(s)}><EditIcon /></IconButton>
                  <IconButton edge="end" onClick={() => deleteStudent(s.id)}><DeleteIcon /></IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      </TabPanel>

      {/* CLASSES TAB */}
      <TabPanel value={tabValue} index={1}>
        <Button variant="contained" color="primary" onClick={handleAddClass} style={{ marginBottom: 15 }}>Add Class</Button>
        <Paper>
          <List>
            {classesList.map(c => (
              <ListItem key={c._id} divider>
                <ListItemText primary={c.name} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => handleEditClass(c)}><EditIcon /></IconButton>
                  <IconButton edge="end" onClick={() => deleteClass(c._id)}><DeleteIcon /></IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      </TabPanel>

      {/* SUBJECTS TAB */}
      <TabPanel value={tabValue} index={2}>
        <Button variant="contained" color="primary" onClick={handleAddSubject} style={{ marginBottom: 15 }}>Add Subject</Button>
        <Paper>
          <List>
            {subjects.map(s => (
              <ListItem key={s.id} divider>
                <ListItemText primary={s.subject} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => handleEditSubject(s)}><EditIcon /></IconButton>
                  <IconButton edge="end" onClick={() => deleteSubject(s.id)}><DeleteIcon /></IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      </TabPanel>

      {/* Student Dialog */}
      <Dialog open={openStudent} onClose={() => setOpenStudent(false)} fullWidth>
        <DialogTitle>{editingId ? "Edit Student" : "Add Student"}</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="Username" type="text" fullWidth value={formName} onChange={e => setFormName(e.target.value)} />
          <TextField margin="dense" label="Email" type="email" fullWidth value={formEmail} onChange={e => setFormEmail(e.target.value)} />
          <TextField margin="dense" label="Password (leave blank to keep current)" type="password" fullWidth value={formPassword} onChange={e => setFormPassword(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenStudent(false)}>Cancel</Button>
          <Button onClick={saveStudent} color="primary">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Class Dialog */}
      <Dialog open={openClass} onClose={() => setOpenClass(false)} fullWidth>
        <DialogTitle>{editingId ? "Edit Class" : "Add Class"}</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="Class Name" type="text" fullWidth value={formName} onChange={e => setFormName(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenClass(false)}>Cancel</Button>
          <Button onClick={saveClass} color="primary">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Subject Dialog */}
      <Dialog open={openSubject} onClose={() => setOpenSubject(false)} fullWidth>
        <DialogTitle>{editingId ? "Edit Subject" : "Add Subject"}</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="Subject Name" type="text" fullWidth value={formName} onChange={e => setFormName(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSubject(false)}>Cancel</Button>
          <Button onClick={saveSubject} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default connect(null, { setAlert })(TeacherDashboard);
