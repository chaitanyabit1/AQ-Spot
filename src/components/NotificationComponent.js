import React, { useState } from "react";
import Toast from "react-bootstrap/Toast";
import {
  requestFirebaseNotificationPermission,
  onMessageListener,
} from "../config/FirebaseConfig";
import {
  isUserNotificationEnabled,
  setUserNotificationToken,
  getUserDetails,
  setUserDetails,
} from "../session/UserSession";
import { getRoutePatientAdmission } from "../config/RoutePathConfig";
import { Link } from "react-router-dom";
import { createToken } from "../services/UsersService";
import {NotificationManager} from "react-notifications";
import { COMMON_MESSAGES } from "../config/AppConfig";

const NotificationComponent = (props) => {
  const { isLoggedIn } = props;

  const [hasNotificationEnabled, setHasNotificationEnabled] = useState(
    isUserNotificationEnabled()
  );
  const [notificationData, setNotificationData] = useState({
    show: false,
    title: "",
    description: "",
    metadata: {}
  });  

  const enableNotifications = () => {
    const userObj = getUserDetails();
    requestFirebaseNotificationPermission()
      .then((token) => {
        const saveData = {
          token: token
        };
        createToken(saveData).then((res) => {
          setUserNotificationToken(token);
          setHasNotificationEnabled(true);
          userObj["notification_token_id"] = res.token_id;
          setUserDetails(userObj);
        }).catch((err) => {
          NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 3000);
        });
      })
      .catch((e) => console.log(e));
  };

  const handleNotificationClose = () => {
    try {
      document.getElementsByClassName("notify-audio")[0].pause();
      document.getElementsByClassName("notify-audio")[0].currentTime = 0;
    } catch (e) {}

    setNotificationData({
      show: false,
      title: "",
      description: "",
      metadata: {}
    });
  };

  if (hasNotificationEnabled) {
    onMessageListener()
      .then((payload) => {
        console.log(payload, "foreground");
        setNotificationData({
          show: true,
          title: payload.data.title,
          description: payload.data.message,
          metadata: JSON.parse(payload.data.metadata)
        });

        try {
          document.getElementsByClassName("notify-audio")[0].play();
        } catch (e) {}
      })
      .catch((e) => console.log(e));

    return notificationData.show ? (
      <>
        <div className="alert-section">
          <Toast onClose={handleNotificationClose} show={notificationData.show}>
            <Toast.Header>
              <strong className="mr-auto"><Link onClick={handleNotificationClose} to={{pathname: getRoutePatientAdmission(notificationData.metadata.patientID, notificationData.metadata.admissionID, "followups"), state: {"fromNotifiction": true, "followupID": notificationData.metadata.followupID}}}>{notificationData.title}</Link></strong>
            </Toast.Header>
            <Toast.Body>{notificationData.description}</Toast.Body>
          </Toast>
        </div>
      </>
    ) : (
      <></>
    );
  } else if (isLoggedIn) {
    return (
      <div className="notification-section">
        <button
          className="nav-link my-2 btn btn-danger btn-block"
          onClick={enableNotifications}
        >
          <span className="far fa-bell mr-2"></span> Enable Notifications
        </button>
      </div>
    );
  } else {
    return <></>;
  }
};

export default NotificationComponent;
