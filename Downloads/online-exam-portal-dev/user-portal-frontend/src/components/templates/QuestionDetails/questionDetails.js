import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { getAllTestAction } from "../../../redux/actions/teacherTestAction";
import { FormControl, InputLabel, Select, MenuItem, Typography } from "@material-ui/core";
import PaperSetup from "../PaperSetup/PaperSetup";
import PaperPreview from "../PaperPreview/PaperPreview";

const useStyles = (theme) => ({
  container : {
    margin: '20px',
    textAlign: 'center',
  },
  formControl: {
    margin: theme.spacing(3),
    minWidth: 300,
  },
  title: {
    marginBottom: theme.spacing(2)
  }
});

class QuestionDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTestId: ""
    };
  }

  componentDidMount() {
    this.props.getAllTestAction();
  }

  handleTestChange = (event) => {
    this.setState({ selectedTestId: event.target.value });
  }

  render() {
    const { classes, testDetails } = this.props;

    // Filter tests that have not started yet (using status because startTime is not returned in GET_ALL_TEST)
    const upcomingTests = (testDetails.list || []).filter(t => {
      if(t.status === 'CANCELLED') return false;
      return ['CREATED', 'REGISTRATION_STARTED', 'REGISTRATION_COMPLETE', 'TEST_STARTED'].includes(t.status);
    });

    const selectedTest = upcomingTests.find(t => t._id === this.state.selectedTestId);

    return (
      <div className={classes.container}>
        <Typography variant="h5" className={classes.title}>Manage Exam Questions</Typography>
        <Typography variant="subtitle1">Select an upcoming exam to add, edit, or delete its questions.</Typography>
        
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel>Select Exam</InputLabel>
          <Select
            value={this.state.selectedTestId}
            onChange={this.handleTestChange}
            label="Select Exam"
          >
            <MenuItem value=""><em>None</em></MenuItem>
            {upcomingTests.map(test => (
              <MenuItem key={test._id} value={test._id}>{test.title}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedTest && (
          <div style={{ marginTop: '20px', textAlign: 'left' }}>
            <PaperSetup testId={selectedTest._id} targetSubject={selectedTest.subjects ? selectedTest.subjects[0] : null} hideFinishButton={true} />
            <div style={{ marginTop: '40px' }}>
              <PaperPreview testId={selectedTest._id} hideFinishButton={true} />
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStatetoProps = state => ({
  user : state.user,
  testDetails : state.testDetails
});

export default withStyles(useStyles)(connect(mapStatetoProps, {
  getAllTestAction
})(QuestionDetails));