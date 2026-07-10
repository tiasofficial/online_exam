import { connect } from "react-redux"
import React from "react";
import {getTeacherDetails, TeacherToggleStatus, TeacherDelete}  from "../../../redux/actions/teacherDetails";
import './teacherTable.css'


class TeacherTable extends React.Component {
    constructor(props) {
      super(props)
      this.state = {}
    }

    handleStatusChange(status, id) {
      this.props.TeacherToggleStatus(status,id,this.props.getTeacherDetails);
    }

    handleDelete(id) {
      if(window.confirm("Are you sure you want to permanently delete this teacher?")) {
        this.props.TeacherDelete(id, this.props.getTeacherDetails);
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
      if(this.props.teachers.retrived===false) {
        this.props.getTeacherDetails();
        return (<div>Collecting data</div>);
      }

      return (
      <div className="main">
        <h2 className="title">Teachers</h2> 
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
          {this.props.teachers.list.map((val,key)=>{
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
  teachers : state.teachers
});

export default connect(mapStateToProps,{
  getTeacherDetails,
  TeacherToggleStatus,
  TeacherDelete
})(TeacherTable);