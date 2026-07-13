import { Button, withStyles } from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom';
import AlertBox from '../../atoms/Alertbox/AlertBox';
import LoginForm from '../../templates/loginForm/loginForm';
import Auth from '../../../helper/Auth';
import { AppBar, Toolbar, Typography } from '@material-ui/core';

const useStyles = (theme) => ({
  addHeight : theme.mixins.toolbar,
  title : {
    flexGrow : 1
  },
  main : {
    textAlign : 'center',
    paddingTop : '5%',
    margin : 'auto'
  }
})


class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gotoStudentRegister: false
    }
  }

  onStudentRegisterClick () {
    this.setState({
      ...this.state,
      gotoStudentRegister : true
    })
  }


  render(){
    if(this.state.gotoStudentRegister) {
      return (<Navigate to='/studentRegisterPage'/>)
    }
    if(this.props.user.isLoggedIn) {
      if(this.props.user.userDetails.type === 'TEACHER')
        return (<Navigate to='/homeTeacher'/>);
      else
        return (<Navigate to='/homeStudent'/>);
    } else if(Auth.retriveToken() && Auth.retriveToken()!=='undefined'){
      
      return (<Navigate to='/homeStudent'/>);
    } 
    else {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1 }}>
            <AppBar
            elevation={0}
            className={this.props.classes.appbar}
            >
              <Toolbar style={{ display: 'flex', justifyContent: 'center' }}>
                    <Typography variant='h5' style={{ fontWeight: 'bold' }}>
                      ONLINE EXAMINATION PORTAL
                    </Typography>
              </Toolbar>
            </AppBar>
            <div className={this.props.classes.addHeight}></div>
            <div className={this.props.classes.main}>
            <AlertBox/>
            <LoginForm/>
            </div>
          </div>
          <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f8f9fa', borderTop: '1px solid #dee2e6' }}>
            Designed and developed by <a href="https://www.tiastech.in/" target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none', color: '#007bff'}}>TIAS</a>
          </div>
        </div>
      )
    }
  }
}

const mapStatetoProps = state=>({
  user : state.user
});

export default withStyles(useStyles)(connect(mapStatetoProps,{})(LoginPage));