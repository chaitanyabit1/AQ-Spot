import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import LoaderComponent from "../../components/LoaderComponent";
import { viewRow } from "../../services/HospitalsService";
import { listAllByHospital } from "../../services/ICUService";
import { NotificationManager } from "react-notifications";
import { COMMON_MESSAGES } from "../../config/AppConfig";

const DataView = (props) => {
  const { handleHideDataView, rowId } = props;

  // Set module variables
  const pageTitle = "Hospital";

  // Set state
  const [rowData, setRowData] = useState([]);
  const [rowICUData, setRowICUData] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    viewRow(rowId).then((res) => {
      const hospitalData = res.data;
      const hospitalSub = hospitalData.subscription;
      setRowData({
        id: rowId,
        name: hospitalData.name || "-",
        address: hospitalData.address || "-",
        city: hospitalData.city || "-",
        state: hospitalData.state || "-",
        country: hospitalData.country || "-",
        email: hospitalData.email || "-",
        pincode: hospitalData.pincode || "-",
        contactPerson: hospitalData.contact_person || "-",
        contactPhone: hospitalData.contact_number || "-",
        sub_startDate: hospitalSub.sub_start || "-",
        sub_endDate: hospitalSub.sub_end || "-",
        sub_amount: hospitalSub.amount || "-",
        sub_paymentMethod: hospitalSub.paymentMethod || "-",
        sub_notes: hospitalSub.notes || "-"
      });
      setDataLoaded(true);
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });

    listAllByHospital(rowId).then((res) => {
      setRowICUData(res.data);
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });
  }, [rowId]);

  if(!dataLoaded) {
    return <LoaderComponent />;
  }

  return (
    <Modal
      size="lg"
      aria-labelledby="example-modal-sizes-title-lg"
      show={true}
      onHide={handleHideDataView}
      className="fade show "
    >
      <Modal.Header closeButton>
        <Modal.Title>{pageTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-md-12"><h4>Info</h4></div>
          <div className="col-md-6">
            <div className="form-group">
                <b>Name:</b> {rowData.name}
            </div>
            <div className="form-group">
                <b>Address:</b> {rowData.address}
            </div>
            <div className="form-group">
                <b>City:</b> {rowData.city}
            </div>
            <div className="form-group">
                <b>State:</b> {rowData.state}
            </div>
            <div className="form-group">
                <b>Country:</b> {rowData.country}
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
                <b>Email:</b> {rowData.email}
            </div>
            <div className="form-group">
                <b>Pincode:</b> {rowData.pincode}
            </div>
            <div className="form-group">
                <b>Contact Person:</b> {rowData.contactPerson}
            </div>
            <div className="form-group">
                <b>Contact Phone:</b> {rowData.contactPhone}
            </div>            
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-md-12"><h4>Subscription</h4></div>
          <div className="col-md-6">
            <div className="form-group">
                <b>Start Date:</b> {rowData.sub_startDate}
            </div>
            <div className="form-group">
                <b>End Date:</b> {rowData.sub_endDate}
            </div>
            <div className="form-group">
                <b>Amount:</b> {rowData.sub_amount}
            </div>            
          </div>
          <div className="col-md-6">
            <div className="form-group">
                <b>Payment Method:</b> {rowData.sub_paymentMethod}
            </div>
            <div className="form-group">
                <b>Notes:</b> {rowData.sub_notes}
            </div>
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-md-12"><h4>ICU Ward</h4></div>
          <div className="col-md-12">
          <table className="table table-borderless">
            <thead>
              <tr>
                <th className="col-wd-40">Ward Name</th>
                <th className="col-wd-40">Capacity</th>
              </tr>
            </thead>
            <tbody>
              {rowICUData.map((row, index) => (
                <tr key={index}>
                  <td>{row.name}</td>
                  <td>{row.capacity}</td>
                </tr>
              ))}   
            </tbody>
          </table>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DataView;
