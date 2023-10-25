import { deleteApiCall, getApiCall, postApiCall, putApiCall, uploadApiCall } from "../utils/Api";

export const listAll = async (query="") => {
  try {
    const q = (query) ? "?1=1"+query : "";
    const result = await getApiCall(`/patients/list${q}`, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const create = async (data) => {
  try {
    const result = await postApiCall(`/patients/create`, data, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const update = async (data, id) => {
  try {
    const result = await putApiCall(`/patients/${id}/update`, data, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const deleteRow = async (id) => {
  try {
    const result = await deleteApiCall(`/patients/${id}/delete`, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const viewRow = async (id) => {
  try {
    const result = await getApiCall(`/patients/${id}/view`, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const uploadFile = async (data) => {
  try {
    const result = await uploadApiCall(`/upload/patients/photo`, data, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const listAllAdmission = async (id) => {
  try {
    const result = await getApiCall(`/patients/${id}/admissions`, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const dicharge = async (id, data) => {
  try {
    const result = await postApiCall(`/patients/${id}/discharge`, data, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const admit = async (id, data) => {
  try {
    const result = await postApiCall(`/patients/${id}/admit`, data, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const updateCritical = async (id, status) => {
  try {
    const result = await getApiCall(`/patients/${id}/status/${status}`, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const getAllCritical = async () => {
  try {
    const result = await getApiCall(`/patients/list/critical`, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const getByHospitalICU = async (hospital_id, icu_ward_id) => {
  try {
    const result = await getApiCall(`/patients/list/${hospital_id}/${icu_ward_id}`, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const viewAdmissionById = async (id, admission_id) => {
  try {
    const result = await getApiCall(`/patients/${id}/admissions/${admission_id}`, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const getByHospital = async (hospital_id) => {
  try {
    const result = await getApiCall(`/patients/list/hospital/${hospital_id}`, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};