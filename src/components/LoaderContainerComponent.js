import React from "react";
import PageTitleComponent from "./PageTitleComponent";
import LoaderComponent from "./LoaderComponent";

const LoaderContainerComponent = (props) => {
  const { title } = props;

  return (
    <main role="main" className="main-content">
      <div className="container-fluid">
        <div className="row justify-content-center mb-3">
          <div className="col-12">
            <div className="row align-items-center">
              <div className="col">
                <PageTitleComponent title={title} />
              </div>
              <div className="col-auto"></div>
            </div>
          </div>
        </div>
      </div>
      <LoaderComponent />
    </main>
  );
};

export default LoaderContainerComponent;
