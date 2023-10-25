import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { masterPageView } from "../../config/RoutePathConfig";
import PageTitleComponent from "../../components/PageTitleComponent";
import LoaderContainerComponent from "../../components/LoaderContainerComponent";
import UserTypesView from "./UserTypesView";
import FollowupTypesView from "./FollowupTypesView";
import DocumentTypesView from "./DocumentTypesView";
import LineTubeTypesView from "./LineTubeTypesView";
import PastHistoryTypesView from "./PastHistoryTypesView";
import InvestigationTypesView from "./InvestigationTypesView";
import HourlyInvestigationTypesView from "./HourlyInvestigationTypesView";
import ExaminationTypesView from "./ExaminationTypesView";
import BodyProfileTypesView from "./BodyProfileTypesView";
import MedicineTypesView from "./MedicineTypesView";
import PastHistoryParamsView from "./PastHistoryParamsView";
import InvestigationParamsView from "./InvestigationParamsView";
import HourlyInvestigationParamsView from "./HourlyInvestigationParamsView";
import ExaminationParamsView from "./ExaminationParamsView";
import BodyProfileParamsView from "./BodyProfileParamsView";

const MasterPagesView = (props) => {
  const { match } = props;

  // Set module variables
  const backButtonText = "Back";
  const pageView = masterPageView;
  let history = useHistory();

  // Set state
  const [pageLoaded, setPageLoaded] = useState(false);
  const currentPageView = pageView[match.params["page"]] ? pageView[match.params["page"]] : pageView["user_types"];
  const pageTitle = pageView[match.params["page"]];

  useEffect(() => {
    async function getDetails() {
      setPageLoaded(true);
    }
    getDetails();
  }, []);

  if (!pageLoaded) {
    return (<LoaderContainerComponent title="" />);
  }
  return (
    <main role="main" className="main-content">
      <div className="container-fluid">
        <div className="row justify-content-center mb-3">
          <div className="col-12">
            <div className="row align-items-center">
              <div className="col">
                <PageTitleComponent title={pageTitle} />
              </div>
              <div className="col-auto">                
                <button type="button" className="btn btn-outline-secondary" onClick={() => {history.goBack();}}>
                  {backButtonText}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="card shadow">
              <div className="card-body">
                {currentPageView === pageView["user_types"] && 
                  (
                    <UserTypesView />
                  )
                }
                {currentPageView === pageView["followup_types"] && 
                  (
                    <FollowupTypesView />
                  )
                }
                {currentPageView === pageView["document_types"] && 
                  (
                    <DocumentTypesView />
                  )
                }
                {currentPageView === pageView["line_tube_types"] && 
                  (
                    <LineTubeTypesView />
                  )
                }
                {currentPageView === pageView["past_history_type"] && 
                  (
                    <PastHistoryTypesView />
                  )
                }
                {currentPageView === pageView["investigation_types"] && 
                  (
                    <InvestigationTypesView />
                  )
                }
                {currentPageView === pageView["hourly_investigation_types"] && 
                  (
                    <HourlyInvestigationTypesView />
                  )
                }
                {currentPageView === pageView["examination_types"] && 
                  (
                    <ExaminationTypesView />
                  )
                }
                {currentPageView === pageView["body_profile_types"] && 
                  (
                    <BodyProfileTypesView />
                  )
                }
                {currentPageView === pageView["medicine_types"] && 
                  (
                    <MedicineTypesView />
                  )
                }
                {currentPageView === pageView["past_history_params"] && 
                  (
                    <PastHistoryParamsView />
                  )
                }
                {currentPageView === pageView["investigation_params"] && 
                  (
                    <InvestigationParamsView />
                  )
                }
                {currentPageView === pageView["hourly_investigation_params"] && 
                  (
                    <HourlyInvestigationParamsView />
                  )
                }
                {currentPageView === pageView["examination_params"] && 
                  (
                    <ExaminationParamsView />
                  )
                }
                {currentPageView === pageView["body_profile_params"] && 
                  (
                    <BodyProfileParamsView />
                  )
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MasterPagesView;
