import React from "react";
import { connect } from "react-redux";
import LogoutButton from "../../atoms/LogoutButton/LogoutButton";
import Auth from "../../../helper/Auth";
import { Navigate } from "react-router-dom";
import { getUserDetails } from "../../../redux/actions/loginAction";
import { Drawer, Typography, withStyles, AppBar, Toolbar, List, ListItem, ListItemText, Hidden, IconButton } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import AlertBox from '../../atoms/Alertbox/AlertBox';
import TestDetailsStudent from "../../templates/TestDetails/TestDetailsStudent";
import UpcomingStudentTestsDetails from "../../templates/TestDetails/UpcomingStudentTestsDetails";
import CompletedTestsDetailsStudent from "../../templates/TestDetails/CompletedTestsDetailsStudent";

const drawerWidth = 200
const appbarHeight = 64

const useStyles = (theme)=>({
  drawer : {
    width : drawerWidth,
    height : `calc(100% - ${appbarHeight}px)`,
    top : appbarHeight
  },
  drawerPaper : {
    width : drawerWidth,
    height : `calc(100% - ${appbarHeight}px)`,
    top : appbarHeight
  },
  flex : {
    display : 'flex'
  },
  content : {
    flexGrow: 1,
    padding: theme.spacing(3),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      maxWidth: `calc(100% - ${drawerWidth}px)`
    }
  },
  addHeight : theme.mixins.toolbar,
  title : {
    flexGrow : 1
  },
  appbar : {
    height : appbarHeight,
    zIndex: theme.zIndex.drawer + 1
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  nav: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  }
})

class StudentHomepage extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      content:(<div>Welcome to Exam portal</div>),
      menuList:[{
        title:'Home',
        content:(<div>Welcome to Exam portal</div>)
      },{
        title : 'View All tests',
        content:<TestDetailsStudent/>
      },{
        title : 'Upcoming Tests',
        content:<UpcomingStudentTestsDetails/>
      },{
        title : 'Completed Tests',
        content : <CompletedTestsDetailsStudent/>
      }],
      mobileOpen: false
    }
  }

  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };

  onMenuItemClick(content) {
    this.setState({
      ...this.state,
      content: content,
      mobileOpen: false
    })
  }

  render(){
    if(!Auth.retriveToken() || Auth.retriveToken()==='undefined'){
      return (<Navigate to='/'/>);
    } else if(!this.props.user.isLoggedIn) {
      this.props.getUserDetails();
      return (<div></div>);
    } else if(this.props.user.userDetails.type !== 'STUDENT') {
      return (<Navigate to='/'/>);
    }
    return(
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }}>
        <div>
          <AppBar
            elevation={0}
            className={this.props.classes.appbar}
          >
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={this.handleDrawerToggle}
                className={this.props.classes.menuButton}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant='h5' className={this.props.classes.title}>
                Student Homepage
              </Typography>
              <Hidden xsDown>
                <Typography variant='h6'>
                  welcome, {this.props.user.userDetails.username} !!
                </Typography>
              </Hidden>
            </Toolbar>
          </AppBar>
          <div className={this.props.classes.addHeight}></div>
        </div>
        <div className={this.props.classes.flex}>
          <nav className={this.props.classes.nav} aria-label="mailbox folders">
            <Hidden smUp implementation="css">
              <Drawer
                variant="temporary"
                anchor="left"
                open={this.state.mobileOpen}
                onClose={this.handleDrawerToggle}
                classes={{ paper: this.props.classes.drawerPaper }}
                ModalProps={{ keepMounted: true }}
              >
                <List>
                  {this.state.menuList.map((item,index)=>(
                    <ListItem button key={index} onClick={()=>(this.onMenuItemClick(item.content))}>
                      <ListItemText primary={item.title}/>
                    </ListItem>
                  ))}
                  <ListItem>
                  <LogoutButton/>
                  </ListItem>
                </List>
              </Drawer>
            </Hidden>
            <Hidden xsDown implementation="css">
              <Drawer
                className={this.props.classes.drawer}
                variant="permanent"
                anchor="left"
                classes= { {paper:this.props.classes.drawerPaper}}
              >
                <List>
                  {this.state.menuList.map((item,index)=>(
                    <ListItem button key={index} onClick={()=>(this.onMenuItemClick(item.content))}>
                      <ListItemText primary={item.title}/>
                    </ListItem>
                  ))}
                  <ListItem>
                  <LogoutButton/>
                  </ListItem>
                </List>
              </Drawer>
            </Hidden>
          </nav>
          <div className={this.props.classes.content}>
            
          <AlertBox></AlertBox>
          {this.state.content}
            
          </div>
        </div>
        </div>
        <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f8f9fa', borderTop: '1px solid #dee2e6', zIndex: 1201, position: 'relative' }}>
          Designed and developed by <a href="https://www.tiastech.in/" target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none', color: '#007bff'}}>TIAS</a>
        </div>
      </div>
    )
  }
}

const mapStatetoProps = state => ({
  user:state.user
})

export default withStyles(useStyles)(connect(mapStatetoProps,{
  getUserDetails
})(StudentHomepage));