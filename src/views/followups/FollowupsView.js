import React, { useState, useEffect } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import PageTitleComponent from "../../components/PageTitleComponent";
import LoaderContainerComponent from "../../components/LoaderContainerComponent";
import ListView from "./ListView";
import CreateView from "./CreateView";
import EditView from "./EditView";
import DataView from "./DataView";
import { listAll, deleteRow } from "../../services/FollowupService";
import { NotificationManager } from "react-notifications";
import { COMMON_MESSAGES } from "../../config/AppConfig";
import PaginationComponent from "../../components/PaginationComponent";

const FollowupsView = () => {
  // Set module variables
  const pageTitle = "Followups";
  // const addButtonText = "Add New Followup";

  // Set state
  const [rowsData, setRowsData] = useState([]);
  const [selectedRowId, setSelectedRowId] = useState(0);
  const [listDataLoaded, setListDataLoaded] = useState(false);
  const [reloadListData, setReloadListData] = useState(false);
  const [showCreateView, setShowCreateView] = useState(false);
  const [showEditView, setShowEditView] = useState(false);
  const [showDataView, setShowDataView] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [paginationData, setPaginationData] = useState({currentPage: 0, totalPages: 0, totalRows: 0});
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const q = (currentPage) ? "&page="+currentPage : "";
    listAll(q).then((res) => {
      setRowsData(res.data);
      setPaginationData({currentPage: res.currentPage, totalPages: res.totalPages, totalRows: res.totalRows});
      setListDataLoaded(true);
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });    
  }, [reloadListData, currentPage]);

  // Handle events
  // const handleShowCreateView = () => {
  //   setShowCreateView(true);
  // };
  const handleHideCreateView = () => {
    setShowCreateView(false);
  };
  const handleShowEditView = () => {
    setShowEditView(true);
  };
  const handleHideEditView = () => {
    setShowEditView(false);
  };
  const handleShowDataView = () => {
    setShowDataView(true);
  };
  const handleHideDataView = () => {
    setShowDataView(false);
    setReloadListData(!reloadListData);
  };
  const handleShowDeleteAlert = () => {
    setShowDeleteAlert(true);
  };
  const handleHideDeleteAlert = () => {
    setSelectedRowId(0);
    setShowDeleteAlert(false);
    setReloadListData(!reloadListData);
  };
  const handleReloadListdata = () => {
    setListDataLoaded(false);
    setReloadListData(!reloadListData);
  };
  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  // On record delete
  const onDelete = () => {
    deleteRow(selectedRowId).then((res) => {
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });
    handleHideDeleteAlert();
  };

  return !listDataLoaded ? (
    <LoaderContainerComponent title={pageTitle} />
  ) : (
    <main role="main" className="main-content">
      <div className="container-fluid">
        <div className="row justify-content-center mb-3">
          <div className="col-12">
            <div className="row align-items-center">
              <div className="col">
                <PageTitleComponent title={pageTitle} />
              </div>
              {/* <div className="col-auto">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleShowCreateView}
                >
                  {addButtonText}
                </button>
              </div> */}
            </div>
          </div>
        </div>
        <ListView
          data={rowsData}
          setRowEdit={(id) => {
            setSelectedRowId(id);
            handleShowEditView();
          }}
          setRowView={(id) => {
            setSelectedRowId(id);
            handleShowDataView();
          }}
          setRowDelete={(id) => {
            setSelectedRowId(id);
            handleShowDeleteAlert();
          }}
        />
        <PaginationComponent 
          currentPage={currentPage || paginationData.currentPage} 
          totalRows={paginationData.totalRows} 
          totalPages={paginationData.totalPages}
          setCurrentPage={(pageNumber) => {handleChangePage(pageNumber);}}
        />
      </div>

      {showCreateView && (
        <CreateView
          handleHideCreateView={handleHideCreateView}
          handleReloadListdata={handleReloadListdata}
        />
      )}
      {showEditView && (
        <EditView
          handleHideEditView={handleHideEditView}
          handleReloadListdata={handleReloadListdata}
          rowId={selectedRowId}
        />
      )}
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
          onConfirm={onDelete}
        >
          You will not be able to recover the data once deleted!
        </SweetAlert>
      )}
    </main>
  );
};

export default FollowupsView;
