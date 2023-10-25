import axios from 'axios';
import { getCurrentTimestamp } from "./Datetime";
import { getUserToken, logoutUser } from "../session/UserSession";
import { RoutePaths } from "../config/RoutePathConfig";

export const postApiCall = async (endpoint, data, isAuthorised) => {
  let options = {
    url: `${process.env.REACT_APP_API_URL}${endpoint}`,
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Req-Time': getCurrentTimestamp(),
      'Access-Control-Allow-Origin': '*',
    },
    data: data || {},
  };
  if (isAuthorised) {
    options.headers['X-Auth-Token'] = getUserToken();
  }

  // const response = await axios(options);
  // return response;
  try {
    const response = await axios(options);
    return response;
  } catch (err) {
    if (err.response.status === 401) {
      logoutUser();
      window.location = RoutePaths.LOGIN;
    } else {
      return err;
    }
  }
};

export const getApiCall = async (endpoint, isAuthorised) => {
  let options = {
    url: `${process.env.REACT_APP_API_URL}${endpoint}`,
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Req-Time': getCurrentTimestamp(),
      'Access-Control-Allow-Origin': '*',
    },
    data: {},
  };
  if (isAuthorised) {
    options.headers['X-Auth-Token'] = getUserToken();
  }

  // const response = await axios(options);
  // return response;
  try {
    const response = await axios(options);
    return response;
  } catch (err) {
    if (err.response.status === 401) {
      logoutUser();
      window.location = RoutePaths.LOGIN;
    } else {
      return err;
    }
  }
};

export const deleteApiCall = async (endpoint, isAuthorised) => {
  let options = {
    url: `${process.env.REACT_APP_API_URL}${endpoint}`,
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Req-Time': getCurrentTimestamp(),
      'Access-Control-Allow-Origin': '*',
    },
    data: {},
  };
  if (isAuthorised) {
    options.headers['X-Auth-Token'] = getUserToken();
  }

  // const response = await axios(options);
  // return response;
  try {
    const response = await axios(options);
    return response;
  } catch (err) {
    if (err.response.status === 401) {
      logoutUser();
      window.location = RoutePaths.LOGIN;
    } else {
      return err;
    }
  }
};

export const putApiCall = async (endpoint, data, isAuthorised) => {
  let options = {
    url: `${process.env.REACT_APP_API_URL}${endpoint}`,
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Req-Time': getCurrentTimestamp(),
      'Access-Control-Allow-Origin': '*',
    },
    data: data || {},
  };
  if (isAuthorised) {
    options.headers['X-Auth-Token'] = getUserToken();
  }

  // const response = await axios(options);
  // return response;
  try {
    const response = await axios(options);
    return response;
  } catch (err) {
    if (err.response.status === 401) {
      logoutUser();
      window.location = RoutePaths.LOGIN;
    } else {
      return err;
    }
  }
};

export const uploadApiCall = async (endpoint, data, isAuthorised) => {
  let options = {
    url: `${process.env.REACT_APP_API_URL}${endpoint}`,
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
      'X-Req-Time': getCurrentTimestamp(),
      'Access-Control-Allow-Origin': '*',
    },
    data: data || {},
  };
  if (isAuthorised) {
    options.headers['X-Auth-Token'] = getUserToken();
  }

  // const response = await axios(options);
  // return response;
  try {
    const response = await axios(options);
    return response;
  } catch (err) {
    if (err.response.status === 401) {
      logoutUser();
      window.location = RoutePaths.LOGIN;
    } else {
      return err;
    }
  }
};
