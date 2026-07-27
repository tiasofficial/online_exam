import React from "react";
import { withStyles } from "@material-ui/styles";
import { connect } from "react-redux";
import { getUpcomingTestsStudentAction } from "../../../redux/actions/studentTestAction";
import { Button, Typography } from "@material-ui/core";
import { TableBody, TableCell, TableRow, Table, TableContainer, Paper } from "@material-ui/core";
import { getDatePretty, getTimePretty } from "../../../helper/common";
import { setAlert } from "../../../redux/actions/alertAction";
import { startTestAction } from "../../../redux/actions/takeTestAction";
import { Navigate } from "react-router-dom";

const useStyles = (theme)=> ({
  tableBorder:{
    background:'#f0f2f5',
    padding:'15px',
    [theme.breakpoints.down('xs')]: {
      padding: '8px',
    }
  },
  tableHeader:{
    background:'#3f51b5',
    color:'white'
  },
  // Mobile card view for test details
  detailCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    border: '1px solid #e8e8e8',
  },
  detailHeader: {
    background: 'linear-gradient(135deg, #3f51b5, #5c6bc0)',
    padding: '16px 20px',
    [theme.breakpoints.down('xs')]: {
      padding: '14px 16px',
    }
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 20px',
    borderBottom: '1px solid #f0f0f0',
    '&:last-child': {
      borderBottom: 'none',
    },
    [theme.breakpoints.down('xs')]: {
      padding: '12px 16px',
    }
  },
  detailLabel: {
    fontSize: '13px',
    color: '#8c8c8c',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  detailValue: {
    fontSize: '15px',
    color: '#333',
    fontWeight: '600',
    textAlign: 'right',
    maxWidth: '60%',
  },
  actionArea: {
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    [theme.breakpoints.down('xs')]: {
      padding: '12px 16px',
    }
  },
  startBtn: {
    borderRadius: '10px',
    textTransform: 'none',
    fontWeight: '700',
    padding: '14px',
    fontSize: '16px',
  },
  backBtn: {
    borderRadius: '10px',
    textTransform: 'none',
    fontWeight: '600',
    padding: '12px',
    fontSize: '14px',
  }
})

class TakeTestStudent extends React.Component {
  constructor(props){
    super(props);
    this.state = {}
  }

  goBack() {
    this.props.getUpcomingTestsStudentAction();
  }

  onStartTest(event,test) {
    if(test.status==='TEST_STARTED'){
      console.log("start test "+test._id);
      
      try {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(err => console.log("Fullscreen request failed:", err));
        }
      } catch (e) {
        console.log(e);
      }

      this.props.startTestAction({testid:test._id},test);

    } else {
      this.props.setAlert({
        isAlert : true,
        type : "info",
        title : "Not Started"
      })
    }
    
  }

  render() {
    if(this.props.isTestStarted) {
      console.log('test started');
      return (<Navigate to='/takeTestPage'/>);
    }
    var test = this.props.test;
    return(<div className={this.props.classes.tableBorder}>
      <div className={this.props.classes.detailCard}>
        <div className={this.props.classes.detailHeader}>
          <Typography variant="h6" style={{ color: '#fff', fontWeight: '700', fontSize: '18px' }}>
            {test.title}
          </Typography>
        </div>
        
        <div className={this.props.classes.detailRow}>
          <span className={this.props.classes.detailLabel}>Status</span>
          <span className={this.props.classes.detailValue} style={{ 
            color: test.status === 'TEST_STARTED' ? '#2e7d32' : '#e65100',
            textTransform: 'lowercase'
          }}>{test.status}</span>
        </div>
        <div className={this.props.classes.detailRow}>
          <span className={this.props.classes.detailLabel}>Total Marks</span>
          <span className={this.props.classes.detailValue}>{test.maxmarks}</span>
        </div>
        <div className={this.props.classes.detailRow}>
          <span className={this.props.classes.detailLabel}>Duration</span>
          <span className={this.props.classes.detailValue}>{getTimePretty(test.duration)}</span>
        </div>
        <div className={this.props.classes.detailRow}>
          <span className={this.props.classes.detailLabel}>Test Start</span>
          <span className={this.props.classes.detailValue}>{getDatePretty(test.startTime)}</span>
        </div>
        <div className={this.props.classes.detailRow}>
          <span className={this.props.classes.detailLabel}>Test End</span>
          <span className={this.props.classes.detailValue}>{getDatePretty(test.endTime)}</span>
        </div>
        <div className={this.props.classes.detailRow}>
          <span className={this.props.classes.detailLabel}>Result Time</span>
          <span className={this.props.classes.detailValue}>{getDatePretty(test.resultTime)}</span>
        </div>

        <div className={this.props.classes.actionArea}>
          <Button
            variant="contained"
            color="primary"
            className={this.props.classes.startBtn}
            onClick={(event)=>(this.onStartTest(event,test))}
          >
            Start Test
          </Button>
          <Button 
            variant="outlined" 
            className={this.props.classes.backBtn}
            onClick={(event)=>(this.goBack(event))}
          >
            Back
          </Button>
        </div>
      </div>
    </div>)
  }
}

const mapStatetoProps = state => ({
  test : state.testDetails.test,
  isTestStarted : state.takeTestDetails.isRetrived
})

export default withStyles(useStyles)(connect(mapStatetoProps,{
  getUpcomingTestsStudentAction,
  setAlert,
  startTestAction
})(TakeTestStudent))