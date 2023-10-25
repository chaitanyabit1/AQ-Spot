import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import LoaderComponent from "../../components/LoaderComponent";
import { viewRow } from "../../services/UsersService";
import { NotificationManager } from "react-notifications";
import { COMMON_MESSAGES } from "../../config/AppConfig";

const DataView = (props) => {
  const { handleHideDataView, rowId } = props;

  // Set module variables
  const pageTitle = "User";

  // Set state
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    viewRow(rowId).then((res) => {
      const data = res.data;
      setRowData({
        id: rowId,
        userType: data.user_type || "Unknown",
        accessPolicy: data.access_policy || "Unknown",
        firstName: data.first_name || "-",
        middleName: data.middle_name || "-",
        lastName: data.last_name || "-",
        email: data.email || "-",
        designation: data.designation || "-",
        photo: (data.photo) ? data.photo : ""
      });
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });
  }, [rowId]);

  if(rowData.id === null) {
    return <LoaderComponent />;
  }

  return (
    <Modal
      size="lg"
      aria-labelledby="example-modal-sizes-title-lg"
      show={true}
      onHide={handleHideDataView}
      className="fade show admission_userview"
    >
      <Modal.Header closeButton>
        <Modal.Title>{pageTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
                <b>User Type:</b> {rowData.userType}
            </div>
            <div className="form-group">
                <b>User Policy:</b> {rowData.accessPolicy}
            </div>
            <div className="form-group">
                <b>FirstName:</b> {rowData.firstName}
            </div>
            <div className="form-group">
                <b>MiddleName:</b> {rowData.middleName}
            </div>
            <div className="form-group">
                <b>LastName:</b> {rowData.lastName}
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
                <b>Email:</b> {rowData.email}
            </div>
            <div className="form-group">
                <b>Designation:</b> {rowData.designation}
            </div>
            <div className="form-group">
              {rowData.photo && (
                <div><b>Photo:</b> <br />
                <img src={process.env.REACT_APP_UPLOAD_URL + rowData.photo} 
                alt="..."
                className="avatar-img"
                width="20%"
                height="20%" 
                />
                </div>
              )
              }
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DataView;
