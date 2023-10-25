import React from "react";

const PageTitle = (props) => {
  const { title } = props;

  return <h1 className="h2 mb-0 page-title patients_title">{title}</h1>;
};

export default PageTitle;
