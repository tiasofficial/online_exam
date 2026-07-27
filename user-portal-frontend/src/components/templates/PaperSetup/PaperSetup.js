import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { TextField, Button, Typography, MenuItem, Select, FormControl, InputLabel, Paper, Checkbox, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import axios from 'axios';
import apis from '../../../helper/Apis';
import Auth from '../../../helper/Auth';
import { connect } from 'react-redux';
import { setAlert } from '../../../redux/actions/alertAction';

const useStyles = theme => ({
  root: {
    padding: theme.spacing(3),
    maxWidth: 800,
    margin: '0 auto',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(4)
  },
  fileInputContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    marginTop: theme.spacing(1)
  },
  optionContainer: {
    border: '1px solid #ddd',
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    marginBottom: theme.spacing(2)
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
    border: '1px solid #ccc',
    marginBottom: theme.spacing(1),
    borderRadius: theme.spacing(1)
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
      marks: 1,
      difficulty: 'MEDIUM',
      explanation: '',
      explanationImage: null,
      explanationImage: null,
      questions: [], // Added questions
      fileInputKey: Date.now(),
      rulesDialogOpen: false,
      hasShownRules: false,
      targetClassName: props.targetClassName || null,
      submitting: false
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
        this.setState({ 
          questions: qResponse.data.questions,
          targetClassName: qResponse.data.targetClassName || this.props.targetClassName 
        }, () => {
          this.autoSetTypeAndMarks();
          if (!this.props.hideFinishButton && !this.state.hasShownRules && (this.state.targetClassName === 'JEE-Mains' || this.state.targetClassName === 'NEET')) {
            this.setState({ rulesDialogOpen: true, hasShownRules: true });
          }
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  autoSetTypeAndMarks = () => {
    if (this.state.targetClassName === 'JEE-Mains' || this.state.targetClassName === 'NEET') {
      let currentQ = this.state.questions.length;
      let qType = 'SINGLE';
      if (this.state.targetClassName === 'JEE-Mains') {
        if ((currentQ >= 20 && currentQ < 25) || (currentQ >= 45 && currentQ < 50) || (currentQ >= 70 && currentQ < 75)) {
          qType = 'NUMERICAL';
        }
      }
      this.setState({ questionType: qType, marks: 4 });
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
          border: '2px dashed #aaa',
          borderRadius: '4px',
          padding: '10px',
          marginTop: '10px',
          cursor: 'text',
          backgroundColor: '#fafafa',
          outline: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
        tabIndex={0}
      >
        <Typography variant="body2">
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
          <div style={{ color: '#2e7d32', fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#e8f5e9', padding: '4px 8px', borderRadius: '4px' }}>
            <span>✓ Image attached: {this.state[name].name || 'Pasted Image'}</span>
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); this.setState({ [name]: null }); }} style={{ color: '#d32f2f' }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>
        )}
      </div>
    );
  }

  handleAddQuestion = async (e) => {
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
        // If the answer is whitespace, it's valid if it matches an option that has an image attached
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
    formData.append('body', this.state.body);
    formData.append('option1', this.state.option1);
    formData.append('option2', this.state.option2);
    formData.append('option3', this.state.option3);
    formData.append('option4', this.state.option4);
    formData.append('answer', this.state.answer);
    formData.append('questionType', this.state.questionType);
    formData.append('marks', this.state.marks);
    formData.append('difficulty', this.state.difficulty);
    formData.append('explanation', this.state.explanation);
    
    if (this.state.bodyImage) formData.append('bodyImage', this.state.bodyImage);
    if (this.state.explanationImage) formData.append('explanationImage', this.state.explanationImage);
    if (this.state.optImg1) formData.append('optImg1', this.state.optImg1);
    if (this.state.optImg2) formData.append('optImg2', this.state.optImg2);
    if (this.state.optImg3) formData.append('optImg3', this.state.optImg3);
    if (this.state.optImg4) formData.append('optImg4', this.state.optImg4);

    this.setState({ submitting: true });

    try {
      const response = await axios.post(apis.BASE + '/api/v1/user/addExamQuestion', formData, {
        headers: { 
          'Authorization': `Bearer ${Auth.retriveToken()}`
        }
      });
      if (response.data.success) {
        this.props.setAlert({ isAlert: true, type: 'success', title: 'Success', message: 'Question added' });
        // Reset form
        this.setState({
          body: '', bodyImage: null,
          option1: ' ', optImg1: null,
          option2: '  ', optImg2: null,
          option3: '   ', optImg3: null,
          option4: '    ', optImg4: null,
          answer: ' ', questionType: 'SINGLE', marks: 1, difficulty: 'MEDIUM',
          explanation: '', explanationImage: null,
          fileInputKey: Date.now(),
          submitting: false
        }, () => {
          this.fetchTestDetails(); // Refresh list
        });
      } else {
        this.setState({ submitting: false });
        this.props.setAlert({ isAlert: true, type: 'error', title: 'Error', message: response.data.message });
      }
    } catch (err) {
      this.setState({ submitting: false });
      console.log("Error in request:", err);
      let errMsg = err.message;
      if (err.response && err.response.data && err.response.data.message) {
        errMsg = err.response.data.message;
      }
      this.props.setAlert({ isAlert: true, type: 'error', title: 'Error', message: 'Failed to add question: ' + errMsg });
    }
  }

  render() {
    const { classes, onFinish } = this.props;
    return (
      <Paper className={classes.root}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Typography variant="h5" gutterBottom>Paper Setup</Typography>
            <Typography variant="subtitle1" gutterBottom>Add questions specifically for this exam.</Typography>
          </div>
          {(this.props.targetClassName === 'JEE-Mains' || this.props.targetClassName === 'NEET') && (
            <Button variant="outlined" color="primary" onClick={() => this.setState({ rulesDialogOpen: true })}>
              View Exam Rules
            </Button>
          )}
        </div>

        <Dialog open={this.state.rulesDialogOpen} onClose={() => this.setState({ rulesDialogOpen: false })} maxWidth="md" fullWidth>
          <DialogTitle style={{ backgroundColor: '#1e293b', color: '#fff' }}>
            Exam Structure & Rules: {this.props.targetClassName || 'Standard Exam'}
          </DialogTitle>
          <DialogContent dividers style={{ padding: '24px', backgroundColor: '#f8fafc' }}>
            <div style={{ backgroundColor: '#e0f2fe', borderLeft: '4px solid #0284c7', padding: '12px 16px', borderRadius: '4px', marginBottom: '20px' }}>
              <Typography variant="subtitle2" style={{ color: '#0369a1', fontWeight: 'bold' }}>
                Teacher Setup Guidance:
              </Typography>
              <Typography variant="body2" style={{ color: '#0c4a6e' }}>
                You are adding questions for a <strong>{this.props.targetClassName}</strong> exam. Question types and marks (+4 / -1) will be set automatically based on the question index.
              </Typography>
            </div>

            {this.props.targetClassName === 'JEE-Mains' ? (
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
                  <Typography variant="body2" style={{ color: '#71717a' }}>• Q 71 - 75: Integer / Numerical (+4 / -1)</Typography>
                </div>
              </div>
            ) : this.props.targetClassName === 'NEET' ? (
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
                Standard test setup mode. Configure question text, options, and marks manually below.
              </Typography>
            )}
          </DialogContent>
          <DialogActions style={{ padding: '16px 24px', backgroundColor: '#f1f5f9' }}>
            <Button onClick={() => this.setState({ rulesDialogOpen: false })} color="primary" variant="contained" disableElevation>
              Got it, Start Setup
            </Button>
          </DialogActions>
        </Dialog>
        
        <form onSubmit={this.handleAddQuestion} className={classes.form}>
          <div className={classes.optionContainer}>
            <Typography variant="h6">Question</Typography>
            <TextField fullWidth label="Question Text" name="body" value={this.state.body} onChange={this.handleInputChange} margin="normal" variant="outlined" />
            {this.renderImageUpload('bodyImage', 'Question Image')}
          </div>
          
          <FormControl variant="outlined" margin="normal">
            <InputLabel>Question Type</InputLabel>
            <Select 
              name="questionType" 
              value={this.state.questionType} 
              onChange={(e) => this.setState({ questionType: e.target.value, answer: e.target.value === 'MULTIPLE' ? [] : '' })} 
              label="Question Type"
              disabled={this.state.targetClassName === 'JEE-Mains' || this.state.targetClassName === 'NEET'}
            >
              <MenuItem value="SINGLE">Single Choice</MenuItem>
              <MenuItem value="MULTIPLE">Multiple Choice</MenuItem>
              <MenuItem value="NUMERICAL">Numerical Value</MenuItem>
            </Select>
            {(this.state.targetClassName === 'JEE-Mains' || this.state.targetClassName === 'NEET') && (
              <Typography variant="caption" color="textSecondary" style={{ marginTop: '5px' }}>
                Question type is automatically set for {this.state.targetClassName} exams.
              </Typography>
            )}
          </FormControl>

          {this.state.questionType !== 'NUMERICAL' && [1, 2, 3, 4].map(num => (
            <div key={num} className={classes.optionContainer}>
              <Typography variant="subtitle2">Option {num}</Typography>
              <TextField fullWidth label={`Option ${num} Text`} name={`option${num}`} value={this.state[`option${num}`]} onChange={this.handleInputChange} margin="normal" variant="outlined" />
              {this.renderImageUpload(`optImg${num}`, `Option ${num} Image`)}
            </div>
          ))}

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

          <div style={{ display: 'flex', gap: '16px' }}>
            <TextField 
              label="Marks" 
              name="marks" 
              type="number" 
              value={this.state.marks} 
              onChange={this.handleInputChange} 
              margin="normal" 
              variant="outlined" 
              InputProps={{ inputProps: { min: 1 } }} 
              style={{ flex: 1 }} 
              disabled={this.props.targetClassName === 'JEE-Mains' || this.props.targetClassName === 'NEET'}
            />
            <FormControl variant="outlined" margin="normal" style={{ flex: 1 }}>
              <InputLabel>Difficulty</InputLabel>
              <Select name="difficulty" value={this.state.difficulty} onChange={this.handleInputChange} label="Difficulty">
                <MenuItem value="EASY">Easy</MenuItem>
                <MenuItem value="MEDIUM">Medium</MenuItem>
                <MenuItem value="HARD">Hard</MenuItem>
              </Select>
            </FormControl>
          </div>
          
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

          <div className={classes.btnContainer}>
            <Button variant="contained" color="primary" type="submit" disabled={this.state.submitting}>
              {this.state.submitting ? <CircularProgress size={24} color="inherit" /> : 'Add Question'}
            </Button>
            {!this.props.hideFinishButton && (
              <Button
                variant='outlined'
                color='secondary'
                onClick={onFinish}
              >
                FINISH SETUP
              </Button>
            )}
          </div>
        </form>

        <div className={classes.questionList}>
          <Typography variant="h6" gutterBottom>Added Questions ({this.state.questions.length})</Typography>
          {this.state.questions.map((q, i) => (
            <div key={q._id} className={classes.questionItem}>
              <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>Q{i+1}: {q.body}</Typography>
              
              {q.bodyImage && (
                <img src={q.bodyImage.startsWith('http') ? q.bodyImage : apis.BASE + q.bodyImage} alt="question" style={{ maxHeight: '150px', display: 'block', margin: '10px 0', borderRadius: '4px' }} />
              )}
              
              {q.questionType !== 'NUMERICAL' && q.options && q.options.map((opt, optIdx) => {
                const optImg = q.optionImages && q.optionImages[optIdx] ? q.optionImages[optIdx] : null;
                if (!opt.trim() && !optImg) return null;
                
                let isCorrect = false;
                if (q.questionType === 'MULTIPLE') {
                  // For multiple choice, answer is usually a comma separated string
                  let ansArr = typeof q.answer === 'string' ? q.answer.split(',') : (Array.isArray(q.answer) ? q.answer : []);
                  isCorrect = ansArr.includes(opt);
                } else {
                  isCorrect = q.answer === opt;
                }

                return (
                  <div key={optIdx} style={{ display: 'flex', alignItems: 'center', margin: '5px 0', padding: '5px', backgroundColor: isCorrect ? '#e8f5e9' : 'transparent', borderRadius: '4px' }}>
                    <Typography variant="body2" style={{ marginRight: '10px', fontWeight: 'bold' }}>{String.fromCharCode(65 + optIdx)}.</Typography>
                    {opt.trim() !== '' && <Typography variant="body2">{opt}</Typography>}
                    {optImg && (
                      <img src={optImg.startsWith('http') ? optImg : apis.BASE + optImg} alt="option" style={{ maxHeight: '50px', marginLeft: '10px', borderRadius: '4px' }} />
                    )}
                  </div>
                );
              })}
              
              <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px', borderLeft: '4px solid #4338ca' }}>
                <Typography variant="body2" style={{ fontWeight: 'bold', color: '#4338ca' }}>
                  Correct Answer: {q.answer}
                </Typography>
                {q.explanation && (
                  <Typography variant="body2" style={{ marginTop: '5px', color: '#555' }}>
                    <strong>Explanation:</strong> {q.explanation}
                  </Typography>
                )}
                {q.explanationImage && q.explanationImage !== 'undefined' && q.explanationImage !== 'null' && String(q.explanationImage).trim() !== '' && (
                  <img src={String(q.explanationImage).startsWith('http') ? q.explanationImage : apis.BASE + q.explanationImage} alt="explanation" style={{ maxHeight: '100px', display: 'block', marginTop: '10px', borderRadius: '4px' }} />
                )}
                <Typography variant="body2" color="textSecondary" style={{ marginTop: '8px', fontSize: '0.8rem' }}>
                  Marks: {q.marks} &nbsp;|&nbsp; Type: {q.questionType} &nbsp;|&nbsp; Difficulty: {q.difficulty}
                </Typography>
              </div>
            </div>
          ))}
        </div>
      </Paper>
    );
  }
}

export default connect(null, { setAlert })(withStyles(useStyles)(PaperSetup));
