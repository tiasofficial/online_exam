import { withStyles } from "@material-ui/styles";
import { connect } from "react-redux";
import React from "react";
import { FormControl, FormControlLabel, RadioGroup, Radio, Typography, Box } from "@material-ui/core";
import { selectedOptionAction } from "../../../redux/actions/takeTestAction";
import apis from "../../../helper/Apis";

const getImageUrl = (path) => {
  if (!path || path === 'null' || path === 'undefined') return '';
  if (path.startsWith('http')) return path;
  return `${apis.BASE}${path}`;
};

const useStyles = (theme) => ({
  main: {
    display: "flex",
    flexDirection: "column"
  },
  headerInfo: {
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px solid #ddd",
    paddingBottom: "10px",
    marginBottom: "15px"
  },
  marksText: {
    color: "#d32f2f",
    fontWeight: "bold",
    fontSize: "13px",
    display: 'flex',
    alignItems: 'center'
  },
  questionNumberText: {
    fontWeight: "bold",
    fontSize: "18px",
    marginBottom: "10px",
    color: '#333'
  },
  quebody: {
    marginBottom: "20px",
    fontSize: "17px",
    lineHeight: "1.6"
  },
  options: {
    width: '100%'
  },
  optionLabel: {
    width: '100%',
    padding: '10px',
    margin: 0,
    marginBottom: '10px',
    fontSize: "16px",
    '&:hover': {
      backgroundColor: '#f9f9f9'
    }
  }
});

class TestQuestion extends React.Component {
  
  optionSelectHandler(event) {
    this.props.selectedOptionAction({
      index: this.props.question,
      ans: event.target.value
    });
  }

  render() {
    if(this.props.question !== undefined) {
      const { classes, taketest, question } = this.props;
      const que = taketest.questionid[question];
      const selectValue = taketest.answersheet.answers[parseInt(question)] || null;
      
      const marks = que.marks || 4; // default to 4 if not provided for mockup
      
      const renderLabel = (text, imgUrl, optionLabel) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
          <strong style={{marginRight: '10px'}}>{optionLabel}.</strong>
          {text !== ' ' && <span>{text}</span>}
          {imgUrl && imgUrl !== 'null' && <img src={getImageUrl(imgUrl)} alt="option" style={{ maxHeight: '100px' }} />}
        </div>
      );

      return (
        <div className={classes.main}>
          <div className={classes.headerInfo}>
            <Typography variant="h6" className={classes.questionNumberText}>
              Question {parseInt(question) + 1}:
            </Typography>
          </div>
          
          <div className={classes.quebody}>
            {que.body !== ' ' && <p style={{margin: 0, marginBottom: '10px'}}>{que.body}</p>}
            {que.bodyImage && <img src={getImageUrl(que.bodyImage)} alt="Question Image" style={{ maxWidth: '100%', maxHeight: '300px' }} />}
          </div>
          
          <FormControl component="fieldset" className={classes.options}>
            <RadioGroup aria-label="answer" name="answer" value={selectValue} onChange={(event) => this.optionSelectHandler(event)}>
              <FormControlLabel className={classes.optionLabel} value="1" control={<Radio color="primary" />} label={renderLabel(que.options[0], que.optionImages && que.optionImages[0], 'A')} />
              <FormControlLabel className={classes.optionLabel} value="2" control={<Radio color="primary" />} label={renderLabel(que.options[1], que.optionImages && que.optionImages[1], 'B')} />
              <FormControlLabel className={classes.optionLabel} value="3" control={<Radio color="primary" />} label={renderLabel(que.options[2], que.optionImages && que.optionImages[2], 'C')} />
              <FormControlLabel className={classes.optionLabel} value="4" control={<Radio color="primary" />} label={renderLabel(que.options[3], que.optionImages && que.optionImages[3], 'D')} />
            </RadioGroup>
          </FormControl>
        </div>
      );
    } else {
      return <div>Question is undefined</div>;
    }
  }
}

const mapStatetoProps = state => ({
  taketest: state.takeTestDetails
});

export default withStyles(useStyles)(connect(mapStatetoProps, {
  selectedOptionAction
})(TestQuestion));
