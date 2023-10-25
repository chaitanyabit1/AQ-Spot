import { deleteApiCall, getApiCall, postApiCall, putApiCall, uploadApiCall } from "../utils/Api";

export const listAll = async (query="") => {
  try {
    const q = (query) ? "?1=1" + query : "";
    const result = await getApiCall(`/users/list${q}`, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const create = async (data) => {
  try {
    const result = await postApiCall(`/users/create`, data, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const update = async (data, id) => {
  try {
    const result = await putApiCall(`/users/${id}/update`, data, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const deleteRow = async (id) => {
  try {
    const result = await deleteApiCall(`/users/${id}/delete`, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const viewRow = async (id) => {
  try {
    const result = await getApiCall(`/users/${id}/view`, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const uploadFile = async (data) => {
  try {
    const result = await uploadApiCall(`/upload/users/photo`, data, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const listAssignedHospitals = async (id) => {
  try {
    const result = await getApiCall(`/users/${id}/hospitals/list`, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const assignHospital = async (id, data) => {
  try {
    const result = await postApiCall(`/users/${id}/hospitals/assign`, data, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const deleteAssignHospital = async (id, hospital_user_id) => {
  try {
    const result = await deleteApiCall(`/users/${id}/hospitals/${hospital_user_id}/delete`, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const createToken = async (data) => {
  try {
    const result = await postApiCall(`/users/tokens/create`, data, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const deleteToken = async (token_id) => {
  try {
    const result = await deleteApiCall(`/users/tokens/${token_id}/delete`, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};