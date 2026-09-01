import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import {
  Typography, TextField, Button, CircularProgress,
  InputAdornment, IconButton, Paper
} from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import LockIcon from '@material-ui/icons/Lock';
import axios from 'axios';
import apis from '../../../helper/Apis';
import Auth from '../../../helper/Auth';
import { setAlert } from '../../../redux/actions/alertAction';

const useStyles = (theme) => ({
  root: {
    maxWidth: 440,
    margin: '40px auto',
    padding: '32px 28px',
    borderRadius: '16px',
    boxShadow: '0 4px 24px rgba(63,81,181,0.10)',
    border: '1px solid #e8eaf6',
    [theme.breakpoints.down('xs')]: {
      margin: '16px',
      padding: '20px 14px',
    }
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '28px',
  },
  lockIcon: {
    color: '#3f51b5',
    fontSize: '32px',
  },
  title: {
    fontWeight: '800',
    color: '#1e293b',
  },
  field: {
    marginBottom: '18px',
  },
  btn: {
    marginTop: '8px',
    padding: '12px',
    borderRadius: '10px',
    fontWeight: '700',
    fontSize: '15px',
    textTransform: 'none',
    letterSpacing: '0.3px',
  },
  hint: {
    marginTop: '16px',
    fontSize: '12px',
    color: '#94a3b8',
    textAlign: 'center',
  }
});

class ChangePassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      showCurrent: false,
      showNew: false,
      showConfirm: false,
      submitting: false,
    };
  }

  handleChange = (field) => (e) => {
    this.setState({ [field]: e.target.value });
  };

  toggleShow = (field) => () => {
    this.setState((prev) => ({ [field]: !prev[field] }));
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = this.state;

    if (newPassword !== confirmPassword) {
      this.props.setAlert({ type: 'error', title: 'Mismatch', message: 'New password and confirm password do not match' });
      return;
    }
    if (newPassword.length < 4) {
      this.props.setAlert({ type: 'error', title: 'Too short', message: 'New password must be at least 4 characters' });
      return;
    }

    this.setState({ submitting: true });
    try {
      const res = await axios.post(
        apis.BASE + apis.CHANGE_PASSWORD,
        { currentPassword, newPassword },
        { headers: { 'Authorization': `Bearer ${Auth.retriveToken()}` } }
      );
      if (res.data.success) {
        this.props.setAlert({ type: 'success', title: 'Done!', message: res.data.message });
        this.setState({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        this.props.setAlert({ type: 'error', title: 'Error', message: res.data.message });
      }
    } catch (err) {
      console.log('Change password error:', err.response || err);
      this.props.setAlert({ type: 'error', title: 'Error', message: err.response?.data?.message || 'Something went wrong. Please try again.' });
    }
    this.setState({ submitting: false });
  };

  render() {
    const { classes } = this.props;
    const { currentPassword, newPassword, confirmPassword, showCurrent, showNew, showConfirm, submitting } = this.state;

    return (
      <Paper className={classes.root} elevation={0}>
        <div className={classes.header}>
          <LockIcon className={classes.lockIcon} />
          <Typography variant="h5" className={classes.title}>Change Password</Typography>
        </div>

        <form onSubmit={this.handleSubmit}>
          <div className={classes.field}>
            <TextField
              label="Current Password"
              type={showCurrent ? 'text' : 'password'}
              value={currentPassword}
              onChange={this.handleChange('currentPassword')}
              variant="outlined"
              fullWidth
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={this.toggleShow('showCurrent')} size="small">
                      {showCurrent ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </div>

          <div className={classes.field}>
            <TextField
              label="New Password"
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={this.handleChange('newPassword')}
              variant="outlined"
              fullWidth
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={this.toggleShow('showNew')} size="small">
                      {showNew ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </div>

          <div className={classes.field}>
            <TextField
              label="Confirm New Password"
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={this.handleChange('confirmPassword')}
              variant="outlined"
              fullWidth
              required
              error={confirmPassword.length > 0 && confirmPassword !== newPassword}
              helperText={confirmPassword.length > 0 && confirmPassword !== newPassword ? 'Passwords do not match' : ''}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={this.toggleShow('showConfirm')} size="small">
                      {showConfirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </div>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className={classes.btn}
            disabled={submitting}
          >
            {submitting ? <CircularProgress size={22} color="inherit" /> : 'Update Password'}
          </Button>
        </form>

        <Typography className={classes.hint}>
          Your teacher will be able to see your new password.
        </Typography>
      </Paper>
    );
  }
}

export default withStyles(useStyles)(connect(null, { setAlert })(ChangePassword));
