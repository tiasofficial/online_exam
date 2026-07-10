import React from "react";
import { withStyles } from "@material-ui/styles";
import { connect } from "react-redux";
import { TableBody, TableCell, TableRow, Table, TableHead, TableContainer, Paper, Button } from "@material-ui/core";
import { studentTestRegister, getTestById } from "../../../redux/actions/studentTestAction";
import { getDatePretty, getTimePretty } from "../../../helper/common";


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
      <TableContainer component={Paper} className={this.props.classes.table}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
