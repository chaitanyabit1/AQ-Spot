import React, { useState } from "react";
import PageTitleComponent from "../../components/PageTitleComponent";
import QuickCriticalPatientsView from "../patients/QuickCriticalPatientsView";
import QuickCreateView from "../followups/QuickCreateView";
import QuickListView from "../followups/QuickListView";

const DashboardView = () => {
  // Set module variables
  const pageTitle = "Dashboard";

  const [reloadFollowupsList, setReloadFollowupList] = useState(false);

  const handleReloadDashboard = () => {
    setReloadFollowupList(!reloadFollowupsList);
  };

  return (
    <main role="main" className="main-content">
      <div className="container-fluid">
        <div className="row justify-content-center mb-3">
          <div className="col-12">
            <div className="row align-items-center">
              <div className="col">
                <PageTitleComponent title={pageTitle} />
              </div>
            </div>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-12 col-lg-4 mb-4">
            <QuickCriticalPatientsView />
          </div>
          <div className="col-md-12 col-lg-4 mb-4">
            <QuickListView handleReloadDashboard={handleReloadDashboard} />
          </div>
          <div className="col-md-12 col-lg-4 mb-4">
            <QuickCreateView handleReloadDashboard={handleReloadDashboard} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardView;
