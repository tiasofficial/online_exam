import { Button, withStyles, Grid, Paper, Box, Typography } from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom';
import AlertBox from '../../atoms/Alertbox/AlertBox';
import LoginForm from '../../templates/loginForm/loginForm';
import Auth from '../../../helper/Auth';

const useStyles = (theme) => ({
  root: {
    minHeight: '100vh',
    display: 'flex',
    overflow: 'hidden',
    backgroundColor: '#f8fafc',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      overflow: 'auto',
      minHeight: '100vh'
    }
  },
  leftSide: {
    flex: 1,
    background: 'linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(6),
    color: '#fff',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    }
  },
  rightSide: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'flex-start',
      minHeight: '100vh'
    }
  },
  titleText: {
    fontWeight: 900,
    fontSize: '3.5rem',
    marginBottom: theme.spacing(3),
    textAlign: 'center',
    textShadow: '0 4px 6px rgba(0,0,0,0.1)',
    lineHeight: 1.2
  },
  subtitleText: {
    fontSize: '1.25rem',
    maxWidth: '500px',
    textAlign: 'center',
    lineHeight: 1.6,
    opacity: 0.9
  },
  glassCard: {
    background: '#ffffff',
    borderRadius: '24px',
    padding: theme.spacing(6),
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0,0,0,0.05)',
    width: '100%',
    maxWidth: '450px',
    zIndex: 10,
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(4),
      borderRadius: '20px',
      margin: '0 auto',
      marginTop: '-20px',
      maxWidth: '90%',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
    }
  },
  mobileHeader: {
    display: 'none',
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      padding: theme.spacing(6, 2, 8, 2),
      background: 'linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%)',
      color: '#fff',
      textAlign: 'center',
      borderRadius: '0 0 24px 24px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
    }
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    textAlign: 'center',
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      position: 'relative',
      marginTop: 'auto',
      paddingBottom: '20px',
      paddingTop: '40px'
    }
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
        <div className={this.props.classes.root}>
          {/* Desktop Left Side */}
          <div className={this.props.classes.leftSide}>
            <Typography className={this.props.classes.titleText}>
              CBT Exam Portal
            </Typography>
            <Typography className={this.props.classes.subtitleText}>
              Platform for NEET & JEE mock tests. Practice online with real exam environments and detailed analytics.
            </Typography>
          </div>
          
          {/* Right Side / Mobile Full */}
          <div className={this.props.classes.rightSide}>
            {/* Mobile Header (Hidden on Desktop) */}
            <div className={this.props.classes.mobileHeader}>
               <Typography variant="h4" style={{fontWeight: 800, textShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>CBT Portal</Typography>
               <Typography variant="body1" style={{opacity: 0.9, marginTop: '8px'}}>Practice Online for NEET & JEE</Typography>
            </div>

            {/* Login Card */}
            <div className={this.props.classes.glassCard}>
              <AlertBox/>
              <LoginForm/>
              
              <Box mt={4} textAlign="center">
              </Box>
            </div>
            
            {/* Footer */}
            <div className={this.props.classes.footer}>
              <Typography variant="body2" style={{ color: '#64748b' }}>
                Designed and developed by <a href="https://www.tiastech.in/" target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none', color: '#3b82f6', fontWeight: 'bold'}}>TIAS</a>
              </Typography>
            </div>
          </div>
        </div>
      )
    }
  }
}

const mapStatetoProps = state=>({
  user : state.user
})

export default withStyles(useStyles)(connect(mapStatetoProps,{})(LoginPage));