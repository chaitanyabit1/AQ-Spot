import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import LoaderComponent from "../../components/LoaderComponent";
import { listAll, uploadFile, create, deleteBodyprofileRow, viewRow } from "../../services/PatientAdmissionService";
import { listAllParams as paramsTypeList } from "../../services/MasterPagesService";
import { NotificationManager } from "react-notifications";
import { COMMON_MESSAGES, USER_RESTRICT_ROUTE } from "../../config/AppConfig";
import SweetAlert from "react-bootstrap-sweetalert";
import Modal from "react-bootstrap/Modal";
import { getUserAccesses } from "../../session/UserSession";

const AdmissionParamsView = (props) => {
  const { patientId, admissionId, discharged, body_profile_id } = props;

  const [listData, setListData] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [reloadData, setReloadData] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(0);
  const [showDataView, setShowDataView] = useState(false);

  // Fetch data
  useEffect(() => {
    listAll(patientId, admissionId, `bodyprofile/${body_profile_id}`).then((res) => {
      const data = res.data;
      let listData = [];
      data.forEach((item) => {
          listData.push({
              id: item.id,
              body_params: item.params,
              value: item.value,
              notes: item.notes,
              document: item.document
          });
      });
      setListData(listData);
      setDataLoaded(true);
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });    
  }, [patientId, admissionId, body_profile_id, reloadData]);

  const handleDeleteAction = () => {
    deleteBodyprofileRow(patientId, admissionId, "bodyprofile", body_profile_id, selectedRowId).then((res) => {
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });
    handleHideDeleteAlert();
  };

  const handleReloadData = () => {
    setReloadData(!reloadData);
  };

  const handleShowDeleteAlert = (id) => {
    setSelectedRowId(id);
    setShowDeleteAlert(true);
  };
  const handleHideDeleteAlert = () => {   
    setSelectedRowId(0); 
    setShowDeleteAlert(false);
    handleReloadData();
  };
  const handleShowDataView = (id) => {
    setSelectedRowId(id);
    setShowDataView(true);
  };
  const handleHideDataView = () => {
    setSelectedRowId(0); 
    setShowDataView(false);
    handleReloadData();
  };
 
  if (!dataLoaded) {
    return <LoaderComponent />;
  }
  return (
    <div>
    <table className="table table-borderless" style={{marginBottom:"0"}}>
      <thead>
        <tr>
          <th className="col-wd-20">Params</th>
          <th className="col-wd-20">Value</th>
          <th className="col-wd-30">Notes</th>
          <th className="col-wd-20">Document</th>
          <th className="col-wd-10 text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        {listData.map((row, index) => (
          <tr key={index}>
            <td>{row.body_params}</td>
            <td>{row.value}</td>
            <td>{row.notes}</td>
            <td>
            {row.document &&  
              (
                <Link to={{ pathname: process.env.REACT_APP_UPLOAD_URL + row.document}} target="_blank" alt="document">
                  <i className="far fa-file text-primary"></i>
                </Link>
              )
            }
            </td>                
            <td className="text-center">
              <button type="button" className="btn btn-sm mr-1" onClick={() => handleShowDataView(row.id)}>
                <i className="far fa-eye text-primary"></i>
              </button>
              {(getUserAccesses().includes(USER_RESTRICT_ROUTE.ADDMISSION_BODYPROFILE_DELETE)) &&
                !discharged && 
                  (
                    <button type="button" className="btn btn-sm" onClick={() => handleShowDeleteAlert(row.id)}>
                      <i className="far fa-trash-alt text-danger"></i>
                    </button>
                  )
              }
            </td>
          </tr>
        ))}   
      </tbody>
    </table>
    {!discharged && (
        <AddForm 
          patientId={patientId}
          admissionId={admissionId}
          body_profile_id={body_profile_id}
          handleReloadData={handleReloadData}
        />
    )}

    {showDataView && (
      <DataView
        patientId={patientId}
        admissionId={admissionId}
        body_profile_id={body_profile_id}
        handleHideDataView={handleHideDataView}
        rowId={selectedRowId}
      />
    )}

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
  );
};

const AddForm = (props) => {
  const { patientId, admissionId, body_profile_id, handleReloadData } = props;

  const [paramsList, setParamsList] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const { register, handleSubmit, errors, reset } = useForm();
  const [selectedFile, setSelectedFile] = useState("");
  const [fileUploading, setFileUploading] = useState(false);

  useEffect(() => {
    paramsTypeList("body_profile_params", body_profile_id).then((res) => {
      const data = res.data;
      setParamsList(data);
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });
  }, [body_profile_id]);

  // Form submit
  const onSubmit = (data) => {
    setFormSubmitted(true);
    const saveData = {
      body_params_id: data.paramsId,
      value: data.value,
      notes: data.notes,
      document: selectedFile,
    };
    create(patientId, admissionId, `bodyprofile/${body_profile_id}`, saveData).then((res) => {
      reset();
      handleReloadData();
      setFormSubmitted(false);
      setSelectedFile('');
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });
  };

  const handleChangeFile = (file) => {
    const data = new FormData() 
    setFileUploading(true);
    data.append('document', file);
    uploadFile(data).then((res) => {
      if(res.error) {
        setSelectedFile('');
        setFileUploading(false);
      } else {
        setFileUploading(false);
        setSelectedFile(res.data.filename);
      }
    }).catch((err) => {
      //NotificationManager.error(COMMON_MESSAGES.UPLOAD_FAILED, 'Warning', 5000);
      setSelectedFile('');
      setFileUploading(false);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <table className="table table-borderless" style={{borderBottom: "1px solid #ccc"}}>
      <tbody>
        <tr>
        <td className="col-wd-20">
          <select
            className={
              "form-control form-control-sm " + (errors.paramsId && "is-invalid")
            }
            name="paramsId"
            ref={register({
              required: true,
              validate: (value) => {
                return !!value.trim();
              },
            })}
          >
            <option value="">Select</option>
            {paramsList.map((obj, index) => {
              return (
                <option value={obj.id} key={obj.id}>
                  {obj.name}
                </option>
              );
            })}
            ;
          </select>
        </td>
        <td className="col-wd-20">
          <input
            type="text"
            className={"form-control form-control-sm " + (errors.value && "is-invalid")}
            name="value"
            placeholder="Value"
            ref={register()}
          />
        </td>
        <td className="col-wd-30">
          <input
            type="text"
            className={"form-control form-control-sm " + (errors.notes && "is-invalid")}
            name="notes"
            placeholder="Notes"
            ref={register()}
          />
        </td>
        <td className="col-wd-20">
        <input 
          className={"form-control"}
          type="file" 
          name="document"
          onChange={(e) => handleChangeFile(e.target.files[0])} 
          ref={register()}
        />
        {(fileUploading) && "Uploading..."}
        </td>
        <td className="col-wd-10 text-right">
          {(!fileUploading) &&
            <button
              className="btn btn-primary btn-sm"
              disabled={formSubmitted}
              type="submit"
            >
            {(formSubmitted && "Saving...") || "Save"}
          </button>
          }
        </td>
      </tr>
      </tbody>
      </table>
    </form>
  );
};

const DataView = (props) => {
  const { handleHideDataView, rowId, patientId, admissionId, body_profile_id } = props;

  // Set module variables
  const pageTitle = "Admission";

  // Set state
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    viewRow(patientId, admissionId, `bodyprofile/${body_profile_id}`, rowId).then((res) => {
      const data = res.data;
      setRowData({
        id: rowId,
        notes: data.notes || "",
        params: data.params || "",
        value: data.value || "-",
        document: (data.document) ? data.document : ""
      });
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });
  }, [rowId, patientId, admissionId, body_profile_id]);

  if(rowData.id === null) {
    return <LoaderComponent />;
  }

  return (
    <Modal
      size="lg"
      aria-labelledby="example-modal-sizes-title-lg"
      show={true}
      onHide={handleHideDataView}
      className="admission_params fade show"
    >
      <Modal.Header closeButton>
        <Modal.Title>{pageTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-md-12">
            <div className="form-group">
                <b>Params:</b> {rowData.params}
            </div>
            <div className="form-group">
                <b>Value:</b> {rowData.value}
            </div>
            <div className="form-group">
                <b>Notes:</b> {rowData.notes}
            </div>
            {rowData.document &&
            <div className="form-group">              
                <b>Document: </b>                 
                <Link to={{ pathname: process.env.REACT_APP_UPLOAD_URL + rowData.document}} target="_blank" className="btn btn-primary btn-sm" alt="document">
                  View
                </Link>
            </div>
            }
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default AdmissionParamsView;
