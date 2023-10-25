import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Modal from "react-bootstrap/Modal";
import { DATE_TIME_FORMAT, COMMON_MESSAGES, USER_RESTRICT_ROUTE } from "../../config/AppConfig";
import LoaderComponent from "../../components/LoaderComponent";
import DatePickerComponent from "../../components/DatePickerComponent";
import moment from "moment";
import { getRoutePatientAdmission } from "../../config/RoutePathConfig";
import { Link } from "react-router-dom";
import { listAll, uploadFile, create, deleteRow, viewRow } from "../../services/PatientAdmissionService";
import { NotificationManager } from "react-notifications";
import PaginationComponent from "../../components/PaginationComponent";
import SweetAlert from "react-bootstrap-sweetalert";
import { getUserAccesses } from "../../session/UserSession";

const ClinicalNotesView = (props) => {
  const { patientId, admissionId, discharged } = props;
  const addButtonText = "Add New Note";

  // Set state
  const [listData, setListData] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [reloadList, setReloadList] = useState(false);
  const [paginationData, setPaginationData] = useState({currentPage: 0, totalPages: 0, totalRows: 0});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowId, setSelectedRowId] = useState(0);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showDataView, setShowDataView] = useState(false);

  let listFromProfile = false;
  if(props.from && props.from === "profile") {
    listFromProfile = true;
  }

  // Fetch data
  useEffect(() => {
    const q = (currentPage) ? "&page="+currentPage : "";
    listAll(patientId, admissionId, `clinicalnotes`, q).then((res) => {
      const data = res.data;
      const listData = [];
      data.forEach((item) => {
        listData.push({
          id: item.id,
          date: item.for_date,
          doctor: item.doctor,
          notes: item.notes,
          document: item.document
        });
      });
      setListData(listData);
      setPaginationData({currentPage: res.currentPage, totalPages: res.totalPages, totalRows: res.totalRows});
      setDataLoaded(true);
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });
  }, [reloadList, admissionId, patientId, currentPage]);

  // Handle events
  const handleAddAction = () => {
    setShowAddForm(true);
  };
  const handleCloseAddAction = () => {
    setShowAddForm(false);
  };
  const handleCloseAddActionAndReload = () => {
    setShowAddForm(false);
    setReloadList(!reloadList);
  };
  const handleDeleteAction = () => {
    deleteRow(patientId, admissionId, 'clinicalnotes', selectedRowId).then((res) => {      
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });
    handleHideDeleteAlert();
  };
  const handleChangePage = (page) => {
    setCurrentPage(page);
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
  const handleShowDataView = (id) => {
    setSelectedRowId(id);
    setShowDataView(true);
  };
  const handleHideDataView = () => {
    setSelectedRowId(0); 
    setShowDataView(false);
    setReloadList(!reloadList);
  };

  if (!dataLoaded) {
    return <LoaderComponent />;
  }
  return (
    <div className="row">
      <div className="col-12">
        {!listFromProfile && !discharged && 
          (
            <div className="row align-items-center mb-3">
              <div className="col"></div>
              <div className="col-auto">
                <button type="button" className="btn btn-primary mr-2" onClick={handleAddAction}>
                  {addButtonText}
                </button>
              </div>
            </div>
          )
        }
        {listFromProfile && (
        <div className="card-header">
            <strong className="card-title">Clinical Notes</strong>
            <button className="btn btn-primary btn-sm" style={{float:"right"}}>
              <Link to={{pathname: getRoutePatientAdmission(patientId, admissionId, "clinical-notes")}} style={{textDecoration:"none", color:"#fff"}}>View All</Link>
            </button>
        </div>
        )}
        <table className="table table-borderless">
          <thead>
            <tr>
              <th className="col-wd-15">Date</th>
              <th className="col-wd-15">Doctor</th>
              <th className="col-wd-50">Remarks</th>
              <th className="col-wd-10">Document</th>
              <th className="col-wd-10 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {listData && listData.map((row, index) => (
              <tr key={index}>
                <td>{row.date}</td>
                <td>{row.doctor}</td>
                <td>{row.notes}</td>
                <td className="text-center">
                  {row.document &&  
                  (
                    <Link to={{ pathname: process.env.REACT_APP_UPLOAD_URL + row.document}} target="_blank" alt="document">
                      <i className="far fa-file text-primary"></i>
                    </Link>
                  )
                  }
                </td>
                <td className="text-center">
                  {!listFromProfile && (
                    <button type="button" className="btn btn-sm mr-1" onClick={() => handleShowDataView(row.id)}>
                      <i className="far fa-eye text-primary"></i>
                    </button>
                  )}
                  {(getUserAccesses().includes(USER_RESTRICT_ROUTE.ADDMISSION_CLINICALNOTES_DELETE)) && !discharged && 
                    (
                      <button type="button" className="btn btn-sm" onClick={() => handleShowDeleteAlert(row.id)}>
                        <i className="far fa-trash-alt text-danger"></i>
                      </button>
                    )
                  }
                </td>
                
              </tr>
            ))}
            {listData.length === 0 && (
              <tr>
                <td className="text-center" colSpan="5">No records found.</td>
              </tr>
            )}
          </tbody>
        </table>

        {!listFromProfile && (
          <PaginationComponent 
            currentPage={currentPage || paginationData.currentPage} 
            totalRows={paginationData.totalRows} 
            totalPages={paginationData.totalPages}
            setCurrentPage={(pageNumber) => {handleChangePage(pageNumber);}}
          />
        )}

        {!listFromProfile && showAddForm && (
          <AddForm 
            patientId={patientId}
            admissionId={admissionId}
            handleClose={handleCloseAddAction}
            handleCloseAndReload={handleCloseAddActionAndReload} 
          />
        )}

        {showDataView && (
          <DataView
            patientId={patientId}
            admissionId={admissionId}
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
    </div>
  );
};

const AddForm = (props) => {
  const { patientId, admissionId, handleClose, handleCloseAndReload } = props;

  const [formSubmitted, setFormSubmitted] = useState(false);
  const { register, handleSubmit, errors, control } = useForm();
  const [selectedFile, setSelectedFile] = useState("");
  const [fileUploading, setFileUploading] = useState(false);

  // Form submit
  const onSubmit = (data) => {
    setFormSubmitted(true);
    const saveData = {
      for_date: moment(data.date).format(DATE_TIME_FORMAT.DDMMYYYY),
      doctor: data.doctor,
      notes: data.notes,
      document: selectedFile
    };
    create(patientId, admissionId, `clinicalnotes`, saveData).then((res) => {
      handleCloseAndReload();
      setSelectedFile("");
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });
  };

  const handleChangeFile = (file) => {
    const data = new FormData() 
    data.append('document', file);
    setFileUploading(true);
    uploadFile(data).then((res) => {
      if(res.error) {
        setSelectedFile('');
        setFileUploading(false);
      } else {
        setSelectedFile(res.data.filename);
        setFileUploading(false);
      }
    }).catch((err) => {
      //NotificationManager.warning(COMMON_MESSAGES.UPLOAD_FAILED, 'Warning', 5000);
      setSelectedFile('');
      setFileUploading(false);
    });
  };

  return (
    <Modal
      show={true}
      className="admission_clinical fade show"
      onHide={handleClose}
    >
      <Modal.Header closeButton>
        <Modal.Title>Add Clinical Note</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>
              Date<i className="text-danger">*</i>
            </label>
            <DatePickerComponent 
                fieldName="date" 
                defaultValue={new Date()} 
                errors={errors} 
                control={control} 
                require={true}
                showTime={false}
            />
          </div>
          <div className="form-group">
            <label>
              Doctor<i className="text-danger">*</i>
            </label>
            <input
              type="text"
              className={"form-control " + (errors.doctor && "is-invalid")}
              name="doctor"
              ref={register({
                required: true,
                validate: (value) => {
                  return !!value.trim();
                },
              })}
            />
          </div>
          <div className="form-group">
            <label>
              Notes
            </label>
            <textarea
              className="form-control"
              rows="4"
              name="notes"
              ref={register}
            ></textarea>
          </div>
          <div className="form-group">
            <label>
              Upload Document
            </label>
            <input 
              className={"form-control"}
              type="file" 
              name="document"
              onChange={(e) => handleChangeFile(e.target.files[0])} 
              ref={register()}
            />
            {(fileUploading) && "Uploading..."}
          </div>
          <div className="form-group mt-4">
          {(!fileUploading) &&
            <button
              className="btn btn-primary"
              disabled={formSubmitted}
              type="submit"
            >
              {(formSubmitted && "Saving...") || "Save"}
            </button>
          }
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

const DataView = (props) => {
  const { handleHideDataView, rowId, patientId, admissionId } = props;

  // Set module variables
  const pageTitle = "Clinical notes View";

  // Set state
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    viewRow(patientId, admissionId, `clinicalnotes`, rowId).then((res) => {
      const data = res.data;
      //console.log(data);
      setRowData({
        id: rowId,
        date: data.for_date,
        doctor: data.doctor || "",
        notes: data.notes || "-",
        document: (data.document) ? data.document : ""
      });
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });
  }, [rowId, patientId, admissionId]);

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
                <b>Date:</b> {rowData.date}
            </div>
            <div className="form-group">
                <b>Doctor:</b> {rowData.doctor}
            </div>
            <div className="form-group">
                <b>Remarks:</b> {rowData.notes}
            </div>
            {rowData.document &&
            <div className="form-group">              
                <b>Document: </b>                 
                <Link to={{ pathname: process.env.REACT_APP_UPLOAD_URL + rowData.document}} className="btn btn-primary btn-sm" target="_blank" alt="document">
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

export default ClinicalNotesView;
