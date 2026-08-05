import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Typography, Paper, Button, Modal, TextField, FormControl, InputLabel, Select, MenuItem, Box, Checkbox, ListItemText, CircularProgress, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import axios from 'axios';
import apis from '../../../helper/Apis';
import Auth from '../../../helper/Auth';
import { connect } from 'react-redux';
import { setAlert } from '../../../redux/actions/alertAction';

const getImageUrl = (path) => {
  if (!path || path === 'null' || path === 'undefined') return '';
  if (path.startsWith('http')) return path;
  return `${apis.BASE}${path}`;
};

const useStyles = theme => ({
  root: {
    padding: theme.spacing(3),
    maxWidth: 800,
    margin: '0 auto',
  },
  questionItem: {
    padding: theme.spacing(2),
    border: '1px solid #ccc',
    marginBottom: theme.spacing(2),
    borderRadius: theme.spacing(1)
  },
  btnContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(4)
  },
  modalStyle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    maxHeight: '90vh',
    overflowY: 'auto',
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  fileInputContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2)
  },
});

class PaperPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: [],
      editingQuestion: null, // Holds the question currently being edited
      submitting: false,
      editData: {}
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

  handleEditClick = (q) => {
    this.setState({
      editingQuestion: q,
      editData: {
        body: q.body,
        bodyImage: null,
        option1: q.options[0] || '',
        optImg1: null,
        option2: q.options[1] || '',
        optImg2: null,
        option3: q.options[2] || '',
        optImg3: null,
        option4: q.options[3] || '',
        optImg4: null,
        answer: q.answer,
        questionType: q.questionType || 'SINGLE',
        marks: q.marks || 1,
        explanation: q.explanation || '',
        explanationImage: q.explanationImage || null
      },
    });
  }

  handleCloseModal = () => {
    this.setState({ editingQuestion: null, editData: {} });
  }

  handleInputChange = (e) => {
    this.setState({
      editData: {
        ...this.state.editData,
        [e.target.name]: e.target.value
      }
    });
  }

  handleFileChange = (e) => {
    this.setState({
      editData: {
        ...this.state.editData,
        [e.target.name]: e.target.files[0]
      }
    });
  }


  renderImageField = (name, label, existingImageUrl, deleteStateKey) => {
    const isDeleted = this.state.editData[deleteStateKey];
    const newFile = this.state.editData[name];

    return (
      <div style={{ marginTop: '15px' }}>
        <Typography variant="body2">{label}:</Typography>
        
        {existingImageUrl && !isDeleted && !newFile && (
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '10px' }}>
            <img src={getImageUrl(existingImageUrl)} alt={label} style={{ maxHeight: '100px', display: 'block', borderRadius: '4px' }} />
            <IconButton 
              size="small" 
              onClick={() => this.setState({ editData: { ...this.state.editData, [deleteStateKey]: true } })} 
              style={{ position: 'absolute', top: -10, right: -10, backgroundColor: '#fff', boxShadow: '0 0 5px rgba(0,0,0,0.3)', color: '#d32f2f' }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>
        )}

        {existingImageUrl && isDeleted && !newFile && (
          <Typography variant="caption" style={{ color: '#d32f2f', display: 'block', marginBottom: '10px' }}>Existing image will be deleted.</Typography>
        )}

        <div style={{
            border: '2px dashed #ccc',
            borderRadius: '4px',
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
        }}>
          <input type="file" name={name} accept="image/*" onChange={this.handleFileChange} />
          {newFile && (
            <div style={{ color: '#2e7d32', fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#e8f5e9', padding: '4px 8px', borderRadius: '4px' }}>
              <span>📷 New image attached: {newFile.name}</span>
              <IconButton size="small" onClick={() => this.setState({ editData: { ...this.state.editData, [name]: null } })} style={{ color: '#d32f2f' }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </div>
          )}
        </div>
      </div>
    );
  }

  handleEditSubmit = async (e) => {
    e.preventDefault();
    const { option1, option2, option3, option4, questionType } = this.state.editData;
    if (questionType !== 'NUMERICAL') {
      const opts = [option1, option2, option3, option4].filter(x => x && x.trim() !== '');
      if (new Set(opts).size !== opts.length) {
        this.props.setAlert({ isAlert: true, type: 'error', title: 'Error', message: 'All text options must be unique.' });
        return;
      }
    }

    let answerMissing = false;
    if (questionType === 'NUMERICAL') {
      answerMissing = !this.state.editData.answer && this.state.editData.answer !== 0;
    } else if (questionType === 'MULTIPLE') {
      answerMissing = !Array.isArray(this.state.editData.answer) || this.state.editData.answer.length === 0;
    } else {
      answerMissing = !this.state.editData.answer;
      if (typeof this.state.editData.answer === 'string' && this.state.editData.answer.trim() === '') {
        // If the answer is whitespace, it's valid if it matches an option that has an image attached
        const matchesOpt1 = this.state.editData.answer === this.state.editData.option1 && !!this.state.editData.optImg1;
        const matchesOpt2 = this.state.editData.answer === this.state.editData.option2 && !!this.state.editData.optImg2;
        const matchesOpt3 = this.state.editData.answer === this.state.editData.option3 && !!this.state.editData.optImg3;
        const matchesOpt4 = this.state.editData.answer === this.state.editData.option4 && !!this.state.editData.optImg4;
        
        if (!matchesOpt1 && !matchesOpt2 && !matchesOpt3 && !matchesOpt4) {
          answerMissing = true;
        }
      }
    }

    if (answerMissing) {
      this.props.setAlert({ isAlert: true, type: 'error', title: 'Error', message: 'Please select or provide a correct answer.' });
      return;
    }

    this.setState({ submitting: true });
      const formData = new FormData();
    formData.append('questionId', this.state.editingQuestion._id);
    formData.append('testId', this.props.testId);
    formData.append('body', this.state.editData.body);
    formData.append('option1', this.state.editData.option1);
    formData.append('option2', this.state.editData.option2);
    formData.append('option3', this.state.editData.option3);
    formData.append('option4', this.state.editData.option4);
    formData.append('answer', this.state.editData.answer);
    formData.append('questionType', this.state.editData.questionType);
    formData.append('marks', this.state.editData.marks);
    formData.append('explanation', this.state.editData.explanation);

    if (this.state.editData.bodyImage) formData.append('bodyImage', this.state.editData.bodyImage);
      if (this.state.editData.delete_bodyImage) formData.append('delete_bodyImage', 'true');
      if (this.state.editData.delete_explanationImage) formData.append('delete_explanationImage', 'true');
      if (this.state.editData.delete_optImg1) formData.append('delete_optImg1', 'true');
      if (this.state.editData.delete_optImg2) formData.append('delete_optImg2', 'true');
      if (this.state.editData.delete_optImg3) formData.append('delete_optImg3', 'true');
      if (this.state.editData.delete_optImg4) formData.append('delete_optImg4', 'true');
    if (this.state.editData.explanationImage) formData.append('explanationImage', this.state.editData.explanationImage);
    if (this.state.editData.optImg1) formData.append('optImg1', this.state.editData.optImg1);
    if (this.state.editData.optImg2) formData.append('optImg2', this.state.editData.optImg2);
    if (this.state.editData.optImg3) formData.append('optImg3', this.state.editData.optImg3);
    if (this.state.editData.optImg4) formData.append('optImg4', this.state.editData.optImg4);

    try {
      const response = await axios.post(apis.BASE + '/api/v1/user/editExamQuestion', formData, {
        headers: { 'Authorization': `Bearer ${Auth.retriveToken()}` }
      });
      if (response.data.success) {
        this.props.setAlert({ isAlert: true, type: 'success', title: 'Success', message: 'Question updated' });
        this.handleCloseModal();
        this.fetchTestDetails();
      } else {
        this.props.setAlert({ isAlert: true, type: 'error', title: 'Error', message: response.data.message });
      }
    } catch (err) {
      console.log(err);
      this.props.setAlert({ isAlert: true, type: 'error', title: 'Error', message: 'Failed to update question' });
    }
  }

  handleDeleteClick = async (questionId) => {
    if(window.confirm("Are you sure you want to delete this question?")) {
      try {
        const response = await axios.post(apis.BASE + '/api/v1/user/deleteExamQuestion', { questionId, testId: this.props.testId }, {
          headers: { 'Authorization': `Bearer ${Auth.retriveToken()}` }
        });
        if (response.data.success) {
          this.props.setAlert({ isAlert: true, type: 'success', title: 'Success', message: 'Question deleted' });
          this.fetchTestDetails();
        } else {
          this.props.setAlert({ isAlert: true, type: 'error', title: 'Error', message: response.data.message });
        }
      } catch (err) {
        console.log(err);
        this.props.setAlert({ isAlert: true, type: 'error', title: 'Error', message: 'Failed to delete question' });
      }
    }
  }

  render() {
    const { classes, onFinish } = this.props;
    const { questions, editingQuestion, editData } = this.state;

    return (
      <Paper className={classes.root}>
        <Typography variant="h5" gutterBottom>Preview & Edit Test</Typography>
        <Typography variant="subtitle1" gutterBottom>Review your questions before final submission.</Typography>

        <div style={{ marginTop: '20px' }}>
          {questions.map((q, i) => (
            <div key={q._id} className={classes.questionItem}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Question {i + 1} ({q.marks} Marks)</Typography>
                <div>
                  <Button variant="outlined" color="primary" onClick={() => this.handleEditClick(q)} style={{marginRight: '10px'}}>Edit</Button>
                  <Button variant="outlined" color="secondary" onClick={() => this.handleDeleteClick(q._id)}>Delete</Button>
                </div>
              </div>
              
              <div style={{ margin: '10px 0' }}>
                {q.body !== ' ' && <Typography>{q.body}</Typography>}
                {q.bodyImage && q.bodyImage.trim() !== '' && <img src={getImageUrl(q.bodyImage)} alt="Question" style={{ maxWidth: '100%', maxHeight: '200px' }} />}
              </div>

              <div style={{ marginLeft: '20px' }}>
                {q.questionType === 'NUMERICAL' ? (
                  <Typography variant="body1"><strong>Correct Answer:</strong> {q.answer}</Typography>
                ) : (
                  q.options.map((opt, optIndex) => (
                    <div key={optIndex} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                      <Typography variant="body2" color={(q.questionType === 'MULTIPLE' ? (Array.isArray(q.answer) && q.answer.includes(opt)) : q.answer === opt) ? 'primary' : 'textSecondary'}>
                        {optIndex + 1}. {opt !== ' ' ? opt : ''}
                      </Typography>
                      {q.optionImages && q.optionImages[optIndex] && q.optionImages[optIndex].trim() !== '' && (
                        <img src={getImageUrl(q.optionImages[optIndex])} alt={`Option ${optIndex + 1}`} style={{ maxWidth: '150px', maxHeight: '100px', marginLeft: q.options[optIndex] !== ' ' ? '10px' : '0' }} />
                      )}
                    </div>
                  ))
                )}
                {q.explanation && (
                  <Typography variant="body2" style={{ marginTop: '5px', color: '#555' }}>
                    <strong>Explanation:</strong> {q.explanation}
                  </Typography>
                )}
                {q.explanationImage && (
                  <img src={q.explanationImage.startsWith('http') ? q.explanationImage : apis.BASE + q.explanationImage} alt="explanation" style={{ maxHeight: '100px', display: 'block', marginTop: '10px', borderRadius: '4px' }} />
                )}
              </div>
            </div>
          ))}
        </div>

        {!this.props.hideFinishButton && (
          <div className={classes.btnContainer}>
            <Button variant="contained" color="secondary" onClick={onFinish} size="large">Final Submit</Button>
          </div>
        )}

        {/* Edit Modal */}
        <Modal open={!!editingQuestion} onClose={this.handleCloseModal}>
          <Box className={classes.modalStyle}>
            <Typography variant="h6" gutterBottom>Edit Question</Typography>
            {editingQuestion && (
              <form onSubmit={this.handleEditSubmit}>
                <TextField fullWidth label="Question Text" name="body" value={editData.body} onChange={this.handleInputChange} margin="normal" variant="outlined" />
                {this.renderImageField('bodyImage', 'Replace Image (Question Body)', editingQuestion.bodyImage, 'delete_bodyImage')}

                <FormControl variant="outlined" margin="normal" fullWidth>
                  <InputLabel>Question Type</InputLabel>
                  <Select name="questionType" value={editData.questionType || 'SINGLE'} onChange={(e) => this.setState({ editData: { ...editData, questionType: e.target.value, answer: e.target.value === 'MULTIPLE' ? [] : '' } })} label="Question Type">
                    <MenuItem value="SINGLE">Single Choice</MenuItem>
                    <MenuItem value="MULTIPLE">Multiple Choice</MenuItem>
                    <MenuItem value="NUMERICAL">Numerical Value</MenuItem>
                  </Select>
                </FormControl>

                {editData.questionType !== 'NUMERICAL' && [1, 2, 3, 4].map(num => (
                  <div key={num}>
                    <TextField fullWidth label={`Option ${num} Text`} name={`option${num}`} value={editData[`option${num}`]} onChange={this.handleInputChange} margin="dense" variant="outlined" />
                    {this.renderImageField(`optImg${num}`, `Replace Image (Option ${num})`, editingQuestion[`optionImages`] && editingQuestion[`optionImages`][num-1], `delete_optImg${num}`)}
                  </div>
                ))}

                {editData.questionType === 'NUMERICAL' ? (
                  <TextField fullWidth label="Correct Answer (Numeric)" name="answer" type="number" value={editData.answer} onChange={this.handleInputChange} margin="normal" variant="outlined" inputProps={{ step: "any" }} />
                ) : editData.questionType === 'MULTIPLE' ? (
                  <FormControl variant="outlined" margin="normal" fullWidth>
                    <InputLabel>Correct Answer</InputLabel>
                    <Select 
                      multiple 
                      name="answer" 
                      value={Array.isArray(editData.answer) ? editData.answer : []} 
                      onChange={(e) => this.handleInputChange({ target: { name: 'answer', value: e.target.value } })} 
                      renderValue={(selected) => selected.join(', ')} 
                      label="Correct Answer"
                    >
                      {[1, 2, 3, 4].map(num => (
                        <MenuItem key={num} value={editData[`option${num}`]} disabled={!editData[`option${num}`]}>
                          <Checkbox checked={Array.isArray(editData.answer) && editData.answer.indexOf(editData[`option${num}`]) > -1} />
                          <ListItemText primary={`Option ${num}`} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  <FormControl variant="outlined" margin="normal" fullWidth>
                    <InputLabel>Correct Answer</InputLabel>
                    <Select name="answer" value={editData.answer} onChange={this.handleInputChange} label="Correct Answer">
                      <MenuItem value={editData.option1}>Option 1</MenuItem>
                      <MenuItem value={editData.option2}>Option 2</MenuItem>
                      <MenuItem value={editData.option3}>Option 3</MenuItem>
                      <MenuItem value={editData.option4}>Option 4</MenuItem>
                    </Select>
                  </FormControl>
                )}

                <TextField label="Marks" name="marks" type="number" value={editData.marks} onChange={this.handleInputChange} margin="normal" variant="outlined" InputProps={{ inputProps: { min: 1 } }} fullWidth />
                
                <TextField 
                  label="Explanation (Optional)" 
                  name="explanation" 
                  value={editData.explanation} 
                  onChange={this.handleInputChange} 
                  margin="normal" 
                  variant="outlined" 
                  multiline 
                  rows={3} 
                  fullWidth
                  placeholder="Explain why the answer is correct..."
                />
                
                {this.renderImageField('explanationImage', 'Explanation Image', editingQuestion.explanationImage, 'delete_explanationImage')}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                  <Button onClick={this.handleCloseModal} color="default">Cancel</Button>
                  <Button type="submit" variant="contained" color="primary" disabled={this.state.submitting} style={{ minWidth: '150px' }}>
                      {this.state.submitting ? (
                         <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <CircularProgress size={20} color="inherit" />
                            Uploading...
                         </span>
                      ) : 'Save Changes'}
                    </Button>
                </div>
              </form>
            )}
          </Box>
        </Modal>
      </Paper>
    );
  }
}

export default connect(null, { setAlert })(withStyles(useStyles)(PaperPreview));
