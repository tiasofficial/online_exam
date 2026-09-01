import React from "react";
import TextField from "@material-ui/core/TextField";
import './loginForm.css';
import Button from "@material-ui/core/Button";
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from "@material-ui/core/styles";
import { loginRequestAction } from "../../../redux/actions/loginAction";
import { connect } from "react-redux";

const useStyles = (theme)=>({
  inputfield : {
    display:'block',
    marginBottom :'24px',
    width: '100%',
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      backgroundColor: '#f8fafc',
      '& fieldset': {
        borderColor: '#e2e8f0',
      },
      '&:hover fieldset': {
        borderColor: '#94a3b8',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#3b82f6',
      },
    }
  },
  loginbtn : {
    width: '100%',
    padding: '14px',
    borderRadius: '12px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    textTransform: 'none',
    backgroundColor: '#3b82f6',
    color: '#fff',
    boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.4)',
    '&:hover': {
      backgroundColor: '#2563eb',
    }
  }
})

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email : "",
      password : "",
      isLoading: false
    }
  } 

  emailInputHandler = (event) => {
    this.setState({
      ...this.state,
      email : event.target.value
    });
  }

  passwordInputHandler = (event) => {
    this.setState({
      ...this.state,
      password : event.target.value
    });
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    this.setState({ ...this.state, isLoading: true });
    await this.props.loginRequestAction(this.state);
    this.setState({ ...this.state, isLoading: false });
  }

  render() {
    return (
      <form className="form-class" onSubmit={this.handleSubmit}>
        <div className="form-title">Welcome Back</div>
        <div style={{ color: '#64748b', marginBottom: '32px', textAlign: 'center', fontSize: '1rem' }}>
          Please enter your details to sign in
        </div>
        
        <TextField
          variant='outlined'
          className={this.props.classes.inputfield}
          label="Email Address"
          placeholder='Enter your email'
          type='email'
          value={this.state.email}
          onChange={this.emailInputHandler}
          required
          InputLabelProps={{ style: { color: '#64748b' } }}
        />
        <TextField
          variant='outlined'
          label="Password"
          className={this.props.classes.inputfield}
          placeholder='Enter your password'
          type='password'
          value={this.state.password}
          onChange={this.passwordInputHandler}
          required
          InputLabelProps={{ style: { color: '#64748b' } }}
        />
        <Button 
          variant='contained'
          type='submit'
          className={this.props.classes.loginbtn}
          disabled={this.state.isLoading}
        >
          {this.state.isLoading ? <CircularProgress size={24} style={{ color: 'white' }} /> : "Sign In"}
        </Button>
      </form>
    )
  }
}

const mapStatetoProps = state => ({
  state: state.user
})

export default withStyles(useStyles)(connect(mapStatetoProps, { loginRequestAction })(LoginForm));
