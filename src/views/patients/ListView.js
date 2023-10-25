import React from "react";
import { Link, useHistory } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import {
  MODULE_ACTION,
  MODULE_ACTION_SEP,
  extractModuleData,
  USER_TYPE,
  USER_RESTRICT_ROUTE
} from "../../config/AppConfig";
import { RoutePaths, getRoutePatientAdmission } from "../../config/RoutePathConfig";
import defaultImg from "../../assets/img/default-patient.png";
import { getUserAccesses, getUserDetails } from "../../session/UserSession";

const ListView = (props) => {
  const { data, setPatientAdmit, setPatientDischarge, setPatientCritical, setRowDelete } = props;
  let history = useHistory();

  const handleAdmitAction = (val) => {
    setPatientAdmit(val);
  }
  const handleDischargeAction = (val) => {
    setPatientDischarge(val);
  }

  // Handle events
  const handleActionSelect = (val) => {
    const actionData = extractModuleData(val);
    let page = "";

    switch (actionData[0]) {
      case MODULE_ACTION.PATIENT_MENU.profileView:
        page = (RoutePaths.PATIENTS_VIEW).replace(":id", actionData[1]);
        history.push(page);
        break;

      case MODULE_ACTION.PATIENT_MENU.profile:
        page = getProfileURL(actionData[1], actionData[2]);
        history.push(page);
        break;
      
      case MODULE_ACTION.PATIENT_MENU.admission:
        page = getRoutePatientAdmission(actionData[1], actionData[2], "admission");
        history.push(page);
        break;
      
      case MODULE_ACTION.PATIENT_MENU.pastHistory:
        page = getRoutePatientAdmission(actionData[1], actionData[2], "past-history");
        history.push(page);
        break;
    
      case MODULE_ACTION.PATIENT_MENU.hourlyReport:
        page = getRoutePatientAdmission(actionData[1], actionData[2], "hourly-report");
        history.push(page);
        break;

      case MODULE_ACTION.PATIENT_MENU.investigation:
        page = getRoutePatientAdmission(actionData[1], actionData[2], "investigation");
        history.push(page);
        break;

      case MODULE_ACTION.PATIENT_MENU.medicines:
        page = getRoutePatientAdmission(actionData[1], actionData[2], "medicines");
        history.push(page);
        break;

      case MODULE_ACTION.PATIENT_MENU.clinical:
        page = getRoutePatientAdmission(actionData[1], actionData[2], "clinical-notes");
        history.push(page);
        break;

      case MODULE_ACTION.PATIENT_MENU.lineTubes:
        page = getRoutePatientAdmission(actionData[1], actionData[2], "line-tubes");
        history.push(page);
        break;

      case MODULE_ACTION.PATIENT_MENU.followups:
        page = getRoutePatientAdmission(actionData[1], actionData[2], "followups");
        history.push(page);
        break;

      case MODULE_ACTION.PATIENT_MENU.documents:
        page = getRoutePatientAdmission(actionData[1], actionData[2], "documents");
        history.push(page);
        break;

      case MODULE_ACTION.CRITICAL:
        setPatientCritical(actionData[1], true);
        break;

      case MODULE_ACTION.NOT_CRITICAL:
        setPatientCritical(actionData[1], false);
        break;

      case MODULE_ACTION.DELETE:
        setRowDelete(actionData[1]);
        break;

      default:
        break;
    }
  };

  const getProfileURL = (id, admissionId) => {
      let page = "";
      page = (RoutePaths.PATIENTS_VIEW_ADMISSION).replace(":id", id);
      page = page.replace(":admissionId", admissionId);
      page = page.replace(":tab", "profile");
      return page;
  }

  return (
    <div className="row patientslist_view">
      {data && data.map((row, index) => (
        <div className="col-md-3" key={index}>
          <div className={"card shadow mb-4 prp_hgt" + ((row.isCritical) ? " border-danger" : "")}>
            <div className="card-body text-center">
              <div className="avatar avatar-lg mt-4">
                <Link to={row.currentAdmissionId ? getProfileURL(row.id, row.currentAdmissionId) : ((RoutePaths.PATIENTS_VIEW).replace(":id", row.id))}>
                  <img
                    src={defaultImg}
                    alt="..."
                    className="avatar-img rounded-circle"
                  />
                </Link>
              </div>
              <div className="card-text my-2">
                <Link to={row.currentAdmissionId ? getProfileURL(row.id, row.currentAdmissionId) : ((RoutePaths.PATIENTS_VIEW).replace(":id", row.id))}>
                  <strong className="card-title my-0">{row.name}</strong>
                </Link>
                <p className="small text-muted mb-0 patient-address">
                  {row.address}
                </p>
              </div>
              {Boolean(row.isCritical) && <div className="critical-card"><i className="fas fa-exclamation"></i></div>}
            </div>
            <div className="card-footer">
              <div className="row align-items-center justify-content-between">
                <div className="col-auto nomrgleft">
                  {(getUserAccesses().includes(USER_RESTRICT_ROUTE.PATIENT_DISCHARGE) || [USER_TYPE.SUPER_ADMIN, USER_TYPE.CCC_DOCTOR, USER_TYPE.DOCTOR].includes(getUserDetails().user_type)) &&
                  <>
                    {row.hospitalId && row.icuWardId && row.currentAdmissionId && (<button type="button" className="btn btn-sm btn-warning" onClick={() => handleDischargeAction(row.id)}>Discharge</button>)}
                  </>
                  }
                  {(getUserAccesses().includes(USER_RESTRICT_ROUTE.PATIENT_ADMIT) || [USER_TYPE.SUPER_ADMIN, USER_TYPE.CCC_DOCTOR, USER_TYPE.DOCTOR].includes(getUserDetails().user_type)) &&
                  <>
                    {!(row.currentAdmissionId) && (<button type="button" className="btn btn-sm btn-primary" onClick={() => handleAdmitAction(row.id)}>Admit</button>)}
                  </>
                  }
                </div>
                <div className="col-auto nomrgright">
                  <Dropdown
                    id={Math.random()}
                    onSelect={handleActionSelect}
                    className="data-action"
                  >
                    <Dropdown.Toggle
                      variant="secondary"
                      className="btn-sm"
                      data-toggle="dropdown"
                    >
                      <i className="fas fa-ellipsis-h"></i>
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item
                        eventKey=
                        {
                          row.currentAdmissionId ? 
                          MODULE_ACTION.PATIENT_MENU.profile +
                          MODULE_ACTION_SEP +
                          row.id +
                          MODULE_ACTION_SEP +
                          row.currentAdmissionId
                          :
                          MODULE_ACTION.PATIENT_MENU.profileView +
                          MODULE_ACTION_SEP +
                          row.id
                        }
                      >
                        View
                      </Dropdown.Item>
                      {row.hospitalId && row.icuWardId && (
                        <Dropdown.Item
                          eventKey={
                            MODULE_ACTION.PATIENT_MENU.admission +
                            MODULE_ACTION_SEP +
                            row.id +
                            MODULE_ACTION_SEP +
                            row.currentAdmissionId
                          }
                        >
                          Admission Details
                        </Dropdown.Item>
                      )}
                      {row.hospitalId && row.icuWardId && (
                        <Dropdown.Item
                          eventKey={
                            MODULE_ACTION.PATIENT_MENU.pastHistory +
                            MODULE_ACTION_SEP +
                            row.id +
                            MODULE_ACTION_SEP +
                            row.currentAdmissionId
                          }
                        >
                          Past History
                        </Dropdown.Item>
                      )}
                      {row.hospitalId && row.icuWardId && (
                        <Dropdown.Item
                          eventKey={
                            MODULE_ACTION.PATIENT_MENU.hourlyReport +
                            MODULE_ACTION_SEP +
                            row.id +
                            MODULE_ACTION_SEP +
                            row.currentAdmissionId
                          }
                        >
                          Hourly Report
                        </Dropdown.Item>
                      )}
                      {row.hospitalId && row.icuWardId && (
                        <Dropdown.Item
                          eventKey={
                            MODULE_ACTION.PATIENT_MENU.investigation +
                            MODULE_ACTION_SEP +
                            row.id +
                            MODULE_ACTION_SEP +
                            row.currentAdmissionId
                          }
                        >
                          Investigation
                        </Dropdown.Item>
                      )}
                      {row.hospitalId && row.icuWardId && (
                        <Dropdown.Item
                          eventKey={
                            MODULE_ACTION.PATIENT_MENU.medicines +
                            MODULE_ACTION_SEP +
                            row.id +
                            MODULE_ACTION_SEP +
                            row.currentAdmissionId
                          }
                        >
                          Medicines
                        </Dropdown.Item>
                      )}
                      {row.hospitalId && row.icuWardId && (
                        <Dropdown.Item
                          eventKey={
                            MODULE_ACTION.PATIENT_MENU.clinical +
                            MODULE_ACTION_SEP +
                            row.id +
                            MODULE_ACTION_SEP +
                            row.currentAdmissionId
                          }
                        >
                          Clinical Notes
                        </Dropdown.Item>
                      )}
                      {row.hospitalId && row.icuWardId && (
                        <Dropdown.Item
                          eventKey={
                            MODULE_ACTION.PATIENT_MENU.lineTubes +
                            MODULE_ACTION_SEP +
                            row.id +
                            MODULE_ACTION_SEP +
                            row.currentAdmissionId
                          }
                        >
                          Lines / Tubes
                        </Dropdown.Item>
                      )}
                      {row.hospitalId && row.icuWardId && (
                        <Dropdown.Item
                          eventKey={
                            MODULE_ACTION.PATIENT_MENU.followups +
                            MODULE_ACTION_SEP +
                            row.id +
                            MODULE_ACTION_SEP +
                            row.currentAdmissionId
                          }
                        >
                          Followups
                        </Dropdown.Item>
                      )}
                      {row.hospitalId && row.icuWardId && (
                        <Dropdown.Item
                          eventKey={
                            MODULE_ACTION.PATIENT_MENU.documents +
                            MODULE_ACTION_SEP +
                            row.id +
                            MODULE_ACTION_SEP +
                            row.currentAdmissionId
                          }
                        >
                          Documents
                        </Dropdown.Item>
                      )}
                      {row.hospitalId && row.icuWardId && row.isCritical && (
                        <Dropdown.Item
                          eventKey={
                            MODULE_ACTION.NOT_CRITICAL +
                            MODULE_ACTION_SEP +
                            row.id
                          }
                        >
                          <span className="text-success">Mark as Not Critical</span>
                        </Dropdown.Item>
                      )}
                      {row.hospitalId && row.icuWardId && !row.isCritical && (
                        <Dropdown.Item
                          eventKey={
                            MODULE_ACTION.CRITICAL +
                            MODULE_ACTION_SEP +
                            row.id
                          }
                        >
                          <span className="text-danger">Mark as Critical</span>
                        </Dropdown.Item>
                      )}
                      <Dropdown.Item
                        eventKey={
                          MODULE_ACTION.DELETE +
                          MODULE_ACTION_SEP +
                          row.id
                        }
                      >
                        Delete
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListView;
