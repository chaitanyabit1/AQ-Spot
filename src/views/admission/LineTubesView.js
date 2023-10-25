import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Modal from "react-bootstrap/Modal";
import { DATE_TIME_FORMAT, COMMON_MESSAGES, USER_RESTRICT_ROUTE } from "../../config/AppConfig";
import LoaderComponent from "../../components/LoaderComponent";
import DatePickerComponent from "../../components/DatePickerComponent";
import moment from "moment";
import { listAll, create, deleteRow, viewRow } from "../../services/PatientAdmissionService";
import { listAll as masterList } from "../../services/MasterPagesService";
import { NotificationManager } from "react-notifications";
import PaginationComponent from "../../components/PaginationComponent";
import SweetAlert from "react-bootstrap-sweetalert";
import { getUserAccesses } from "../../session/UserSession";

const LineTubesView = (props) => {
  const { patientId, admissionId, discharged } = props;
  const addButtonText = "Add New Line/Tube";

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

  // Fetch data
  useEffect(() => {
    const q = (currentPage) ? "&page="+currentPage : "";
    listAll(patientId, admissionId, `linetubes`, q).then((res) => {
      const data = res.data;
      const listData = [];
      data.forEach((item) => {
        listData.push({
          id: item.id,
          type: item.type || "",
          addDate: item.add_date,
          removeDate: item.remove_date,
          notes: item.notes
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
    deleteRow(patientId, admissionId, 'linetubes', selectedRowId).then((res) => {      
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
        {!discharged && 
          (
            <div className="row align-items-center mb-3">
              <div className="col"></div>
              <div className="col-auto">
                <button type="button" className="btn btn-primary" onClick={handleAddAction}>
                  {addButtonText}
                </button>
              </div>
            </div>
          )
        }
        <table className="table table-borderless line_tubes">
          <thead>
            <tr>
              <th className="col-wd-20">Type</th>
              <th className="col-wd-15">Added Date</th>
              <th className="col-wd-15 remove_date">Remove Date</th>
              <th className="col-wd-40">Notes</th>
              <th className="col-wd-10 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {listData && listData.map((row, index) => (
              <tr key={index}>
                <td>{row.type}</td>
                <td>{row.addDate}</td>
                <td>{row.removeDate}</td>
                <td>{row.notes}</td>
                <td className="text-center">
                  <button type="button" className="btn btn-sm mr-1" onClick={() => handleShowDataView(row.id)}>
                    <i className="far fa-eye text-primary"></i>
                  </button>
                  {(getUserAccesses().includes(USER_RESTRICT_ROUTE.ADDMISSION_LINETUBES_DELETE)) && !discharged && 
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

        <PaginationComponent 
          currentPage={currentPage || paginationData.currentPage} 
          totalRows={paginationData.totalRows} 
          totalPages={paginationData.totalPages}
          setCurrentPage={(pageNumber) => {handleChangePage(pageNumber);}}
        />

        {showAddForm && (
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

  const [typeList, setTypeList] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const { register, handleSubmit, errors, control } = useForm();

  useEffect(() => {
    masterList("linetube_types").then((res) => {
      setTypeList(res.data);
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });
  },[]);

  // Form submit
  const onSubmit = (data) => {
    setFormSubmitted(true);
    const saveData = {
      param_id: data.type,
      add_date: moment(data.addDate).format(DATE_TIME_FORMAT.DDMMYYYY),
      remove_date: moment(data.removeDate).format(DATE_TIME_FORMAT.DDMMYYYY),
      notes: data.notes,
    };
    create(patientId, admissionId, `linetubes`, saveData).then((res) => {
      handleCloseAndReload();
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });
  };

  return (
    <Modal
      show={true}
      className="admission_clinical fade show"
      onHide={handleClose}
    >
      <Modal.Header closeButton>
        <Modal.Title>Add Lines/Tubes</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>
              Line/Tube Type<i className="text-danger">*</i>
            </label>
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
          </div>
          <div className="form-group">
            <label>
              Add Date<i className="text-danger">*</i>
            </label>
            <DatePickerComponent 
                fieldName="addDate" 
                defaultValue={new Date()} 
                errors={errors} 
                control={control} 
                require={true}
                showTime={false}
            />
          </div>
          <div className="form-group">
            <label>
              Remove Date<i className="text-danger">*</i>
            </label>
            <DatePickerComponent 
                fieldName="removeDate" 
                defaultValue={new Date()} 
                errors={errors} 
                control={control} 
                require={true}
                showTime={false}
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
          <div className="form-group mt-4">
            <button
              className="btn btn-primary"
              disabled={formSubmitted}
              type="submit"
            >
              {(formSubmitted && "Saving...") || "Save"}
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

const DataView = (props) => {
  const { handleHideDataView, rowId, patientId, admissionId } = props;

  // Set module variables
  const pageTitle = "Line/Tubes View";

  // Set state
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    viewRow(patientId, admissionId, `linetubes`, rowId).then((res) => {
      const data = res.data;
      //console.log(data);
      setRowData({
        id: rowId,
        type: data.type,
        added_date: data.add_date || "-",
        removed_date: data.remove_date || "-",
        notes: data.notes || "-",
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
                <b>Type:</b> {rowData.type}
            </div>
            <div className="form-group">
                <b>Added Date:</b> {rowData.added_date}
            </div>
            <div className="form-group">
                <b>Removed Date:</b> {rowData.removed_date}
            </div>
            <div className="form-group">
                <b>Notes:</b> {rowData.notes}
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default LineTubesView;
