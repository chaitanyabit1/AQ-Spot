import React, { useState, useEffect } from "react";
import LoaderComponent from "../../components/LoaderComponent";
import defaultImg from "../../assets/img/default-patient.png";
import InvestigationView from "./InvestigationView";
import ClinicalNotesView from "./ClinicalNotesView";
import MedicinesView from "./MedicinesView";
import EditView from "../patients/EditView";
import { getAgeFromBirthDate } from "../../services/PatientAdmissionService";
import { viewRow } from "../../services/PatientService";
import { NotificationManager } from "react-notifications";
import { COMMON_MESSAGES } from "../../config/AppConfig";

const ProfileView = (props) => {
  const { patientId, discharged, admissionId } = props;

  // Set state
  const [patientInfo, setPatientInfo] = useState(null);
  const [showEditView, setShowEditView] = useState(false);
  const [reloadData, setReloadData] = useState(false);

  // Handle events
  const handleShowEditView = () => {
    setShowEditView(true);
  };
  const handleHideEditView = () => {
    setShowEditView(false);
  };
  const handleHideEditViewReload = () => {
    setShowEditView(false);
    setReloadData(!reloadData);
  };

  // Fetch data
  useEffect(() => {
    //Patient info
    viewRow(patientId).then((res) => {
      setPatientInfo(res.data);
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });
  }, [patientId, admissionId, reloadData]);

  if (patientInfo === null) {
    return <LoaderComponent />;
  }

  return (
    <div className="row">
      <div className="col-12">
        <div className="row admission_are">
          <div className="col-md-2 text-center">
            <div className="avatar mb-2">
              <img src={defaultImg} alt="..." className="avatar-img rounded-circle" />
            </div>
            {!discharged && 
              (
                <button type="button" className="btn btn-sm btn-primary" onClick={handleShowEditView}>
                Edit Profile
                </button>
              )
            }
          </div>
          <div className="col-md-10">
            <h4 className="mb-1">{patientInfo.first_name} {patientInfo.middle_name} {patientInfo.last_name}</h4>

            <div className="row">
              <div className="col-md-6">
                {patientInfo.address && (<p className="small mb-0 text-muted">{patientInfo.address}</p>)}
                {patientInfo.city && (<p className="small mb-0 text-muted">{patientInfo.city}</p>)}
                {patientInfo.state && (<p className="small mb-0 text-muted">{patientInfo.state}</p>)}
                {patientInfo.country && (<p className="small mb-0 text-muted">{patientInfo.country}</p>)}
                {patientInfo.pincode && (<p className="small mb-0 text-muted">{patientInfo.pincode}</p>)}
              </div>
              <div className="col-md-4">
                {patientInfo.birth_date && (<p className="small mb-0 text-muted">{getAgeFromBirthDate(patientInfo.birth_date)}</p>)}
                {patientInfo.email && (<p className="small mb-0 text-muted">{patientInfo.email}</p>)}
                {patientInfo.phone && (<p className="small mb-0 text-muted">{patientInfo.phone}</p>)}
                {/* {patientInfo.emergencyPhone && (<p className="small mb-0 text-muted">{patientInfo.emergencyPhone}</p>)} */}
              </div>
            </div>
          </div>
        </div>
        <br />
        <InvestigationView patientId={patientId} admissionId={admissionId} discharged={discharged} from="profile" />
        <br />
        <ClinicalNotesView patientId={patientId} admissionId={admissionId} discharged={discharged} from="profile" />
        <br />
        <MedicinesView patientId={patientId} admissionId={admissionId} discharged={discharged} from="profile" />
        
        {showEditView && (
        <EditView
          handleHideEditView={handleHideEditView}
          handleHideEditViewReload={handleHideEditViewReload}
          patientId={patientId}
        />
      )}
      </div>
    </div>
  );
};

export default ProfileView;
