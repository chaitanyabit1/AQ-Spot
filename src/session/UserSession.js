import { SESSION_KEY, NOTIFICATION_TOKEN, AUTH_KEY, AUTH_ACCESS } from "../config/AppConfig";

// Check if user logged in or not
export const isUserLoggedIn = () => {
  return !!localStorage.getItem(AUTH_KEY);
};

// Logout the user
export const logoutUser = () => {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(NOTIFICATION_TOKEN);
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(AUTH_ACCESS);
};

// Get user details from the session
export const getUserDetails = () => {
  return JSON.parse(localStorage.getItem(SESSION_KEY)) || {};
};

// Set user details in the session
export const setUserDetails = (data) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(data));
};

// Check if user is registered for notifications
export const isUserNotificationEnabled = () => {
  return !!localStorage.getItem(NOTIFICATION_TOKEN);
};

// Get user notification token
export const getUserNotificationToken = () => {
  return localStorage.getItem(NOTIFICATION_TOKEN) || "";
};

// Set user notification token
export const setUserNotificationToken = (data) => {
  localStorage.setItem(NOTIFICATION_TOKEN, data);
};

export const getUserToken = () => {
  return localStorage.getItem(AUTH_KEY);
}

export const setUserToken = (token) => {
  return localStorage.setItem(AUTH_KEY, token);
}

export const getUserAccesses = () => {
  return localStorage.getItem(AUTH_ACCESS);  
}

export const setUserAccesses = (accesses) => {
  return localStorage.setItem(AUTH_ACCESS, accesses);
}
