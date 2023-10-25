import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SweetAlert from "react-bootstrap-sweetalert";
import { RoutePaths } from "../../config/RoutePathConfig";
import PageTitleComponent from "../../components/PageTitleComponent";
import LoaderContainerComponent from "../../components/LoaderContainerComponent";
import ListView from "./ListView";
import DataView from "./DataView";
import { listAll, deleteRow } from "../../services/HospitalsService";
import { NotificationManager } from "react-notifications";
import { COMMON_MESSAGES, USER_TYPE, USER_RESTRICT_ROUTE } from "../../config/AppConfig";
import PaginationComponent from "../../components/PaginationComponent";
import { getUserAccesses, getUserDetails } from "../../session/UserSession";

const HospitalView = () => {
  // Set module variables
  const pageTitle = "Hospitals";
  const addButtonText = "Add New Hospital";

  // Set state
  const [rowsData, setRowsData] = useState([]);
  const [selectedRowId, setSelectedRowId] = useState(0);
  const [listDataLoaded, setListDataLoaded] = useState(false);
  const [reloadListData, setReloadListData] = useState(false);
  const [showDataView, setShowDataView] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [paginationData, setPaginationData] = useState({currentPage: 0, totalPages: 0, totalRows: 0});
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const q = (currentPage) ? "&page="+currentPage : "";
    listAll(q).then((res) => {
      const data = res.data;
      let listData = [];
      data.forEach((item) => {
        let address = item.address !== "" ? item.address : "";
        address += item.city !== "" ? ", " + item.city : "";
        address += item.state !== "" ? ", " + item.state : "";
        address += item.country !== "" ? ", " + item.country : "";
        address += item.pincode !== "" ? " " + item.pincode : "";
        listData.push({
          id: item.id,
          name: item.name,
          address: address.replace(/(^,)|(,$)/g, ""),
        });
      });
      setRowsData(listData);
      setPaginationData({currentPage: res.currentPage, totalPages: res.totalPages, totalRows: res.totalRows});
      setListDataLoaded(true);
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });
  }, [reloadListData, currentPage]);

  // Handle events
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
  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  // On record delete
  const onDelete = () => {
    deleteRow(selectedRowId).then((res) => {
      handleHideDeleteAlert();
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });
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
              <div className="col-auto">
              {(getUserAccesses().includes(USER_RESTRICT_ROUTE.HOSPITAL_ADD) || [USER_TYPE.SUPER_ADMIN].includes(getUserDetails().user_type)) &&
                <Link to={RoutePaths.HOSPITALS_ADD}>
                  <button type="button" className="btn btn-primary">
                    {addButtonText}
                  </button>
                </Link>
              }
              </div>
            </div>
          </div>
        </div>
        <ListView
          data={rowsData}
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

export default HospitalView;
