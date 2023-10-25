import React, { useEffect } from "react";
import { logoutUser, getUserDetails } from "../../session/UserSession";
import LoaderComponent from "../../components/LoaderComponent";
import { deleteToken } from "../../services/UsersService";

const LogoutView = (props) => {
  const { updateLoggedIn } = props;

  useEffect(() => {
    const userObj = getUserDetails();
    const token_id = userObj.notification_token_id || 0;
    deleteToken(token_id).then((res) => {
    }).catch((err) => {
    });
    logoutUser();
    updateLoggedIn(false);
  });

  return <LoaderComponent />;
};

export default LogoutView;
