import React from "react";
import { withStyles } from "@material-ui/styles";
import { connect } from "react-redux";
import { TableBody, TableCell, TableRow, Table, TableHead, TableContainer, Paper, Button, Typography, Chip } from "@material-ui/core";
import { studentTestRegister, getTestById } from "../../../redux/actions/studentTestAction";
import { getDatePretty, getTimePretty } from "../../../helper/common";


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
  // Desktop table wrapper
  desktopTable: {
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    }
  },
  // Mobile card wrapper
  mobileCards: {
    display: 'none',
    [theme.breakpoints.down('xs')]: {
      display: 'block',
    }
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    border: '1px solid #e8e8e8',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: '10px',
    lineHeight: '1.3',
  },
  cardRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '6px 0',
    borderBottom: '1px solid #f0f0f0',
    '&:last-child': {
      borderBottom: 'none',
    }
  },
  cardLabel: {
    fontSize: '12px',
    color: '#8c8c8c',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  cardValue: {
    fontSize: '14px',
    color: '#333',
    fontWeight: '500',
    textAlign: 'right',
    maxWidth: '60%',
  },
  cardActions: {
    display: 'flex',
    gap: '8px',
    marginTop: '12px',
  },
  cardBtn: {
    flex: 1,
    borderRadius: '8px',
    textTransform: 'none',
    fontWeight: '600',
    padding: '10px',
    fontSize: '14px',
  },
  statusChip: {
    fontSize: '11px',
    fontWeight: '700',
    height: '24px',
    borderRadius: '6px',
    textTransform: 'lowercase',
  }
})

class TestTableStudent extends React.Component {
  constructor(props){
    super(props);
    this.state = {}
  }

  onTestClick(event,id) {
    this.props.getTestById({testid:id});
  }

  onTestRegister(event,id) {
    this.props.studentTestRegister({testid:id});
  }


  render() {
    return(<div className={this.props.classes.tableBorder}>
      {/* Desktop Table */}
      <div className={this.props.classes.desktopTable}>
        <TableContainer component={Paper} style={{ overflowX: 'auto' }}>
          <Table style={{ minWidth: 650 }} aria-label="simple table">
            <TableHead >
              <TableRow>
                <TableCell align="left" className={this.props.classes.tableHeader}>Action</TableCell>
                <TableCell align="left" className={this.props.classes.tableHeader}>Test Title</TableCell>
                <TableCell className={this.props.classes.tableHeader}>Status</TableCell>
                <TableCell className={this.props.classes.tableHeader}>total<br/>marks</TableCell>
                <TableCell className={this.props.classes.tableHeader}>Duration<br/>(hours)</TableCell>
                <TableCell className={this.props.classes.tableHeader}>Registration start</TableCell>
                <TableCell className={this.props.classes.tableHeader}>Registration end</TableCell>
                <TableCell className={this.props.classes.tableHeader}>Test start</TableCell>
                <TableCell className={this.props.classes.tableHeader}>Test end</TableCell>
                <TableCell className={this.props.classes.tableHeader}>Result</TableCell>
                <TableCell className={this.props.classes.tableHeader}>Register</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.testlist.map((test,index)=>(
                <TableRow key={index}>
                  <TableCell>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      size="small" 
                      onClick={(event)=>(this.onTestClick(event,test._id))}
                    >
                      View Test
                    </Button>
                  </TableCell>
                  <TableCell>{test.title}</TableCell>
                  <TableCell style={{textTransform:'lowercase'}}>{test.status}</TableCell>
                  <TableCell>{test.maxmarks}</TableCell>
                  <TableCell>{getTimePretty(test.duration)}</TableCell>
                  <TableCell>{getDatePretty(test.regStartTime)}</TableCell>
                  <TableCell>{getDatePretty(test.regEndTime)}</TableCell>
                  <TableCell>{getDatePretty(test.startTime)}</TableCell>
                  <TableCell>{getDatePretty(test.endTime)}</TableCell>
                  <TableCell>{getDatePretty(test.resultTime)}</TableCell>
                  <TableCell>{test.isRegistered===false?(test.status==='REGISTRATION_STARTED'? (<Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={(event)=>(this.onTestRegister(event,test._id))}>
                      Register
                  </Button>)  : 'not Registered'):'Registered'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Mobile Cards */}
      <div className={this.props.classes.mobileCards}>
        {this.props.testlist.length === 0 && (
          <Typography variant="body2" style={{ textAlign: 'center', padding: '20px', color: '#999' }}>No tests available</Typography>
        )}
        {this.props.testlist.map((test, index) => (
          <div key={index} className={this.props.classes.card}>
            <div className={this.props.classes.cardTitle}>{test.title}</div>
            <div className={this.props.classes.cardRow}>
              <span className={this.props.classes.cardLabel}>Status</span>
              <Chip label={test.status} className={this.props.classes.statusChip} size="small" 
                style={{ 
                  backgroundColor: test.status === 'TEST_STARTED' ? '#e8f5e9' : test.status === 'REGISTRATION_STARTED' ? '#e3f2fd' : '#f5f5f5',
                  color: test.status === 'TEST_STARTED' ? '#2e7d32' : test.status === 'REGISTRATION_STARTED' ? '#1565c0' : '#616161'
                }}
              />
            </div>
            <div className={this.props.classes.cardRow}>
              <span className={this.props.classes.cardLabel}>Marks</span>
              <span className={this.props.classes.cardValue}>{test.maxmarks}</span>
            </div>
            <div className={this.props.classes.cardRow}>
              <span className={this.props.classes.cardLabel}>Duration</span>
              <span className={this.props.classes.cardValue}>{getTimePretty(test.duration)}</span>
            </div>
            <div className={this.props.classes.cardRow}>
              <span className={this.props.classes.cardLabel}>Test Start</span>
              <span className={this.props.classes.cardValue}>{getDatePretty(test.startTime)}</span>
            </div>
            <div className={this.props.classes.cardRow}>
              <span className={this.props.classes.cardLabel}>Test End</span>
              <span className={this.props.classes.cardValue}>{getDatePretty(test.endTime)}</span>
            </div>
            <div className={this.props.classes.cardRow}>
              <span className={this.props.classes.cardLabel}>Result</span>
              <span className={this.props.classes.cardValue}>{getDatePretty(test.resultTime)}</span>
            </div>
            <div className={this.props.classes.cardActions}>
              <Button 
                variant="contained" 
                color="primary" 
                className={this.props.classes.cardBtn}
                onClick={(event)=>(this.onTestClick(event,test._id))}
              >
                View Test
              </Button>
              {test.isRegistered === false && test.status === 'REGISTRATION_STARTED' && (
                <Button
                  variant="contained"
                  color="secondary"
                  className={this.props.classes.cardBtn}
                  onClick={(event)=>(this.onTestRegister(event,test._id))}
                >
                  Register
                </Button>
              )}
              {test.isRegistered === true && (
                <Chip label="✓ Registered" style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', fontWeight: 'bold', height: '38px', borderRadius: '8px', flex: 1 }} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>)
  }
}

const mapStatetoProps = state => ({
  testlist : state.testDetails.list
})

export default withStyles(useStyles)(connect(mapStatetoProps,{
  studentTestRegister,
  getTestById
})(TestTableStudent));
