import React from "react";
import PageTitleComponent from "../../components/PageTitleComponent";

const ProfileView = () => {
  const pageTitle = "Profile";

  return (
    <main role="main" className="main-content">
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-12">
            <PageTitleComponent title={pageTitle} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfileView;
