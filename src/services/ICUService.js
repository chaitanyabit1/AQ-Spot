import { deleteApiCall, getApiCall, postApiCall, putApiCall } from "../utils/Api";

export const listAll = async () => {
  try {
    const result = await getApiCall(`/icuwards/list`, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const listAllByHospital = async (hospitalId) => {
  try {
    const result = await getApiCall(`/icuwards/list/hospital/${hospitalId}`, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const create = async (data) => {
  try {
    const result = await postApiCall(`/icuwards/create`, data, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const update = async (data, id) => {
  try {
    const result = await putApiCall(`/icuwards/${id}/update`, data, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const deleteRow = async (id) => {
  try {
    const result = await deleteApiCall(`/icuwards/${id}/delete`, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const viewRow = async (id) => {
  try {
    const result = await getApiCall(`/icuwards/${id}/view`, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};