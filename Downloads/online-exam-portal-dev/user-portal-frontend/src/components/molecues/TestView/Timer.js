import { withStyles } from "@material-ui/styles";
import React from "react";
import { connect } from "react-redux";
import { saveAnswerAction } from "../../../redux/actions/takeTestAction";
import { endTestAction } from "../../../redux/actions/takeTestAction";
const useStyles = (theme)=>({
  
})

var x = null;

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      remainingMs: props.time > 0 ? props.time : 0,
    };
  }

  componentDidMount() {
    this.startTimer();
  }

  componentWillUnmount() {
    if (this.interval) clearInterval(this.interval);
  }

  startTimer() {
    // Record the exact time the timer was started on the client
    this.endTime = Date.now() + this.props.time;
    
    this.interval = setInterval(() => {
      let remaining = this.endTime - Date.now();
      
      // Auto-save every 60 seconds approximately
      if (Math.floor(remaining / 1000) % 60 === 0 && remaining > 0) {
        if (!this.lastSaved || Date.now() - this.lastSaved > 59000) {
          this.props.saveAnswerAction();
          this.lastSaved = Date.now();
        }
      }

      if (remaining <= 0) {
        remaining = 0;
        clearInterval(this.interval);
        this.props.endTestAction();
      }
      
      this.setState({ remainingMs: remaining });
    }, 1000);
  }

  render() {
    if (this.props.time === undefined) {
      return <div></div>;
    }
    
    let totalSeconds = Math.floor(this.state.remainingMs / 1000);
    let h = Math.floor(totalSeconds / 3600);
    let m = Math.floor((totalSeconds % 3600) / 60);
    let s = totalSeconds % 60;
    
    return (
      <div>
        {h}:{m < 10 ? '0' + m : m}:{s < 10 ? '0' + s : s}
      </div>
    );
  }
}

const mapStatetoProps = state => ({

})

export default withStyles(useStyles)(connect(mapStatetoProps,{
  saveAnswerAction,
  endTestAction

})(Timer));