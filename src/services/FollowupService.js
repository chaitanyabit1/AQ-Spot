import { deleteApiCall, getApiCall, postApiCall, putApiCall, uploadApiCall } from "../utils/Api";

export const usersList = [
  {
    id: 1,
    name: "TeleICU One",
  },
  {
    id: 2,
    name: "TeleICU Two",
  },
  {
    id: 3,
    name: "TeleICU Three",
  },
];

export const followupTypes = [
  {
    id: 1,
    name: "Instruction",
  },
  {
    id: 2,
    name: "Reports",
  },
  {
    id: 3,
    name: "Drugs",
  },
];

export const getFollowupTypeText = (val) => {
  let i = 0;
  let returnText = "NA";

  while (i < followupTypes.length) {
    if (followupTypes[i].id === val) {
      returnText = followupTypes[i].name;
      break;
    }
    i++;
  }

  return returnText;
};

export const listAll = async (query="") => {
  try {
    const q = (query) ? "?1=1" + query : "";
    const result = await getApiCall(`/followups/list${q}`, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const create = async (data) => {
  try {
    const result = await postApiCall(`/followups/create`, data, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const update = async (data, id) => {
  try {
    const result = await putApiCall(`/followups/${id}/update`, data, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const deleteRow = async (id) => {
  try {
    const result = await deleteApiCall(`/followups/${id}/delete`, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const viewRow = async (id) => {
  try {
    const result = await getApiCall(`/followups/${id}/view`, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const updateToClose = async (id) => {
  try {
    const result = await getApiCall(`/followups/${id}/closed`, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const listAllRecent = async () => {
  try {
    const result = await getApiCall(`/followups/list/recent`, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const listAllNote = async (followupId) => {
  try {
    const result = await getApiCall(`/followups/${followupId}/note/list`, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const createNote = async (followupId, data) => {
  try {
    const result = await postApiCall(`/followups/${followupId}/note/create`, data, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const deleteNote = async (followupId, id) => {
  try {
    const result = await deleteApiCall(`/followups/${followupId}/note/${id}/delete`, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const uploadFile = async (data) => {
  try {
    const result = await uploadApiCall(`/upload/followupnotes/document`, data, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};