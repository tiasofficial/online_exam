import { Button, withStyles } from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Avatar, Box } from "@material-ui/core";
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
    if (this.props.taketest && this.props.taketest.answersheet && this.props.taketest.answersheet.answers) {
      initialStatuses = this.props.taketest.answersheet.answers.map(ans => ans !== null ? 2 : 0);
      if (initialStatuses.length > 0 && initialStatuses[0] === 0) {
        initialStatuses[0] = 1; // Mark first as Not Answered (visited)
      }
    }

    this.state = {
      curIndex: 0,
      questionStatuses: initialStatuses,
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
    const { curIndex, questionStatuses } = this.state;
    const newStatuses = [...questionStatuses];
    newStatuses[curIndex] = newStatus;
    
    let nextIndex = curIndex + 1;
    if (nextIndex >= this.props.taketest.answersheet.answers.length) {
      nextIndex = 0; // Wrap around
    }
    
    if (newStatuses[nextIndex] === 0) {
      newStatuses[nextIndex] = 1; // Mark next as visited (Not Answered)
    }

    this.setState({
      questionStatuses: newStatuses,
      curIndex: nextIndex
    }, () => {
      this.props.saveAnswerAction(); // Save answer to backend
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
    const newStatuses = [...this.state.questionStatuses];
    if (newStatuses[x] === 0) {
      newStatuses[x] = 1; // Mark as visited
    }
    this.setState({
      curIndex: x,
      questionStatuses: newStatuses
    });
  }

  endtest() {
    this.props.endTestAction();
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
            <Button style={{color: 'white', textTransform: 'none'}} size="small">Instructions</Button>
          </Box>
        </Box>

        {/* SUB BAR */}
        <div className={classes.subBar}>
          <div style={{display: 'flex', gap: '5px', alignItems: 'center'}}>
            <div className={classes.activeTab} style={{borderTopLeftRadius: '0px', borderTopRightRadius: '0px'}}>{testSubject}</div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', fontWeight: 'bold'}}>
            Time Left: &nbsp; <Timer time={timerTime} />
          </div>
        </div>

        {/* MAIN LAYOUT */}
        <div className={classes.mainArea} style={{ userSelect: 'none' }}>
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