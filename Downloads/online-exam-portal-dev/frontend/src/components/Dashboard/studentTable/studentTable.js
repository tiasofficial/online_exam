import { connect } from "react-redux"
import React from "react";
import {getStudentDetails, StudentToggleStatus, StudentDelete}  from "../../../redux/actions/studentDetails";
import './studentTable.css'


class StudentTable extends React.Component {
    constructor(props) {
      super(props)
      this.state = {}
    }

    handleStatusChange(status, id) {
      this.props.StudentToggleStatus(status,id,this.props.getStudentDetails);
    }

    handleDelete(id) {
      if(window.confirm("Are you sure you want to permanently delete this student?")) {
        this.props.StudentDelete(id, this.props.getStudentDetails);
      }
    }

    buttonTextBasedOnStatus(status) {
      if(status === true) {
        return("block");
      } else {
        return("unblock");
      }
    }

    render(){
      if(this.props.students.retrived===false) {
        this.props.getStudentDetails();
        return (<div>Collecting data</div>);
      }

      return (
      <div className="main">
        <h2 className="title">Students</h2> 
        <table>
          <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Password</th>
            <th>Created At</th>
            <th>Organization</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
          </thead>
          <tbody>
          {this.props.students.list.map((val,key)=>{
            return (
              <tr key={key}>
                <td>{val.name}</td>
                <td>{val.email}</td>
                <td><div style={{maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}} title={val.password}>{val.password}</div></td>
                <td>{new Date(val.createdAt).toLocaleString()}</td>
                <td>{val.organization || "N/A"}</td>
                <td>{val.status.toString()}</td>
                <td>
                  <button onClick={()=>(this.handleStatusChange(val.status,val.id))} style={{marginRight: '5px'}}>{this.buttonTextBasedOnStatus(val.status)}</button>
                  <button onClick={()=>(this.handleDelete(val.id))} style={{color: 'red'}}>delete</button>
                </td>
              </tr>
            )
          })}
          </tbody>
        </table>
      </div>)
    }
}

const mapStateToProps = state => ({
  students : state.students
});

export default connect(mapStateToProps,{
  getStudentDetails,
  StudentToggleStatus,
  StudentDelete
})(StudentTable);