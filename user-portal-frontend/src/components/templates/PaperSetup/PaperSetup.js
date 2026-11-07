import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { 
  TextField, Button, Typography, MenuItem, Select, FormControl, 
  InputLabel, Paper, Checkbox, ListItemText, Dialog, DialogTitle, 
  DialogContent, DialogActions, CircularProgress, IconButton, 
  FormControlLabel, Chip, Tabs, Tab, Tooltip 
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import axios from 'axios';
import apis from '../../../helper/Apis';
import Auth from '../../../helper/Auth';
import { connect } from 'react-redux';
import { setAlert } from '../../../redux/actions/alertAction';
import MathText from '../../atoms/MathText/MathText';

const useStyles = theme => ({
  root: {
    padding: theme.spacing(3),
    maxWidth: 1200,
    margin: '0 auto',
  },
  layoutContainer: {
    display: 'flex',
    gap: theme.spacing(3),
    marginTop: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column-reverse'
    }
  },
  mainFormArea: {
    flex: 1,
    minWidth: 0
  },
  sidebarPalette: {
    width: 320,
    padding: theme.spacing(2),
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    border: '1px solid #e2e8f0',
    height: 'fit-content',
    position: 'sticky',
    top: 20,
    maxHeight: 'calc(100vh - 40px)',
    overflowY: 'auto',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      position: 'static',
      maxHeight: 'none'
    }
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(4)
  },
  optionContainer: {
    border: '1px solid #e2e8f0',
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    marginBottom: theme.spacing(2),
    backgroundColor: '#ffffff'
  },
  btnContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: theme.spacing(2)
  },
  questionList: {
    marginTop: theme.spacing(4)
  },
  questionItem: {
    padding: theme.spacing(2),
    border: '1px solid #cbd5e1',
    marginBottom: theme.spacing(2),
    borderRadius: theme.spacing(1.5),
    backgroundColor: '#ffffff'
  },
  paletteGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '8px',
    marginTop: theme.spacing(2)
  },
  qBtn: {
    minWidth: 0,
    padding: '6px 0',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '0.85rem',
    textTransform: 'none',
    position: 'relative'
  },
  pyqBadge: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
    fontWeight: 'bold',
    fontSize: '0.75rem',
    borderRadius: '4px',
    padding: '2px 8px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    border: '1px solid #fde68a'
  }
});

class PaperSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      body: '',
      bodyImage: null,
      option1: ' ',
      optImg1: null,
      option2: '  ',
      optImg2: null,
      option3: '   ',
      optImg3: null,
      option4: '    ',
      optImg4: null,
      answer: ' ',
      questionType: 'SINGLE',
      marks: 4,
      difficulty: 'AUTO',
      isPyq: false,
      pyqTag: '',
      explanation: '',
      explanationImage: null,
      questions: [],
      fileInputKey: Date.now(),
      rulesDialogOpen: false,
      hasShownRules: false,
      targetClassName: props.targetClassName || null,
      submitting: false,

      // Navigation & Editing state
      selectedQIndex: 0,
      editingQuestionId: null,
      sidebarTab: 0 // 0: All, 1: Physics, 2: Chemistry, 3: Maths/Bio
    };
  }

  componentDidMount() {
    this.fetchTestDetails();
    if (!this.props.hideFinishButton && (this.state.targetClassName === 'JEE-Mains' || this.state.targetClassName === 'NEET')) {
      this.setState({ rulesDialogOpen: true, hasShownRules: true });
    }
  }

  fetchTestDetails = async () => {
    try {
      const qResponse = await axios.post(apis.BASE + apis.GET_TEST_QUESTIONS_TEACHER, { testid: this.props.testId }, {
        headers: { 'Authorization': `Bearer ${Auth.retriveToken()}` }
      });
      if (qResponse.data.success) {
        const questions = qResponse.data.questions || [];
        const targetClassName = qResponse.data.targetClassName || this.props.targetClassName;
        this.setState({ 
          questions: questions,
          targetClassName: targetClassName,
          selectedQIndex: questions.length
        }, () => {
          this.loadFormForIndex(this.state.selectedQIndex);
          if (!this.props.hideFinishButton && !this.state.hasShownRules && (targetClassName === 'JEE-Mains' || targetClassName === 'NEET')) {
            this.setState({ rulesDialogOpen: true, hasShownRules: true });
          }
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  getTotalExamQuestionsCount = () => {
    if (this.state.targetClassName === 'JEE-Mains') return 75;
    if (this.state.targetClassName === 'NEET') return 180;
    return Math.max(this.state.questions.length + 5, 20);
  }

  getSubjectForIndex = (index) => {
    if (this.state.targetClassName === 'JEE-Mains') {
      if (index < 25) return 'Physics';
      if (index < 50) return 'Chemistry';
      return 'Mathematics';
    } else if (this.state.targetClassName === 'NEET') {
      if (index < 45) return 'Physics';
      if (index < 90) return 'Chemistry';
      return 'Biology';
    }
    return '';
  }

  getExpectedQTypeForIndex = (index) => {
    if (this.state.targetClassName === 'JEE-Mains') {
      if ((index >= 20 && index < 25) || (index >= 45 && index < 50) || (index >= 70 && index < 75)) {
        return 'NUMERICAL';
      }
      return 'SINGLE';
    }
    if (this.state.targetClassName === 'NEET') {
      return 'SINGLE';
    }
    return 'SINGLE';
  }

  loadFormForIndex = (index) => {
    const existingQ = this.state.questions[index];
    if (existingQ) {
      // Editing existing question at this slot
      const opts = existingQ.options || [' ', '  ', '   ', '    '];
      this.setState({
        selectedQIndex: index,
        editingQuestionId: existingQ._id,
        body: existingQ.body || '',
        bodyImage: null,
        option1: opts[0] || ' ',
        optImg1: null,
        option2: opts[1] || '  ',
        optImg2: null,
        option3: opts[2] || '   ',
        optImg3: null,
        option4: opts[3] || '    ',
        optImg4: null,
        answer: existingQ.answer || ' ',
        questionType: existingQ.questionType || 'SINGLE',
        marks: existingQ.marks || 4,
        isPyq: !!existingQ.isPyq,
        pyqTag: existingQ.pyqTag || '',
        explanation: existingQ.explanation || '',
        explanationImage: null,
        fileInputKey: Date.now()
      });
    } else {
      // New question slot
      const expectedType = this.getExpectedQTypeForIndex(index);
      this.setState({
        selectedQIndex: index,
        editingQuestionId: null,
        body: '',
        bodyImage: null,
        option1: ' ',
        optImg1: null,
        option2: '  ',
        optImg2: null,
        option3: '   ',
        optImg3: null,
        option4: '    ',
        optImg4: null,
        answer: ' ',
        questionType: expectedType,
        marks: (this.state.targetClassName === 'JEE-Mains' || this.state.targetClassName === 'NEET') ? 4 : 1,
        isPyq: false,
        pyqTag: '',
        explanation: '',
        explanationImage: null,
        fileInputKey: Date.now()
      });
    }
  }

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleFileChange = (e) => {
    this.setState({ [e.target.name]: e.target.files[0] });
  }

  handlePaste = (e, targetName) => {
    if (e.clipboardData && e.clipboardData.files && e.clipboardData.files.length > 0) {
      const file = e.clipboardData.files[0];
      if (file.type.startsWith('image/')) {
        this.setState({ [targetName]: file });
        e.preventDefault();
      }
    }
  }

  renderImageUpload = (name, label) => {
    return (
      <div 
        onPaste={(e) => this.handlePaste(e, name)}
        style={{
          border: '2px dashed #cbd5e1',
          borderRadius: '6px',
          padding: '10px',
          marginTop: '10px',
          cursor: 'text',
          backgroundColor: '#f8fafc',
          outline: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
        tabIndex={0}
      >
        <Typography variant="body2" style={{ color: '#475569' }}>
          <strong>{label}</strong>: Choose a file OR click here and press Ctrl+V to paste a screenshot.
        </Typography>
        <input 
          key={this.state.fileInputKey} 
          type="file" 
          name={name} 
          accept="image/*" 
          onChange={this.handleFileChange} 
        />
        {this.state[name] && (
          <div style={{ color: '#166534', fontWeight: 'bold', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#dcfce7', padding: '4px 10px', borderRadius: '4px' }}>
            <span>✓ Image attached: {this.state[name].name || 'Pasted Image'}</span>
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); this.setState({ [name]: null }); }} style={{ color: '#dc2626' }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>
        )}
      </div>
    );
  }

  handleSaveQuestion = async (e) => {
    e.preventDefault();
    if (!this.state.body && !this.state.bodyImage) {
      this.props.setAlert({ isAlert: true, type: 'error', title: 'Error', message: 'Question body or image is required' });
      return;
    }

    if (this.state.questionType !== 'NUMERICAL') {
      const opts = [this.state.option1, this.state.option2, this.state.option3, this.state.option4].filter(x => x && x.trim() !== '');
      if (new Set(opts).size !== opts.length) {
        this.props.setAlert({ isAlert: true, type: 'error', title: 'Error', message: 'All text options must be unique.' });
        return;
      }
    }

    let answerMissing = false;
    if (this.state.questionType === 'NUMERICAL') {
      answerMissing = !this.state.answer && this.state.answer !== 0;
    } else if (this.state.questionType === 'MULTIPLE') {
      answerMissing = !Array.isArray(this.state.answer) || this.state.answer.length === 0;
    } else {
      answerMissing = !this.state.answer;
      if (typeof this.state.answer === 'string' && this.state.answer.trim() === '') {
        const matchesOpt1 = this.state.answer === this.state.option1 && !!this.state.optImg1;
        const matchesOpt2 = this.state.answer === this.state.option2 && !!this.state.optImg2;
        const matchesOpt3 = this.state.answer === this.state.option3 && !!this.state.optImg3;
        const matchesOpt4 = this.state.answer === this.state.option4 && !!this.state.optImg4;
        
        if (!matchesOpt1 && !matchesOpt2 && !matchesOpt3 && !matchesOpt4) {
          answerMissing = true;
        }
      }
    }

    if (answerMissing) {
      this.props.setAlert({ isAlert: true, type: 'error', title: 'Error', message: 'Please select or provide a correct answer.' });
      return;
    }

    const formData = new FormData();
    formData.append('testId', this.props.testId);
    if (this.props.targetSubject) {
      formData.append('targetSubject', this.props.targetSubject);
    }
    const currentSubjectName = this.getSubjectForIndex(this.state.selectedQIndex);
    if (currentSubjectName) {
      formData.append('subjectName', currentSubjectName);
      formData.append('questionIndex', this.state.selectedQIndex);
    }
    formData.append('body', this.state.body);
    formData.append('option1', this.state.option1);
    formData.append('option2', this.state.option2);
    formData.append('option3', this.state.option3);
    formData.append('option4', this.state.option4);
    formData.append('answer', this.state.answer);
    formData.append('questionType', this.state.questionType);
    formData.append('marks', this.state.marks);
    formData.append('difficulty', 'MEDIUM');
    formData.append('isPyq', this.state.isPyq);
    formData.append('pyqTag', this.state.pyqTag || '');
    formData.append('explanation', this.state.explanation);
    
    if (this.state.bodyImage) formData.append('bodyImage', this.state.bodyImage);
    if (this.state.explanationImage) formData.append('explanationImage', this.state.explanationImage);
    if (this.state.optImg1) formData.append('optImg1', this.state.optImg1);
    if (this.state.optImg2) formData.append('optImg2', this.state.optImg2);
    if (this.state.optImg3) formData.append('optImg3', this.state.optImg3);
    if (this.state.optImg4) formData.append('optImg4', this.state.optImg4);

    this.setState({ submitting: true });

    try {
      let endpoint = '/api/v1/user/addExamQuestion';
      if (this.state.editingQuestionId) {
        endpoint = '/api/v1/user/editExamQuestion';
        formData.append('questionId', this.state.editingQuestionId);
      }

      const response = await axios.post(apis.BASE + endpoint, formData, {
        headers: { 'Authorization': `Bearer ${Auth.retriveToken()}` }
      });

      if (response.data.success) {
        const msg = this.state.editingQuestionId ? 'Question updated successfully' : 'Question added successfully';
        this.props.setAlert({ isAlert: true, type: 'success', title: 'Success', message: msg });
        
        this.setState({ submitting: false }, () => {
          this.fetchTestDetails();
        });
      } else {
        this.setState({ submitting: false });
        this.props.setAlert({ isAlert: true, type: 'error', title: 'Error', message: response.data.message });
      }
    } catch (err) {
      this.setState({ submitting: false });
      console.log("Error in save request:", err);
      let errMsg = err.message;
      if (err.response && err.response.data && err.response.data.message) {
        errMsg = err.response.data.message;
      }
      this.props.setAlert({ isAlert: true, type: 'error', title: 'Error', message: 'Failed: ' + errMsg });
    }
  }

  filterQuestionIndexesForSidebar = (total) => {
    const { sidebarTab, targetClassName } = this.state;
    const indexes = [];
    for (let i = 0; i < total; i++) {
      if (sidebarTab === 0) {
        indexes.push(i);
      } else if (targetClassName === 'JEE-Mains') {
        if (sidebarTab === 1 && i < 25) indexes.push(i);
        if (sidebarTab === 2 && i >= 25 && i < 50) indexes.push(i);
        if (sidebarTab === 3 && i >= 50 && i < 75) indexes.push(i);
      } else if (targetClassName === 'NEET') {
        if (sidebarTab === 1 && i < 45) indexes.push(i);
        if (sidebarTab === 2 && i >= 45 && i < 90) indexes.push(i);
        if (sidebarTab === 3 && i >= 90 && i < 180) indexes.push(i);
      } else {
        indexes.push(i);
      }
    }
    return indexes;
  }

  renderSidebarPalette = () => {
    const { classes } = this.props;
    const { targetClassName, sidebarTab, questions, selectedQIndex } = this.state;
    const totalCount = this.getTotalExamQuestionsCount();
    const filteredIndexes = this.filterQuestionIndexesForSidebar(totalCount);
    const pyqCount = questions.filter(q => q.isPyq).length;

    return (
      <Paper className={classes.sidebarPalette} elevation={0}>
        <Typography variant="h6" style={{ fontWeight: 'bold', color: '#1e293b', fontSize: '1rem' }}>
          Question Navigator
        </Typography>
        <Typography variant="caption" style={{ color: '#64748b', display: 'block', marginBottom: '8px' }}>
          Progress: {questions.length} / {totalCount} Questions Added &nbsp;|&nbsp; 🏷️ {pyqCount} PYQs
        </Typography>

        {(targetClassName === 'JEE-Mains' || targetClassName === 'NEET') && (
          <Tabs
            value={sidebarTab}
            onChange={(e, val) => this.setState({ sidebarTab: val })}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            style={{ marginBottom: '12px', borderBottom: '1px solid #e2e8f0', minHeight: '36px' }}
          >
            <Tab label="All" style={{ minWidth: 60, minHeight: 36, fontSize: '0.75rem', fontWeight: 'bold' }} />
            <Tab label="Physics" style={{ minWidth: 70, minHeight: 36, fontSize: '0.75rem', fontWeight: 'bold' }} />
            <Tab label="Chemistry" style={{ minWidth: 75, minHeight: 36, fontSize: '0.75rem', fontWeight: 'bold' }} />
            <Tab label={targetClassName === 'JEE-Mains' ? 'Maths' : 'Biology'} style={{ minWidth: 70, minHeight: 36, fontSize: '0.75rem', fontWeight: 'bold' }} />
          </Tabs>
        )}

        <div className={classes.paletteGrid}>
          {filteredIndexes.map((idx) => {
            const hasQ = !!questions[idx];
            const isPyq = hasQ && !!questions[idx].isPyq;
            const isSelected = idx === selectedQIndex;

            let bgColor = '#ffffff';
            let textColor = '#475569';
            let borderColor = '#cbd5e1';

            if (hasQ) {
              bgColor = '#dcfce7';
              textColor = '#14532d';
              borderColor = '#86efac';
            }

            if (isSelected) {
              borderColor = '#2563eb';
              bgColor = hasQ ? '#bbf7d0' : '#e0f2fe';
              textColor = '#1e40af';
            }

            return (
              <Tooltip key={idx} title={`Q${idx + 1}: ${hasQ ? (questions[idx].body.slice(0, 30) + '...') : 'Empty Slot'}`} placement="top">
                <Button
                  className={classes.qBtn}
                  onClick={() => this.loadFormForIndex(idx)}
                  style={{
                    backgroundColor: bgColor,
                    color: textColor,
                    border: `2px solid ${borderColor}`,
                    boxShadow: isSelected ? '0 0 0 2px #3b82f6' : 'none'
                  }}
                >
                  Q{idx + 1}
                  {isPyq && <span style={{ position: 'absolute', top: -2, right: 2, fontSize: '10px' }}>🏷️</span>}
                </Button>
              </Tooltip>
            );
          })}
        </div>

        <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #e2e8f0', fontSize: '0.75rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: '#dcfce7', border: '1px solid #86efac', display: 'inline-block' }}></span>
            <span>Green = Added Question</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: '#ffffff', border: '1px solid #cbd5e1', display: 'inline-block' }}></span>
            <span>White = Empty Slot</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>🏷️ = Tagged as Previous Year Question (PYQ)</span>
          </div>
        </div>
      </Paper>
    );
  }

  render() {
    const { classes, onFinish } = this.props;
    const { selectedQIndex, editingQuestionId, targetClassName, questions } = this.state;
    const currentSubjectName = this.getSubjectForIndex(selectedQIndex);

    return (
      <Paper className={classes.root}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <Typography variant="h5" style={{ fontWeight: 'bold', color: '#0f172a' }}>Paper Setup</Typography>
            <Typography variant="subtitle2" style={{ color: '#64748b' }}>
              Add and configure questions specifically for this exam.
            </Typography>
          </div>
          {(targetClassName === 'JEE-Mains' || targetClassName === 'NEET') && (
            <Button variant="outlined" color="primary" onClick={() => this.setState({ rulesDialogOpen: true })}>
              View Pattern & Rules
            </Button>
          )}
        </div>

        {/* Rules Dialog */}
        <Dialog open={this.state.rulesDialogOpen} onClose={() => this.setState({ rulesDialogOpen: false })} maxWidth="md" fullWidth>
          <DialogTitle style={{ backgroundColor: '#1e293b', color: '#fff' }}>
            Exam Structure & Rules: {targetClassName || 'Standard Exam'}
          </DialogTitle>
          <DialogContent dividers style={{ padding: '24px', backgroundColor: '#f8fafc' }}>
            <div style={{ backgroundColor: '#e0f2fe', borderLeft: '4px solid #0284c7', padding: '12px 16px', borderRadius: '4px', marginBottom: '20px' }}>
              <Typography variant="subtitle2" style={{ color: '#0369a1', fontWeight: 'bold' }}>
                Teacher Setup Guidance:
              </Typography>
              <Typography variant="body2" style={{ color: '#0c4a6e' }}>
                You are adding questions for a <strong>{targetClassName}</strong> exam. Question types and marks (+4 / -1) are set automatically based on question index.
              </Typography>
            </div>

            {targetClassName === 'JEE-Mains' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Typography variant="h6" style={{ color: '#0f172a', fontWeight: 'bold' }}>JEE-Mains Pattern (75 Questions Total)</Typography>
                <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 16px' }}>
                  <Typography variant="subtitle2" style={{ color: '#2563eb', fontWeight: 'bold' }}>Physics (Q 1 - 25)</Typography>
                  <Typography variant="body2" style={{ color: '#475569' }}>• Q 1 - 20: Single Choice (+4 / -1)</Typography>
                  <Typography variant="body2" style={{ color: '#475569' }}>• Q 21 - 25: Integer / Numerical (+4 / -1)</Typography>
                </div>
                <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 16px' }}>
                  <Typography variant="subtitle2" style={{ color: '#059669', fontWeight: 'bold' }}>Chemistry (Q 26 - 50)</Typography>
                  <Typography variant="body2" style={{ color: '#475569' }}>• Q 26 - 45: Single Choice (+4 / -1)</Typography>
                  <Typography variant="body2" style={{ color: '#475569' }}>• Q 46 - 50: Integer / Numerical (+4 / -1)</Typography>
                </div>
                <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 16px' }}>
                  <Typography variant="subtitle2" style={{ color: '#d97706', fontWeight: 'bold' }}>Mathematics (Q 51 - 75)</Typography>
                  <Typography variant="body2" style={{ color: '#475569' }}>• Q 51 - 70: Single Choice (+4 / -1)</Typography>
                  <Typography variant="body2" style={{ color: '#475569' }}>• Q 71 - 75: Integer / Numerical (+4 / -1)</Typography>
                </div>
              </div>
            ) : targetClassName === 'NEET' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Typography variant="h6" style={{ color: '#0f172a', fontWeight: 'bold' }}>NEET Pattern (180 Questions Total)</Typography>
                <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 16px' }}>
                  <Typography variant="subtitle2" style={{ color: '#2563eb', fontWeight: 'bold' }}>Physics (Q 1 - 45)</Typography>
                  <Typography variant="body2" style={{ color: '#475569' }}>• 45 Single Choice Questions (+4 / -1)</Typography>
                </div>
                <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 16px' }}>
                  <Typography variant="subtitle2" style={{ color: '#059669', fontWeight: 'bold' }}>Chemistry (Q 46 - 90)</Typography>
                  <Typography variant="body2" style={{ color: '#475569' }}>• 45 Single Choice Questions (+4 / -1)</Typography>
                </div>
                <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 16px' }}>
                  <Typography variant="subtitle2" style={{ color: '#d97706', fontWeight: 'bold' }}>Biology (Q 91 - 180)</Typography>
                  <Typography variant="body2" style={{ color: '#475569' }}>• 90 Single Choice Questions (+4 / -1)</Typography>
                </div>
              </div>
            ) : (
              <Typography variant="body1">
                Standard test setup mode. Configure question text, options, and marks manually.
              </Typography>
            )}
          </DialogContent>
          <DialogActions style={{ padding: '16px 24px', backgroundColor: '#f1f5f9' }}>
            <Button onClick={() => this.setState({ rulesDialogOpen: false })} color="primary" variant="contained">
              Got it, Start Setup
            </Button>
          </DialogActions>
        </Dialog>

        {/* Layout with Form & Sidebar */}
        <div className={classes.layoutContainer}>
          <div className={classes.mainFormArea}>
            <form onSubmit={this.handleSaveQuestion} className={classes.form}>
              <div className={classes.optionContainer}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <Typography variant="h6" style={{ fontWeight: 'bold', color: '#1e293b' }}>
                    Question {selectedQIndex + 1} {editingQuestionId ? '(Editing Existing)' : '(New Slot)'}
                  </Typography>
                  {currentSubjectName && (
                    <Chip 
                      label={`Subject: ${currentSubjectName}`} 
                      color="primary" 
                      variant="outlined"
                      style={{ fontWeight: 'bold' }}
                    />
                  )}
                </div>
                <TextField fullWidth multiline rows={3} label="Question Text" name="body" value={this.state.body} onChange={this.handleInputChange} margin="normal" variant="outlined" placeholder="Type the question content..." />
                {this.renderImageUpload('bodyImage', 'Question Image')}
              </div>
              
              {/* Question Type & PYQ Tag Box */}
              <div className={classes.optionContainer} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <FormControl variant="outlined" style={{ flex: 1, minWidth: 200 }}>
                    <InputLabel>Question Type</InputLabel>
                    <Select 
                      name="questionType" 
                      value={this.state.questionType} 
                      onChange={(e) => this.setState({ questionType: e.target.value, answer: e.target.value === 'MULTIPLE' ? [] : '' })} 
                      label="Question Type"
                      disabled={targetClassName === 'JEE-Mains' || targetClassName === 'NEET'}
                    >
                      <MenuItem value="SINGLE">Single Choice</MenuItem>
                      <MenuItem value="MULTIPLE">Multiple Choice</MenuItem>
                      <MenuItem value="NUMERICAL">Numerical Value</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField 
                    label="Marks" 
                    name="marks" 
                    type="number" 
                    value={this.state.marks} 
                    onChange={this.handleInputChange} 
                    variant="outlined" 
                    style={{ width: 120 }}
                    disabled={targetClassName === 'JEE-Mains' || targetClassName === 'NEET'}
                  />
                </div>

                {/* PYQ Tagging */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={this.state.isPyq} 
                        onChange={(e) => this.setState({ isPyq: e.target.checked })} 
                        color="primary" 
                      />
                    }
                    label={<span style={{ fontWeight: 'bold', color: '#1e293b' }}>🏷️ Is Previous Year Question (PYQ)?</span>}
                  />

                  {this.state.isPyq && (
                    <TextField 
                      label="PYQ Tag / Exam Year" 
                      name="pyqTag" 
                      value={this.state.pyqTag} 
                      onChange={this.handleInputChange} 
                      variant="outlined" 
                      size="small"
                      placeholder="e.g. JEE Main 2023, NEET 2022" 
                      style={{ flex: 1, minWidth: 200 }}
                    />
                  )}
                </div>
              </div>

              {/* Options Section */}
              {this.state.questionType !== 'NUMERICAL' && [1, 2, 3, 4].map(num => (
                <div key={num} className={classes.optionContainer}>
                  <Typography variant="subtitle2" style={{ fontWeight: 'bold', color: '#334155' }}>Option {num}</Typography>
                  <TextField fullWidth label={`Option ${num} Text`} name={`option${num}`} value={this.state[`option${num}`]} onChange={this.handleInputChange} margin="normal" variant="outlined" />
                  {this.renderImageUpload(`optImg${num}`, `Option ${num} Image`)}
                </div>
              ))}

              {/* Correct Answer Section */}
              {this.state.questionType === 'NUMERICAL' ? (
                <TextField label="Correct Answer (Numeric)" name="answer" type="number" value={this.state.answer} onChange={this.handleInputChange} margin="normal" variant="outlined" inputProps={{ step: "any" }} fullWidth />
              ) : this.state.questionType === 'MULTIPLE' ? (
                <FormControl variant="outlined" margin="normal" fullWidth>
                  <InputLabel>Correct Answer</InputLabel>
                  <Select multiple name="answer" value={Array.isArray(this.state.answer) ? this.state.answer : []} onChange={this.handleInputChange} renderValue={(selected) => selected.join(', ')} label="Correct Answer">
                    {[1, 2, 3, 4].map(num => (
                      <MenuItem key={num} value={this.state[`option${num}`]}>
                        <Checkbox checked={Array.isArray(this.state.answer) && this.state.answer.indexOf(this.state[`option${num}`]) > -1} />
                        <ListItemText primary={`Option ${num}`} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <FormControl variant="outlined" margin="normal" fullWidth>
                  <InputLabel>Correct Answer</InputLabel>
                  <Select name="answer" value={this.state.answer} onChange={this.handleInputChange} label="Correct Answer">
                    <MenuItem value={this.state.option1}>Option 1</MenuItem>
                    <MenuItem value={this.state.option2}>Option 2</MenuItem>
                    <MenuItem value={this.state.option3}>Option 3</MenuItem>
                    <MenuItem value={this.state.option4}>Option 4</MenuItem>
                  </Select>
                </FormControl>
              )}
              
              {/* Explanation Section */}
              <TextField 
                label="Explanation (Optional)" 
                name="explanation" 
                value={this.state.explanation} 
                onChange={this.handleInputChange} 
                margin="normal" 
                variant="outlined" 
                multiline 
                rows={3} 
                fullWidth
                placeholder="Explain why the answer is correct..."
              />
              {this.renderImageUpload('explanationImage', 'Explanation Image')}

              {/* Submit Controls */}
              <div className={classes.btnContainer}>
                <Button variant="contained" color="primary" type="submit" disabled={this.state.submitting} style={{ minWidth: '180px', fontWeight: 'bold' }}>
                  {this.state.submitting ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CircularProgress size={20} color="inherit" />
                      Saving...
                    </span>
                  ) : editingQuestionId ? 'Update Question' : 'Save Question'}
                </Button>
                
                {!this.props.hideFinishButton && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={onFinish}
                    style={{ fontWeight: 'bold' }}
                  >
                    FINISH SETUP
                  </Button>
                )}
              </div>
            </form>

            {/* Added Questions List */}
            <div className={classes.questionList}>
              <Typography variant="h6" style={{ fontWeight: 'bold', color: '#0f172a', marginBottom: '16px' }}>
                Added Questions ({questions.length})
              </Typography>

              {questions.map((q, i) => (
                <div key={q._id} className={classes.questionItem}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <Typography variant="subtitle1" style={{ fontWeight: 'bold', color: '#1e293b' }}>
                        Q{i+1}: <MathText text={q.body} />
                      </Typography>
                      {q.isPyq && (
                        <span className={classes.pyqBadge}>
                          🏷️ PYQ {q.pyqTag ? `: ${q.pyqTag}` : ''}
                        </span>
                      )}
                    </div>
                    <Button 
                      size="small" 
                      variant="outlined" 
                      color="primary"
                      startIcon={<EditIcon />}
                      onClick={() => this.loadFormForIndex(i)}
                    >
                      Edit
                    </Button>
                  </div>
                  
                  {q.bodyImage && (
                    <img src={q.bodyImage.startsWith('http') ? q.bodyImage : apis.BASE + q.bodyImage} alt="question" style={{ maxHeight: '150px', display: 'block', margin: '10px 0', borderRadius: '4px' }} />
                  )}
                  
                  {q.questionType !== 'NUMERICAL' && q.options && q.options.map((opt, optIdx) => {
                    const optImg = q.optionImages && q.optionImages[optIdx] ? q.optionImages[optIdx] : null;
                    if (!opt.trim() && !optImg) return null;
                    
                    let isCorrect = false;
                    if (q.questionType === 'MULTIPLE') {
                      let ansArr = typeof q.answer === 'string' ? q.answer.split(',') : (Array.isArray(q.answer) ? q.answer : []);
                      isCorrect = ansArr.includes(opt);
                    } else {
                      isCorrect = q.answer === opt;
                    }

                    return (
                      <div key={optIdx} style={{ display: 'flex', alignItems: 'center', margin: '5px 0', padding: '6px 12px', backgroundColor: isCorrect ? '#dcfce7' : '#f8fafc', borderRadius: '6px', border: isCorrect ? '1px solid #86efac' : '1px solid #f1f5f9' }}>
                        <Typography variant="body2" style={{ marginRight: '10px', fontWeight: 'bold', color: isCorrect ? '#166534' : '#475569' }}>
                          {String.fromCharCode(65 + optIdx)}.
                        </Typography>
                        {opt.trim() !== '' && <Typography variant="body2"><MathText text={opt} /></Typography>}
                        {optImg && (
                          <img src={optImg.startsWith('http') ? optImg : apis.BASE + optImg} alt="option" style={{ maxHeight: '50px', marginLeft: '10px', borderRadius: '4px' }} />
                        )}
                      </div>
                    );
                  })}
                  
                  <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f1f5f9', borderRadius: '6px', borderLeft: '4px solid #2563eb' }}>
                    <Typography variant="body2" style={{ fontWeight: 'bold', color: '#1e40af' }}>
                      Correct Answer: <MathText text={String(q.answer)} />
                    </Typography>
                    {q.explanation && (
                      <Typography variant="body2" style={{ marginTop: '5px', color: '#334155' }}>
                        <strong>Explanation:</strong> <MathText text={q.explanation} />
                      </Typography>
                    )}
                    {q.explanationImage && q.explanationImage !== 'undefined' && q.explanationImage !== 'null' && String(q.explanationImage).trim() !== '' && (
                      <img src={String(q.explanationImage).startsWith('http') ? q.explanationImage : apis.BASE + q.explanationImage} alt="explanation" style={{ maxHeight: '100px', display: 'block', marginTop: '10px', borderRadius: '4px' }} />
                    )}
                    <Typography variant="body2" color="textSecondary" style={{ marginTop: '8px', fontSize: '0.8rem' }}>
                      Marks: {q.marks} &nbsp;|&nbsp; Type: {q.questionType}
                    </Typography>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Question Navigator Sidebar */}
          {this.renderSidebarPalette()}
        </div>
      </Paper>
    );
  }
}

export default connect(null, { setAlert })(withStyles(useStyles)(PaperSetup));
