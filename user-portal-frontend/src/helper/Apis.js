const environment = process.env.NODE_ENV;
let base_local_url = 'http://localhost:3001';
let base_backend_url = process.env.REACT_APP_API_URL || 'http://localhost:5000';
if(environment==='docker') {
  base_local_url = 'http://user-frontend-app:3001';
  base_backend_url = 'http://backend:5000';
}

const apis = {
  BASE_LOCAL_URL:base_local_url,
  BASE : base_backend_url,
  LOGIN : "/api/v1/login",
  GET_USER_DETAILS: "/api/v1/user/details",
  STUDENT_REGISTER: "/api/v1/public/register",
  GET_ALL_SUBJECT: "/api/v1/user/getAllSubjects",
  ADD_QUESTION : '/api/v1/user/addQuestion',
  SEARCH_QUESTION : '/api/v1/user/searchQuestion',
  CHANGE_QUESTION_STATUS : '/api/v1/user/changeQuestionStatus',
  GET_QUESTION_BY_ID:'/api/v1/user/getQuestionAnswer',
  GET_ANSWER : '/api/v1/user/getAnswer',
  UPDATE_QUESTION : '/api/v1/user/updateQuestion',
  CREATE_QUESTION : '/api/v1/user/createTest',
  GET_ALL_TEST : '/api/v1/user/getAllTest',
  GET_ALL_TEST_STUDNET:'/api/v1/user/getAllTestStudent',
  STUDENT_TEST_REGISTER : '/api/v1/user/testRegistration',
  GET_UPCOMING_TESTS_STUDENT : '/api/v1/user/getUpcomingTests',
  GET_TEST_DETAILS_BY_ID : '/api/v1/user/getTestById',
  START_TEST : '/api/v1/user/startTest',
  GET_QUESTIONS_TAKETEST : '/api/v1/user/getQuenStarttime',
  SAVE_ANSWER : '/api/v1/user/saveAnswer',
  END_TEST : '/api/v1/user/endTest',
  GET_ALL_COMPLETED_TEST_STUDENT : '/api/v1/user/getAllCompletedTest',
  GET_TEST_RESULT_STUDENT:'/api/v1/user/getResultMainDetailsByTestId',
  GET_RESULT_QUESTIONS_STUDENTS : '/api/v1/user/getQuestionAnswerByIds',
  GET_TEST_QUESTIONS_TEACHER : '/api/v1/user/getTestQuestionsForTeacher',
  GET_TEACHER_RESULTS : '/api/v1/user/getTestResultsForTeacher',
  GET_CLASSES : "/api/v1/class/all",
  ADD_CLASS_STUDENT : "/api/v1/class/addStudent",
  REMOVE_CLASS_STUDENT : "/api/v1/class/removeStudent",
  ADD_CLASS_SUBJECT : "/api/v1/class/addSubject",
  REMOVE_CLASS_SUBJECT : "/api/v1/class/removeSubject",
  GET_ALL_STUDENTS_TEACHER : "/api/v1/user/getAllStudentsForTeacher",
  CREATE_CLASS: "/api/v1/class/create",
  UPDATE_CLASS: "/api/v1/class/update",
  DELETE_CLASS: "/api/v1/class/delete",
  CREATE_SUBJECT: "/api/v1/user/createSubject",
  UPDATE_SUBJECT: "/api/v1/user/updateSubject",
  DELETE_SUBJECT: "/api/v1/user/deleteSubject",
  CREATE_STUDENT: "/api/v1/user/createStudent",
  UPDATE_STUDENT: "/api/v1/user/updateStudent",
  DELETE_STUDENT: "/api/v1/user/deleteStudent",
  DELETE_TEST: "/api/v1/user/deleteTest",
  ASSIGN_STUDENTS: "/api/v1/user/assignStudentsToTest",
  GET_ASSIGNED_STUDENTS: "/api/v1/user/getAssignedStudents",
  GET_STUDENT_RESULT_DETAILS_TEACHER: "/api/v1/user/getStudentResultDetailsForTeacher"
}

export default apis;