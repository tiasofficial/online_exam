import { withStyles } from "@material-ui/styles";
import React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import { FormControlLabel, FormGroup, FormLabel, Checkbox } from "@material-ui/core";
import { getSubjectDetails } from '../../../redux/actions/subjectAction';
import { setAlert } from "../../../redux/actions/alertAction";
import { createTestAction } from "../../../redux/actions/teacherTestAction";
import { getAllClasses } from "../../../redux/actions/classAction";
import { Select, MenuItem, InputLabel, FormControl } from "@material-ui/core";
import PaperSetup from "../PaperSetup/PaperSetup";
import PaperPreview from "../PaperPreview/PaperPreview";

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

class CreateTestForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title :"",
      subjects : [],
      maxmarks : 30,
      queTypes : [],
      startTime: "",
      endTime : "",
      duration : 30,
      regStartTime : "",
      regEndTime : "",
      resultTime : "",
      targetClass: "",
      assignedStudents: [],
      createdTestId: null,
      setupStep: 0, // 0: Form, 1: Setup, 2: Preview
      isSubmitting: false
    }
  }

  componentDidMount() {
    this.props.getAllClasses();
  }

  titleInputHandler = (event) => {
    this.setState({
      ...this.state,
      title : event.target.value
    });
  }

  subjectCheckboxInputHandler = (event) => {
    var list = this.state.subjects;
    if(event.target.checked) {
      list.push(event.target.name);
      this.setState({
        ...this.state,
        subjects : list
      })
    } else {
      this.setState({
        ...this.state,
        subjects : list.filter((v)=>(v!==event.target.name))
      })
    }
    
  } 

  queTypestCheckboxInputHandler = (event) => {
    var list = this.state.queTypes;
    var n = parseInt(event.target.name)
    if(event.target.checked) {
      list.push(n);
      this.setState({
        ...this.state,
        queTypes : list
      })
    } else {
      this.setState({
        ...this.state,
        queTypes : list.filter((v)=>(v!==n))
      })
    }
  }

  classSelectHandler = (event) => {
    const classId = event.target.value;
    const selectedClassObj = this.props.classesData.find(c => c._id === classId);
    
    // By default, select all students in the class
    let defaultStudents = [];
    if (selectedClassObj && selectedClassObj.students) {
      defaultStudents = selectedClassObj.students.map(s => s._id);
    }

    this.setState({
      ...this.state,
      targetClass: classId,
      assignedStudents: defaultStudents,
      subjects: [] // Reset subjects when class changes
    });
  }

  studentCheckboxInputHandler = (event) => {
    var list = [...this.state.assignedStudents];
    var studentId = event.target.name;
    if(event.target.checked) {
      list.push(studentId);
    } else {
      list = list.filter((v)=>(v!==studentId));
    }
    this.setState({
      ...this.state,
      assignedStudents: list
    });
  }

  marksInputHandler = (event) => {
    this.setState({
      ...this.state,
      maxmarks : parseInt(event.target.value)
    })
  }

  startTimeInputHandler = (event) => {
    this.setState({
      ...this.state,
      startTime : event.target.value
    })
  }

  endTimeInputHandler = (event) => {
    this.setState({
      ...this.state,
      endTime : event.target.value
    })
  }

  TestDurationInputHandler = (event) => {
    this.setState({
      ...this.state,
      duration : event.target.value
    })
  }

  regStartTimeInputHandler = (event) => {
    this.setState({
      ...this.state,
      regStartTime : event.target.value
    })
  }

  regEndTimeInputHandler = (event) => {
    this.setState({
      ...this.state,
      regEndTime : event.target.value
    })
  }

  resultTimeInputHandler = (event) => {
    this.setState({
      ...this.state,
      resultTime : event.target.value
    })
  }

  sendAlert(type,title,message) {
    this.props.setAlert({
      isAlert:true,
      type:type,
      title:title,
      message:message
    })
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.isSubmitting) return;
    var dur = parseInt(this.state.duration) * 60 * 1000;
    if(this.state.subjects.length<1) {
      this.sendAlert('error','Invalid input','select at least one subject');
    } else if(this.state.regStartTime && this.state.regEndTime && Date.parse(this.state.regStartTime) >= Date.parse(this.state.regEndTime)) {
      this.sendAlert('error','Invalid input','Invalid Registration start and end time');
    } else if(Date.parse(this.state.startTime) >= Date.parse(this.state.endTime)) {
      this.sendAlert('error','Invalid input','Invalid Test start and end time');
    } else if(this.state.regEndTime && Date.parse(this.state.regEndTime) >= Date.parse(this.state.startTime)) {
      this.sendAlert('error','Invalid input','Invalid Test start time');
    } else if(Date.parse(this.state.endTime) >= Date.parse(this.state.resultTime)) {
      this.sendAlert('error','Invalid input','Invalid Test result time');
    } else if((Date.parse(this.state.endTime) - Date.parse(this.state.startTime) - dur) <= 0) {
      this.sendAlert('error','Invalid input','Invalid Test duration time');
    } else if(!this.state.targetClass) {
      this.sendAlert('error','Invalid input','select a target class');
    } else {
      this.setState({ isSubmitting: true });
      this.props.createTestAction({...this.state, duration: dur/1000}, (testId) => {
        this.setState({ createdTestId: testId, setupStep: 1, isSubmitting: false });
      });
    }
  }

  render() {
    if (this.state.setupStep === 1 && this.state.createdTestId) {
      return <PaperSetup testId={this.state.createdTestId} targetSubject={this.state.subjects[0]} onFinish={() => this.setState({ setupStep: 2 })} />
    }

    if (this.state.setupStep === 2 && this.state.createdTestId) {
      return <PaperPreview testId={this.state.createdTestId} targetSubject={this.state.subjects[0]} onFinish={() => this.setState({ setupStep: 0, createdTestId: null, title: '', subjects: [], targetClass: '', assignedStudents: [] })} />
    }

    if(this.props.subjectDetails.retrived === false) {
      this.props.getSubjectDetails();
      return (<div></div>);
    }
    return(
      <form className={this.props.classes.formClass} onSubmit={(event)=>(this.handleSubmit(event))}>
        <div className={this.props.classes.formTitle} color="primary">Create Test</div>
        <TextField
          variant='outlined'
          color="primary"
          className={this.props.classes.questionInput}
          label="Title"
          placeholder='enter title'
          type='text'
          error_text=''
          value={this.state.title}
          onChange={(event)=>(this.titleInputHandler(event))}
          required
          fullWidth
        />
        <FormControl variant="outlined" className={this.props.classes.inputfield} fullWidth>
          <InputLabel>Target Class</InputLabel>
          <Select
            value={this.state.targetClass}
            onChange={this.classSelectHandler}
            label="Target Class"
          >
            {this.props.classesData.map((c) => (
              <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <br/>

        {this.state.targetClass && (() => {
          const currentClass = this.props.classesData.find(c => c._id === this.state.targetClass);
          if (!currentClass) return null;

          return (
            <React.Fragment>
              <FormLabel className={this.props.classes.optionInput} >Subjects</FormLabel>
              <FormGroup className={this.props.classes.inputfield}>
                {currentClass.subjects && currentClass.subjects.map((sub)=>(
                  <FormControlLabel key={sub._id}
                    control={<Checkbox name={sub._id} onChange={(event)=>(this.subjectCheckboxInputHandler(event))} />}
                    label={sub.name}
                  />
                ))}
              </FormGroup>
              <br/>

              <FormLabel className={this.props.classes.optionInput} >Assign to Students</FormLabel>
              <FormGroup className={this.props.classes.inputfield}>
                {currentClass.students && currentClass.students.map((student)=>(
                  <FormControlLabel key={student._id}
                    control={<Checkbox name={student._id} checked={this.state.assignedStudents.includes(student._id)} onChange={(event)=>(this.studentCheckboxInputHandler(event))} />}
                    label={`${student.username} (${student.email})`}
                  />
                ))}
              </FormGroup>
              <br/>
            </React.Fragment>
          );
        })()}
        <br/>
        <TextField
          variant='outlined'
          color="primary"
          className={this.props.classes.optionInput}
          label="Registration Start Time"
          type='datetime-local'
          error_text=''
          value={this.state.regStartTime}
          onChange={(event)=>(this.regStartTimeInputHandler(event))}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          variant='outlined'
          color="primary"
          className={this.props.classes.optionInput}
          label="Registration End Time"
          type='datetime-local'
          error_text=''
          value={this.state.regEndTime}
          onChange={(event)=>(this.regEndTimeInputHandler(event))}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <br/>
        <TextField
          variant='outlined'
          color="primary"
          className={this.props.classes.optionInput}
          label="Start Time"
          type='datetime-local'
          error_text=''
          value={this.state.startTime}
          onChange={(event)=>(this.startTimeInputHandler(event))}
          required
          InputLabelProps={{
            shrink: true,
          }}
        />
        
        <TextField
          variant='outlined'
          color="primary"
          className={this.props.classes.optionInput}
          label="End Time"
          type='datetime-local'
          error_text=''
          value={this.state.endTime}
          onChange={(event)=>(this.endTimeInputHandler(event))}
          required
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          variant='outlined'
          color="primary"
          className={this.props.classes.optionInput}
          label="Test Duration (minutes)"
          type='number'
          error_text=''
          value={this.state.duration}
          inputProps={{ min: 1 }}
          onChange={(event)=>(this.TestDurationInputHandler(event))}
          required
          InputLabelProps={{
            shrink: true,
          }}
        />
        <br/>
        <TextField
          variant='outlined'
          color="primary"
          className={this.props.classes.optionInput}
          label="Result Time"
          type='datetime-local'
          error_text=''
          value={this.state.resultTime}
          onChange={(event)=>(this.resultTimeInputHandler(event))}
          required
          InputLabelProps={{
            shrink: true,
          }}
        />
        <br/>
        <Button 
          variant='contained'
          color="primary"
          type='submit'
          className={this.props.classes.btn}
          disabled={this.state.isSubmitting}
        >
          {this.state.isSubmitting ? 'Creating...' : 'Create test'}
        </Button>
      </form>
    )
  }
}

const mapStatetoProps = state => ({
  subjectDetails : state.subjectDetails,
  classesData: state.classes.classes || []
})

export default withStyles(useStyles)(connect(mapStatetoProps,{
  getSubjectDetails,
  setAlert,
  createTestAction,
  getAllClasses
})(CreateTestForm));