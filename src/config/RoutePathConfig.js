// Application route path information
export const RoutePaths = {
  LOGIN: "/",
  DASHBOARD: "/dashboard",
  USERS: "/users",
  USERS_ADD: "/users/new",
  USERS_EDIT: "/users/:id/edit",
  HOSPITALS: "/hospitals",
  HOSPITALS_ADD: "/hospitals/new",
  HOSPITALS_EDIT: "/hospitals/:id/edit",
  PATIENTS: "/patients",
  PATIENTS_ADD: "/patients/new",
  PATIENTS_VIEW: "/patients/:id/view",
  PATIENTS_VIEW_ADMISSION: "/patients/:id/view/:admissionId/:tab",
  FOLLOWUPS: "/followups",
  PROFILE: "/profile",
  LOGOUT: "/logout",
  USER_POLICY: "/user-policy",
  MASTERS_VIEW: "/pages/:page"
};

export const masterPageView = {
  "followup_types": "Followup Types",
  "document_types": "Document Types",
  "line_tube_types": "Line Tube Types",
  "past_history_type": "Past History Types",
  "past_history_params": "Past History Params",
  "investigation_types": "Investigation Types",
  "investigation_params": "Investigation Params",
  "hourly_investigation_types": "Hourly Investi. Types",
  "hourly_investigation_params": "Hourly Investi. Params",
  "examination_types": "Examination Types",
  "examination_params": "Examination Params",
  "body_profile_types": "Body Profile Types",
  "body_profile_params": "Body Profile Params",
  "medicine_types": "Medicine Types"
};

export const getRoutePatientAdmission = (id, admissionId, tab) => {
  let page = (RoutePaths.PATIENTS_VIEW_ADMISSION).replace(":id", id);
  page = page.replace(":admissionId", admissionId);
  page = page.replace(":tab", tab);
  return page;
}

export const getRouteMastersPage = (page) => {
  return (RoutePaths.MASTERS_VIEW).replace(":page", page);  
}

export const collapseSidebar = () => {
  if (window.innerWidth <= 992) { 
    document.querySelector("body").classList.remove("collapsed");
  }
};
