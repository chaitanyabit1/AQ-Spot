import React from "react";
import { NavLink } from "react-router-dom";
import { RoutePaths, getRouteMastersPage, masterPageView } from "../config/RoutePathConfig";
import SidebarLogoComponent from "./SidebarLogoComponent";
import { getUserDetails } from "../session/UserSession";
import { USER_TYPE } from "../config/AppConfig";

const SidebarComponent = () => {
  return (
    <aside className="sidebar-left border-right bg-white shadow">
      <nav className="vertnav navbar navbar-light">
        <SidebarLogoComponent />

        <p className="text-muted nav-heading mb-2 mt-2">
          <span>Manage</span>
        </p>
        <ul className="navbar-nav flex-fill w-100 mb-2 mt-1">
          <li className="nav-item w-100">
            <NavLink
              className="nav-link"
              to={RoutePaths.DASHBOARD}
              activeClassName="active-menu"
            >
              <i className="fas fa-stream"></i>
              <span className="ml-2 item-text">Dashboard</span>
            </NavLink>
          </li>
          <li className="nav-item w-100">
            <NavLink
              className="nav-link"
              to={RoutePaths.USERS}
              activeClassName="active-menu"
            >
              <i className="far fa-user"></i>
              <span className="ml-2 item-text">Users</span>
            </NavLink>
          </li>
          <li className="nav-item w-100">
            <NavLink
              className="nav-link"
              to={RoutePaths.HOSPITALS}
              activeClassName="active-menu"
            >
              <i className="far fa-hospital"></i>
              <span className="ml-2 item-text">Hospitals</span>
            </NavLink>
          </li>
          <li className="nav-item w-100">
            <NavLink
              className="nav-link"
              to={RoutePaths.PATIENTS}
              activeClassName="active-menu"
            >
              <i className="far fa-address-book"></i>
              <span className="ml-2 item-text">Patients</span>
            </NavLink>
          </li>
          <li className="nav-item w-100">
            <NavLink
              className="nav-link"
              to={RoutePaths.FOLLOWUPS}
              activeClassName="active-menu"
            >
              <i className="far fa-bell"></i>
              <span className="ml-2 item-text">Followups</span>
            </NavLink>
          </li>
        </ul>
      
        {getUserDetails().user_type === USER_TYPE.SUPER_ADMIN &&
          <>
            <p className="text-muted nav-heading mb-2 mt-2">
              <span>Settings</span>
            </p>
            <ul className="navbar-nav flex-fill w-100 mb-2 mt-1">
              {Object.keys(masterPageView).map(function(keyName, keyIndex) {
                return (
                  <li className="nav-item w-100" key={"li-"+keyIndex}>
                  <NavLink
                    key={keyIndex}
                    className="nav-link"
                    to={getRouteMastersPage(keyName)}
                    activeClassName="active-menu"
                  >
                    <i className="fas fa-stream"></i>
                    <span className="ml-2 item-text">{masterPageView[keyName]}</span>
                  </NavLink>
                  </li>
                );
              })}
            </ul>
          </>
        }
      </nav>
    </aside>
  );
};

export default SidebarComponent;
