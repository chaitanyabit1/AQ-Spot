import React, { useState, useEffect } from "react";
import { RoutePaths } from "../../config/RoutePathConfig";
import { Link } from "react-router-dom";
import { listAllRecent } from "../../services/FollowupService";
import { NotificationManager } from "react-notifications";
import { COMMON_MESSAGES } from "../../config/AppConfig";

const QuickListView = (props) => {
  const { handleReloadDashboard } = props;
  // Set module variables
  const pageTitle = "Recent Followups";

  // Set state
  const [rowsData, setRowsData] = useState([]);

  useEffect(() => {
    listAllRecent().then((res) => {
      const data = res.data;
      const listData = [];
      data.forEach((item) => {
        let styleClass = item.status === "Open" ? "primary" : ((item.status === "Viewed") ? "warning" : "secondary");

        listData.push({
          id: item.id,
          instructions: item.instructions,
          patient: item.patient || "None",
          patientId: item.patient_id,
          type: item.type || "Unknown",
          status: item.status,
          styleClass: styleClass
        });
      });        
      setRowsData(listData);
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });
  }, [handleReloadDashboard]);

  return (
    <div className="card shadow timeline">
      <div className="card-header">
        <strong className="card-title">{pageTitle}</strong>
        <Link
          className="float-right small text-muted"
          to={RoutePaths.FOLLOWUPS}
        >
          View all
        </Link>
      </div>
      <div className="card-body dashboard-quick-cards-1">
        {rowsData && rowsData.map((row, index) => (
          <div className={"pb-3 timeline-item item-" + row.styleClass} key={index}>
            <div className="pl-5" key={index}>
              <div className="mb-1">
                <Link to={(RoutePaths.PATIENTS_VIEW).replace(":id", row.patientId)}>
                  <div>
                    <strong>{row.patient}</strong>
                  </div>
                </Link>
                <div>{row.type}</div>
                <div className="text-muted">
                  {row.instructions}
                </div>
                <p className={"badge badge-pill badge-" + row.styleClass + " mt-1 mb-1"}>{row.status}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickListView;
