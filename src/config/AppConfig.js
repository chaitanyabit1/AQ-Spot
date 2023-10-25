// Application global configuration variables
export const APP_NAME = "TELE ICU";
export const SESSION_KEY = "user";
export const NOTIFICATION_TOKEN = "notify";
export const AUTH_KEY = "authkey";
export const AUTH_ACCESS = "authaccess";

// Data list action handler
export const MODULE_ACTION = {
  ADD: "CREATE",
  EDIT: "UPDATE",
  DELETE: "DELETE",
  VIEW: "VIEW",
  MULTI_DELETE: "MULTI_DELETE",
  ADMIT: "ADMIT",
  DISCHARGE: "DISCHARGE", 
  CRITICAL: "CRITICAL",
  NOT_CRITICAL: "NOT_CRITICAL",
  PATIENT_MENU: {
    profileView: "Profile View",
    profile: "Profile",
    admission: "Admission",
    pastHistory: "Past History",
    hourlyReport: "Hourly Report",
    investigation: "Investigation",
    medicines: "Medicines",
    clinical: "Clinical Notes",
    lineTubes: "Line Tubes",
    followups: "Followups",
    documents: "Documents"
  }
};
export const MODULE_ACTION_SEP = "|";
export const extractModuleData = (v) => {
  return v.split(MODULE_ACTION_SEP);
};

// Status text enum
export const STATUS_VALUE = {
  INACTIVE: 0,
  ACTIVE: 1,
  DELETED: 2,
  OPEN: 5,
  READ: 6,
  CLOSED: 7,
  NO_ACTION_REQUIRED: 8,
};
export const STATUS_TEXT = {
  INACTIVE: "Inactive",
  ACTIVE: "Active",
  DELETED: "Deleted",
  OPEN: "Open",
  READ: "Read",
  CLOSED: "Closed",
  NO_ACTION_REQUIRED: "No Action Required",
};
export const getStatusText = (val) => {
  switch (val) {
    case STATUS_VALUE.INACTIVE:
      return STATUS_TEXT.INACTIVE;
    case STATUS_VALUE.ACTIVE:
      return STATUS_TEXT.ACTIVE;
    case STATUS_VALUE.DELETED:
      return STATUS_TEXT.DELETED;
    case STATUS_VALUE.OPEN:
      return STATUS_TEXT.OPEN;
    case STATUS_VALUE.READ:
      return STATUS_TEXT.READ;
    case STATUS_VALUE.CLOSED:
      return STATUS_TEXT.CLOSED;
    case STATUS_VALUE.NO_ACTION_REQUIRED:
      return STATUS_TEXT.NO_ACTION_REQUIRED;
    default:
      return "NA";
  }
};

export const DATE_TIME_FORMAT = {
  DDMMYYYY: "DD/MM/YYYY",
  DDMMYYYYHHmm : "DD/MM/YYYY HH:mm",
  DATEPICKERDATE: "dd/MM/yyyy",
  DATEPICKERDATETIME: "dd/MM/yyyy hh:mm a",
  DDMMYYYYhhmma : "DD/MM/YYYY hh:mm a"
};

export const COMMON_MESSAGES = {
  SOMETHING_WRONG: "Something went wrong, please reload again!",
  DELETE_SUCCESS: "Row deleted successfully!",
  DONT_ACCESS: "You don't have access to perform this action!",
  UPLOAD_FAILED: "File upload failed!",
};

export const USER_TYPE = {
  SUPER_ADMIN: 1,
  CCC_DOCTOR: 2,
  DOCTOR: 3,
  STAFF: 4,
  OTHER: 5,
};

export const USER_RESTRICT_ROUTE = {
  USER_EDIT: '/users/:id/edit',
  USER_UPDATE: '/users/:id/update',
  USER_ADD: '/users/create',
  HOSPITAL_ADD: '/hospitals/create',
  HOSPITAL_EDIT: '/hospitals/:id/edit',
  HOSPITAL_UPDATE: '/hospitals/:id/update',
  PATIENT_ADMIT: '/patients/:id/admit',
  PATIENT_DISCHARGE: '/patients/:id/discharge',
  PATIENT_ADD: '/patients/create',
  ADDMISSION_BODYPROFILE_DELETE: '/admissions/:patient_id/:admission_id/bodyprofile/:body_profile_id/:id/delete',
  ADDMISSION_PASTHISTORY_DELETE: '/admissions/:patient_id/:admission_id/pasthistory/:id/delete',
  ADDMISSION_INVESTIGATION_DELETE: '/admissions/:patient_id/:admission_id/investigation/:id/delete',
  ADDMISSION_MEDICINES_DELETE: '/admissions/:patient_id/:admission_id/medicines/:id/delete',
  ADDMISSION_CLINICALNOTES_DELETE: '/admissions/:patient_id/:admission_id/clinicalnotes/:id/delete',
  ADDMISSION_LINETUBES_DELETE: '/admissions/:patient_id/:admission_id/linetubes/:id/delete',
  ADDMISSION_FOLLOWUPS_DELETE: '/admissions/:patient_id/:admission_id/followups/:id/delete',
  ADDMISSION_DOCUMENTS_DELETE: '/admissions/:patient_id/:admission_id/documents/:id/delete',
  FOLLLOWUPS_DELETE: '/followups/:id/delete',
};