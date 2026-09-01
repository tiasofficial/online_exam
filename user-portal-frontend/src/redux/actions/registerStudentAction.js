import axios from "axios"
import apis from "../../helper/Apis"
import { ActionTypes } from "../action-types";

export const registerStudentAction = (details) => {
  return async(dispatch) => {
    try {
      const response = await axios.post(apis.BASE + apis.STUDENT_REGISTER,details);
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
        return true;
      }
      return false;
    } catch (error) {
      let message = "Something went wrong";
      if (error.response && error.response.data && error.response.data.message) {
        message = error.response.data.message;
        if (error.response.data.errors && error.response.data.errors.length > 0) {
          message += ": " + error.response.data.errors.map(e => e.msg).join(", ");
        }
      }
      dispatch({
        type:ActionTypes.SET_ALERT,
        payload : {
          isAlert : true,
          title : "Error",
          type : "error",
          message : message
        }
      })
      return false;
    }
  }
}