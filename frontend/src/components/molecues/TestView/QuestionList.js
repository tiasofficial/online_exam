import { withStyles } from "@material-ui/styles";
import React from "react";
import { Typography, Box } from "@material-ui/core";

const useStyles = (theme) => ({
  main: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    overflowY: "auto",
  },
  legendContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "15px",
    padding: "20px",
    fontSize: "16px",
    fontWeight: "bold",
    borderBottom: "1px solid #ccc",
    [theme.breakpoints.down('sm')]: {
      padding: "10px",
      gap: "10px",
      fontSize: "14px",
    }
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    width: "45%",
    lineHeight: "1.3",
    [theme.breakpoints.down('sm')]: {
      width: "100%",
    }
  },
  // Shapes
  shapeNotVisited: {
    width: "50px", height: "50px", backgroundColor: "#e0e0e0", border: "1px solid #999", borderRadius: "4px",
    display: "flex", alignItems: "center", justifyContent: "center", marginRight: "10px", color: '#333', cursor: 'pointer', fontSize: "20px", fontWeight: "bold",
    [theme.breakpoints.down('sm')]: { width: '35px', height: '35px', fontSize: '14px', marginRight: '5px' }
  },
  shapeNotAnswered: {
    width: "50px", height: "50px", backgroundColor: "#d32f2f", 
    borderBottomLeftRadius: "25px", borderBottomRightRadius: "25px", borderRadius: "4px",
    display: "flex", alignItems: "center", justifyContent: "center", marginRight: "10px", color: 'white', cursor: 'pointer', fontSize: "20px", fontWeight: "bold",
    [theme.breakpoints.down('sm')]: { width: '35px', height: '35px', fontSize: '14px', marginRight: '5px', borderBottomLeftRadius: "17px", borderBottomRightRadius: "17px" }
  },
  shapeAnswered: {
    width: "50px", height: "50px", backgroundColor: "#689f38", 
    borderTopLeftRadius: "25px", borderTopRightRadius: "25px", borderRadius: "4px",
    display: "flex", alignItems: "center", justifyContent: "center", marginRight: "10px", color: 'white', cursor: 'pointer', fontSize: "20px", fontWeight: "bold",
    [theme.breakpoints.down('sm')]: { width: '35px', height: '35px', fontSize: '14px', marginRight: '5px', borderTopLeftRadius: "17px", borderTopRightRadius: "17px" }
  },
  shapeMarked: {
    width: "50px", height: "50px", backgroundColor: "#7b1fa2", borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center", marginRight: "10px", color: 'white', cursor: 'pointer', fontSize: "20px", fontWeight: "bold",
    [theme.breakpoints.down('sm')]: { width: '35px', height: '35px', fontSize: '14px', marginRight: '5px' }
  },
  shapeMarkedAnswered: {
    width: "50px", height: "50px", backgroundColor: "#7b1fa2", borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center", marginRight: "10px", color: 'white', cursor: 'pointer', fontSize: "20px", fontWeight: "bold",
    position: "relative",
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: '3px', right: '3px',
      width: '14px', height: '14px',
      backgroundColor: '#689f38',
      borderRadius: '50%',
      border: '2px solid #fff'
    },
    [theme.breakpoints.down('sm')]: { width: '35px', height: '35px', fontSize: '14px', marginRight: '5px', '&::after': { width: '10px', height: '10px', bottom: '1px', right: '1px' } }
  },
  subjectHeader: {
    backgroundColor: '#3b5998',
    color: '#fff',
    padding: '12px 15px',
    fontWeight: 'bold',
    fontSize: '18px'
  },
  gridContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "15px",
    padding: "20px",
    backgroundColor: "#eaf3fa", 
    flexGrow: 1,
    alignContent: 'flex-start',
  }
});

class QuestionList extends React.Component {

  getShapeClass(status) {
    const { classes } = this.props;
    switch(status) {
      case 0: return classes.shapeNotVisited;
      case 1: return classes.shapeNotAnswered;
      case 2: return classes.shapeAnswered;
      case 3: return classes.shapeMarked;
      case 4: return classes.shapeMarkedAnswered;
      default: return classes.shapeNotVisited;
    }
  }

  render() {
    const { classes, answers, questionStatuses, callback, subject } = this.props;
    
    if (!answers || answers.length === 0) {
      return <div>No questions in test</div>;
    }

    return (
      <div className={classes.main}>
        {/* Legend */}
        <div className={classes.legendContainer}>
          <div className={classes.legendItem}>
            <div className={classes.shapeAnswered}></div> Answered
          </div>
          <div className={classes.legendItem}>
            <div className={classes.shapeNotAnswered}></div> Not Answered
          </div>
          <div className={classes.legendItem}>
            <div className={classes.shapeNotVisited}></div> Not Visited
          </div>
          <div className={classes.legendItem}>
            <div className={classes.shapeMarked}></div> Marked for Review
          </div>
          <div className={classes.legendItem} style={{width: '100%'}}>
            <div className={classes.shapeMarkedAnswered}></div> Answered & Marked for Review (will be considered for evaluation)
          </div>
        </div>

        {/* Subject Header */}
        <div className={classes.subjectHeader}>
          {subject || 'Subject'}
        </div>

        {/* Grid */}
        <div className={classes.gridContainer}>
          {answers.map((_, index) => {
            const status = questionStatuses ? questionStatuses[index] : 0;
            return (
              <div 
                key={index} 
                className={this.getShapeClass(status)}
                onClick={() => callback(index)}
                style={{ 
                  border: this.props.curIndex === index ? '2px solid #000' : undefined 
                }}
              >
                {index + 1}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default withStyles(useStyles)(QuestionList);
