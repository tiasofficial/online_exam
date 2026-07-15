import React from "react";
import { withStyles } from "@material-ui/styles";
import { connect } from "react-redux";
import { TableBody, TableCell, TableRow, Table, TableHead, TableContainer, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, Checkbox, FormControlLabel, FormGroup } from "@material-ui/core";
import { getTestDetailsFromId, getTestQuestionsForTeacherAction, getAllTestAction } from "../../../redux/actions/teacherTestAction";
import axios from "axios";
import apis from "../../../helper/Apis";
import Auth from "../../../helper/Auth";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const getImageUrl = (path) => {
  if (!path || path === 'null' || path === 'undefined') return '';
  if (path.startsWith('http')) return path;
  return `${apis.BASE}${path}`;
};


const useStyles = (theme)=> ({
  tableBorder:{
    background:'#e7e7e7',
    padding:'15px'
  },
  tableHeader:{
    background:'#3f51b5',
    color:'white'
  }
})

class TestTable extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      previewOpen: false,
      previewTestTitle: "",
      resultsOpen: false,
      resultsData: [],
      resultsTestTitle: "",
      resultsTargetClass: "",
      assignOpen: false,
      assignTestId: null,
      assignTestTitle: "",
      allStudents: [],
      assignedStudentIds: []
    }
  }

  onTestClick(event,id) {
    this.props.getTestDetailsFromId({testid:id});
  }

  onPreviewClick(event, id, title) {
    this.props.getTestQuestionsForTeacherAction({testid: id});
    this.setState({
      previewOpen: true,
      previewTestTitle: title
    });
  }

  handleClose = () => {
    this.setState({ previewOpen: false });
  }

  onResultsClick = async (event, id, title) => {
    try {
      const response = await axios.post(apis.BASE + apis.GET_TEACHER_RESULTS, { testid: id }, {
        headers: { 'Authorization': `Bearer ${Auth.retriveToken()}` }
      });
      if (response.data.success) {
        this.setState({
          resultsOpen: true,
          resultsData: response.data.results,
          resultsTestTitle: response.data.testTitle,
          resultsTargetClass: response.data.targetClass
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  handleResultsClose = () => {
    this.setState({ resultsOpen: false });
  }

  onDownloadPdfClick = async (answersheetId) => {
    try {
      const response = await axios.post(apis.BASE + apis.GET_STUDENT_RESULT_DETAILS_TEACHER, { answersheetId }, {
        headers: { 'Authorization': `Bearer ${Auth.retriveToken()}` }
      });
      if (response.data.success) {
        const data = response.data.result;
        const doc = new jsPDF();
        
        doc.setFontSize(18);
        doc.text(`Test Result: ${data.testTitle}`, 14, 22);
        
        doc.setFontSize(12);
        doc.text(`Student: ${data.studentName} (${data.studentEmail})`, 14, 32);
        doc.text(`Score: ${data.score}`, 14, 40);

        const tableColumn = ["Q No.", "Question", "Correct Answer", "Student's Answer"];
        const tableRows = [];

        if (data.questions && Array.isArray(data.questions)) {
          data.questions.forEach((q, index) => {
            if (!q) return; // Skip if question data is missing
            
            const formatAnswer = (ans) => {
               if(Array.isArray(ans)) return ans.map(a => formatAnswer(a)).join(', ');
               if(!ans) return ans;
               if(typeof ans === 'string' && ans.trim() === '') {
                 let idx = q.options ? q.options.indexOf(ans) : -1;
                 if(idx !== -1) return `Option ${String.fromCharCode(65 + idx)} [Image]`;
                 return '[Image Option]';
               }
               return ans;
            }

            let correctAnswerRaw = q.answer;
            if (q.questionType === 'MULTIPLE' && typeof correctAnswerRaw === 'string') {
               correctAnswerRaw = correctAnswerRaw.split(',');
            }
            let correctAnswer = formatAnswer(correctAnswerRaw);
            let studentAnswer = data.answers && data.answers[index] ? formatAnswer(data.answers[index]) : "Not Answered";
            let bodyText = q.body || '';
            if (bodyText.length > 50) bodyText = bodyText.substring(0, 50) + "...";
            tableRows.push([
              index + 1,
              bodyText,
              correctAnswer,
              studentAnswer
            ]);
          });
        }

        autoTable(doc, {
          head: [tableColumn],
          body: tableRows,
          startY: 50,
          styles: { fontSize: 10 },
          columnStyles: {
            0: { cellWidth: 15 },
            1: { cellWidth: 70 },
            2: { cellWidth: 50 },
            3: { cellWidth: 50 }
          }
        });

        doc.save(`${data.studentName}_${data.testTitle}_Result.pdf`);
      } else {
        alert("Failed to fetch details: " + response.data.message);
      }
    } catch (err) {
      console.error("PDF generation error:", err);
      alert("An error occurred while generating PDF: " + (err.message || err));
    }
  }

  onDeleteClick = async (event, id) => {
    if(window.confirm("Are you sure you want to delete this test?")) {
      try {
        const response = await axios.post(apis.BASE + apis.DELETE_TEST, { testid: id }, {
          headers: { 'Authorization': `Bearer ${Auth.retriveToken()}` }
        });
        if (response.data.success) {
          this.props.getAllTestAction();
        } else {
          alert("Failed to delete test: " + response.data.message);
        }
      } catch (err) { console.log(err); }
    }
  }

  onAssignClick = async (event, id, title) => {
    try {
      const resAll = await axios.get(apis.BASE + apis.GET_ALL_STUDENTS_TEACHER, {
        headers: { 'Authorization': `Bearer ${Auth.retriveToken()}` }
      });
      const resAssigned = await axios.post(apis.BASE + apis.GET_ASSIGNED_STUDENTS, { testid: id }, {
        headers: { 'Authorization': `Bearer ${Auth.retriveToken()}` }
      });
      if(resAll.data.success && resAssigned.data.success) {
        this.setState({
          assignOpen: true,
          assignTestId: id,
          assignTestTitle: title,
          allStudents: resAll.data.students,
          assignedStudentIds: resAssigned.data.studentIds
        });
      }
    } catch(err) { console.log(err); }
  }

  handleAssignClose = () => {
    this.setState({ assignOpen: false });
  }

  handleStudentToggle = (id) => {
    const currentIndex = this.state.assignedStudentIds.indexOf(id);
    const newAssigned = [...this.state.assignedStudentIds];
    if (currentIndex === -1) {
      newAssigned.push(id);
    } else {
      newAssigned.splice(currentIndex, 1);
    }
    this.setState({ assignedStudentIds: newAssigned });
  }

  saveAssignments = async () => {
    try {
      const response = await axios.post(apis.BASE + apis.ASSIGN_STUDENTS, { 
        testid: this.state.assignTestId, 
        studentIds: this.state.assignedStudentIds 
      }, {
        headers: { 'Authorization': `Bearer ${Auth.retriveToken()}` }
      });
      if(response.data.success) {
        this.setState({ assignOpen: false });
        alert("Assignments saved successfully");
      } else {
        alert("Failed to save assignments: " + response.data.message);
      }
    } catch(err) { console.log(err); }
  }

  render() {
    return(<div className={this.props.classes.tableBorder}>
      <TableContainer component={Paper} className={this.props.classes.table}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead >
            <TableRow>
              <TableCell className={this.props.classes.tableHeader}>No.</TableCell>
              <TableCell align="left" className={this.props.classes.tableHeader}>Test</TableCell>
              <TableCell className={this.props.classes.tableHeader}>Status</TableCell>
              <TableCell className={this.props.classes.tableHeader}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.testlist.map((test,index)=>(
              <TableRow key={index}>
                <TableCell>{index+1}</TableCell>
                <TableCell onClick={(event)=>(this.onTestClick(event,test._id))} style={{cursor:'pointer', color:'blue', textDecoration:'underline'}}>{test.title}</TableCell>
                <TableCell>{test.status}</TableCell>
                <TableCell>
                  <Button variant="outlined" color="primary" onClick={(event) => this.onPreviewClick(event, test._id, test.title)} style={{marginRight: '10px'}}>
                    Preview
                  </Button>
                  <Button variant="outlined" color="primary" onClick={(event) => this.onAssignClick(event, test._id, test.title)} style={{marginRight: '10px'}}>
                    Assign Students
                  </Button>
                  {test.status === 'TEST_STARTED' || test.status === 'TEST_COMPLETE' || test.status === 'RESULT_DECLARED' ? (
                    <Button variant="outlined" color="secondary" onClick={(event) => this.onResultsClick(event, test._id, test.title)} style={{marginRight: '10px'}}>
                      Results
                    </Button>
                  ) : null}
                  <Button variant="outlined" style={{color: 'red', borderColor: 'red'}} onClick={(event) => this.onDeleteClick(event, test._id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
      </TableContainer>
      
      <Dialog open={this.state.previewOpen} onClose={this.handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Preview Questions - {this.state.previewTestTitle}</DialogTitle>
        <DialogContent dividers>
          {this.props.previewQuestions && this.props.previewQuestions.length > 0 ? (
            <div>
              <p>Total Questions Added: {this.props.previewTotalQuestions}</p>
              {this.props.previewQuestions.map((q, index) => (
                <div key={index} style={{marginBottom: '15px', padding: '10px', border: '1px solid #eee', borderRadius: '5px'}}>
                  <p><strong>Q{index + 1}: {q.body}</strong> ({q.marks} Marks)</p>
                  {q.bodyImage && q.bodyImage !== 'null' && q.bodyImage !== 'undefined' && q.bodyImage.trim() !== '' && (
                    <img src={getImageUrl(q.bodyImage)} alt="Question Image" style={{maxWidth: '100%', maxHeight: '200px', display: 'block', margin: '10px 0'}} />
                  )}
                  <ul>
                    {q.options.map((opt, i) => (
                      <li key={i} style={{color: opt === q.answer ? 'green' : 'black', fontWeight: opt === q.answer ? 'bold' : 'normal', marginBottom: '10px'}}>
                        {opt} {opt === q.answer ? "(Correct Answer)" : ""}
                        {q.optionImages && q.optionImages[i] && q.optionImages[i] !== 'null' && q.optionImages[i] !== 'undefined' && q.optionImages[i].trim() !== '' && (
                          <img src={getImageUrl(q.optionImages[i])} alt={`Option ${i+1}`} style={{maxWidth: '150px', maxHeight: '150px', display: 'block', marginTop: '5px'}} />
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p>No questions found for this test.</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={this.state.resultsOpen} onClose={this.handleResultsClose} maxWidth="md" fullWidth>
        <DialogTitle>Results - {this.state.resultsTestTitle} ({this.state.resultsTargetClass})</DialogTitle>
        <DialogContent dividers>
          {this.state.resultsData && this.state.resultsData.length > 0 ? (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Rank</strong></TableCell>
                  <TableCell><strong>Student Name</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>Score</strong></TableCell>
                  <TableCell><strong>Action</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.resultsData.map((res) => (
                  <TableRow key={res._id}>
                    <TableCell>{res.rank}</TableCell>
                    <TableCell>{res.studentName}</TableCell>
                    <TableCell>{res.studentEmail}</TableCell>
                    <TableCell>{res.score}</TableCell>
                    <TableCell>
                      <Button variant="outlined" color="primary" size="small" onClick={() => this.onDownloadPdfClick(res._id)}>
                        Download PDF
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>No results found for this test.</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleResultsClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={this.state.assignOpen} onClose={this.handleAssignClose} maxWidth="sm" fullWidth>
        <DialogTitle>Assign Students - {this.state.assignTestTitle}</DialogTitle>
        <DialogContent dividers>
          <FormGroup>
            {this.state.allStudents.map(student => (
              <FormControlLabel
                key={student.id}
                control={
                  <Checkbox 
                    checked={this.state.assignedStudentIds.indexOf(student.id) !== -1}
                    onChange={() => this.handleStudentToggle(student.id)}
                    color="primary"
                  />
                }
                label={`${student.name} (${student.email})`}
              />
            ))}
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleAssignClose}>Cancel</Button>
          <Button onClick={this.saveAssignments} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </div>)
  }
}

const mapStatetoProps = state => ({
  testlist : state.testDetails.list,
  previewQuestions: state.testDetails.previewQuestions,
  previewTotalQuestions: state.testDetails.previewTotalQuestions
})

export default withStyles(useStyles)(connect(mapStatetoProps,{
  getTestDetailsFromId,
  getTestQuestionsForTeacherAction,
  getAllTestAction
})(TestTable));
