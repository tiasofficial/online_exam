import axios from "axios"
import apis from "../../helper/Apis"
import Auth from "../../helper/Auth"
import { ActionTypes } from "../action-types"
import { Navigate } from "react-router-dom";
import store from "../store";

export const startTestAction = (details, test) => {
  
  return async(dispatch)=> {
    const response = await axios.post(apis.BASE + apis.START_TEST, details, {
      headers : {
        'Authorization' : `Bearer ${Auth.retriveToken()}`
      }
    }).catch(err => {
      console.log(err);
      return;
    })
    if(response.data.success) {
      console.log(response.data);
      var addStartTime = (response.data.answersheet.startTime === undefined)
      const queResponse = await axios.post(apis.BASE + apis.GET_QUESTIONS_TAKETEST,
        {
          answersheetid:response.data.answersheet._id,
          addStartTime:addStartTime,
          questionid:response.data.questions
        }, {
        headers : {
          'Authorization' : `Bearer ${Auth.retriveToken()}`
        }
      }).catch(err => {
        console.log(err);
        return;
      })
      if(queResponse.data.success) {
        if(response.data.answersheet.answers.length > 0) {
          dispatch({
            type: ActionTypes.START_TEST,
            payload : {
              test : response.data.test || test,
              answersheet : {...response.data.answersheet,startTime:queResponse.data.startTime},
              questions : queResponse.data.questions
            }
          })
        }
        else {
          var emptyAns = new Array(response.data.questions.length).fill(null);
          dispatch({
            type: ActionTypes.START_TEST,
            payload : {
              test : response.data.test || test,
              answersheet : {...response.data.answersheet,startTime:queResponse.data.startTime, answers:emptyAns},
              questions : queResponse.data.questions
            }
          })
        }
      } else {
        dispatch({
          type:ActionTypes.SET_ALERT,
          payload : {
            isAlert : true,
            title : "Start Test Error",
            type : "error",
            message : queResponse.data.message
          }
        })
      }
    } 
    else {
      dispatch({
        type:ActionTypes.SET_ALERT,
        payload : {
          isAlert : true,
          title : "Start Test Error",
          type : "error",
          message : response.data.message
        }
      })
    }
  }
}

export const selectedOptionAction = (details) => {
  return async(dispatch)=>{
    dispatch({
      type:ActionTypes.SELECT_ANSWER,
      payload : details
    })
  }
}

const sanitizeTrackingArray = (arr, length) => {
  const result = Array(length).fill(0);
  if (Array.isArray(arr)) {
    for (let i = 0; i < length; i++) {
      result[i] = (typeof arr[i] === 'number' && !isNaN(arr[i])) ? Math.max(0, arr[i]) : 0;
    }
  }
  return result;
};

export const saveAnswerAction = (timeSpent, revisitCounts) => {
  return async(dispatch)=> {
    var answersheet = store.getState().takeTestDetails.answersheet;
    if (!answersheet || !answersheet._id) return;
    const numQ = answersheet.answers ? answersheet.answers.length : (timeSpent ? timeSpent.length : 0);
    const safeTime = sanitizeTrackingArray(timeSpent, numQ);
    const safeRevisits = sanitizeTrackingArray(revisitCounts, numQ);

    axios.post(apis.BASE + apis.SAVE_ANSWER, {
      answersheetid: answersheet._id,
      answers: answersheet.answers,
      timeSpent: safeTime,
      revisitCounts: safeRevisits
    }, {
      headers : {
        'Authorization' : `Bearer ${Auth.retriveToken()}`
      }
    }).then(response=> {
      if(response.data.success) {
        if(response.data.testDone) {
          dispatch({
            type : ActionTypes.END_TEST
          })
        }
      }
    }).catch(err => {
      console.log(err);
      return;
    })
  }
}

export const endTestAction = (timeSpent, revisitCounts) => {
  return async(dispatch)=> {
    var answersheet = store.getState().takeTestDetails.answersheet;
    if (!answersheet || !answersheet._id) return;
    const numQ = answersheet.answers ? answersheet.answers.length : (timeSpent ? timeSpent.length : 0);
    const safeTime = sanitizeTrackingArray(timeSpent, numQ);
    const safeRevisits = sanitizeTrackingArray(revisitCounts, numQ);

    axios.post(apis.BASE + apis.END_TEST, {
      answersheetid: answersheet._id,
      answers: answersheet.answers,
      timeSpent: safeTime,
      revisitCounts: safeRevisits
    }, {
      headers : {
        'Authorization' : `Bearer ${Auth.retriveToken()}`
      }
    }).then(response=> {
      if(response.data.success) {
        dispatch({
          type : ActionTypes.END_TEST
        })
        window.location.href = '/homeStudent';
      }
    }).catch(err => {
      console.log(err);
      return;
    })
  }
}