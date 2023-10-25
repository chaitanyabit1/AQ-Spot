import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { DATE_TIME_FORMAT } from "../../config/AppConfig";
import LoaderComponent from "../../components/LoaderComponent";
import DatePickerComponent from "../../components/DatePickerComponent";
import moment from "moment";
import { getRoutePatientAdmission } from "../../config/RoutePathConfig";
import { Link } from "react-router-dom";
import { listAll, uploadFile, create, deleteRow, viewRow } from "../../services/PatientAdmissionService";
import { listAll as masterList, listAllParams as paramsTypeList } from "../../services/MasterPagesService";
import { NotificationManager } from "react-notifications";
import { COMMON_MESSAGES, USER_RESTRICT_ROUTE } from "../../config/AppConfig";
import PaginationComponent from "../../components/PaginationComponent";
import SweetAlert from "react-bootstrap-sweetalert";
import Modal from "react-bootstrap/Modal";
import { getUserAccesses } from "../../session/UserSession";

const InvestigationView = (props) => {
  const { patientId, admissionId, discharged } = props;

  // Set state
  const [listData, setListData] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
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
    listAll(patientId, admissionId, `investigation`, q).then((res) => {
      const data = res.data;
      const listData = [];
      data.forEach((item, index) => {
        listData.push({
          id: item.id,
          date: item.for_date,
          reportType: item.type || "",
          param: item.param || "",
          value: item.value,
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
  const handleReload = () => {
    setReloadList(!reloadList);
  };
  const handleDeleteAction = () => {
    deleteRow(patientId, admissionId, 'investigation', selectedRowId).then((res) => {      
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
    handleReload();
  };
  const handleShowDataView = (id) => {
    setSelectedRowId(id);
    setShowDataView(true);
  };
  const handleHideDataView = () => {
    setSelectedRowId(0); 
    setShowDataView(false);
    handleReload();
  };

  if (!dataLoaded) {
    return <LoaderComponent />;
  }
  return (
    <div className="row">
      <div className="col-12">
        {listFromProfile && (
          <div className="card-header">
              <strong className="card-title">Investigation</strong>
              <button className="btn btn-primary btn-sm" style={{float:"right"}}>
                  <Link to={{pathname: getRoutePatientAdmission(patientId, admissionId, "investigation")}} style={{textDecoration:"none", color:"#fff"}}>View All</Link>
              </button>
          </div>
        )}
        <table className="table table-borderless view_investing">
          <thead>
            <tr>
              <th className="col-wd-15">Date</th>
              <th className="col-wd-15 report_type">Report Type</th>
              <th className="col-wd-5">Unit</th>
              <th className="col-wd-15">Value</th>
              <th className="col-wd-30">Notes</th>
              <th className="col-wd-10">Document</th>
              <th className="col-wd-10 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {listData && listData.map((row, index) => (
              <tr key={index}>
                <td>{row.date}</td>
                <td>{row.reportType}</td>
                <td>{row.param}</td>
                <td>{row.value}</td>
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
                  {(getUserAccesses().includes(USER_RESTRICT_ROUTE.ADDMISSION_INVESTIGATION_DELETE)) && !discharged && 
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
                <td className="text-center" colSpan="7">No records found.</td>
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

        {!listFromProfile && !discharged && (
          <AddForm 
            patientId={patientId}
            admissionId={admissionId}
            handleReload={handleReload}
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
  const { patientId, admissionId, handleReload } = props;

  const [typeList, setTypeList] = useState([]);
  const [subTypeList, setSubTypeList] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const { register, handleSubmit, errors, reset, control } = useForm();
  const [selectedFile, setSelectedFile] = useState("");
  const [fileUploading, setFileUploading] = useState(false);

  useEffect(() => {
    masterList("investigation_types").then((res) => {
      setTypeList(res.data);
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });
  }, []);

  const handleChangeType = (e) => {
    const type_id = e.target.value || 0;
    paramsTypeList("investigation_params", type_id).then((res) => {
      setSubTypeList(res.data);
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });
  };

  // Form submit
  const onSubmit = (data) => {
    setFormSubmitted(true);
    const saveData = {
      param_id: data.subType,
      for_date: moment(data.date).format(DATE_TIME_FORMAT.DDMMYYYY),
      value: data.value,
      notes: data.notes,
      document: selectedFile,
    };
    create(patientId, admissionId, `investigation`, saveData).then((res) => {
      reset();
      handleReload();
      setFormSubmitted(false);
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
        NotificationManager.error("File Not Uploaded", 'Error', 5000);
        setSelectedFile('');
        setFileUploading(false);
      } else {
        setFormSubmitted(false);
        setSelectedFile(res.data.filename);
        setFileUploading(false);
      }
    }).catch((err) => {
      setSelectedFile('');
      setFileUploading(false);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <br /><br /><br />
      <table className="table table-borderless investigation_view">
        <tbody>
          <tr>
            <td colSpan="4">
              <strong>Add New Data</strong>
            </td>
          </tr>
          <tr>
            <td className="col-wd-25">
              <DatePickerComponent 
                fieldName="date" 
                defaultValue={new Date()} 
                errors={errors} 
                control={control} 
                require={true}
                showTime={false}
              />
            </td>
            <td className="col-wd-25">
              <select
                className={
                  "form-control " + (errors.type && "is-invalid")
                }
                name="type"
                ref={register({
                  required: true,
                  validate: (value) => {
                    return !!value.trim();
                  },
                })}
                onChange={handleChangeType}
              >
                <option value="">Select</option>
                {typeList.map((obj, index) => {
                  return (
                    <option value={obj.id} key={obj.id}>
                      {obj.name}
                    </option>
                  );
                })}
                ;
              </select>
            </td>
            <td className="col-wd-25">
              <select
                className={
                  "form-control " + (errors.subType && "is-invalid")
                }
                name="subType"
                ref={register({
                  required: true,
                  validate: (value) => {
                    return !!value.trim();
                  },
                })}
              >
                <option value="">Select</option>
                {subTypeList.map((obj, index) => {
                  return (
                    <option value={obj.id} key={obj.id}>
                      {obj.name}
                    </option>
                  );
                })}
                ;
              </select>
            </td>
            <td className="col-wd-25">
              <input
                type="value"
                className={"form-control " + (errors.value && "is-invalid")}
                name="value"
                ref={register({
                  required: true,
                  validate: (value) => {
                    return !!value.trim();
                  },
                })}
              />
            </td>
          </tr>
          <tr>
              <td className="choose_area">
                <input 
                  className={"form-control"}
                  type="file" 
                  name="document"
                  onChange={(e) => handleChangeFile(e.target.files[0])} 
                  ref={register()}
                />
                {(fileUploading) && "Uploading..."}
              </td>
              <td colSpan="3">
                &nbsp;
              </td>
          </tr>
          <tr>
            <td colSpan="4">
              <textarea
                className={"form-control " + (errors.notes && "is-invalid")}
                rows="3"
                name="notes"
                ref={register({
                  required: true,
                  validate: (value) => {
                    return !!value.trim();
                  },
                })}
              ></textarea>
            </td>
          </tr>
          <tr>
            <td colSpan="4">
            {(!fileUploading) &&
              <button
                className="btn btn-primary"
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
  const { handleHideDataView, rowId, patientId, admissionId } = props;

  // Set module variables
  const pageTitle = "Investigation View";

  // Set state
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    viewRow(patientId, admissionId, `investigation`, rowId).then((res) => {
      const data = res.data;
      //console.log(data);
      setRowData({
        id: rowId,
        date: data.for_date,
        type: data.type || "",
        unit: data.param || "",
        value: data.value || "-",
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
                <b>Report Type:</b> {rowData.type}
            </div>
            <div className="form-group">
                <b>Unit:</b> {rowData.unit}
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

export default InvestigationView;
