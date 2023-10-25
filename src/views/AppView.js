import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { isUserLoggedIn } from "../session/UserSession";
import AppRoutes from "../routes/AppRoutes";

import "react-notifications/lib/notifications.css";

const AppView = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(isUserLoggedIn());

  // if (!isLoggedIn) {
  //   async function logout() {
  //     try {
  //       await auth.signOut();
  //     } catch (e) {}
  //   }
  //   logout();
  // }

  return (
    <Router>
      <div className="wrapper">
        <AppRoutes />
      </div>
    </Router>
  );
};

export default AppView;
