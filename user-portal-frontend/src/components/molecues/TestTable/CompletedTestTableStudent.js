import React from "react";
import { withStyles } from "@material-ui/styles";
import { connect } from "react-redux";
import { TableBody, TableCell, TableRow, Table, TableHead, TableContainer, Paper, Button, Typography, Chip } from "@material-ui/core";
import { getTestResultStudent } from "../../../redux/actions/studentTestAction";

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
  desktopTable: {
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    }
  },
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
    marginTop: '12px',
  },
  cardBtn: {
    width: '100%',
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

class CompletedTestTableStudent extends React.Component {
  constructor(props){
    super(props);
    this.state = {}
  }

  onTestClick(event,id) {
    console.log("view result for test "+id);
    this.props.getTestResultStudent({testid:id});
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
                <TableCell align="left" className={this.props.classes.tableHeader}>Test</TableCell>
                <TableCell className={this.props.classes.tableHeader}>Status</TableCell>
                <TableCell className={this.props.classes.tableHeader}>total<br/>marks</TableCell>
                <TableCell className={this.props.classes.tableHeader}>View</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.testlist.map((test,index)=>(
                <TableRow key={index}>
                  <TableCell>{test.title}</TableCell>
                  <TableCell style={{textTransform:'lowercase'}}>
                    {test.status}
                    {test.status === 'TEST_COMPLETE' && test.resultTime && (
                      <div style={{fontSize: '0.8em', color: '#666', marginTop: '5px'}}>
                        Result on: <br/><strong>{new Date(test.resultTime).toLocaleDateString()} {new Date(test.resultTime).toLocaleTimeString()}</strong>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{test.maxmarks}</TableCell>
                  <TableCell><Button variant="contained" color="primary" size="small" onClick={(event)=>(this.onTestClick(event,test._id))}>View</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Mobile Cards */}
      <div className={this.props.classes.mobileCards}>
        {this.props.testlist.length === 0 && (
          <Typography variant="body2" style={{ textAlign: 'center', padding: '20px', color: '#999' }}>No completed tests</Typography>
        )}
        {this.props.testlist.map((test, index) => (
          <div key={index} className={this.props.classes.card}>
            <div className={this.props.classes.cardTitle}>{test.title}</div>
            <div className={this.props.classes.cardRow}>
              <span className={this.props.classes.cardLabel}>Status</span>
              <Chip label={test.status} className={this.props.classes.statusChip} size="small"
                style={{
                  backgroundColor: test.status === 'RESULT_DECLARED' ? '#e8f5e9' : '#fff3e0',
                  color: test.status === 'RESULT_DECLARED' ? '#2e7d32' : '#e65100'
                }}
              />
            </div>
            <div className={this.props.classes.cardRow}>
              <span className={this.props.classes.cardLabel}>Total Marks</span>
              <span className={this.props.classes.cardValue}>{test.maxmarks}</span>
            </div>
            {test.status === 'TEST_COMPLETE' && test.resultTime && (
              <div className={this.props.classes.cardRow}>
                <span className={this.props.classes.cardLabel}>Result On</span>
                <span className={this.props.classes.cardValue} style={{ fontSize: '13px' }}>
                  {new Date(test.resultTime).toLocaleDateString()} {new Date(test.resultTime).toLocaleTimeString()}
                </span>
              </div>
            )}
            <div className={this.props.classes.cardActions}>
              <Button variant="contained" color="primary" className={this.props.classes.cardBtn}
                onClick={(event)=>(this.onTestClick(event,test._id))}>
                View Result
              </Button>
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
  getTestResultStudent
})(CompletedTestTableStudent));
