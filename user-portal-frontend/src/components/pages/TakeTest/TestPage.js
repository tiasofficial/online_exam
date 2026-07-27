import { Button, withStyles, Avatar, Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";
import { AppBar, Toolbar } from "@material-ui/core";
import Timer from "../../molecues/TestView/Timer";
import QuestionList from "../../molecues/TestView/QuestionList";
import TestQuestion from "../../molecues/TestView/TestQuestion";
import AlertBox from '../../atoms/Alertbox/AlertBox';
import { endTestAction, saveAnswerAction, selectedOptionAction } from "../../../redux/actions/takeTestAction";
import { setAlert } from "../../../redux/actions/alertAction";

const useStyles = (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  topBar: {
    backgroundColor: '#3b5998', 
    minHeight: '40px !important',
    padding: '0 15px',
  },
  subBar: {
    backgroundColor: '#f5f5f5',
    borderBottom: '1px solid #ccc',
    padding: '0 15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: '40px',
  },
  mainArea: {
    display: 'flex',
    flexGrow: 1,
    overflow: 'hidden',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      overflow: 'auto',
    }
  },
  leftPanel: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid #ccc',
    [theme.breakpoints.down('sm')]: {
      borderRight: 'none',
      borderBottom: '1px solid #ccc',
      minHeight: '60vh',
    }
  },
  rightPanel: {
    width: '400px',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f5f5f5',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    }
  },
  tabsStrip: {
    display: 'flex',
    borderBottom: '1px solid #ccc',
    padding: '5px 15px 0 15px',
  },
  activeTab: {
    backgroundColor: '#4a90e2',
    color: '#fff',
    padding: '8px 15px',
    borderTopLeftRadius: '5px',
    borderTopRightRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  inactiveTab: {
    backgroundColor: '#eee',
    color: '#333',
    padding: '8px 15px',
    borderTopLeftRadius: '5px',
    borderTopRightRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    marginLeft: '5px',
  },
  questionContent: {
    flexGrow: 1,
    overflowY: 'auto',
    padding: '20px',
  },
  bottomActions: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 20px',
    borderTop: '1px solid #ccc',
    backgroundColor: '#f9f9f9',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      gap: '10px',
      padding: '10px',
    }
  },
  submitBtn: {
    backgroundColor: '#4a90e2',
    color: '#fff',
    width: '100%',
    borderRadius: 0,
    padding: '15px 0',
    fontSize: '18px',
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: '#357abd',
    },
    [theme.breakpoints.down('sm')]: {
      padding: '10px 0',
      fontSize: '16px',
    }
  },
  actionButton: {
    textTransform: 'none',
    fontWeight: 'bold',
    borderColor: '#ccc',
    fontSize: '18px',
    padding: '10px 20px',
    flexGrow: 1,
    [theme.breakpoints.down('sm')]: {
      fontSize: '14px',
      padding: '6px 10px',
    }
  },
  actionButtonPrimary: {
    textTransform: 'none',
    fontWeight: 'bold',
    fontSize: '18px',
    padding: '10px 20px',
    flexGrow: 1,
    [theme.breakpoints.down('sm')]: {
      fontSize: '14px',
      padding: '6px 10px',
    }
  },
  userInfoBox: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #ccc',
    [theme.breakpoints.down('sm')]: {
      padding: '8px',
    }
  },
  userAvatar: {
    width: 80,
    height: 80,
    marginRight: 15,
    [theme.breakpoints.down('sm')]: {
      width: 40,
      height: 40,
      marginRight: 10,
    }
  }
});

class TestPage extends React.Component {
  constructor(props) {
    super(props);
    let initialStatuses = [];
    let initialTimeSpent = [];
    let initialRevisits = [];
    
    if (this.props.taketest && this.props.taketest.answersheet && this.props.taketest.answersheet.answers) {
      const numQuestions = this.props.taketest.answersheet.answers.length;
      initialStatuses = this.props.taketest.answersheet.answers.map(ans => ans !== null ? 2 : 0);
      if (initialStatuses.length > 0 && initialStatuses[0] === 0) {
        initialStatuses[0] = 1; // Mark first as Not Answered (visited)
      }
      
      initialTimeSpent = Array(numQuestions).fill(0);
      initialRevisits = Array(numQuestions).fill(0);
      if (numQuestions > 0) {
        initialRevisits[0] = 1; // First question is visited initially
      }
    }

    this.state = {
      curIndex: 0,
      questionStatuses: initialStatuses,
      timeSpent: initialTimeSpent,
      revisitCounts: initialRevisits,
      lastSwitchTime: Date.now(),
      rulesDialogOpen: true
    };

    this.handleContextMenu = this.handleContextMenu.bind(this);
    this.handleCopy = this.handleCopy.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.setCurIndex = this.setCurIndex.bind(this);
    this.handleSaveNext = this.handleSaveNext.bind(this);
    this.handleMarkForReview = this.handleMarkForReview.bind(this);
    this.handleClearResponse = this.handleClearResponse.bind(this);
  }

  handleContextMenu = (e) => { e.preventDefault(); }

  handleKeyDown = (e) => {
    if (e.key === 'PrintScreen') {
      e.preventDefault(); 
      this.props.setAlert({
        isAlert: true,
        type: "error",
        title: "Copying or taking screenshots is disabled during the test."
      });
    }
  }

  handleCopy = (e) => {
    if (window.location.pathname === '/takeTestPage') {
      e.preventDefault();
      this.props.setAlert({
        isAlert: true,
        type: "error",
        title: "Copying or taking screenshots is disabled during the test."
      });
    }
  }

  handleVisibilityChange = () => {
    if (document.hidden) {
      this.props.setAlert({
        isAlert: true,
        type: "warning",
        title: "Warning: You have switched tabs or minimized the window during the test!"
      });
    }
  }

  componentDidMount() {
    try {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(err => console.log("Fullscreen request failed:", err));
      }
    } catch (e) {
      console.log(e);
    }
    document.addEventListener("contextmenu", this.handleContextMenu);
    document.addEventListener("copy", this.handleCopy);
    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("visibilitychange", this.handleVisibilityChange);

    const testClassName = this.props.taketest?.test?.class?.name;
    if (testClassName === 'JEE-Mains' || testClassName === 'NEET') {
      this.setState({ rulesDialogOpen: true });
    }
  }

  componentWillUnmount() {
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(err => console.log("Exit fullscreen failed:", err));
      }
    } catch (e) {
      console.log(e);
    }
    document.removeEventListener("contextmenu", this.handleContextMenu);
    document.removeEventListener("copy", this.handleCopy);
    document.removeEventListener("keydown", this.handleKeyDown);
    document.removeEventListener("visibilitychange", this.handleVisibilityChange);
  }

  updateCurrentStatusAndGoNext(newStatus) {
    const { curIndex, questionStatuses, timeSpent, revisitCounts, lastSwitchTime } = this.state;
    const newStatuses = [...questionStatuses];
    newStatuses[curIndex] = newStatus;
    
    const newTimeSpent = [...timeSpent];
    newTimeSpent[curIndex] += Math.floor((Date.now() - lastSwitchTime) / 1000);

    let nextIndex = curIndex + 1;
    if (nextIndex >= this.props.taketest.answersheet.answers.length) {
      nextIndex = 0; // Wrap around
    }
    
    const newRevisits = [...revisitCounts];
    if (nextIndex !== curIndex) {
      newRevisits[nextIndex] += 1;
    }
    
    if (newStatuses[nextIndex] === 0) {
      newStatuses[nextIndex] = 1; // Mark next as visited (Not Answered)
    }

    this.setState({
      questionStatuses: newStatuses,
      curIndex: nextIndex,
      timeSpent: newTimeSpent,
      revisitCounts: newRevisits,
      lastSwitchTime: Date.now()
    }, () => {
      this.props.saveAnswerAction(this.state.timeSpent, this.state.revisitCounts); // Save answer to backend
    });
  }

  handleSaveNext() {
    const isAnswered = this.props.taketest.answersheet.answers[this.state.curIndex] !== null;
    this.updateCurrentStatusAndGoNext(isAnswered ? 2 : 1);
  }

  handleSaveAndMarkForReview = () => {
    const isAnswered = this.props.taketest.answersheet.answers[this.state.curIndex] !== null;
    if(!isAnswered) {
      this.props.setAlert({
        isAlert: true,
        type: "warning",
        title: "Please select an answer first to Save & Mark for Review. Otherwise use 'Mark for Review & Next'."
      });
      return;
    }
    this.updateCurrentStatusAndGoNext(4);
  }

  handleMarkForReview() {
    // If they click Mark for review & next, we don't save their option if it's supposed to be purely marked for review.
    // Or we save it as 3 (Marked for review without answering).
    // Actually, in JEE, Mark for Review & Next clears the response if you don't explicitly save it, but let's just mark it as 3.
    this.updateCurrentStatusAndGoNext(3);
  }

  handleClearResponse() {
    this.props.selectedOptionAction({ index: this.state.curIndex, ans: null });
    const newStatuses = [...this.state.questionStatuses];
    newStatuses[this.state.curIndex] = 1;
    this.setState({ questionStatuses: newStatuses });
  }

  setCurIndex(x) {
    if (x === this.state.curIndex) return;

    const { curIndex, questionStatuses, timeSpent, revisitCounts, lastSwitchTime } = this.state;
    
    const newTimeSpent = [...timeSpent];
    newTimeSpent[curIndex] += Math.floor((Date.now() - lastSwitchTime) / 1000);
    
    const newRevisits = [...revisitCounts];
    newRevisits[x] += 1;

    const newStatuses = [...questionStatuses];
    if (newStatuses[x] === 0) {
      newStatuses[x] = 1; // Mark as visited
    }
    this.setState({
      curIndex: x,
      questionStatuses: newStatuses,
      timeSpent: newTimeSpent,
      revisitCounts: newRevisits,
      lastSwitchTime: Date.now()
    });
  }

  endtest() {
    const { curIndex, timeSpent, lastSwitchTime, revisitCounts } = this.state;
    const newTimeSpent = [...timeSpent];
    newTimeSpent[curIndex] += Math.floor((Date.now() - lastSwitchTime) / 1000);
    
    this.setState({ timeSpent: newTimeSpent, lastSwitchTime: Date.now() }, () => {
      this.props.endTestAction(this.state.timeSpent, this.state.revisitCounts);
    });
  }

  handleAutoSave = () => {
    const { curIndex, timeSpent, lastSwitchTime, revisitCounts } = this.state;
    const newTimeSpent = [...timeSpent];
    newTimeSpent[curIndex] += Math.floor((Date.now() - lastSwitchTime) / 1000);
    
    this.setState({ timeSpent: newTimeSpent, lastSwitchTime: Date.now() }, () => {
      this.props.saveAnswerAction(this.state.timeSpent, this.state.revisitCounts);
    });
  }

  render() {
    const { classes, taketest, user } = this.props;
    if (taketest.isRetrived === false) {
      return (<Navigate to='/' />);
    }
    
    var timerTime = taketest.test.duration * 1000 - (Date.now() - Date.parse(taketest.answersheet.startTime));
    const testSubject = taketest.test.title; 

    return (
      <div className={classes.root} style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}>
        {/* TOP BAR */}
        <Box display="flex" justifyContent="flex-end" alignItems="center" className={classes.topBar} color="white">
          <Box display="flex" gap="10px">
            <Button style={{color: 'white', textTransform: 'none'}} size="small">Question Paper</Button>
            <Button style={{color: 'white', textTransform: 'none'}} size="small" onClick={() => this.setState({ rulesDialogOpen: true })}>Instructions</Button>
          </Box>
        </Box>

        {/* SUB BAR */}
        <div className={classes.subBar}>
          <div style={{display: 'flex', gap: '5px', alignItems: 'center'}}>
            <div className={classes.activeTab} style={{borderTopLeftRadius: '0px', borderTopRightRadius: '0px'}}>{testSubject}</div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', fontWeight: 'bold'}}>
            Time Left: &nbsp; <Timer time={timerTime} onAutoSave={this.handleAutoSave} onTimeout={() => this.endtest()} />
          </div>
        </div>

        {/* MAIN LAYOUT */}
        <div className={classes.mainArea} style={{ userSelect: 'none' }}>
          <Dialog open={this.state.rulesDialogOpen} onClose={() => this.setState({ rulesDialogOpen: false })} maxWidth="md" fullWidth>
            <DialogTitle style={{ backgroundColor: '#0f172a', color: '#fff' }}>
              Exam Instructions: {this.props.taketest?.test?.title || 'Online Test'}
            </DialogTitle>
            <DialogContent dividers style={{ padding: '24px', backgroundColor: '#f8fafc' }}>
              {(() => {
                const className = (this.props.taketest?.test?.class?.name || 
                                   this.props.taketest?.test?.targetClass?.name || 
                                   this.props.taketest?.test?.targetClassName || '').toLowerCase();
                const isJee = className.includes('jee');
                const isNeet = className.includes('neet');
                const totalQ = this.props.taketest?.test?.questions?.length || 0;
                const durationMins = (this.props.taketest?.test?.duration || 0) / 60;

                if (isJee) {
                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <Typography variant="h6" style={{ color: '#0f172a', fontWeight: 'bold' }}>JEE-Mains Exam Pattern</Typography>
                      <div style={{ backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '16px' }}>
                        <Typography variant="subtitle2" style={{ color: '#2563eb', fontWeight: 'bold' }}>Physics (Q 1 - 25)</Typography>
                        <Typography variant="body2" style={{ color: '#475569' }}>• Q 1 - 20: Single Choice (+4 Correct / -1 Incorrect)</Typography>
                        <Typography variant="body2" style={{ color: '#475569' }}>• Q 21 - 25: Integer / Numerical Answer (+4 Correct / -1 Incorrect)</Typography>
                      </div>
                      <div style={{ backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '16px' }}>
                        <Typography variant="subtitle2" style={{ color: '#059669', fontWeight: 'bold' }}>Chemistry (Q 26 - 50)</Typography>
                        <Typography variant="body2" style={{ color: '#475569' }}>• Q 26 - 45: Single Choice (+4 Correct / -1 Incorrect)</Typography>
                        <Typography variant="body2" style={{ color: '#475569' }}>• Q 46 - 50: Integer / Numerical Answer (+4 Correct / -1 Incorrect)</Typography>
                      </div>
                      <div style={{ backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '16px' }}>
                        <Typography variant="subtitle2" style={{ color: '#d97706', fontWeight: 'bold' }}>Mathematics (Q 51 - 75)</Typography>
                        <Typography variant="body2" style={{ color: '#475569' }}>• Q 51 - 70: Single Choice (+4 Correct / -1 Incorrect)</Typography>
                        <Typography variant="body2" style={{ color: '#475569' }}>• Q 71 - 75: Integer / Numerical Answer (+4 Correct / -1 Incorrect)</Typography>
                      </div>
                      <div style={{ backgroundColor: '#fef3c7', borderLeft: '4px solid #f59e0b', padding: '12px 16px', borderRadius: '4px' }}>
                        <Typography variant="body2" style={{ color: '#92400e', fontWeight: '500' }}>
                          <strong>Important Rules:</strong> Do not copy or switch tabs/windows. System warnings will be recorded. Click <strong>Submit Test</strong> when finished.
                        </Typography>
                      </div>
                    </div>
                  );
                } else if (isNeet) {
                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <Typography variant="h6" style={{ color: '#0f172a', fontWeight: 'bold' }}>NEET Exam Pattern</Typography>
                      <div style={{ backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '16px' }}>
                        <Typography variant="subtitle2" style={{ color: '#2563eb', fontWeight: 'bold' }}>Physics (Q 1 - 45)</Typography>
                        <Typography variant="body2" style={{ color: '#475569' }}>• 45 Single Choice Questions (+4 Correct / -1 Incorrect)</Typography>
                      </div>
                      <div style={{ backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '16px' }}>
                        <Typography variant="subtitle2" style={{ color: '#059669', fontWeight: 'bold' }}>Chemistry (Q 46 - 90)</Typography>
                        <Typography variant="body2" style={{ color: '#475569' }}>• 45 Single Choice Questions (+4 Correct / -1 Incorrect)</Typography>
                      </div>
                      <div style={{ backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '16px' }}>
                        <Typography variant="subtitle2" style={{ color: '#d97706', fontWeight: 'bold' }}>Biology (Q 91 - 180)</Typography>
                        <Typography variant="body2" style={{ color: '#475569' }}>• 90 Single Choice Questions (+4 Correct / -1 Incorrect)</Typography>
                      </div>
                      <div style={{ backgroundColor: '#fef3c7', borderLeft: '4px solid #f59e0b', padding: '12px 16px', borderRadius: '4px' }}>
                        <Typography variant="body2" style={{ color: '#92400e', fontWeight: '500' }}>
                          <strong>Important Rules:</strong> Do not copy or switch tabs/windows. System warnings will be recorded. Click <strong>Submit Test</strong> when finished.
                        </Typography>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <Typography variant="h6" style={{ color: '#0f172a', fontWeight: 'bold' }}>General Exam Instructions</Typography>
                      <div style={{ backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '16px' }}>
                        <Typography variant="subtitle2" style={{ color: '#0369a1', fontWeight: 'bold' }}>Test Summary & Structure</Typography>
                        <Typography variant="body2" style={{ color: '#475569', marginTop: '4px' }}>• <strong>Total Questions:</strong> {totalQ || 'As displayed on screen'}</Typography>
                        {durationMins > 0 && <Typography variant="body2" style={{ color: '#475569' }}>• <strong>Duration:</strong> {durationMins} Minutes</Typography>}
                        <Typography variant="body2" style={{ color: '#475569' }}>• <strong>Marking Scheme:</strong> Each question carries marks as assigned. Read each question carefully before submitting.</Typography>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
                      <div style={{ backgroundColor: '#fef3c7', borderLeft: '4px solid #f59e0b', padding: '12px 16px', borderRadius: '4px' }}>
                        <Typography variant="body2" style={{ color: '#92400e', fontWeight: '500' }}>
                          <strong>Proctoring Notice:</strong> Do not leave full-screen mode or switch browser tabs. Warnings will be issued and logged automatically. Make sure to click <strong>Submit Test</strong> when you are done.
                        </Typography>
                      </div>
                    </div>
                  );
                }
              })()}
            </DialogContent>
            <DialogActions style={{ padding: '16px 24px', backgroundColor: '#f1f5f9' }}>
              <Button onClick={() => this.setState({ rulesDialogOpen: false })} color="primary" variant="contained" disableElevation>
                I am ready to begin
              </Button>
            </DialogActions>
          </Dialog>

          {/* LEFT PANEL */}
          <div className={classes.leftPanel}>
            
            <div className={classes.questionContent}>
              <AlertBox />
              <TestQuestion 
                question={this.state.curIndex} 
                answer={taketest.answersheet.answers[this.state.curIndex]}
              />
            </div>

            <div className={classes.bottomActions}>
              <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                <Button variant="outlined" onClick={this.handleMarkForReview} className={classes.actionButton}>Mark for Review & Next</Button>
                <Button variant="outlined" onClick={this.handleClearResponse} className={classes.actionButton}>Clear Response</Button>
              </div>
              <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                <Button variant="contained" style={{backgroundColor: '#7b1fa2', color: 'white'}} onClick={this.handleSaveAndMarkForReview} className={classes.actionButtonPrimary}>Save & Mark for Review</Button>
                <Button variant="contained" style={{backgroundColor: '#4caf50', color: 'white'}} onClick={this.handleSaveNext} className={classes.actionButtonPrimary}>Save & Next</Button>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className={classes.rightPanel}>
            <Box className={classes.userInfoBox}>
              <Avatar className={classes.userAvatar} />
              <Typography variant="h6" style={{fontWeight: 'bold', color: '#333'}}>
                {user.username}
              </Typography>
            </Box>
            
            <QuestionList 
              answers={taketest.answersheet.answers} 
              questionStatuses={this.state.questionStatuses}
              callback={this.setCurIndex} 
              curIndex={this.state.curIndex}
              subject={testSubject}
            />

            <Button className={classes.submitBtn} onClick={() => this.endtest()}>
              Submit Test
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStatetoProps = state => ({
  user: state.user,
  taketest: state.takeTestDetails
})
export default withStyles(useStyles)(connect(mapStatetoProps, {
  endTestAction,
  saveAnswerAction,
  selectedOptionAction,
  setAlert
})(TestPage));