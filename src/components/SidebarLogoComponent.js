import React from "react";
import { Link } from "react-router-dom";
import { APP_NAME } from "../config/AppConfig";
import { RoutePaths } from "../config/RoutePathConfig";

import logoImg from "../assets/img/logo.png";

const SidebarLogoComponent = () => {
  return (
    <div className="w-100 pb-2 d-flex">
      <Link
        className="navbar-brand mx-auto flex-fill text-center"
        to={RoutePaths.DASHBOARD}
      >
        <img src={logoImg} className="avatar-img" alt={APP_NAME} />
      </Link>
    </div>
  );
};

export default SidebarLogoComponent;
