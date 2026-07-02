import { withStyles } from "@material-ui/styles";
import { connect } from "react-redux";
import React from "react";
import { FormControl, FormControlLabel, FormLabel, RadioGroup, Radio } from "@material-ui/core";
import { selectedOptionAction } from "../../../redux/actions/takeTestAction";
import apis from "../../../helper/Apis";

const getImageUrl = (path) => {
  if (!path || path === 'null' || path === 'undefined') return '';
  if (path.startsWith('http')) return path;
  return `${apis.BASE}${path}`;
};


const useStyles = (theme) => ({
  quebody : {
    margin : "15px"
  },
  options : {
    margin : "15px"
  }
})

class TestQuestion extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props.question)
    this.state = {
      selectedOption : this.props.taketest.answersheet.answers[parseInt(this.props.question)] || null
    }
  }

  optionSelectHandler(event) {
    this.props.selectedOptionAction({
      index : this.props.question,
      ans : event.target.value
    })
  }

  render() {
    if(this.props.question!==undefined) {
      var que = this.props.taketest.questionid[this.props.question];
      var selectValue = this.props.taketest.answersheet.answers[parseInt(this.props.question)] || null
      
      const renderLabel = (text, imgUrl) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {text !== ' ' && <span>{text}</span>}
          {imgUrl && imgUrl !== 'null' && <img src={getImageUrl(imgUrl)} alt="option" style={{ maxHeight: '100px' }} />}
        </div>
      );

      return(<div className={this.props.classes.main}>
        <div className={this.props.classes.quebody}>
          {que.body !== ' ' && <p>{que.body}</p>}
          {que.bodyImage && <img src={getImageUrl(que.bodyImage)} alt="Question Image" style={{ maxWidth: '100%', maxHeight: '200px' }} />}
        </div>
        <FormControl component="fieldset" className={this.props.classes.options}>
          <FormLabel component="legend" >Select Answer</FormLabel>
          <RadioGroup aria-label="gender" name="answer" value={selectValue} onChange={(event)=>(this.optionSelectHandler(event))}>
            <FormControlLabel value="1" control={<Radio />} label={renderLabel(que.options[0], que.optionImages && que.optionImages[0])} />
            <FormControlLabel value="2" control={<Radio />} label={renderLabel(que.options[1], que.optionImages && que.optionImages[1])} />
            <FormControlLabel value="3" control={<Radio />} label={renderLabel(que.options[2], que.optionImages && que.optionImages[2])} />
            <FormControlLabel value="4" control={<Radio />} label={renderLabel(que.options[3], que.optionImages && que.optionImages[3])} />
          </RadioGroup>
        </FormControl>

      </div>)
    } else {
      return <div>qustion is undefined</div>
    }
  }
}

const mapStatetoProps = state => ({
  taketest : state.takeTestDetails
})

export default withStyles(useStyles)(connect(mapStatetoProps,{
  selectedOptionAction
})(TestQuestion));
