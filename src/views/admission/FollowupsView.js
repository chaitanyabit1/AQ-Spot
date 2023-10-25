import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Modal from "react-bootstrap/Modal";
import LoaderComponent from "../../components/LoaderComponent";
import DataView from "../followups/DataView";
import { useLocation } from "react-router-dom";
import moment from "moment";
import { DATE_TIME_FORMAT, COMMON_MESSAGES, USER_RESTRICT_ROUTE } from "../../config/AppConfig";
import { listAll, deleteRow } from "../../services/PatientAdmissionService";
import { NotificationManager } from "react-notifications";
import PaginationComponent from "../../components/PaginationComponent";
import SweetAlert from "react-bootstrap-sweetalert";
import { getUserAccesses } from "../../session/UserSession";
import { create } from "../../services/FollowupService";
import { listAll as masterList } from "../../services/MasterPagesService";

const FollowupsView = (props) => {
  const { patientId, discharged, admissionId } = props;
  const addButtonText = "Add New Followup";
  let location = useLocation();

  // Set state
  const [listData, setListData] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [showDataView, setShowDataView] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(0);
  const [reloadList, setReloadList] = useState(false);
  const [paginationData, setPaginationData] = useState({currentPage: 0, totalPages: 0, totalRows: 0});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowDeleteId, setSelectedRowDeleteId] = useState(0);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // Fetch data
  useEffect(() => {
    const q = (currentPage) ? "&page="+currentPage : "";
    listAll(patientId, admissionId, `followups`, q).then((res) => {
      const data = res.data;
      const listData = [];
      data.forEach((item) => {
        listData.push({
          id: item.id,
          createdBy: item.created_by,
          createdAt: moment(Date.parse(new Date(item.created_at*1000).toString())).format(DATE_TIME_FORMAT.DDMMYYYYhhmma) || "",
          type: item.type || "Unknown",
          instructions: item.instructions,
          viewedBy: item.viewed_by,
          viewedAt: moment(Date.parse(new Date(item.viewed_at*1000).toString())).format(DATE_TIME_FORMAT.DDMMYYYYhhmma) || "",
          status: item.status,
        });          
      });
      setListData(listData);
      setPaginationData({currentPage: res.currentPage, totalPages: res.totalPages, totalRows: res.totalRows});
      setDataLoaded(true);
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });

    if(location.state && location.state.fromNotifiction && location.state.followupID) {
      handleViewAction(location.state.followupID);
      delete location.state.followupID;
      delete location.state.fromNotifiction;
    }
  }, [location, patientId, admissionId, reloadList, currentPage]);

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
  const handleViewAction = (val) => {
    //alert("This will open the followup view popup");
    setSelectedRowId(val);
    setShowDataView(true);
  };
  const handleDeleteAction = () => {
    deleteRow(patientId, admissionId, 'followups', selectedRowDeleteId).then((res) => {      
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });
    handleHideDeleteAlert();
  };

  const handleHideDataView = () => {
    setShowDataView(false);
    setReloadList(!reloadList);
  };
  const handleChangePage = (page) => {
    setCurrentPage(page);
  };
  const handleShowDeleteAlert = (id) => {
    setSelectedRowDeleteId(id);
    setShowDeleteAlert(true);
  };
  const handleHideDeleteAlert = () => {
    setSelectedRowDeleteId(0);
    setShowDeleteAlert(false);
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
        <table className="table table-borderless">
          <thead>
            <tr>
              <th className="col-wd-15">Type</th>
              <th className="col-wd-20">Created By</th>
              <th className="col-wd-20">Viewed By</th>
              <th className="col-wd-25">Instructions</th>
              <th className="col-wd-10 text-center">Status</th>
              <th className="col-wd-10 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {listData && listData.map((row, index) => (
              <tr key={index}>
                <td>{row.type}</td>
                <td>{row.createdBy}<br />{row.createdAt}</td>
                <td>{row.viewedBy}<br />{row.viewedAt}</td>
                <td>{row.instructions}</td>
                <td className="text-center">{row.status}</td>
                <td className="text-center">
                  <button type="button" className="btn btn-sm" onClick={() => handleViewAction(row.id)}>
                    <i className="far fa-eye text-primary"></i>
                  </button>
                  {(getUserAccesses().includes(USER_RESTRICT_ROUTE.ADDMISSION_FOLLOWUPS_DELETE)) && !discharged && 
                    (
                      <button type="button" className="btn btn-sm ml-1" onClick={() => handleShowDeleteAlert(row.id)}>
                        <i className="far fa-trash-alt text-danger"></i>
                      </button>
                    )
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <PaginationComponent 
          currentPage={currentPage || paginationData.currentPage} 
          totalRows={paginationData.totalRows} 
          totalPages={paginationData.totalPages}
          setCurrentPage={(pageNumber) => {handleChangePage(pageNumber);}}
        />

        {showDataView && (
          <DataView
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

        {showAddForm && (
          <AddForm 
            patientId={patientId}
            admissionId={admissionId}
            handleClose={handleCloseAddAction}
            handleCloseAndReload={handleCloseAddActionAndReload}
          />
        )}

      </div>
    </div>
  );
};

const AddForm = (props) => {
  const { patientId, handleClose, handleCloseAndReload } = props;

  const [followupTypeList, setFollowupTypeList] = useState([]);
  const { register, handleSubmit, errors } = useForm();
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    masterList("followup_types").then((res) => {
      setFollowupTypeList(res.data);
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });
  },[]);

  // Form submit
  const onSubmit = (data) => {
    setFormSubmitted(true);

    const saveData = {
      patient: patientId,
      type: data.followupTypeId,
      instructions: data.instructions
    };
    create(saveData).then((res) => {
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
        <Modal.Title>Add Followup</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>
              Followup Type<i className="text-danger">*</i>
            </label>
            <select
              className={
                "form-control " + (errors.followupTypeId && "is-invalid")
              }
              name="followupTypeId"
              ref={register({
                required: true,
                validate: (value) => {
                  return !!value.trim();
                },
              })}
            >
              <option value="">Select</option>
              {followupTypeList.map((obj, index) => {
                return (
                  <option value={obj.id} key={"ft-" + obj.id}>
                    {obj.name}
                  </option>
                );
              })}
              ;
            </select>
          </div>
          <div className="form-group">
            <label>
              Instructions<i className="text-danger">*</i>
            </label>
            <textarea
              className={"form-control " + (errors.instructions && "is-invalid")}
              rows="4"
              name="instructions"
              ref={register({
                required: true,
                validate: (value) => {
                  return !!value.trim();
                },
                minLength: 10,
              })}
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

export default FollowupsView;
