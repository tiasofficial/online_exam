import { withStyles } from "@material-ui/styles";
import React from "react";
import { connect } from "react-redux";
import { getSubjectDetails } from '../../../redux/actions/subjectAction';
import { setAlert } from "../../../redux/actions/alertAction";
import { getTestQuestionsForTeacherAction } from '../../../redux/actions/teacherTestAction';
import { Button } from "@material-ui/core";
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography 
} from "@material-ui/core";
import axios from 'axios';
import apis from '../../../helper/Apis';
import Auth from '../../../helper/Auth';
import { editTestTimeAction, reassignStudentTestAction } from '../../../redux/actions/teacherTestAction';


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
  },
  field : {
    display:'flex'
  },
  fieldkey : {
    display : 'inline-block',
    fontSize: '1.1em',
    padding:'5px',
    margin:'20px 20px 0px 0px',
    minWidth:'40%'
  },
  fieldvalue : {
    display : 'inline-block',
    fontSize: '1.1em',
    padding:'5px',
    margin:'20px 20px 0px 0px',
    minWidth:'60%'
  }
})

class ViewTest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title :this.props.testDetails.test.title,
      subjects : this.props.testDetails.test.subjects,
      maxmarks : this.props.testDetails.test.maxmarks,
      queTypes : this.props.testDetails.test.queTypes,
      startTime: new Date(this.props.testDetails.test.startTime).toLocaleString(),
      endTime : new Date(this.props.testDetails.test.endTime).toLocaleString(),
      regStartTime : this.props.testDetails.test.regStartTime ? new Date(this.props.testDetails.test.regStartTime).toLocaleString() : "N/A",
      regEndTime : this.props.testDetails.test.regEndTime ? new Date(this.props.testDetails.test.regEndTime).toLocaleString() : "N/A",
      resultTime :  this.props.testDetails.test.resultTime ? new Date(this.props.testDetails.test.resultTime).toLocaleString() : "N/A",
      duration : Math.round(this.props.testDetails.test.duration / 60),
      showPreview : false,
      
      // New State
      assignedStudents: [],
      openEditTime: false,
      editStartTime: this.props.testDetails.test.startTime.slice(0, 16),
      editEndTime: this.props.testDetails.test.endTime.slice(0, 16),
      editRegStartTime: this.props.testDetails.test.regStartTime ? this.props.testDetails.test.regStartTime.slice(0, 16) : "",
      editRegEndTime: this.props.testDetails.test.regEndTime ? this.props.testDetails.test.regEndTime.slice(0, 16) : "",
      editResultTime: this.props.testDetails.test.resultTime ? this.props.testDetails.test.resultTime.slice(0, 16) : "",
      
      openReassign: false,
      reassignStudentId: null,
      reassignStudentName: '',
      reassignEndTime: ''
    }
  }

  
  componentDidMount() {
    this.fetchAssignedStudents();
  }

  fetchAssignedStudents = () => {
    axios.post(apis.BASE + apis.GET_ASSIGNED_STUDENTS, { testid: this.props.testDetails.test._id }, {
      headers: { 'Authorization': `Bearer ${Auth.retriveToken()}` }
    }).then(res => {
      if(res.data.success) {
        this.setState({ assignedStudents: res.data.studentsData });
      }
    }).catch(err => console.log(err));
  }

  handleEditTimeSave = () => {
    if (this.state.editResultTime && new Date(this.state.editResultTime) <= new Date(this.state.editEndTime)) {
      alert('Result Time must be after the Test End Time.');
      return;
    }
    const details = {
      testid: this.props.testDetails.test._id,
      startTime: this.state.editStartTime,
      endTime: this.state.editEndTime,
      resultTime: this.state.editResultTime || null,
    };
    this.props.editTestTimeAction(details, () => {
      this.setState({ 
        openEditTime: false, 
        startTime: new Date(this.state.editStartTime).toLocaleString(), 
        endTime: new Date(this.state.editEndTime).toLocaleString(),
        resultTime: this.state.editResultTime ? new Date(this.state.editResultTime).toLocaleString() : this.state.resultTime
      });
    });
  }

  handleReassignSave = () => {
    if (!this.state.reassignEndTime) {
      alert('Please set an Extended End Time for the student.');
      return;
    }
    if (new Date(this.state.reassignEndTime).getTime() <= Date.now()) {
      alert('Extended End Time must be in the future.');
      return;
    }
    const details = {
      testid: this.props.testDetails.test._id,
      studentid: this.state.reassignStudentId,
      newEndTime: this.state.reassignEndTime
    };
    this.props.reassignStudentTestAction(details, () => {
      this.setState({ openReassign: false });
      this.fetchAssignedStudents();
    });
  }

  togglePreview = () => {
    if(!this.state.showPreview) {
      this.props.getTestQuestionsForTeacherAction({testid: this.props.testDetails.test._id});
    }
    this.setState({
      ...this.state,
      showPreview: !this.state.showPreview
    });
  }


  

  

  

  


  findInArray(arr, val) {
    for(let i=0;i<(arr || []).length;i++){
      if(arr[i]===val) {
        return  true;
      }
    }
    return false;
  }
  
  findInArraySubname(arr, sub) {
    for(let i=0;i<(arr || []).length;i++){
      if(arr[i]===sub.id) {
        return  sub.subject + ", ";
      }
    }
    return "";
  }

  getQuesTypesString(arr) {
    var str = "";
    for(let i=0;i<(arr || []).length;i++){
      str = str + arr[i] + " Marks, ";
    }
    return str;
  }

  render() {
    if(this.props.subjectDetails.retrived === false) {
      this.props.getSubjectDetails();
      return (<div></div>);
    }
    return(
      <div className={this.props.classes.formClass}>
        <div className={this.props.classes.formTitle} color="primary">View Test</div>
        <div className={this.props.classes.field}>
          <div className={this.props.classes.fieldkey}>Title</div>
          <div className={this.props.classes.fieldvalue}>{this.state.title}</div>
        </div>
        <div className={this.props.classes.field}>
          <div className={this.props.classes.fieldkey}>Subjects</div>
          <div className={this.props.classes.fieldvalue}>
          {(this.props.subjectDetails.list || []).map((sub)=>(
            this.findInArraySubname(this.state.subjects,sub)
          ))}
          </div>  
        </div>
        <div className={this.props.classes.field}>
          <div className={this.props.classes.fieldkey}>Question Types</div>
          <div className={this.props.classes.fieldvalue}>
            {this.getQuesTypesString(this.state.queTypes)}
          </div>
        </div>
        <div className={this.props.classes.field}>
          <div className={this.props.classes.fieldkey}>Max Marks</div>
          <div className={this.props.classes.fieldvalue}>{this.state.maxmarks}</div>
        </div>
        <div className={this.props.classes.field}>
          <div className={this.props.classes.fieldkey}>Registration Start Time</div>
          <div className={this.props.classes.fieldvalue}>{this.state.regStartTime}</div>
        </div>
        <div className={this.props.classes.field}>
          <div className={this.props.classes.fieldkey}>Registration End Time</div>
          <div className={this.props.classes.fieldvalue}>{this.state.regEndTime}</div>
        </div>
        <div className={this.props.classes.field}>
          <div className={this.props.classes.fieldkey}>Test Start Time</div>
          <div className={this.props.classes.fieldvalue}>{this.state.startTime}</div>
        </div>
        <div className={this.props.classes.field}>
          <div className={this.props.classes.fieldkey}>Test End Time</div>
          
          <div className={this.props.classes.fieldvalue}>
            {this.state.endTime}
            {Date.parse(this.props.testDetails.test.endTime) > Date.now() && (
              <Button size="small" variant="outlined" color="primary" style={{marginLeft: 15}} onClick={() => this.setState({openEditTime: true})}>Edit Time</Button>
            )}
          </div>

        </div>
        <div className={this.props.classes.field}>
          <div className={this.props.classes.fieldkey}>Test Duration</div>
          <div className={this.props.classes.fieldvalue}>{this.state.duration} minutes</div>
        </div>
        <div className={this.props.classes.field}>
          <div className={this.props.classes.fieldkey}>Result Time</div>
          <div className={this.props.classes.fieldvalue}>{this.state.resultTime}</div>
        </div>
        <Button variant="contained" color="primary" onClick={this.togglePreview} className={this.props.classes.btn}>
          {this.state.showPreview ? "Hide Preview" : "Preview Questions"}
        </Button>
        {this.state.showPreview && this.props.testDetails.previewQuestions && (
          <div style={{textAlign: 'left', marginTop: '20px', borderTop: '1px solid #ccc', paddingTop: '20px'}}>
            <h3>Preview Exam Questions</h3>
            <p>Total Questions Added: {this.props.testDetails.previewTotalQuestions}</p>
            {(this.props.testDetails.previewQuestions || []).map((q, index) => (
              <div key={index} style={{marginBottom: '15px', padding: '10px', border: '1px solid #eee', borderRadius: '5px'}}>
                <p><strong>Q{index + 1}: {q.body}</strong> ({q.marks} Marks)</p>
                <ul>
                  {Array.isArray(q.options) && q.options.map((opt, i) => (
                    <li key={i} style={{color: opt === q.answer ? 'green' : 'black', fontWeight: opt === q.answer ? 'bold' : 'normal'}}>
                      {opt} {opt === q.answer ? "(Correct Answer)" : ""}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      
        {/* ASSIGNED STUDENTS SECTION */}
        <div style={{ marginTop: '40px', textAlign: 'left', padding: '0 20px' }}>
          <Typography variant="h5" gutterBottom>Assigned Students</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Score</strong></TableCell>
                  <TableCell><strong>Reassign End Time</strong></TableCell>
                  <TableCell><strong>Action</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(this.state.assignedStudents || []).map((s, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{s.name}</TableCell>
                    <TableCell>{s.email}</TableCell>
                    <TableCell>{s.completed ? 'Completed' : s.started ? 'In Progress' : 'Not Started'}</TableCell>
                    <TableCell>{s.score}</TableCell>
                    <TableCell>{s.reassignEndTime ? new Date(s.reassignEndTime).toLocaleString() : 'N/A'}</TableCell>
                    <TableCell>
                      <Button variant="contained" color="secondary" size="small" onClick={() => this.setState({
                        openReassign: true, reassignStudentId: s.id, reassignStudentName: s.name, reassignEndTime: ''
                      })}>Reassign</Button>
                    </TableCell>
                  </TableRow>
                ))}
                {(this.state.assignedStudents || []).length === 0 && (
                  <TableRow><TableCell colSpan={6} align="center">No students assigned</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        {/* Edit Time Dialog */}
        <Dialog open={this.state.openEditTime} onClose={() => this.setState({openEditTime: false})} fullWidth>
          <DialogTitle>Edit Test Time</DialogTitle>
          <DialogContent>
            <TextField label="Test Start Time" type="datetime-local" fullWidth margin="dense" 
              value={this.state.editStartTime} onChange={(e) => this.setState({editStartTime: e.target.value})} 
              InputLabelProps={{ shrink: true }} />
            <TextField label="Test End Time" type="datetime-local" fullWidth margin="dense" 
              value={this.state.editEndTime} onChange={(e) => this.setState({editEndTime: e.target.value})} 
              InputLabelProps={{ shrink: true }} />
            <TextField label="Result Declaration Time" type="datetime-local" fullWidth margin="dense" 
              value={this.state.editResultTime} onChange={(e) => this.setState({editResultTime: e.target.value})} 
              InputLabelProps={{ shrink: true }}
              helperText="Set when results become visible to students. Must be after End Time."
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.setState({openEditTime: false})}>Cancel</Button>
            <Button onClick={this.handleEditTimeSave} color="primary">Save</Button>
          </DialogActions>
        </Dialog>

        {/* Reassign Dialog */}
        <Dialog open={this.state.openReassign} onClose={() => this.setState({openReassign: false})} fullWidth>
          <DialogTitle>Reassign Test for {this.state.reassignStudentName}</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="error" gutterBottom>
              Note: Reassigning a test will completely wipe the student's previous answersheet and score, if any.
            </Typography>
            <Typography variant="body2" gutterBottom>
              You must set a new end time for the student to participate in the reassigned test.
            </Typography>
            <TextField 
              label="Extended End Time *" 
              type="datetime-local" 
              fullWidth 
              margin="normal" 
              required
              value={this.state.reassignEndTime} 
              onChange={(e) => this.setState({reassignEndTime: e.target.value})} 
              InputLabelProps={{ shrink: true }}
              helperText="Required: Set a future date and time for this student's exam window."
              error={this.state.openReassign && !this.state.reassignEndTime}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.setState({openReassign: false})}>Cancel</Button>
            <Button 
              onClick={this.handleReassignSave} 
              color="primary"
              disabled={!this.state.reassignEndTime}
            >Confirm Reassign</Button>
          </DialogActions>
        </Dialog>

      </div>
    )
  }
}


const mapStatetoProps = state => ({
  subjectDetails : state.subjectDetails,
  testDetails : state.testDetails
})

export default withStyles(useStyles)(connect(mapStatetoProps,{
  getSubjectDetails,
  setAlert,
  getTestQuestionsForTeacherAction,
  editTestTimeAction,
  reassignStudentTestAction
})(ViewTest));