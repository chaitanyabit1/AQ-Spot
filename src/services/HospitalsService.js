import { deleteApiCall, getApiCall, postApiCall, putApiCall, uploadApiCall } from "../utils/Api";

export const listAll = async (query="") => {
  try {
    const q = (query) ? "?1=1" + query : "";
    const result = await getApiCall(`/hospitals/list${q}`, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const create = async (data) => {
  try {
    const result = await postApiCall(`/hospitals/create`, data, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const update = async (data, id) => {
  try {
    const result = await putApiCall(`/hospitals/${id}/update`, data, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const deleteRow = async (id) => {
  try {
    const result = await deleteApiCall(`/hospitals/${id}/delete`, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const viewRow = async (id) => {
  try {
    const result = await getApiCall(`/hospitals/${id}/view`, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const uploadFile = async (data) => {
  try {
    const result = await uploadApiCall(`/upload/hospitals/photo`, data, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};