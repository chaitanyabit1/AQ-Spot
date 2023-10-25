import { deleteApiCall, getApiCall, postApiCall, uploadApiCall, putApiCall } from "../utils/Api";
import { DATE_TIME_FORMAT } from "../config/AppConfig";
import moment from "moment";

export const hourlyReportDayList = async (inDate, outDate) => {

  let inDate1 = moment(inDate, DATE_TIME_FORMAT.DDMMYYYY);
  let outDate1 = moment(outDate, DATE_TIME_FORMAT.DDMMYYYY);
  const totalDays = outDate1.diff(inDate1, "days");
  //console.log(outDate1.diff(inDate1,"days"));

  let formattedDay = "";
  let daysArray = [];
  for (let day = 0; day <= totalDays; day++) {
    formattedDay = moment(outDate1, DATE_TIME_FORMAT.DDMMYYYY).subtract(day, "day").format(DATE_TIME_FORMAT.DDMMYYYY);
    daysArray.push({ "key": formattedDay, "value": "Day " + ((totalDays - day) + 1) + " - " + formattedDay });
  }
  //console.log(daysArray, "Dayslist");
  return daysArray;
}

export const getAgeFromBirthDate = (birth_date) => {
  const birthday = moment(birth_date, DATE_TIME_FORMAT.DDMMYYYY);
  return moment().diff(birthday, 'years');
}

export const saveAdmission = async (patient_id, amission_id, data) => {
  try {
    const result = await postApiCall(`/admissions/${patient_id}/${amission_id}/save`, data, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};


export const viewAdmission = async (patient_id, amission_id) => {
  try {
    const result = await getApiCall(`/admissions/${patient_id}/${amission_id}/view`, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const listAll = async (patient_id, amission_id, route, query = "") => {
  try {
    const q = (query) ? "?1=1" + query : "";
    const result = await getApiCall(`/admissions/${patient_id}/${amission_id}/${route}/list${q}`, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const create = async (patient_id, amission_id, route, data) => {
  try {
    const result = await postApiCall(`/admissions/${patient_id}/${amission_id}/${route}/create`, data, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const deleteRow = async (patient_id, amission_id, route, id) => {
  try {
    const result = await deleteApiCall(`/admissions/${patient_id}/${amission_id}/${route}/${id}/delete`, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const viewRow = async (patient_id, amission_id, route, id) => {
  try {
    const result = await getApiCall(`/admissions/${patient_id}/${amission_id}/${route}/${id}/view`, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const update = async (patient_id, amission_id, route, id, data) => {
  try {
    const result = await putApiCall(`/admissions/${patient_id}/${amission_id}/${route}/${id}/update`, data, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const uploadFile = async (data) => {
  try {
    const result = await uploadApiCall(`/upload/admissions/document`, data, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const deleteBodyprofileRow = async (patient_id, amission_id, route, body_profile_id, id) => {
  try {
    const result = await deleteApiCall(`/admissions/${patient_id}/${amission_id}/${route}/${body_profile_id}/${id}/delete`, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const multipleUploadFile = async (data) => {
  try {
    const result = await uploadApiCall(`/multiupload/admissions/document`, data, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const listAllDocuments = async (patient_id, amission_id, row_id, type) => {
  try {
    const result = await getApiCall(`/admissions/multidocuments/${patient_id}/${amission_id}/${row_id}/${type}/list`, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const deleteDocument = async (patient_id, amission_id, row_id, id) => {
  try {
    const result = await deleteApiCall(`/admissions/multidocuments/${patient_id}/${amission_id}/${row_id}/${id}/delete`, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const createDocument = async (patient_id, amission_id, data) => {
  try {
    const result = await postApiCall(`/admissions/multidocuments/${patient_id}/${amission_id}/create`, data, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const listAllUploadedDocument = async (patient_id, amission_id, route, query = "") => {
  try {
    const q = (query) ? "?1=1" + query : "";
    const result = await getApiCall(`/admissions/${patient_id}/${amission_id}/${route}/listall${q}`, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};