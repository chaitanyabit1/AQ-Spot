import { deleteApiCall, getApiCall, postApiCall, putApiCall } from "../utils/Api";

export const listAll = async () => {
  try {
    const result = await getApiCall(`/usertypes/list`, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const create = async (data) => {
  try {
    const result = await postApiCall(`/usertypes/create`, data, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const update = async (data, id) => {
  try {
    const result = await putApiCall(`/usertypes/${id}/update`, data, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const deleteRow = async (id) => {
  try {
    const result = await deleteApiCall(`/usertypes/${id}/delete`, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const viewRow = async (id) => {
  try {
    const result = await getApiCall(`/usertypes/${id}/view`, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};
