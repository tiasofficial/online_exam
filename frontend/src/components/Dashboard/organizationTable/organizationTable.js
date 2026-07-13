import React from "react";
import axios from "axios";
import apis from "../../../services/Apis";
import Auth from "../../../services/Auth";
import Alert from "../../../services/alert";
import '../teacherTable/teacherTable.css';

class OrganizationTable extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        organizations: [],
        newOrgName: "",
        newOrgCode: ""
      };
    }

    componentDidMount() {
      this.fetchOrganizations();
    }

    fetchOrganizations = () => {
      axios.get(apis.BASE + apis.GET_ORGANIZATIONS, {
        headers: { 'Authorization': `Bearer ${Auth.retriveToken()}` }
      }).then(res => {
        if(res.data.success) {
          this.setState({ organizations: res.data.organizations });
        }
      });
    }

    handleCreate = (e) => {
      e.preventDefault();
      axios.post(apis.BASE + apis.ADD_ORGANIZATION, {
        name: this.state.newOrgName,
        code: this.state.newOrgCode
      }, {
        headers: { 'Authorization': `Bearer ${Auth.retriveToken()}` }
      }).then(res => {
        if(res.data.success) {
          Alert('info', 'Success', res.data.message);
          this.setState({ newOrgName: "", newOrgCode: "" });
          this.fetchOrganizations();
        } else {
          Alert('error', 'Error', res.data.message);
        }
      })
    }

    handleStatusChange = (status, id) => {
      axios.post(apis.BASE + apis.CHANGE_ORGANIZATION_STATUS, {
        organizationId: id,
        status: !status
      }, {
        headers: { 'Authorization': `Bearer ${Auth.retriveToken()}` }
      }).then(res => {
        if(res.data.success) {
          Alert('info', 'Success', res.data.message);
          this.fetchOrganizations();
        } else {
          Alert('error', 'Error', res.data.message);
        }
      })
    }

    handleDelete = (id) => {
      axios.post(apis.BASE + apis.DELETE_ORGANIZATION, {
        organizationId: id
      }, {
        headers: { 'Authorization': `Bearer ${Auth.retriveToken()}` }
      }).then(res => {
        if(res.data.success) {
          Alert('info', 'Success', res.data.message);
          this.fetchOrganizations();
        } else {
          Alert('error', 'Error', res.data.message);
        }
      }).catch(err => {
        console.error(err);
        Alert('error', 'Error', 'Failed to delete organization');
      });
    }

    buttonTextBasedOnStatus = (status) => {
      return status !== false ? "block" : "unblock";
    }

    render(){
      return (
      <div className="main">
        <h2 className="title">Organizations</h2>
        <form onSubmit={this.handleCreate} style={{marginBottom: "20px", display: "flex", gap: "10px", justifyContent: "center"}}>
          <input type="text" placeholder="Organization Name" value={this.state.newOrgName} onChange={e => this.setState({newOrgName: e.target.value})} required style={{padding: "10px", borderRadius: "5px", border: "1px solid #ccc", color: "black", backgroundColor: "white"}}/>
          <input type="text" placeholder="Organization Code" value={this.state.newOrgCode} onChange={e => this.setState({newOrgCode: e.target.value})} required style={{padding: "10px", borderRadius: "5px", border: "1px solid #ccc", color: "black", backgroundColor: "white"}}/>
          <button type="submit" style={{padding: "10px 20px", borderRadius: "5px", cursor: "pointer", border: "none", backgroundColor: "#007BFF", color: "white"}}>Create Organization</button>
        </form>
        <table style={{width: "100%"}}>
          <thead>
          <tr>
            <th>Name</th>
            <th>Code</th>
            <th>Created At</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
          </thead>
          <tbody>
          {this.state.organizations.map((val,key)=>{
            return (
              <tr key={key}>
                <td>{val.name}</td>
                <td>{val.code}</td>
                <td>{new Date(val.createdAt).toLocaleString()}</td>
                <td>{val.status !== false ? 'true' : 'false'}</td>
                <td>
                  <button onClick={()=>(this.handleStatusChange(val.status !== false, val._id))} style={{marginRight: '5px'}}>{this.buttonTextBasedOnStatus(val.status !== false)}</button>
                  <button onClick={()=>(this.handleDelete(val._id))} style={{color: 'red'}}>delete</button>
                </td>
              </tr>
            )
          })}
          </tbody>
        </table>
      </div>
      )
    }
}

export default OrganizationTable;
