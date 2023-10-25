import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import LoaderComponent from "../../components/LoaderComponent";
import { DATE_TIME_FORMAT } from "../../config/AppConfig";
import AddNotesView from "./AddNotesView";
import ListNotesView from "./ListNotesView";
import moment from "moment";
import { viewRow } from "../../services/FollowupService";
import { NotificationManager } from "react-notifications";
import { COMMON_MESSAGES } from "../../config/AppConfig";

const DataView = (props) => {
  const { handleHideDataView, rowId } = props;

  // Set module variables
  const pageTitle = "Followup";

  // Set state
  const [reloadNoteListData, setReloadNoteListData] = useState(false);
  const [rowData, setRowData] = useState({
    id: null,
    followType: "",
    hospital: "",
    icuWard: "",
    instructions: "",
    patient: "",
    createdBy: "",
    createdAt: "",
    viewedBy: "",
    viewedAt: "",
    status: ""
  });

  useEffect(() => {
    viewRow(rowId).then((res) => {
      const data = res.data;
      setRowData({
        id: rowId,
        followType: data.type || "Unknown",
        hospital: data.hospital || "Unknown",
        icuWard: data.icuward || "Unknown",
        instructions: data.instructions,
        patient: data.patient || "None",
        createdBy: data.create_by || "Unknown",
        createdAt: (data.created_at) ? moment(Date.parse(new Date(data.created_at*1000).toString())).format(DATE_TIME_FORMAT.DDMMYYYYhhmma) : "-",
        viewedBy: data.view_by || "Unknown",
        viewedAt: (data.viewed_at) ? moment(Date.parse(new Date(data.viewed_at*1000).toString())).format(DATE_TIME_FORMAT.DDMMYYYYhhmma) : "-",
        status: data.status
      });
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });
  }, [rowId]);

  const reloadFollowupNotes = () => {    
    setReloadNoteListData(!reloadNoteListData);
  };

  if(rowData.id === null) {
    return <LoaderComponent />;
  }

  return (
    <Modal
      size="lg"
      aria-labelledby="example-modal-sizes-title-lg"
      show={true}
      onHide={handleHideDataView}
      className="fade show"
    >
      <Modal.Header closeButton>
        <Modal.Title>{pageTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="form-group followup_are_view">
            <b>Instructions:</b> {rowData.instructions}
        </div>
        <div className="row">
          <div className="col-md-4">
            <div className="form-group followup_are_view">
                <b>FollowupType:</b> {rowData.followType}
            </div>
            <div className="form-group followup_are_view">
                <b>CreatedBy:</b> {rowData.createdBy}
            </div>
            <div className="form-group followup_are_view">
                <b>Status:</b> {rowData.status}
            </div> 
          </div>
          <div className="col-md-4">
            <div className="form-group followup_are_view">
                <b>CreatedAt:</b> {rowData.createdAt}
            </div>
            <div className="form-group followup_are_view">
                <b>ViewedBy:</b> {rowData.viewedBy}
            </div>
            <div className="form-group followup_are_view">
                <b>ViewedAt:</b> {rowData.createdAt}
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group followup_are_view">
                <b>Patient:</b> {rowData.patient}
            </div>
            <div className="form-group followup_are_view">
                <b>Hospital:</b> {rowData.hospital}
            </div>
            <div className="form-group followup_are_view">
                <b>ICU Ward:</b> {rowData.icuWard}
            </div>
          </div>

          <div className="col-md-12">
              <ListNotesView rowID={rowId} reloadFollowupNotes={reloadFollowupNotes} />
          </div>
            &nbsp;
          <div className="col-md-12">
            <AddNotesView reloadFollowupNotes={reloadFollowupNotes} rowID={rowId} rowStatus={rowData.status} />
          </div>
        </div>
        <br />
        <button type="button" className="btn btn-primary" onClick={handleHideDataView}>
            Cancel
        </button>
  
      </Modal.Body>
    </Modal>
  );
};

export default DataView;
