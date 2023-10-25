import React, { useState, useEffect } from "react";
import { RoutePaths } from "../../config/RoutePathConfig";
import { Link } from "react-router-dom";
import { getAllCritical } from "../../services/PatientService";
import patientDefaultImg from "../../assets/img/default-patient.png";
import { NotificationManager } from "react-notifications";
import { COMMON_MESSAGES } from "../../config/AppConfig";

const QuickCriticalPatientsView = (props) => {
  const { handleReloadDashboard } = props;
  // Set module variables
  const pageTitle = "Critical Patients";

  // Set state
  const [rowsData, setRowsData] = useState([]);

  useEffect(() => {
    getAllCritical().then((res) => {
      const data = res.data;
      const listData = [];
      data.forEach((item) => {
        listData.push({
          id: item.id,
          name: item.name,
          hospitalName: item.hospital || "",
        });
      });
      setRowsData(listData);
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });
  }, [handleReloadDashboard]);

  return (
    <div className="card shadow">
      <div className="card-header">
        <strong className="card-title">{pageTitle}</strong>
        <Link className="float-right small text-muted" to={RoutePaths.PATIENTS}>
          View all
        </Link>
      </div>
      <div className="card-body dashboard-quick-cards-1">
        <div className="list-group list-group-flush my-n3">
          {rowsData && rowsData.map((row, index) => (
            <div className="list-group-item" key={index}>
              <div className="row">
                <div className="col-auto">
                  <div className="avatar avatar-sm mt-2">
                    <Link to={(RoutePaths.PATIENTS_VIEW).replace(":id", row.id)}>
                      <img
                        src={patientDefaultImg}
                        alt="N"
                        className="avatar-img rounded-circle"
                      />
                    </Link>
                  </div>
                </div>
                <div className="col">
                  <Link to={(RoutePaths.PATIENTS_VIEW).replace(":id", row.id)}>
                    <small>
                      <strong>{row.name}</strong>
                    </small>
                  </Link>
                  <div className="my-0 text-muted small">{row.hospitalName}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickCriticalPatientsView;
