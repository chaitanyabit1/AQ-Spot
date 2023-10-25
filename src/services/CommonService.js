import { getApiCall } from "../utils/Api";

export const countryList = async () => {
  try {
    const result = await getApiCall(`/common/country/list`, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const stateList = async (country_id) => {
  try {
    const result = await getApiCall(`/common/${country_id}/state/list`, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const cityList = async (state_id) => {
  try {
    const result = await getApiCall(`/common/${state_id}/city/list`, true);
    return result.data;
  } catch (e) {
    throw e;
  }
};

