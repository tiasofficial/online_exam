import axios from "axios"
import apis from "../../helper/Apis"
import { ActionTypes } from "../action-types";
import Auth from "../../helper/Auth"
import { setAlert } from "./alertAction";

export const createTestAction = (details, cb) => {
  return async(dispatch)=> {
    const response = await axios.post(apis.BASE + apis.CREATE_QUESTION, details, {
      headers:{
        'Authorization':`Bearer ${Auth.retriveToken()}`
      }
    })
    if(response.data.success) {
      dispatch({
        type:ActionTypes.SET_ALERT,
        payload : {
          isAlert : true,
          title : "Success",
          type : "success",
          message : response.data.message
        }
      })
      if (cb) cb(response.data.testId);
    }
    else {
      dispatch({
        type:ActionTypes.SET_ALERT,
        payload : {
          isAlert : true,
          title : "Submit Error",
          type : "error",
          message : response.data.message
        }
      })
    }
  }
}

export const getAllTestAction = () => {
  return async(dispatch)=> {
    await axios.get(apis.BASE + apis.GET_ALL_TEST, {
      headers : {
        'Authorization':`Bearer ${Auth.retriveToken()}`
      }
    }).then(response => {
      if(response.data.success) {
        dispatch({
          type: ActionTypes.GET_ALL_TESTS,
          payload : {
            testlist : response.data.testlist
          }
        })
      }
    })
  }
}

export const getTestDetailsFromId = (details) => {
  return async(dispatch) => {
    const response = await axios.post(apis.BASE+ apis.GET_TEST_DETAILS_BY_ID,details,{
      headers:{
        'Authorization':`Bearer ${Auth.retriveToken()}`
      }
    })
    if(response.data.success) {
      dispatch({
        type:ActionTypes.GET_TEST_DETAILS_TEACHER,
        payload : {
          test : response.data.test
        }
      })
    } else {
      dispatch({
        type:ActionTypes.SET_ALERT,
        payload : {
          isAlert : true,
          title : "Could not get test details",
          type : "error",
          message : response.data.message
        }
      })
    }
  }
}

export const goBackToAllTest = () => {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.Go_BACK_ALL_TEST_TEACHER,
      payload : ''
    })
  }
}

export const getTestQuestionsForTeacherAction = (details) => {
  return async(dispatch) => {
    const response = await axios.post(apis.BASE+ apis.GET_TEST_QUESTIONS_TEACHER, details, {
      headers:{
        'Authorization':`Bearer ${Auth.retriveToken()}`
      }
    })
    if(response.data.success) {
      dispatch({
        type:ActionTypes.GET_TEST_QUESTIONS_TEACHER,
        payload : {
          questions : response.data.questions,
          totalQuestions: response.data.totalQuestions
        }
      })
    } else {
      dispatch({
        type:ActionTypes.SET_ALERT,
        payload : {
          isAlert : true,
          title : "Could not fetch questions",
          type : "error",
          message : response.data.message
        }
      })
    }
  }
}


export const editTestTimeAction = (details, cb) => {
  return (dispatch) => {
    axios.post(apis.BASE + apis.EDIT_TEST_TIME, details, {
      headers:{
        'Authorization':`Bearer ${Auth.retriveToken()}`
      }
    }).then(response => {
      if(response.data.success) {
        dispatch(setAlert({isAlert:true,type:'success',title:'Success',message:response.data.message}))
        if(cb) cb();
      } else {
        dispatch(setAlert({isAlert:true,type:'error',title:'Error',message:response.data.message}))
      }
    }).catch(err => {
      console.log(err);
      dispatch(setAlert({isAlert:true,type:'error',title:'Error',message:'Error updating test time'}))
    })
  }
}

export const reassignStudentTestAction = (details, cb) => {
  return (dispatch) => {
    axios.post(apis.BASE + apis.REASSIGN_STUDENT_TEST, details, {
      headers:{
        'Authorization':`Bearer ${Auth.retriveToken()}`
      }
    }).then(response => {
      if(response.data.success) {
        dispatch(setAlert({isAlert:true,type:'success',title:'Success',message:response.data.message}))
        if(cb) cb();
      } else {
        dispatch(setAlert({isAlert:true,type:'error',title:'Error',message:response.data.message}))
      }
    }).catch(err => {
      console.log(err);
      dispatch(setAlert({isAlert:true,type:'error',title:'Error',message:'Error reassigning test'}))
    })
  }
}
