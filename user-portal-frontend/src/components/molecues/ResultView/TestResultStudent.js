import { withStyles } from "@material-ui/styles";
import React from "react";
import { connect } from "react-redux";
import { Button, Typography, Chip } from "@material-ui/core";
import { getCompletedTestsStudentAction } from "../../../redux/actions/studentTestAction";
import { TableCell, TableContainer, Table, TableBody, TableRow, Paper, TableHead } from "@material-ui/core";
import TestResultViewQuestions from "./TestResultViewQuestions";
import { setAlert } from "../../../redux/actions/alertAction";
import html2pdf from "html2pdf.js";
import axios from "axios";
import apis from "../../../helper/Apis";
import Auth from "../../../helper/Auth";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';

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
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    border: '1px solid #e8e8e8',
  },
  resultHeader: {
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
      flexWrap: 'wrap',
      gap: '4px',
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
    [theme.breakpoints.down('xs')]: {
      fontSize: '14px',
      maxWidth: '100%',
      textAlign: 'right',
    }
  },
  actionArea: {
    padding: '16px 20px',
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    [theme.breakpoints.down('xs')]: {
      padding: '12px 16px',
      flexDirection: 'column',
    }
  },
  actionBtn: {
    borderRadius: '10px',
    textTransform: 'none',
    fontWeight: '600',
    padding: '12px 20px',
    fontSize: '14px',
    flex: 1,
    [theme.breakpoints.down('xs')]: {
      flex: 'unset',
      width: '100%',
    }
  },
  leaderboardSection: {
    marginTop: '20px',
    [theme.breakpoints.down('xs')]: {
      marginTop: '16px',
    }
  },
  leaderboardTitle: {
    color: '#3f51b5',
    fontWeight: '700',
    fontSize: '18px',
    marginBottom: '12px',
    [theme.breakpoints.down('xs')]: {
      fontSize: '16px',
      marginBottom: '8px',
    }
  },
  leaderboardTable: {
    overflowX: 'auto',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  rankBadge: {
    fontWeight: '800',
    fontSize: '20px',
    color: '#3f51b5',
    [theme.breakpoints.down('xs')]: {
      fontSize: '16px',
    }
  },
  // Mobile leaderboard cards
  leaderboardCard: {
    display: 'none',
    [theme.breakpoints.down('xs')]: {
      display: 'block',
    }
  },
  leaderboardDesktop: {
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    }
  },
  lbCard: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '12px 16px',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    border: '1px solid #f0f0f0',
  },
  lbRank: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#e8eaf6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '800',
    fontSize: '14px',
    color: '#3f51b5',
    marginRight: '12px',
    flexShrink: 0,
  },
  lbName: {
    flex: 1,
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
  },
  lbScore: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#3f51b5',
    marginLeft: '8px',
  },
  chartSection: {
    marginTop: '20px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    border: '1px solid #e8e8e8',
    [theme.breakpoints.down('xs')]: {
      padding: '14px',
    }
  }
})

class TestResultStudent extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      toggleViewQue : false
    }
  }

  onViewQuestions(event, result){
    if(result.status !== 'RESULT_DECLARED') {
      this.props.setAlert({
        type : 'info',
        title:'No Result',
        message : 'test result is not declared'
      })
      return;
    }
    this.setState({
      ...this.state,
      toggleViewQue : !this.state.toggleViewQue
    })
  }

  goBack() {
    this.props.getCompletedTestsStudentAction();
  }

  downloadPDF() {
    if (!this.state.toggleViewQue) {
      this.props.setAlert({
        type: 'info',
        title: 'Please view questions first',
        message: 'Please click "View Questions" to load the questions layout before downloading the PDF.'
      });
      return;
    }

    const element = document.getElementById('pdf-content');
    const actions = document.getElementById('pdf-actions');
    
    // Hide action buttons during PDF generation
    if (actions) actions.style.display = 'none';

    const testTitle = (this.props.test.title || "Result").replace(/\s+/g, '_');
    const opt = {
      margin:       10,
      filename:     `${this.props.user.username}_${testTitle}_Result.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, logging: false },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      // Restore action buttons
      if (actions) actions.style.display = 'flex';
    });
  }

  render() {
    var test = this.props.test;

    // Prepare chart data
    let chartData = [];
    if (test && test.questions && test.timeSpent) {
       chartData = test.questions.map((qId, index) => {
          const time = test.timeSpent[index] || 0;
          let strength = "Strong";
          let color = "#4caf50";
          if (time > 120) {
             strength = "Weak";
             color = "#f44336";
          } else if (time > 60) {
             strength = "Medium";
             color = "#ff9800";
          }
          return {
             name: `Q${index+1}`,
             Time: time,
             Strength: strength,
             color: color
          };
       });
    }

    return (<div className={this.props.classes.tableBorder} id="pdf-content"> 
      <div className={this.props.classes.resultCard}>
        <div className={this.props.classes.resultHeader}>
          <Typography variant="h6" style={{ color: '#fff', fontWeight: '700', fontSize: '18px' }}>
            {test.title}
          </Typography>
        </div>

        <div className={this.props.classes.detailRow}>
          <span className={this.props.classes.detailLabel}>Student</span>
          <span className={this.props.classes.detailValue}>{this.props.user.username}</span>
        </div>
        <div className={this.props.classes.detailRow}>
          <span className={this.props.classes.detailLabel}>Status</span>
          <span className={this.props.classes.detailValue} style={{ textTransform: 'lowercase' }}>{test.status}</span>
        </div>
        <div className={this.props.classes.detailRow}>
          <span className={this.props.classes.detailLabel}>Subjects</span>
          <span className={this.props.classes.detailValue}>{test.subjects}</span>
        </div>
        <div className={this.props.classes.detailRow}>
          <span className={this.props.classes.detailLabel}>Total Marks</span>
          <span className={this.props.classes.detailValue}>{test.maxmarks}</span>
        </div>
        <div className={this.props.classes.detailRow}>
          <span className={this.props.classes.detailLabel}>Obtained Marks</span>
          <span className={this.props.classes.detailValue}>
            {test.status === 'RESULT_DECLARED' ? (
              <span style={{ color: '#2e7d32', fontWeight: '800', fontSize: '18px' }}>{test.score}</span>
            ) : (
              <span style={{ fontSize: '12px', color: '#e65100' }}>
                Result on: {test.resultTime ? new Date(test.resultTime).toLocaleString() : 'Not set'}
              </span>
            )}
          </span>
        </div>
        {test.status === 'RESULT_DECLARED' && test.rank !== null && (
          <div className={this.props.classes.detailRow}>
            <span className={this.props.classes.detailLabel}>Your Rank</span>
            <span className={this.props.classes.rankBadge}>#{test.rank}</span>
          </div>
        )}

        <div className={this.props.classes.actionArea} id="pdf-actions">
          <Button 
            variant="contained" 
            color="primary" 
            className={this.props.classes.actionBtn}
            onClick={(event)=>(this.onViewQuestions(event,test))}
          >
            View Questions
          </Button>
          <Button 
            variant="outlined" 
            className={this.props.classes.actionBtn}
            onClick={(event)=>(this.goBack(event))}
          >
            Back
          </Button>
          <Button 
            variant="contained" 
            className={this.props.classes.actionBtn}
            onClick={() => this.downloadPDF()}
            style={{ backgroundColor: '#2e7d32', color: '#fff' }}
          >
            Download PDF
          </Button>
        </div>
      </div>

      {test.status === 'RESULT_DECLARED' && test.leaderboard && test.leaderboard.length > 0 && (
        <div className={this.props.classes.leaderboardSection}>
          <Typography className={this.props.classes.leaderboardTitle}>Class Leaderboard</Typography>
          
          {/* Desktop leaderboard table */}
          <div className={this.props.classes.leaderboardDesktop}>
            <TableContainer component={Paper} className={this.props.classes.leaderboardTable}>
              <Table size="small">
                <TableHead style={{ backgroundColor: '#3f51b5' }}>
                  <TableRow>
                    <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Rank</TableCell>
                    <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Student Name</TableCell>
                    <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Score</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {test.leaderboard.map((student) => (
                    <TableRow 
                      key={student.rank + student.studentName}
                      style={{ backgroundColor: student.isCurrentUser ? '#e8eaf6' : 'inherit' }}
                    >
                      <TableCell style={{ fontWeight: student.isCurrentUser ? 'bold' : 'normal' }}>#{student.rank}</TableCell>
                      <TableCell style={{ fontWeight: student.isCurrentUser ? 'bold' : 'normal' }}>
                        {student.studentName} {student.isCurrentUser ? "(You)" : ""}
                      </TableCell>
                      <TableCell style={{ fontWeight: student.isCurrentUser ? 'bold' : 'normal' }}>{student.score}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>

          {/* Mobile leaderboard cards */}
          <div className={this.props.classes.leaderboardCard}>
            {test.leaderboard.map((student) => (
              <div 
                key={student.rank + student.studentName} 
                className={this.props.classes.lbCard}
                style={{ 
                  backgroundColor: student.isCurrentUser ? '#e8eaf6' : '#fff',
                  borderColor: student.isCurrentUser ? '#3f51b5' : '#f0f0f0',
                }}
              >
                <div className={this.props.classes.lbRank}>{student.rank}</div>
                <span className={this.props.classes.lbName}>
                  {student.studentName} {student.isCurrentUser ? "(You)" : ""}
                </span>
                <span className={this.props.classes.lbScore}>{student.score}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {chartData.length > 0 && (
        <div className={this.props.classes.chartSection}>
          <Typography variant="h6" style={{ marginBottom: '8px', color: '#3f51b5', fontWeight: 'bold' }}>
            Time Spent per Question Analysis
          </Typography>
          <Typography variant="body2" style={{ marginBottom: '20px', color: '#666' }}>
            <span style={{ color: '#f44336', fontWeight: 'bold' }}>Weak (&gt;2 mins)</span> | 
            <span style={{ color: '#ff9800', fontWeight: 'bold', marginLeft: '8px' }}>Medium (1-2 mins)</span> | 
            <span style={{ color: '#4caf50', fontWeight: 'bold', marginLeft: '8px' }}>Strong (&lt;1 min)</span>
          </Typography>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{fontSize: 12}} />
              <YAxis tick={{fontSize: 12}} />
              <RechartsTooltip 
                 formatter={(value, name, props) => [`${value}s (${props.payload.Strength})`, 'Time Spent']}
              />
              <Bar dataKey="Time" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <br/>
      { this.state.toggleViewQue === true ? <TestResultViewQuestions/>: ""}
      </div>)
  }
}


const mapStatetoProps = state => ({
  test : state.testDetails.test,
  user : state.user.userDetails
})

export default withStyles(useStyles)(connect(mapStatetoProps,{
  getCompletedTestsStudentAction,
  setAlert
})(TestResultStudent));
