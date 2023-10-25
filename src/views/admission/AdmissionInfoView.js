import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { RoutePaths, getRoutePatientAdmission } from "../../config/RoutePathConfig";
import PageTitleComponent from "../../components/PageTitleComponent";
import LoaderContainerComponent from "../../components/LoaderContainerComponent";
import ProfileView from "./ProfileView";
import AdmissionView from "./AdmissionView";
import PastHistoryView from "./PastHistoryView";
import HourlyReportView from "./HourlyReportView";
import MedicinesView from "./MedicinesView";
import InvestigationView from "./InvestigationView";
import ClinicalNotesView from "./ClinicalNotesView";
import LineTubesView from "./LineTubesView";
import FollowupsView from "./FollowupsView";
import DocumentsView from "./DocumentsView";
import DischargeView from "../patients/DischargeView";
import { viewRow } from "../../services/PatientService";
import { NotificationManager } from "react-notifications";
import { COMMON_MESSAGES } from "../../config/AppConfig";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

const SampleView = (props) => {
  const { match } = props;

  // Set module variables
  const pageTitle = "Patient Admission Information";
  const backButtonText = "Back";
  const pageView = {
    "profile": "Profile",
    "admission": "Admission",
    "past-history": "Past History",
    "hourly-report": "Hourly Report",
    "investigation": "Investigation",
    "medicines": "Medicines",
    "clinical-notes": "Clinical Notes",
    "line-tubes": "Lines/Tubes",
    "followups": "Followups",
    "documents": "Documents",
  };

  // Set state
  const patientId = match.params["id"];
  const admissionId = match.params["admissionId"];
  const [discharged, setDischarged] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [showDischargeView, setShowDischargeView] = useState(false);
  const currentPageView = pageView[match.params["tab"]] ? pageView[match.params["tab"]] : pageView["profile"];

  const handleShowDischargeView = () => {
    setShowDischargeView(true);
  };
  const handleHideDischargeView = () => {
    setShowDischargeView(false);
  };
  const handleHideDischargeViewReload = () => {
    setDischarged(true);
    setShowDischargeView(false);
  };

  useEffect(() => {
    viewRow(patientId).then((res) => {
      const data = res.data;
      if (data.current_admission_id) {
        setDischarged(false);
      } else {
        setDischarged(true);
      }
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });    
    setPageLoaded(true);
  }, [patientId]);

  // Toggle sidebar menu
  const handleAdmissionNavbar = () => {
    if (document.querySelector("#admission-navbar-nav").classList.contains("show")) {
      document.querySelector("#btn-admission-navbar").click();
    }
  };

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
                <Link to={RoutePaths.PATIENTS}>
                  <button type="button" className="btn btn-outline-secondary">
                    {backButtonText}
                  </button>
                </Link>
                {!discharged && (
                  <button type="button" className="btn btn-outline-warning ml-2" onClick={() => handleShowDischargeView(patientId)}>Discharge</button>
                )}                
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="card shadow">
              <div className="card-body">
                {/*<ul className="nav nav-tabs mb-4" role="tablist">
                  {Object.keys(pageView).map(function(keyName, keyIndex) {
                    return (
                      <li className="nav-item" key={keyIndex}>
                        <Link to={getRoutePatientAdmission(patientId, admissionId, keyName)}>
                          <span className={"nav-link " + (currentPageView === pageView[keyName] ? "active" : "")}>
                            {pageView[keyName]}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul> */}
                <Navbar bg="light" className="patients_nvbar" expand="sm" collapseOnSelect>
                  <Navbar.Toggle aria-controls="admission-navbar-nav" id="btn-admission-navbar" />                  
                  <Navbar.Collapse id="admission-navbar-nav">
                    <Nav className="mr-auto">
                      {Object.keys(pageView).map(function(keyName, keyIndex) {
                        return (                          
                          <Link key={keyIndex} onClick={handleAdmissionNavbar} to={getRoutePatientAdmission(patientId, admissionId, keyName)}>
                            <span className={"nav-link " + (currentPageView === pageView[keyName] ? "active" : "")}>
                              {pageView[keyName]}
                            </span>
                          </Link>                         
                        );
                      })}
                    </Nav>
                  </Navbar.Collapse>
                </Navbar>

                {currentPageView === pageView["profile"] && 
                  (
                    <ProfileView 
                      patientId={patientId}
                      admissionId={admissionId}
                      discharged={discharged}
                    />
                  )
                }
                {currentPageView === pageView["admission"] && 
                  (
                    <AdmissionView 
                      patientId={patientId}
                      admissionId={admissionId}
                      discharged={discharged}
                    />
                  )
                }
                {currentPageView === pageView["past-history"] && 
                  (
                    <PastHistoryView 
                      patientId={patientId}
                      admissionId={admissionId}
                      discharged={discharged}
                    />
                  )
                }
                {currentPageView === pageView["hourly-report"] && 
                  (
                    <HourlyReportView 
                      patientId={patientId}
                      admissionId={admissionId}
                      discharged={discharged}
                    />
                  )
                }
                {currentPageView === pageView["medicines"] && 
                  (
                    <MedicinesView 
                      patientId={patientId}
                      admissionId={admissionId}
                      discharged={discharged}
                    />
                  )
                }
                {currentPageView === pageView["investigation"] && 
                  (
                    <InvestigationView 
                      patientId={patientId}
                      admissionId={admissionId}
                      discharged={discharged}
                    />
                  )
                }
                {currentPageView === pageView["clinical-notes"] && 
                  (
                    <ClinicalNotesView
                      patientId={patientId}
                      admissionId={admissionId}
                      discharged={discharged}
                    />
                  )
                }
                {currentPageView === pageView["line-tubes"] && 
                  (
                    <LineTubesView 
                      patientId={patientId}
                      admissionId={admissionId}
                      discharged={discharged}
                    />
                  )
                }
                {currentPageView === pageView["followups"] && 
                  (
                    <FollowupsView 
                      patientId={patientId}
                      admissionId={admissionId}
                      discharged={discharged}
                    />
                  )
                }
                {currentPageView === pageView["documents"] && 
                  (
                    <DocumentsView 
                      patientId={patientId}
                      admissionId={admissionId}
                      discharged={discharged}
                    />
                  )
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      {!discharged && showDischargeView && (
        <DischargeView
          handleHideDischargeView={handleHideDischargeView}
          handleHideDischargeViewReload={handleHideDischargeViewReload}
          rowId={patientId}
        />
      )}
    </main>
  );
};

export default SampleView;
