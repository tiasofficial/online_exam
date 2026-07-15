import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { TextField, Button, Typography, MenuItem, Select, FormControl, InputLabel, Paper, Checkbox, ListItemText } from '@material-ui/core';
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
      explanation: '',
      questions: [], // Added questions
      fileInputKey: Date.now()
    };
  }

  componentDidMount() {
    this.fetchTestDetails();
  }

  fetchTestDetails = async () => {
    try {
      const qResponse = await axios.post(apis.BASE + apis.GET_TEST_QUESTIONS_TEACHER, { testid: this.props.testId }, {
        headers: { 'Authorization': `Bearer ${Auth.retriveToken()}` }
      });
      if (qResponse.data.success) {
        this.setState({ questions: qResponse.data.questions });
      }
    } catch (err) {
      console.log(err);
    }
  }

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleFileChange = (e) => {
    this.setState({ [e.target.name]: e.target.files[0] });
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
    formData.append('explanation', this.state.explanation);
    
    if (this.state.bodyImage) formData.append('bodyImage', this.state.bodyImage);
    if (this.state.optImg1) formData.append('optImg1', this.state.optImg1);
    if (this.state.optImg2) formData.append('optImg2', this.state.optImg2);
    if (this.state.optImg3) formData.append('optImg3', this.state.optImg3);
    if (this.state.optImg4) formData.append('optImg4', this.state.optImg4);

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
          answer: ' ', questionType: 'SINGLE', marks: 1,
          explanation: '',
          fileInputKey: Date.now()
        });
        this.fetchTestDetails(); // Refresh list
      } else {
        this.props.setAlert({ isAlert: true, type: 'error', title: 'Error', message: response.data.message });
      }
    } catch (err) {
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
        <Typography variant="h5" gutterBottom>Paper Setup</Typography>
        <Typography variant="subtitle1" gutterBottom>Add questions specifically for this exam.</Typography>
        
        <form onSubmit={this.handleAddQuestion} className={classes.form}>
          <div className={classes.optionContainer}>
            <Typography variant="h6">Question</Typography>
            <TextField fullWidth label="Question Text" name="body" value={this.state.body} onChange={this.handleInputChange} margin="normal" variant="outlined" />
            <div className={classes.fileInputContainer}>
              <Typography variant="body2">Or Upload Image:</Typography>
              <input key={this.state.fileInputKey} type="file" name="bodyImage" accept="image/*" onChange={this.handleFileChange} />
            </div>
          </div>
          
          <FormControl variant="outlined" margin="normal">
            <InputLabel>Question Type</InputLabel>
            <Select name="questionType" value={this.state.questionType} onChange={(e) => this.setState({ questionType: e.target.value, answer: e.target.value === 'MULTIPLE' ? [] : '' })} label="Question Type">
              <MenuItem value="SINGLE">Single Choice</MenuItem>
              <MenuItem value="MULTIPLE">Multiple Choice</MenuItem>
              <MenuItem value="NUMERICAL">Numerical Value</MenuItem>
            </Select>
          </FormControl>

          {this.state.questionType !== 'NUMERICAL' && [1, 2, 3, 4].map(num => (
            <div key={num} className={classes.optionContainer}>
              <Typography variant="subtitle2">Option {num}</Typography>
              <TextField fullWidth label={`Option ${num} Text`} name={`option${num}`} value={this.state[`option${num}`]} onChange={this.handleInputChange} margin="normal" variant="outlined" />
              <div className={classes.fileInputContainer}>
                <Typography variant="body2">Image:</Typography>
                <input key={this.state.fileInputKey} type="file" name={`optImg${num}`} accept="image/*" onChange={this.handleFileChange} />
              </div>
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

          <TextField label="Marks" name="marks" type="number" value={this.state.marks} onChange={this.handleInputChange} margin="normal" variant="outlined" InputProps={{ inputProps: { min: 1 } }} />
          
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

          <div className={classes.btnContainer}>
            <Button variant="contained" color="primary" type="submit">Add Question</Button>
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
          <Typography variant="h6">Added Questions ({this.state.questions.length})</Typography>
          {this.state.questions.map((q, i) => (
            <div key={q._id} className={classes.questionItem}>
              <Typography variant="subtitle1">Q{i+1}: {q.body}</Typography>
              <Typography variant="body2" color="textSecondary">Marks: {q.marks}</Typography>
            </div>
          ))}
        </div>
      </Paper>
    );
  }
}

export default connect(null, { setAlert })(withStyles(useStyles)(PaperSetup));
