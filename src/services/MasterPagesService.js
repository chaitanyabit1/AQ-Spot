import { deleteApiCall, getApiCall, postApiCall, putApiCall } from "../utils/Api";

export const listAll = async (pageName, query="") => {
  try {
    const q = (query) ? "?1=1" + query : "";
    const result = await getApiCall(`/pages/${pageName}/list${q}`, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const create = async (pageName, data) => {
  try {
    const result = await postApiCall(`/pages/${pageName}/create`, data, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const update = async (pageName, data, id) => {
  try {
    const result = await putApiCall(`/pages/${pageName}/${id}/update`, data, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const deletePage = async (pageName, id) => {
  try {
    const result = await deleteApiCall(`/pages/${pageName}/${id}/delete`, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const viewPage = async (pageName, id) => {
  try {
    const result = await getApiCall(`/pages/${pageName}/${id}/view`, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const listAllParams = async (pageName, parent_id) => {
  try {
    const result = await getApiCall(`/pages/${pageName}/${parent_id}/params`, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};
