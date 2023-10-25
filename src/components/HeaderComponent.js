import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { RoutePaths } from "../config/RoutePathConfig";
import { getUserDetails } from "../session/UserSession";

const HeaderComponent = () => {
  // Set state
  const [displayName, setDisplayName] = useState("Guest");

  useEffect(() => {
    async function getUserName() {
      const userObj = getUserDetails();
      const displayName = userObj.name || "";
      setDisplayName(displayName);
    }
    getUserName();
  });

  // Toggle sidebar menu
  const handleSidebar = () => {
    if (document.querySelector("body").classList.contains("collapsed")) {
      document.querySelector("body").classList.remove("collapsed");
    } else {
      document.querySelector("body").classList.add("collapsed");
    }
  };

  return (
    <nav className="topnav navbar navbar-light border-bottom bg-white fixed-top">
      <button
        type="button"
        className="navbar-toggler text-muted mt-2 p-0 mr-3 collapseSidebar"
        onClick={handleSidebar}
      >
        <i className="fas fa-bars navbar-toggler-icon"></i>
      </button>
      <ul className="nav">
        <li className="nav-item">
          <Link className="nav-link my-2" to={RoutePaths.PROFILE}>
            <span className="far fa-user text-secondary"></span>
            <span className="text-secondary ml-2">{displayName}</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link my-2" to={RoutePaths.LOGOUT}>
            <span className="fas fa-sign-out-alt text-secondary"></span>
            <span className="text-secondary ml-2">Signout</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default HeaderComponent;
