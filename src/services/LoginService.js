import { postApiCall } from "../utils/Api";

export const login = async (data) => {
  try {
    const result = await postApiCall(`/auth/login`, data, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};