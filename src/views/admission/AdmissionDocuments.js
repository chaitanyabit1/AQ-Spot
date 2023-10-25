import React, { useEffect, useState } from "react";
import { listAllDocuments, deleteDocument, createDocument } from "../../services/PatientAdmissionService";
import Modal from "react-bootstrap/Modal";
import { COMMON_MESSAGES } from "../../config/AppConfig";
import { NotificationManager } from "react-notifications";
import { Link } from "react-router-dom";
import LoaderComponent from "../../components/LoaderComponent";
import defaultDocImg from "../../assets/img/default-doc.png";
import SweetAlert from "react-bootstrap-sweetalert";
import MultipleUploadComponent from "../../components/MultipleUploadComponent";
import { useForm } from "react-hook-form";

const AdmissionDocuments = (props) => {
  const { patientId, admissionId, rowId, handleHideDocumentsView, type } = props;

  // Set module variables
  const pageTitle = "All Documents";

  // Set state
  const [listData, setListData] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(0);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [reloadList, setReloadList] = useState(false);
  const { register, errors } = useForm();
  const [selectedFile, setSelectedFile] = useState([]);
  const [fileUploading, setFileUploading] = useState(false);

  useEffect(() => {
    setDataLoaded(false);
    if (selectedFile.length > 0) {
      const saveData = {
        reference_id: rowId,
        reference_type: type,
        document: selectedFile
      };
      createDocument(patientId, admissionId, saveData).then((res) => {
        console.log(res)
      }).catch((err) => {
        NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
      });
      //setSelectedFile([]);
    }
    listAllDocuments(patientId, admissionId, rowId, type).then((res) => {
      const data = res.data;
      console.log(res.data)
      const listdata = [];
      data.forEach((item) => {
        const fileExtension = ((item.document).split('.').pop()).toLowerCase();
        let fileType = ['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(fileExtension) ? "Image" : "Document";
        listdata.push({
          id: item.id,
          document: item.document,
          type: fileType,
        });
      });
      setListData(listdata);
      setDataLoaded(true);
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });
  }, [rowId, patientId, admissionId, reloadList, selectedFile, type]);

  const handleDeleteAction = () => {
    deleteDocument(patientId, admissionId, rowId, selectedRowId).then((res) => {
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });
    handleHideDeleteAlert();
  };

  const handleShowDeleteAlert = (id) => {
    setSelectedRowId(id);
    setShowDeleteAlert(true);
  };
  const handleHideDeleteAlert = () => {
    setSelectedRowId(0);
    setShowDeleteAlert(false);
    setReloadList(!reloadList);
  };

  // if (!dataLoaded) {
  //   return <LoaderComponent />;
  // }
  return (
    <Modal
      size="lg"
      aria-labelledby="example-modal-sizes-title-lg"
      show={true}
      onHide={handleHideDocumentsView}
      className="admission_params admission_document fade show"
    >
      <Modal.Header closeButton>
      <Modal.Title>{pageTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          {listData.length > 0 ?
            (listData.map((row, index) => (
              <div className="col-md-3" key={index}>
                <div className={"card shadow mb-4 prp_hgt"}>
                  <div className="text-center document">
                    <button className='btn pull-right' onClick={() => handleShowDeleteAlert(row.id)}><i className="fa fa-trash" aria-hidden="true"></i></button>
                    <div className="">
                      <Link to={{ pathname: process.env.REACT_APP_UPLOAD_URL + row.document }} target="_blank" alt="document">
                        <img
                          src={row.type === "Image" ? process.env.REACT_APP_UPLOAD_URL + row.document : defaultDocImg}
                          alt="..."
                          className="avatar-img"
                          style={{ width: "100%" }}
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )))
            :
            <div className="col-md-12 mb-4">No documents.</div>
          }
          {showDeleteAlert && (
            <SweetAlert
              warning
              showCancel
              btnSize=""
              confirmBtnText="Delete"
              confirmBtnBsStyle="danger"
              cancelBtnText="Cancel"
              title="Are you sure?"
              focusCancelBtn
              onCancel={handleHideDeleteAlert}
              onConfirm={handleDeleteAction}
            >
              You will not be able to recover the data once deleted!
            </SweetAlert>
          )}
        </div>
        <div className="form-group">
          <label>
            Add New:
          </label>
          <MultipleUploadComponent
            fieldName="document"
            errors={errors}
            required={false}
            fileUploading={fileUploading}
            setFileUploading={setFileUploading}
            setSelectedFile={setSelectedFile}
            register={register}
          />
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default AdmissionDocuments;