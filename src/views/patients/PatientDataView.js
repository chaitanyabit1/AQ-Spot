import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { RoutePaths, getRoutePatientAdmission } from "../../config/RoutePathConfig";
import PageTitleComponent from "../../components/PageTitleComponent";
import LoaderComponent from "../../components/LoaderComponent";
import defaultImg from "../../assets/img/default-patient.png";
import EditView from "./EditView";
import { getAgeFromBirthDate } from "../../services/PatientAdmissionService";
import { viewRow, listAllAdmission } from "../../services/PatientService";
import { NotificationManager } from "react-notifications";
import { COMMON_MESSAGES } from "../../config/AppConfig";

const PatientDataView = (props) => {
  const { match } = props;

  // Set module variables
  const pageTitle = "Patient Information";
  const backButtonText = "Back";

  // Set state
  const patientId = match.params["id"];
  const [showEditView, setShowEditView] = useState(false);
  const [patientInfo, setPatientInfo] = useState(null);
  const [pastAdmissionHistory, setPastAdmissionHistory] = useState([]);
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

  useEffect(() => {
    viewRow(patientId).then((res) => {
      setPatientInfo(res.data);
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });

    listAllAdmission(patientId).then((res) => {
      const data = res.data;
      const listData = [];
      data.forEach((item) => {
        listData.push({
          id: item.id,
          admissionNumber: item.admission_number,
          bedNumber: item.bed_number,
          hospital: item.hospital || "",
          icuWard: item.icuward || "",
          inDate: item.check_in,
          outDate: item.check_out || "-",
          notes: item.notes || ""
        });
      });
      setPastAdmissionHistory(listData);
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });
  }, [reloadData, patientId]);

  if (patientInfo === null) {
    return <LoaderComponent />;
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
                <button type="button" className="btn btn-outline-primary ml-2" onClick={handleShowEditView}>
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="card shadow">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12">
                    <div className="row">
                      <div className="col-md-2 text-center">
                        <div className="avatar">
                          <img src={defaultImg} alt="..." className="avatar-img rounded-circle" />
                        </div>
                      </div>
                      <div className="col-md-10">
                        <h4 className="mb-1">{patientInfo.first_name} {patientInfo.middle_name} {patientInfo.last_name}</h4>

                        <div className="row">
                          <div className="col-md-5">
                            {patientInfo.address && (<p className="small mb-0 text-muted">{patientInfo.address}</p>)}
                            {patientInfo.city && (<p className="small mb-0 text-muted">{patientInfo.city}</p>)}
                            {patientInfo.state && (<p className="small mb-0 text-muted">{patientInfo.state}</p>)}
                            {patientInfo.country && (<p className="small mb-0 text-muted">{patientInfo.country}</p>)}
                            {patientInfo.pincode && (<p className="small mb-0 text-muted">{patientInfo.pincode}</p>)}
                          </div>
                          <div className="col-md-5">
                            {patientInfo.birth_date && (<p className="small mb-0 text-muted">{getAgeFromBirthDate(patientInfo.birth_date)}</p>)}
                            {patientInfo.email && (<p className="small mb-0 text-muted">{patientInfo.email}</p>)}
                            {patientInfo.phone && (<p className="small mb-0 text-muted">{patientInfo.phone}</p>)}
                            {/* {patientInfo.emergencyPhone && (<p className="small mb-0 text-muted">{patientInfo.emergencyPhone}</p>)} */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <br /><br />
                <div className="row">
                  <div className="col-md-12">
                    <h4 className="mb-1">Past Admission History</h4>
                    <table className="table table-borderless">
                      <thead>
                        <tr>
                          <th className="col-wd-10">Number</th>
                          <th className="col-wd-15">In Date</th>
                          <th className="col-wd-15">Out Date</th>
                          <th className="col-wd-20">Hospital</th>
                          <th className="col-wd-10">Ward</th>
                          <th className="col-wd-10">Bed Number</th>
                          <th className="col-wd-20">Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pastAdmissionHistory && pastAdmissionHistory.map((row, index) => (
                          <tr key={index}>
                            <td>
                              <Link to={getRoutePatientAdmission(patientId, row.id, "profile")}>
                                {row.admissionNumber}
                              </Link>
                            </td>
                            <td>{row.inDate}</td>
                            <td>{row.outDate}</td>
                            <td>{row.hospital}</td>
                            <td>{row.icuWard}</td>
                            <td>{row.bedNumber}</td>
                            <td>{row.notes}</td>
                          </tr>
                        ))}
                        {pastAdmissionHistory.length === 0 && (
                          <tr>
                            <td className="text-center" colSpan="7">No past admission history found.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showEditView && (
        <EditView
          handleHideEditView={handleHideEditView}
          handleHideEditViewReload={handleHideEditViewReload}
          patientId={patientId}
        />
      )}
    </main>
  );
};

export default PatientDataView;
