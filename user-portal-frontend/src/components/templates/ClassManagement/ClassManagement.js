import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  getAllClasses, addStudentToClass, removeStudentFromClass,
  addSubjectToClass, removeSubjectFromClass, createClass, deleteClass
} from '../../../redux/actions/classAction';
import { getSubjectDetails } from '../../../redux/actions/subjectAction';
import {
  Typography, Paper, Grid, List, ListItem, ListItemText,
  ListItemSecondaryAction, IconButton, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, Select, MenuItem, TextField,
  FormControl, InputLabel, Chip, Divider, Box, Tooltip, Badge
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import SchoolIcon from '@material-ui/icons/School';
import ScienceIcon from '@material-ui/icons/EmojiObjects';
import BioIcon from '@material-ui/icons/LocalHospital';
import GroupIcon from '@material-ui/icons/Group';
import axios from 'axios';
import apis from '../../../helper/Apis';
import Auth from '../../../helper/Auth';

// ─── Colour palette ───────────────────────────────────────────────────────────
const COLORS = {
  regular:  { bg: '#f0f4ff', border: '#6366f1', badge: '#6366f1', badgeBg: '#e0e7ff', label: 'Regular' },
  jee:      { bg: '#fff7ed', border: '#f97316', badge: '#ea580c', badgeBg: '#ffedd5', label: 'JEE-Mains' },
  neet:     { bg: '#f0fdf4', border: '#22c55e', badge: '#16a34a', badgeBg: '#dcfce7', label: 'NEET' },
};

const getColorScheme = (examType) => {
  if (examType === 'JEE-Mains') return COLORS.jee;
  if (examType === 'NEET')      return COLORS.neet;
  return COLORS.regular;
};

// ─── Exam type badge chip ─────────────────────────────────────────────────────
const ExamBadge = ({ examType }) => {
  const cs = getColorScheme(examType);
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 10px',
      borderRadius: '20px',
      fontSize: '11px',
      fontWeight: '700',
      letterSpacing: '0.5px',
      backgroundColor: cs.badgeBg,
      color: cs.badge,
      marginLeft: '8px',
      textTransform: 'uppercase'
    }}>
      {cs.label}
    </span>
  );
};

// ─── Seeded base class names (cannot be deleted) ──────────────────────────────
const SEEDED_NAMES = new Set([
  'Class 6','Class 7','Class 8','Class 9','Class 10',
  'Class 11','Class 12','Crash Course'
]);

const ClassManagement = ({
  classes, getAllClasses, subjects, getSubjectDetails,
  addStudentToClass, removeStudentFromClass,
  addSubjectToClass, removeSubjectFromClass,
  createClass, deleteClass
}) => {
  const [selectedClass, setSelectedClass]       = useState(null);
  const [allStudents, setAllStudents]           = useState([]);
  const [openAddStudent, setOpenAddStudent]     = useState(false);
  const [openAddSubject, setOpenAddSubject]     = useState(false);
  const [openCreateClass, setOpenCreateClass]   = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

  // "Create class" dialog state
  const [newClassName, setNewClassName]         = useState('');
  const [newExamType, setNewExamType]           = useState('');   // 'JEE-Mains' | 'NEET' | ''
  const [createForType, setCreateForType]       = useState(null); // pre-fills examType

  const [selectedStudent, setSelectedStudent]   = useState('');
  const [selectedSubject, setSelectedSubject]   = useState('');

  useEffect(() => {
    getAllClasses();
    getSubjectDetails();
    fetchStudents();
  }, []);   // eslint-disable-line

  const fetchStudents = async () => {
    try {
      const r = await axios.get(apis.BASE + apis.GET_ALL_STUDENTS_TEACHER, {
        headers: { 'Authorization': `Bearer ${Auth.retriveToken()}` }
      });
      if (r.data.success) setAllStudents(r.data.students);
    } catch (e) { console.log(e); }
  };

  // ── helpers ──────────────────────────────────────────────────────────────────
  const refresh = () => setTimeout(() => getAllClasses(), 400);

  const handleAddStudent = () => {
    if (selectedClass && selectedStudent) {
      addStudentToClass(selectedClass._id, selectedStudent);
      setOpenAddStudent(false); setSelectedStudent(''); refresh();
    }
  };

  const handleAddSubject = () => {
    if (selectedClass && selectedSubject) {
      addSubjectToClass(selectedClass._id, selectedSubject);
      setOpenAddSubject(false); setSelectedSubject(''); refresh();
    }
  };

  const handleCreateClass = () => {
    if (!newClassName.trim()) return;
    createClass(newClassName.trim(), newExamType || null);
    setOpenCreateClass(false); setNewClassName(''); setNewExamType(''); setCreateForType(null);
  };

  const handleDeleteClass = () => {
    if (selectedClass) {
      deleteClass(selectedClass._id);
      setSelectedClass(null);
      setOpenDeleteConfirm(false);
    }
  };

  const openCreateFor = (examType) => {
    setCreateForType(examType);
    setNewExamType(examType || '');
    setNewClassName('');
    setOpenCreateClass(true);
  };

  // ── group classes ─────────────────────────────────────────────────────────
  const regular  = classes.filter(c => !c.examType && c.name !== 'JEE-Mains' && c.name !== 'NEET');
  const jeeList  = classes.filter(c => c.examType === 'JEE-Mains' || (!c.examType && c.name === 'JEE-Mains'));
  const neetList = classes.filter(c => c.examType === 'NEET' || (!c.examType && c.name === 'NEET'));

  // Always pick fresh populated class from store
  const currentClassObj = selectedClass ? classes.find(c => c._id === selectedClass._id) : null;
  const isSeeded        = currentClassObj ? (SEEDED_NAMES.has(currentClassObj.name) || currentClassObj.name === 'JEE-Mains' || currentClassObj.name === 'NEET') : true;
  const isExamClass     = currentClassObj ? (!!currentClassObj.examType || currentClassObj.name === 'JEE-Mains' || currentClassObj.name === 'NEET') : false;

  // ── Section renderer ──────────────────────────────────────────────────────
  const renderSection = (title, list, examTypeKey, icon) => {
    const cs = getColorScheme(examTypeKey);
    return (
      <div style={{ marginBottom: '20px' }}>
        {/* Section header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '8px 12px', borderRadius: '8px 8px 0 0',
          background: cs.badgeBg, borderLeft: `4px solid ${cs.border}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {icon}
            <Typography variant="subtitle2" style={{ fontWeight: '700', color: cs.badge }}>
              {title}
            </Typography>
            <span style={{
              background: cs.badge, color: '#fff', borderRadius: '12px',
              padding: '1px 8px', fontSize: '11px', fontWeight: '700'
            }}>{list.length}</span>
          </div>
          {/* "+ New Batch" only for exam types */}
          {examTypeKey && (
            <Tooltip title={`Create new ${examTypeKey} batch`}>
              <Button
                size="small"
                startIcon={<AddIcon />}
                onClick={() => openCreateFor(examTypeKey)}
                style={{
                  backgroundColor: cs.badge, color: '#fff',
                  borderRadius: '20px', padding: '2px 14px',
                  fontSize: '12px', fontWeight: '600', textTransform: 'none'
                }}
              >
                New Batch
              </Button>
            </Tooltip>
          )}
          {/* "+ New Class" for regular */}
          {!examTypeKey && (
            <Tooltip title="Create new regular class">
              <Button
                size="small"
                startIcon={<AddIcon />}
                onClick={() => openCreateFor('')}
                style={{
                  backgroundColor: cs.badge, color: '#fff',
                  borderRadius: '20px', padding: '2px 14px',
                  fontSize: '12px', fontWeight: '600', textTransform: 'none'
                }}
              >
                New Class
              </Button>
            </Tooltip>
          )}
        </div>

        {/* Class list */}
        <Paper elevation={0} style={{ border: `1px solid ${cs.border}30`, borderTop: 'none', borderRadius: '0 0 8px 8px' }}>
          <List dense>
            {list.length === 0 && (
              <ListItem>
                <ListItemText
                  secondary={examTypeKey ? `No ${examTypeKey} batches yet. Click 'New Batch' to create one.` : 'No classes in this group.'}
                />
              </ListItem>
            )}
            {list.map((c, idx) => (
              <React.Fragment key={c._id}>
                <ListItem
                  button
                  selected={selectedClass && selectedClass._id === c._id}
                  onClick={() => setSelectedClass(c)}
                  style={{
                    borderRadius: '4px',
                    backgroundColor: selectedClass && selectedClass._id === c._id ? cs.badgeBg : 'transparent'
                  }}
                >
                  <ListItemText
                    primary={
                      <span style={{ fontWeight: selectedClass && selectedClass._id === c._id ? '700' : '500' }}>
                        {c.name}
                      </span>
                    }
                    secondary={
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                        <GroupIcon style={{ fontSize: '13px', color: '#64748b' }} />
                        <span style={{ fontSize: '12px', color: '#64748b' }}>{c.students ? c.students.length : 0} students</span>
                      </span>
                    }
                  />
                  {!SEEDED_NAMES.has(c.name) && (
                    <ListItemSecondaryAction>
                      <Tooltip title="Delete batch">
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={(e) => { e.stopPropagation(); setSelectedClass(c); setOpenDeleteConfirm(true); }}
                        >
                          <DeleteIcon fontSize="small" style={{ color: '#ef4444' }} />
                        </IconButton>
                      </Tooltip>
                    </ListItemSecondaryAction>
                  )}
                </ListItem>
                {idx < list.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </div>
    );
  };

  // ── Detail panel ─────────────────────────────────────────────────────────
  const renderDetailPanel = () => {
    if (!currentClassObj) {
      return (
        <Paper elevation={0} style={{
          height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '2px dashed #e2e8f0', borderRadius: '12px', padding: '40px',
          flexDirection: 'column', gap: '12px', minHeight: '400px'
        }}>
          <SchoolIcon style={{ fontSize: '48px', color: '#cbd5e1' }} />
          <Typography variant="h6" style={{ color: '#94a3b8', fontWeight: '600' }}>Select a Class</Typography>
          <Typography variant="body2" style={{ color: '#b0bec5', textAlign: 'center' }}>
            Choose a class from the left panel to manage its students and subjects
          </Typography>
        </Paper>
      );
    }

    const cs = getColorScheme(currentClassObj.examType);

    return (
      <Paper elevation={0} style={{
        border: `2px solid ${cs.border}50`, borderRadius: '12px', overflow: 'hidden'
      }}>
        {/* Panel header */}
        <div style={{
          padding: '16px 20px', background: `linear-gradient(135deg, ${cs.badgeBg}, white)`,
          borderBottom: `1px solid ${cs.border}30`, display: 'flex',
          alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h6" style={{ fontWeight: '800', color: '#1e293b' }}>
                {currentClassObj.name}
              </Typography>
              <ExamBadge examType={currentClassObj.examType} />
            </div>
            <Typography variant="body2" style={{ color: '#64748b', marginTop: '2px' }}>
              {currentClassObj.students.length} students · {currentClassObj.subjects.length} subjects
            </Typography>
          </div>
          {!isSeeded && (
            <Tooltip title="Delete this batch permanently">
              <Button
                variant="outlined"
                size="small"
                startIcon={<DeleteIcon />}
                onClick={() => setOpenDeleteConfirm(true)}
                style={{ borderColor: '#ef4444', color: '#ef4444', borderRadius: '8px' }}
              >
                Delete Batch
              </Button>
            </Tooltip>
          )}
        </div>

        <Grid container style={{ padding: '16px' }} spacing={2}>
          {/* Students column */}
          <Grid item xs={12} md={6}>
            <div style={{
              background: '#f8fafc', borderRadius: '10px', padding: '16px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <Typography variant="subtitle1" style={{ fontWeight: '700', color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <GroupIcon fontSize="small" style={{ color: cs.badge }} /> Students
                </Typography>
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenAddStudent(true)}
                  style={{ backgroundColor: cs.badge, color: '#fff', borderRadius: '8px', textTransform: 'none', fontSize: '12px' }}
                >
                  Add
                </Button>
              </div>
              {currentClassObj.students.length === 0 ? (
                <Typography variant="body2" style={{ color: '#94a3b8', textAlign: 'center', padding: '20px 0' }}>
                  No students yet
                </Typography>
              ) : (
                <List dense style={{ maxHeight: '280px', overflowY: 'auto' }}>
                  {currentClassObj.students.map((s, i) => (
                    <React.Fragment key={s._id}>
                      <ListItem style={{ borderRadius: '6px', background: '#fff', marginBottom: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                        <ListItemText
                          primary={<span style={{ fontWeight: '600', fontSize: '13px' }}>{s.username}</span>}
                          secondary={<span style={{ fontSize: '11px', color: '#64748b' }}>{s.email}</span>}
                        />
                        <ListItemSecondaryAction>
                          <Tooltip title="Remove from class">
                            <IconButton size="small" onClick={() => { removeStudentFromClass(currentClassObj._id, s._id); refresh(); }}>
                              <DeleteIcon fontSize="small" style={{ color: '#f87171' }} />
                            </IconButton>
                          </Tooltip>
                        </ListItemSecondaryAction>
                      </ListItem>
                    </React.Fragment>
                  ))}
                </List>
              )}
            </div>
          </Grid>

          {/* Subjects column */}
          <Grid item xs={12} md={6}>
            <div style={{
              background: '#f8fafc', borderRadius: '10px', padding: '16px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <Typography variant="subtitle1" style={{ fontWeight: '700', color: '#334155' }}>
                  📚 Subjects
                </Typography>
                {!isExamClass && (
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenAddSubject(true)}
                    style={{ backgroundColor: '#6366f1', color: '#fff', borderRadius: '8px', textTransform: 'none', fontSize: '12px' }}
                  >
                    Add
                  </Button>
                )}
              </div>

              {isExamClass && (
                <div style={{
                  background: cs.badgeBg, borderRadius: '8px', padding: '10px 12px',
                  marginBottom: '10px', border: `1px solid ${cs.border}40`
                }}>
                  <Typography variant="caption" style={{ color: cs.badge, fontWeight: '700' }}>
                    {(currentClassObj.examType === 'JEE-Mains' || currentClassObj.name === 'JEE-Mains')
                      ? '⚡ Physics · Chemistry · Mathematics (auto-assigned by question order)'
                      : '🔬 Physics · Chemistry · Biology (auto-assigned by question order)'}
                  </Typography>
                </div>
              )}

              {currentClassObj.subjects.length === 0 && !isExamClass ? (
                <Typography variant="body2" style={{ color: '#94a3b8', textAlign: 'center', padding: '20px 0' }}>
                  No subjects added
                </Typography>
              ) : (
                <List dense style={{ maxHeight: '240px', overflowY: 'auto' }}>
                  {currentClassObj.subjects.map(s => (
                    <ListItem key={s._id} style={{ borderRadius: '6px', background: '#fff', marginBottom: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                      <ListItemText
                        primary={<span style={{ fontWeight: '600', fontSize: '13px' }}>{s.name}</span>}
                      />
                      {!isExamClass && (
                        <ListItemSecondaryAction>
                          <IconButton size="small" onClick={() => { removeSubjectFromClass(currentClassObj._id, s._id); refresh(); }}>
                            <DeleteIcon fontSize="small" style={{ color: '#f87171' }} />
                          </IconButton>
                        </ListItemSecondaryAction>
                      )}
                    </ListItem>
                  ))}
                </List>
              )}
            </div>
          </Grid>
        </Grid>
      </Paper>
    );
  };

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ padding: '24px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Page title */}
      <div style={{ marginBottom: '28px' }}>
        <Typography variant="h4" style={{ fontWeight: '800', color: '#1e293b' }}>Class Management</Typography>
        <Typography variant="body1" style={{ color: '#64748b', marginTop: '4px' }}>
          Manage regular classes and competitive exam batches (JEE-Mains &amp; NEET)
        </Typography>
      </div>

      <Grid container spacing={3}>
        {/* ── Left: Class list ───────────────────────────── */}
        <Grid item xs={12} md={4}>
          {renderSection('Regular Classes', regular, null,
            <SchoolIcon style={{ fontSize: '16px', color: COLORS.regular.badge }} />
          )}
          {renderSection('JEE-Mains Batches', jeeList, 'JEE-Mains',
            <span style={{ fontSize: '15px' }}>⚡</span>
          )}
          {renderSection('NEET Batches', neetList, 'NEET',
            <span style={{ fontSize: '15px' }}>🔬</span>
          )}
        </Grid>

        {/* ── Right: Detail panel ────────────────────────── */}
        <Grid item xs={12} md={8}>
          {renderDetailPanel()}
        </Grid>
      </Grid>

      {/* ── Add Student Dialog ──────────────────────────────── */}
      <Dialog open={openAddStudent} onClose={() => setOpenAddStudent(false)} fullWidth maxWidth="xs">
        <DialogTitle style={{ fontWeight: '700' }}>Add Student to {currentClassObj?.name}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth variant="outlined" style={{ marginTop: '8px' }}>
            <InputLabel>Select Student</InputLabel>
            <Select value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)} label="Select Student">
              {allStudents
                .filter(s => !currentClassObj?.students?.some(cs => cs._id === s.id))
                .map(s => (
                  <MenuItem key={s.id} value={s.id}>{s.name} <span style={{ color: '#64748b', marginLeft: '6px', fontSize: '12px' }}>({s.email})</span></MenuItem>
                ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions style={{ padding: '12px 24px' }}>
          <Button onClick={() => setOpenAddStudent(false)}>Cancel</Button>
          <Button onClick={handleAddStudent} variant="contained" color="primary" disabled={!selectedStudent}>Add Student</Button>
        </DialogActions>
      </Dialog>

      {/* ── Add Subject Dialog ──────────────────────────────── */}
      <Dialog open={openAddSubject} onClose={() => setOpenAddSubject(false)} fullWidth maxWidth="xs">
        <DialogTitle style={{ fontWeight: '700' }}>Add Subject to {currentClassObj?.name}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth variant="outlined" style={{ marginTop: '8px' }}>
            <InputLabel>Select Subject</InputLabel>
            <Select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} label="Select Subject">
              {subjects
                .filter(s => !currentClassObj?.subjects?.some(cs => cs._id === s.id))
                .map(s => (
                  <MenuItem key={s.id} value={s.id}>{s.subject}</MenuItem>
                ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions style={{ padding: '12px 24px' }}>
          <Button onClick={() => setOpenAddSubject(false)}>Cancel</Button>
          <Button onClick={handleAddSubject} variant="contained" color="primary" disabled={!selectedSubject}>Add Subject</Button>
        </DialogActions>
      </Dialog>

      {/* ── Create Class / Batch Dialog ─────────────────────── */}
      <Dialog open={openCreateClass} onClose={() => setOpenCreateClass(false)} fullWidth maxWidth="xs">
        <DialogTitle style={{ fontWeight: '700' }}>
          {createForType ? `New ${createForType} Batch` : 'New Regular Class'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            variant="outlined"
            label={createForType ? 'Batch Name (e.g. JEE Batch B)' : 'Class Name (e.g. Class 10 B)'}
            value={newClassName}
            onChange={e => setNewClassName(e.target.value)}
            style={{ marginTop: '8px', marginBottom: '16px' }}
            onKeyPress={e => { if (e.key === 'Enter') handleCreateClass(); }}
          />
          {!createForType && (
            <FormControl fullWidth variant="outlined">
              <InputLabel>Exam Type (optional)</InputLabel>
              <Select
                value={newExamType}
                onChange={e => setNewExamType(e.target.value)}
                label="Exam Type (optional)"
              >
                <MenuItem value="">None (Regular Class)</MenuItem>
                <MenuItem value="JEE-Mains">⚡ JEE-Mains</MenuItem>
                <MenuItem value="NEET">🔬 NEET</MenuItem>
              </Select>
            </FormControl>
          )}
          {createForType && (
            <div style={{
              background: getColorScheme(createForType).badgeBg,
              borderRadius: '8px', padding: '10px 14px',
              border: `1px solid ${getColorScheme(createForType).border}40`
            }}>
              <Typography variant="caption" style={{ color: getColorScheme(createForType).badge, fontWeight: '600' }}>
                This batch will be tagged as <strong>{createForType}</strong>. You can add different students than other {createForType} batches.
              </Typography>
            </div>
          )}
        </DialogContent>
        <DialogActions style={{ padding: '12px 24px' }}>
          <Button onClick={() => setOpenCreateClass(false)}>Cancel</Button>
          <Button
            onClick={handleCreateClass}
            variant="contained"
            color="primary"
            disabled={!newClassName.trim()}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Delete Confirm Dialog ───────────────────────────── */}
      <Dialog open={openDeleteConfirm} onClose={() => setOpenDeleteConfirm(false)} maxWidth="xs">
        <DialogTitle style={{ color: '#ef4444', fontWeight: '700' }}>Delete Batch?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{selectedClass?.name}</strong>?
            This will remove the class but students will remain in the system.
          </Typography>
        </DialogContent>
        <DialogActions style={{ padding: '12px 24px' }}>
          <Button onClick={() => setOpenDeleteConfirm(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteClass}
            variant="contained"
            style={{ backgroundColor: '#ef4444', color: '#fff' }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const mapStateToProps = state => ({
  classes:  state.classes.classes || [],
  subjects: state.subjectDetails.list || []
});

export default connect(mapStateToProps, {
  getAllClasses, getSubjectDetails,
  addStudentToClass, removeStudentFromClass,
  addSubjectToClass, removeSubjectFromClass,
  createClass, deleteClass
})(ClassManagement);
