import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import SweetAlert from "react-bootstrap-sweetalert";
import Modal from "react-bootstrap/Modal";
import LoaderComponent from "../../components/LoaderComponent";
import { listAll, deletePage, create, viewPage, update } from "../../services/MasterPagesService";
import { NotificationManager } from "react-notifications";
import PaginationComponent from "../../components/PaginationComponent";
import { COMMON_MESSAGES } from "../../config/AppConfig";

const BodyProfileParamsView = (props) => {
  const addButtonText = "Add Body Profile Params";

  // Set state
  const [listData, setListData] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editRowId, setEditRowId] = useState(0);
  const [reloadList, setReloadList] = useState(false);
  const [deleteRowId, setDeleteRowId] = useState(0);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [paginationData, setPaginationData] = useState({currentPage: 0, totalPages: 0, totalRows: 0});
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch data
  useEffect(() => {
    const q = (currentPage) ? "&page="+currentPage : "";
    listAll("body_profile_params", q).then((res) => {
      setListData(res.data);
      setPaginationData({currentPage: res.currentPage, totalPages: res.totalPages, totalRows: res.totalRows});
      setDataLoaded(true);
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });
  }, [reloadList, currentPage]);

  // Handle events
  const handleAddAction = () => {
    setShowAddForm(true);
  };
  const handleEditAction = (id) => {
    setEditRowId(id);
    setShowEditForm(true);
  };
  const handleCloseAddAction = () => {
    setShowAddForm(false);
  };
  const handleCloseAddActionAndReload = () => {
    setShowAddForm(false);
    setReloadList(!reloadList);
  };
  const handleCloseEditAction = () => {
    setEditRowId(0);
    setShowEditForm(false);
  };
  const handleCloseEditActionAndReload = () => {
    setShowEditForm(false);
    setReloadList(!reloadList);
  };
  const handleDeleteAction = (id) => {
    setDeleteRowId(id);
    setShowDeleteAlert(true);
  };
  const handleHideDeleteAlert = () => {
    setDeleteRowId(0);
    setShowDeleteAlert(false);
    setReloadList(!reloadList);
  };

  const handleChangePage = (page) => {
    setCurrentPage(page);
  }

  // On record delete
  const onRowDelete = () => {
    deletePage("body_profile_params", deleteRowId).then((res) => {
      NotificationManager.success(COMMON_MESSAGES.DELETE_SUCCESS, 'Success', 5000);
      handleHideDeleteAlert();
      setCurrentPage(1);
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });    
  };

  if (!dataLoaded) {
    return <LoaderComponent />;
  }
  return (
    <div className="row">
      <div className="col-12">
        <div className="row align-items-center mb-3">
          <div className="col"></div>
          <div className="col-auto">
            <button type="button" className="btn btn-primary mr-2" onClick={handleAddAction}>
              {addButtonText}
            </button>
          </div>
        </div>
        <table className="table table-borderless">
          <thead>
            <tr>
              <th className="col-wd-20">Type</th>
              <th className="col-wd-30">Name</th>
              <th className="col-wd-20">Description</th>
              <th className="col-wd-20">Hospital</th>
              <th className="col-wd-10 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {listData && listData.map((row, index) => (
              <tr key={index}>
                <td>{row.type}</td>
                <td>{row.name}</td>
                <td>{row.description}</td>
                <td>{row.hospital}</td>
                <td className="text-center">
                  <button type="button" className="btn btn-sm" onClick={() => handleEditAction(row.id)}>
                    <i className="far fa-edit"></i>
                  </button>
                  <button type="button" className="btn btn-sm" onClick={() => handleDeleteAction(row.id)}>
                    <i className="far fa-trash-alt text-danger"></i>
                  </button>
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
            handleClose={handleCloseAddAction}
            handleCloseAndReload={handleCloseAddActionAndReload} 
          />
        )}

        {showEditForm && (
          <EditForm 
            rowId={editRowId}
            handleClose={handleCloseEditAction}
            handleCloseAndReload={handleCloseEditActionAndReload}
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
            onConfirm={onRowDelete}
          >
            You will not be able to recover the data once deleted!
          </SweetAlert>
        )}
      </div>
    </div>
  );
};

const AddForm = (props) => {
  const { handleClose, handleCloseAndReload } = props;

  const [typeList, setTypeList] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const { register, handleSubmit, errors } = useForm();

  useEffect(() => {
    listAll("body_profile_types").then((res) => {
      setTypeList(res.data);
      setDataLoaded(true);
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });    
  }, []);

  // Form submit
  const onSubmit = (data) => {
    setFormSubmitted(true);
    const saveData = {
      type: data.type,
      name: data.name,
      description: data.description
    };
    create("body_profile_params", saveData).then((res) => {
      handleCloseAndReload();
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });    
  };

  if (!dataLoaded) {
    return <LoaderComponent />;
  }

  return (
    <Modal
      show={true}
      className="followups_view fade show"
      onHide={handleClose}
    >
      <Modal.Header closeButton>
        <Modal.Title>Add Body Profile Params</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>
              Type<i className="text-danger">*</i>
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
              Name<i className="text-danger">*</i>
            </label>
            <input
              type="text"
              className={"form-control " + (errors.name && "is-invalid")}
              name="name"
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
              Description
            </label>
            <input
              type="text"
              className={"form-control " + (errors.description && "is-invalid")}
              name="description"
              ref={register()}
            />
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

const EditForm = (props) => {
  const { rowId, handleClose, handleCloseAndReload } = props;

  const [rowInfo, setRowInfo] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const { register, handleSubmit, errors } = useForm();
  const [selectedType, setSelectedType] = useState("");
  const [typeList, setTypeList] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    listAll("body_profile_types").then((res) => {
      setTypeList(res.data);
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });

    viewPage("body_profile_params", rowId).then((res) => {
      setRowInfo(res.data);
      setSelectedType(res.data.type_id ? res.data.type_id : "");
      setDataLoaded(true);
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });
  }, [rowId]);

  // Form submit
  const onSubmit = (data) => {
    setFormSubmitted(true);
    const saveData = {
      type: data.type,
      name: data.name,
      description: data.description
    };

    update("body_profile_params", saveData, rowId).then((res) => {
      handleCloseAndReload();
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });
  };

  const handleChangeType = (e) => {
    setSelectedType(e.target.value);
  }

  if (!dataLoaded) {
    return <LoaderComponent />;
  }

  return (
    <Modal
      show={true}
      className="followups_view fade show"
      onHide={handleClose}
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit Body Profile Params</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>
              Type<i className="text-danger">*</i>
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
                onChange={handleChangeType}
                value={selectedType}
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
              Name<i className="text-danger">*</i>
            </label>
            <input
              type="text"
              className={"form-control " + (errors.name && "is-invalid")}
              name="name"
              ref={register({
                required: true,
                validate: (value) => {
                  return !!value.trim();
                },
              })}
              defaultValue={(rowInfo.name) ? rowInfo.name : ""}
            />
          </div>
          <div className="form-group">
            <label>
              Description
            </label>
            <input
              type="text"
              className={"form-control " + (errors.description && "is-invalid")}
              name="description"
              ref={register()}
              defaultValue={(rowInfo.description) ? rowInfo.description : ""}
            />
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
}
export default BodyProfileParamsView;
