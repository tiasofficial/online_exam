import apis from "../../helper/Apis";
import Auth from "../../helper/Auth";
import axios from "axios";
import { setAlert } from "./alertAction";

export const ActionTypes = {
  GET_CLASSES: "GET_CLASSES"
}

export const getAllClasses = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(apis.BASE + apis.GET_CLASSES, {
        headers: {
          'Authorization': `Bearer ${Auth.retriveToken()}`
        }
      });
      if (response.data.success) {
        dispatch({
          type: ActionTypes.GET_CLASSES,
          payload: response.data.classes
        });
      } else {
        dispatch(setAlert({ isAlert: true, type: 'error', title: 'Error', message: response.data.message }));
      }
    } catch (err) {
      console.log(err);
      dispatch(setAlert({ isAlert: true, type: 'error', title: 'Error', message: 'Failed to fetch classes' }));
    }
  }
}

export const addStudentToClass = (classId, studentId) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(apis.BASE + apis.ADD_CLASS_STUDENT, { classId, studentId }, {
        headers: { 'Authorization': `Bearer ${Auth.retriveToken()}` }
      });
      if (response.data.success) {
        dispatch(getAllClasses());
        dispatch(setAlert({ isAlert: true, type: 'success', title: 'Success', message: response.data.message }));
      } else {
        dispatch(setAlert({ isAlert: true, type: 'error', title: 'Error', message: response.data.message }));
      }
    } catch (err) {
      dispatch(setAlert({ isAlert: true, type: 'error', title: 'Error', message: 'Failed to add student' }));
    }
  }
}

export const removeStudentFromClass = (classId, studentId) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(apis.BASE + apis.REMOVE_CLASS_STUDENT, { classId, studentId }, {
        headers: { 'Authorization': `Bearer ${Auth.retriveToken()}` }
      });
      if (response.data.success) {
        dispatch(getAllClasses());
        dispatch(setAlert({ isAlert: true, type: 'success', title: 'Success', message: response.data.message }));
      } else {
        dispatch(setAlert({ isAlert: true, type: 'error', title: 'Error', message: response.data.message }));
      }
    } catch (err) {
      dispatch(setAlert({ isAlert: true, type: 'error', title: 'Error', message: 'Failed to remove student' }));
    }
  }
}

export const addSubjectToClass = (classId, subjectId) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(apis.BASE + apis.ADD_CLASS_SUBJECT, { classId, subjectId }, {
        headers: { 'Authorization': `Bearer ${Auth.retriveToken()}` }
      });
      if (response.data.success) {
        dispatch(getAllClasses());
        dispatch(setAlert({ isAlert: true, type: 'success', title: 'Success', message: response.data.message }));
      } else {
        dispatch(setAlert({ isAlert: true, type: 'error', title: 'Error', message: response.data.message }));
      }
    } catch (err) {
      dispatch(setAlert({ isAlert: true, type: 'error', title: 'Error', message: 'Failed to add subject' }));
    }
  }
}

export const removeSubjectFromClass = (classId, subjectId) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(apis.BASE + apis.REMOVE_CLASS_SUBJECT, { classId, subjectId }, {
        headers: { 'Authorization': `Bearer ${Auth.retriveToken()}` }
      });
      if (response.data.success) {
        dispatch(getAllClasses());
        dispatch(setAlert({ isAlert: true, type: 'success', title: 'Success', message: response.data.message }));
      } else {
        dispatch(setAlert({ isAlert: true, type: 'error', title: 'Error', message: response.data.message }));
      }
    } catch (err) {
      dispatch(setAlert({ isAlert: true, type: 'error', title: 'Error', message: 'Failed to remove subject' }));
    }
  }
}
