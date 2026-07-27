import React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { setAlert } from "../../../redux/actions/alertAction";
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import { getSubjectDetails } from '../../../redux/actions/subjectAction';
import { addQuestionAction } from "../../../redux/actions/questionAction";
import { TextareaAutosize, MenuItem, Checkbox, ListItemText, Typography } from "@material-ui/core";



const useStyles = ()=>({
  questionInput:{
    marginTop:'20px',
    display : 'block'
  },
  optionInput : {
    display:'inline-block',
    margin :'20px 20px 0px'
  },
  inputfield : {
    display : 'block',
    margin : '10px 20px 0px'
  },
  btn : {
    margin : '20px 40px',
    display:'inline-block'
  },
  formClass : {
    margin:'20px',
    display: 'inline-block',
    textAlign : 'center',
    border : '1px solid black',
    borderRadius: '10px',
    padding : '20px'
  },
  
  formTitle:{
    fontSize: '1.7em'
  },
  textarea : {
    fontSize: '1.1em',
    padding:'5px',
    margin:'20px 20px 0px 0px',
    minWidth:'60%'
  }
})

class AddQuestionForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      body : "",
      options : ["","","",""],
      subject : "",
      answer : "",
      questionType: "SINGLE",
      marks : 1,
      difficulty: "MEDIUM",
      explanation : "",
      explanationImage: null,
      bodyImage: null,
      optImg1: null,
      optImg2: null,
      optImg3: null,
      optImg4: null,
      fileInputKey: Date.now()
    }
  }

  bodyInputHandler = (event) => {
    this.setState({
      ...this.state,
      body : event.target.value
    });
  }

  optionInputHandler = (event,i) => {
    var opt = this.state.options
    opt[i] = event.target.value
    this.setState({
      ...this.state,
      options :opt
    })
  }

  subjectInputHandler = (event) => {
    this.setState({
      ...this.state,
      subject : event.target.value
    })
  }

  answerInputHandler = (event) => {
    this.setState({
      ...this.state,
      answer : event.target.value
    })
  }

  marksInputHandler = (event) => {
    this.setState({
      ...this.state,
      marks : event.target.value
    })
  }

  explanationInputHandler = (event) => {
    this.setState({
      ...this.state,
      explanation : event.target.value
    })
  }

  handleFileChange = (e) => {
    this.setState({ [e.target.name]: e.target.files[0] });
  };

  handlePaste = (e, name) => {
    if (e.clipboardData && e.clipboardData.files && e.clipboardData.files.length > 0) {
      this.setState({ [name]: e.clipboardData.files[0] });
      e.preventDefault();
    }
  };

  async handleSubmit(event) {
    event.preventDefault();
    let isAnswerInvalid = false;
    if (this.state.questionType === 'MULTIPLE') {
      isAnswerInvalid = (!Array.isArray(this.state.answer) || this.state.answer.length === 0);
    } else {
      isAnswerInvalid = (!this.state.answer || this.state.answer === 'None' || this.state.answer === '');
      
      // If the answer is falsy or empty, it might still be valid if it exactly matches an option that has an image attached
      if (isAnswerInvalid && (this.state.answer === '' || this.state.answer === undefined || this.state.answer === null || typeof this.state.answer === 'string' && this.state.answer.trim() === '')) {
        const matchesOpt1 = this.state.answer === this.state.options[0] && !!this.state.optImg1;
        const matchesOpt2 = this.state.answer === this.state.options[1] && !!this.state.optImg2;
        const matchesOpt3 = this.state.answer === this.state.options[2] && !!this.state.optImg3;
        const matchesOpt4 = this.state.answer === this.state.options[3] && !!this.state.optImg4;
        
        if (matchesOpt1 || matchesOpt2 || matchesOpt3 || matchesOpt4) {
          isAnswerInvalid = false;
        }
      }
    }

    if(isAnswerInvalid){
      console.log('answer error');
      this.props.setAlert({
        isAlert:true,
        type:'error',
        title:'invalid input',
        message:'please provide an answer'
      })
      return;
    }
    console.log(this.state);
    
    let formData = new FormData();
    formData.append('body', this.state.body);
    formData.append('subject', this.state.subject);
    formData.append('marks', this.state.marks);
    formData.append('difficulty', this.state.difficulty);
    formData.append('questionType', this.state.questionType);
    if(this.state.explanation !== '') formData.append('explanation', this.state.explanation);
    
    if (this.state.bodyImage) formData.append('bodyImage', this.state.bodyImage);
    if (this.state.explanationImage) formData.append('explanationImage', this.state.explanationImage);
    if (this.state.optImg1) formData.append('optImg1', this.state.optImg1);
    if (this.state.optImg2) formData.append('optImg2', this.state.optImg2);
    if (this.state.optImg3) formData.append('optImg3', this.state.optImg3);
    if (this.state.optImg4) formData.append('optImg4', this.state.optImg4);

    if (this.state.questionType === 'MULTIPLE' && Array.isArray(this.state.answer)) {
      formData.append('answer', this.state.answer.join(','));
    } else {
      formData.append('answer', this.state.answer);
    }
    
    if (this.state.questionType !== 'NUMERICAL') {
      formData.append('option1', this.state.options[0]);
      formData.append('option2', this.state.options[1]);
      formData.append('option3', this.state.options[2]);
      formData.append('option4', this.state.options[3]);
    }
    
    const success = await this.props.addQuestionAction(formData);
    if (success) {
      this.setState({
        body : "",
        options : ["","","",""],
        subject : "",
        answer : "",
        questionType: "SINGLE",
        marks : 1,
        difficulty: "MEDIUM",
        explanation : "",
        explanationImage: null,
        bodyImage: null,
        optImg1: null,
        optImg2: null,
        optImg3: null,
        optImg4: null,
        fileInputKey: Date.now()
      });
    }
  }

  render() {
    if(this.props.subjectDetails.retrived === false) {
      this.props.getSubjectDetails();
      return (<div></div>);
    }
    return (
      <form className={this.props.classes.formClass} onSubmit={(event)=>(this.handleSubmit(event))}>
        <div className={this.props.classes.formTitle} color="primary">Add Question</div>
        <TextField
          variant='outlined'
          color="primary"
          className={this.props.classes.questionInput}
          label="Question"
          placeholder='enter question'
          type='text'
          error_text=''
          value={this.state.body}
          onChange={(event)=>(this.bodyInputHandler(event))}
          required={!this.state.bodyImage}
          fullWidth
        />
        <div style={{ marginTop: '10px' }} onPaste={(e) => this.handlePaste(e, 'bodyImage')}>
          <Typography variant="body2">Question Image (paste or select):</Typography>
          <input key={this.state.fileInputKey + "body"} type="file" name="bodyImage" accept="image/*" onChange={this.handleFileChange} />
          {this.state.bodyImage && <span style={{color: 'green'}}>Image attached!</span>}
        </div>
        <br/>
        <InputLabel htmlFor='questionType-label' className={this.props.classes.optionInput}>Question Type</InputLabel>
        <Select
          native
          value={this.state.questionType}
          onChange={(event) => this.setState({ questionType: event.target.value, answer: event.target.value === 'MULTIPLE' ? [] : '' })}
          label="Question Type"
          inputProps={{ name:'questionType', id:'questionType-label' }}
          className={this.props.classes.optionInput}
        >
          <option value='SINGLE'>Single Choice</option>
          <option value='MULTIPLE'>Multiple Choice</option>
          <option value='NUMERICAL'>Numerical Value</option>
        </Select>
        <br/>

        {this.state.questionType !== 'NUMERICAL' && (
          <React.Fragment>
        <div style={{display: 'flex', alignItems: 'center', marginBottom: '10px'}}>
        <TextField
          variant='outlined'
          color="primary"
          className={this.props.classes.optionInput}
          label="Option A"
          placeholder='enter option'
          type='text'
          value={this.state.options[0]}
          onChange={(event)=>(this.optionInputHandler(event,0))}
          required={!this.state.optImg1}
        />
        <div onPaste={(e) => this.handlePaste(e, 'optImg1')}>
          <Typography variant="body2">Image A (paste):</Typography>
          <input key={this.state.fileInputKey + "opt1"} type="file" name="optImg1" accept="image/*" onChange={this.handleFileChange} />
          {this.state.optImg1 && <span style={{color: 'green'}}>Attached!</span>}
        </div>
        </div>

        <div style={{display: 'flex', alignItems: 'center', marginBottom: '10px'}}>
        <TextField
          variant='outlined'
          color="primary"
          className={this.props.classes.optionInput}
          label="Option B"
          placeholder='enter option'
          type='text'
          value={this.state.options[1]}
          onChange={(event)=>(this.optionInputHandler(event,1))}
          required={!this.state.optImg2}
        />
        <div onPaste={(e) => this.handlePaste(e, 'optImg2')}>
          <Typography variant="body2">Image B (paste):</Typography>
          <input key={this.state.fileInputKey + "opt2"} type="file" name="optImg2" accept="image/*" onChange={this.handleFileChange} />
          {this.state.optImg2 && <span style={{color: 'green'}}>Attached!</span>}
        </div>
        </div>

        <div style={{display: 'flex', alignItems: 'center', marginBottom: '10px'}}>
        <TextField
          variant='outlined'
          color="primary"
          className={this.props.classes.optionInput}
          label="Option C"
          placeholder='enter option'
          type='text'
          value={this.state.options[2]}
          onChange={(event)=>(this.optionInputHandler(event,2))}
          required={!this.state.optImg3}
        />
        <div onPaste={(e) => this.handlePaste(e, 'optImg3')}>
          <Typography variant="body2">Image C (paste):</Typography>
          <input key={this.state.fileInputKey + "opt3"} type="file" name="optImg3" accept="image/*" onChange={this.handleFileChange} />
          {this.state.optImg3 && <span style={{color: 'green'}}>Attached!</span>}
        </div>
        </div>

        <div style={{display: 'flex', alignItems: 'center', marginBottom: '10px'}}>
        <TextField
          variant='outlined'
          color="primary"
          className={this.props.classes.optionInput}
          label="Option D"
          placeholder='enter option'
          type='text'
          value={this.state.options[3]}
          onChange={(event)=>(this.optionInputHandler(event,3))}
          required={!this.state.optImg4}
        />
        <div onPaste={(e) => this.handlePaste(e, 'optImg4')}>
          <Typography variant="body2">Image D (paste):</Typography>
          <input key={this.state.fileInputKey + "opt4"} type="file" name="optImg4" accept="image/*" onChange={this.handleFileChange} />
          {this.state.optImg4 && <span style={{color: 'green'}}>Attached!</span>}
        </div>
        </div>
        <br/>
        </React.Fragment>
        )}
        <TextField
          variant='outlined'
          color="primary"
          className={this.props.classes.optionInput}
          label="Marks"
          placeholder='enter marks'
          type='number'
          error_text=''
          value={this.state.marks}
          onChange={(event)=>(this.marksInputHandler(event))}
          required
          InputProps={{
            inputProps: { 
              max: 4, min: 1 
            }
          }}
        />
        <InputLabel htmlFor='difficulty-label' className={this.props.classes.optionInput}>Difficulty</InputLabel>
        <Select
          native
          value={this.state.difficulty}
          onChange={(event) => this.setState({ difficulty: event.target.value })}
          label="Difficulty"
          inputProps={{ name:'difficulty', id:'difficulty-label' }}
          className={this.props.classes.optionInput}
        >
          <option value='EASY'>Easy</option>
          <option value='MEDIUM'>Medium</option>
          <option value='HARD'>Hard</option>
        </Select>
        <br/>
        <InputLabel htmlFor='subject-label' className={this.props.classes.optionInput}>Subject</InputLabel>
        <Select
          native
          value={this.state.subject}
          onChange={(event)=>(this.subjectInputHandler(event))}
          label="Subject"
          inputProps={{
            name:'subject',
            id:'subject-label'
          }}
          required
          className={this.props.classes.optionInput}
        >
          <option defaultValue={''} style={{color:'rgba(7,7,7,0.3)'}}>None</option>
          {this.props.subjectDetails.list.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.subject}
            </option>
          ))}

        </Select>
        <InputLabel htmlFor='answer-label' className={this.props.classes.optionInput}>Answer</InputLabel>
        {this.state.questionType === 'NUMERICAL' ? (
          <TextField
            variant='outlined'
            color="primary"
            className={this.props.classes.optionInput}
            label="Correct Answer (Numeric)"
            type="number"
            value={this.state.answer}
            onChange={this.answerInputHandler}
            required
            inputProps={{ step: "any" }}
          />
        ) : this.state.questionType === 'MULTIPLE' ? (
          <Select
            multiple
            value={Array.isArray(this.state.answer) ? this.state.answer : []}
            onChange={this.answerInputHandler}
            renderValue={(selected) => selected.join(', ')}
            className={this.props.classes.optionInput}
          >
            {[0, 1, 2, 3].map((i) => (
              <MenuItem key={i} value={this.state.options[i]}>
                <Checkbox checked={Array.isArray(this.state.answer) && this.state.answer.indexOf(this.state.options[i]) > -1} />
                <ListItemText primary={`Option ${String.fromCharCode(65 + i)}`} />
              </MenuItem>
            ))}
          </Select>
        ) : (
          <Select
            native
            value={this.state.answer}
            onChange={(event)=>(this.answerInputHandler(event))}
            label="Answer"
            inputProps={{
              name:'answer',
              id:'answer-label'
            }}
            required
            className={this.props.classes.optionInput}
          >
            <option value='None'></option>
            <option value={this.state.options[0]}> option A</option>
            <option value={this.state.options[1]}> option B</option>
            <option value={this.state.options[2]}> option C</option>
            <option value={this.state.options[3]}> option D</option>
          </Select>
        )}
        <br/>
        <InputLabel htmlFor='explanation-label' className={this.props.classes.optionInput}>Explanation</InputLabel>
        <TextareaAutosize
          variant='outlined'
          color="primary"
          id="explanation"
          placeholder='enter explanation'
          value={this.state.explanation}
          onChange={(event)=>(this.explanationInputHandler(event))}
          className={this.props.classes.textarea}
          minRows={3}
        />
        <div style={{ marginTop: '15px' }} onPaste={(e) => this.handlePaste(e, 'explanationImage')}>
          <Typography variant="body2">Explanation Image (paste or select):</Typography>
          <input key={this.state.fileInputKey + "exp"} type="file" name="explanationImage" accept="image/*" onChange={this.handleFileChange} />
          {this.state.explanationImage && <span style={{color: 'green'}}>Image attached!</span>}
        </div>
        
        <div className={this.props.classes.btnContainer}>
        <br/>
        <Button 
          variant='contained'
          color="primary"
          type='submit'
          className={this.props.classes.btn}
        >
          Submit
        </Button>
      </form>
    )
  }
}

const mapStatetoProps = state => ({
  subjectDetails : state.subjectDetails
})

export default withStyles(useStyles)(connect(mapStatetoProps,{
  getSubjectDetails,
  setAlert,
  addQuestionAction
})(AddQuestionForm));