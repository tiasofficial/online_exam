const environment = process.env.NODE_ENV;

let base_local_url = 'http://localhost:3000';
let base_backend_url = process.env.REACT_APP_API_URL || 'http://localhost:5000';
if(environment==='docker') {
  base_local_url = 'http://user-frontend-app:3000';
  base_backend_url = 'http://backend:5000';
}

const apis = {
  BASE_LOCAL_URL:base_local_url,
  BASE : base_backend_url,
  LOGIN : "/api/v1/adminlogin/",
  REGISTER_USER : "/api/v1/public/register",
  GET_ADMIN_DETAILS : "/api/v1/admin/details",
  GET_DASHBOARD_COUNT : "/api/v1/admin/getDashboardCount",
  GET_TEACHER_DETAILS : "/api/v1/admin/getAllTeachers",
  REMOVE_USER : "/api/v1/admin/removeUser",
  UNBLOCK_USER : "/api/v1/admin/unblockUser",
  GET_STUDENT_DETAILS : "/api/v1/admin/getAllStudent",
  GET_SUBJECT_DETAILS : "/api/v1/admin/getAllSubjects",
  REMOVE_SUBJECT : "/api/v1/admin/removeSubject",
  UNBLOCK_SUBJECT : "/api/v1/admin/unblockSubject",
  ADD_TEACHER : "/api/v1/admin/register",
  ADD_SUBJECT : "/api/v1/admin/addSubject",
  TEACHER_ADD_SUBJECT : "/api/v1/user/createSubject",
  DELETE_USER : "/api/v1/admin/deleteUser",
  GET_CLASSES : "/api/v1/class/all",
  ADD_CLASS_STUDENT : "/api/v1/class/addStudent",
  REMOVE_CLASS_STUDENT : "/api/v1/class/removeStudent",
  ADD_CLASS_SUBJECT : "/api/v1/class/addSubject",
  REMOVE_CLASS_SUBJECT : "/api/v1/class/removeSubject",
  GET_TEACHER_RESULTS : "/api/v1/user/getTestResultsForTeacher",
  GET_ORGANIZATIONS: "/api/v1/admin/organizations",
  ADD_ORGANIZATION: "/api/v1/admin/organizations",
  CHANGE_ORGANIZATION_STATUS: "/api/v1/admin/changeOrganizationStatus",
  DELETE_ORGANIZATION: "/api/v1/admin/deleteOrganization"
}

export default apis;