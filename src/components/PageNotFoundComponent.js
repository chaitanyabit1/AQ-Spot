import React from "react";
import { Link } from "react-router-dom";
import { RoutePaths } from "../config/RoutePathConfig";

const PageNotFoundComponent = (props) => {
  const { isLoggedIn } = props;

  return (
    <main role="main" className="main-content">
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-12">
            <div className="align-items-center h-100 d-flex w-50 mx-auto mt-4">
              <div className="mx-auto text-center">
                <h1 className="display-1 m-0 font-weight-bolder text-danger pg-not-found-header mt-5">
                  404
                </h1>
                <h1 className="mb-1 text-muted font-weight-bold">OOPS!</h1>
                <h6 className="mb-3 text-muted">
                  The page could not be found.
                </h6>
                {!isLoggedIn && (
                  <Link to={RoutePaths.LOGIN} className="btn btn-primary px-5">
                    Go to Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PageNotFoundComponent;
