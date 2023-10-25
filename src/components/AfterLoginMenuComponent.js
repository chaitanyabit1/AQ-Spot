import React from "react";
import SidebarComponent from "./SidebarComponent";
import HeaderComponent from "./HeaderComponent";

const AfterLoginMenuComponent = (props) => {
  const { shouldRender } = props;

  return !shouldRender ? (
    <></>
  ) : (
    <>
      <HeaderComponent />
      <SidebarComponent />
    </>
  );
};

export default AfterLoginMenuComponent;
