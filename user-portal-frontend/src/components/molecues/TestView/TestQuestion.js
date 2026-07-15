import { withStyles } from "@material-ui/styles";
import { connect } from "react-redux";
import React from "react";
import { FormControl, FormControlLabel, RadioGroup, Radio, Typography, Box, Checkbox, FormGroup, Button, TextField } from "@material-ui/core";
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

  handleMultipleSelect = (val) => {
    const { question, taketest } = this.props;
    let currentVal = taketest.answersheet.answers[parseInt(question)] || [];
    if (!Array.isArray(currentVal)) currentVal = [];
    
    if (currentVal.includes(val)) {
      currentVal = currentVal.filter(v => v !== val);
    } else {
      currentVal = [...currentVal, val];
    }
    this.props.selectedOptionAction({ index: question, ans: currentVal });
  }

  handleKeypad = (val) => {
    const { question, taketest } = this.props;
    let currentVal = taketest.answersheet.answers[parseInt(question)] || '';
    if (val === 'CLEAR') {
      currentVal = '';
    } else if (val === 'BACKSPACE') {
      currentVal = currentVal.toString().slice(0, -1);
    } else {
      currentVal = currentVal.toString() + val;
    }
    this.props.selectedOptionAction({ index: question, ans: currentVal });
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
          {typeof text === 'string' && text.trim() !== '' && <span>{text}</span>}
          {imgUrl && imgUrl !== 'null' && <img src={getImageUrl(imgUrl)} alt="option" style={{ maxHeight: '100px' }} />}
        </div>
      );

      const KeypadButton = ({ onClick, children }) => (
        <Button variant="outlined" style={{ minWidth: '50px', margin: '5px' }} onClick={onClick}>
          {children}
        </Button>
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
          
          {que.questionType === 'NUMERICAL' ? (
            <div style={{ marginTop: '20px' }}>
              <TextField 
                variant="outlined" 
                value={selectValue || ''} 
                disabled 
                style={{ marginBottom: '10px', backgroundColor: '#fff' }} 
                inputProps={{ style: { textAlign: 'center', fontSize: '20px', color: '#000' } }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <KeypadButton onClick={() => this.handleKeypad('7')}>7</KeypadButton>
                  <KeypadButton onClick={() => this.handleKeypad('8')}>8</KeypadButton>
                  <KeypadButton onClick={() => this.handleKeypad('9')}>9</KeypadButton>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <KeypadButton onClick={() => this.handleKeypad('4')}>4</KeypadButton>
                  <KeypadButton onClick={() => this.handleKeypad('5')}>5</KeypadButton>
                  <KeypadButton onClick={() => this.handleKeypad('6')}>6</KeypadButton>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <KeypadButton onClick={() => this.handleKeypad('1')}>1</KeypadButton>
                  <KeypadButton onClick={() => this.handleKeypad('2')}>2</KeypadButton>
                  <KeypadButton onClick={() => this.handleKeypad('3')}>3</KeypadButton>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <KeypadButton onClick={() => this.handleKeypad('-')}>-</KeypadButton>
                  <KeypadButton onClick={() => this.handleKeypad('0')}>0</KeypadButton>
                  <KeypadButton onClick={() => this.handleKeypad('.')}>.</KeypadButton>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                  <Button variant="contained" color="secondary" style={{ width: '45%' }} onClick={() => this.handleKeypad('BACKSPACE')}>Del</Button>
                  <Button variant="contained" color="default" style={{ width: '45%' }} onClick={() => this.handleKeypad('CLEAR')}>Clear</Button>
                </div>
              </div>
            </div>
          ) : que.questionType === 'MULTIPLE' ? (
            <FormControl component="fieldset" className={classes.options}>
              <FormGroup>
                <FormControlLabel className={classes.optionLabel} control={<Checkbox color="primary" checked={Array.isArray(selectValue) && selectValue.includes(que.options[0])} onChange={() => this.handleMultipleSelect(que.options[0])} />} label={renderLabel(que.options[0], que.optionImages && que.optionImages[0], 'A')} />
                <FormControlLabel className={classes.optionLabel} control={<Checkbox color="primary" checked={Array.isArray(selectValue) && selectValue.includes(que.options[1])} onChange={() => this.handleMultipleSelect(que.options[1])} />} label={renderLabel(que.options[1], que.optionImages && que.optionImages[1], 'B')} />
                <FormControlLabel className={classes.optionLabel} control={<Checkbox color="primary" checked={Array.isArray(selectValue) && selectValue.includes(que.options[2])} onChange={() => this.handleMultipleSelect(que.options[2])} />} label={renderLabel(que.options[2], que.optionImages && que.optionImages[2], 'C')} />
                <FormControlLabel className={classes.optionLabel} control={<Checkbox color="primary" checked={Array.isArray(selectValue) && selectValue.includes(que.options[3])} onChange={() => this.handleMultipleSelect(que.options[3])} />} label={renderLabel(que.options[3], que.optionImages && que.optionImages[3], 'D')} />
              </FormGroup>
            </FormControl>
          ) : (
            <FormControl component="fieldset" className={classes.options}>
              <RadioGroup aria-label="answer" name="answer" value={selectValue} onChange={(event) => this.optionSelectHandler(event)}>
                <FormControlLabel className={classes.optionLabel} value={que.options[0]} control={<Radio color="primary" />} label={renderLabel(que.options[0], que.optionImages && que.optionImages[0], 'A')} />
                <FormControlLabel className={classes.optionLabel} value={que.options[1]} control={<Radio color="primary" />} label={renderLabel(que.options[1], que.optionImages && que.optionImages[1], 'B')} />
                <FormControlLabel className={classes.optionLabel} value={que.options[2]} control={<Radio color="primary" />} label={renderLabel(que.options[2], que.optionImages && que.optionImages[2], 'C')} />
                <FormControlLabel className={classes.optionLabel} value={que.options[3]} control={<Radio color="primary" />} label={renderLabel(que.options[3], que.optionImages && que.optionImages[3], 'D')} />
              </RadioGroup>
            </FormControl>
          )}
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
