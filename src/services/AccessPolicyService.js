import { deleteApiCall, getApiCall, postApiCall, putApiCall } from "../utils/Api";

export const listAll = async () => {
  try {
    const result = await getApiCall(`/accesspolices/list`, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const create = async (data) => {
  try {
    const result = await postApiCall(`/accesspolices/create`, data, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const update = async (data, id) => {
  try {
    const result = await putApiCall(`/accesspolices/${id}/update`, data, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const deleteRow = async (id) => {
  try {
    const result = await deleteApiCall(`/accesspolices/${id}/delete`, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const viewRow = async (id) => {
  try {
    const result = await getApiCall(`/accesspolices/${id}/view`, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};
