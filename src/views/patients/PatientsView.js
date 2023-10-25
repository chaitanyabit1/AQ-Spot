import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import SweetAlert from "react-bootstrap-sweetalert";
import { RoutePaths } from "../../config/RoutePathConfig";
import PageTitleComponent from "../../components/PageTitleComponent";
import LoaderContainerComponent from "../../components/LoaderContainerComponent";
import ListView from "./ListView";
import AdmitView from "./AdmitView";
import DischargeView from "./DischargeView";
import { listAll, deleteRow, updateCritical } from "../../services/PatientService";
import { listAll as hospitalListAll } from "../../services/HospitalsService";
import { listAllByHospital as icuListAll } from "../../services/ICUService";
import { NotificationManager } from "react-notifications";
import { COMMON_MESSAGES, USER_TYPE, USER_RESTRICT_ROUTE } from "../../config/AppConfig";
import PaginationComponent from "../../components/PaginationComponent";
import { getUserAccesses, getUserDetails } from "../../session/UserSession";
import AutoSuggestView from "./AutoSuggestView";

const PatientsView = () => {
  // Set module variables
  const pageTitle = "Patients";
  const addButtonText = "Add New Patient";

  // Set state
  const [rowsData, setRowsData] = useState([]);
  const [selectedRowId, setSelectedRowId] = useState(0);
  const [listDataLoaded, setListDataLoaded] = useState(false);
  const [reloadListData, setReloadListData] = useState(false);
  const [showAdmitView, setShowAdmitView] = useState(false);
  const [showDischargeView, setShowDischargeView] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [hospitalList, setHospitalList] = useState([]);
  const [icuWardsList, setIcuWardsList] = useState([]);
  const { register, handleSubmit, reset } = useForm();
  const [dataFilters, setDataFilters] = useState({
    hospitalId: 0,
    icuWardId: 0,
    query: "",
    pid: '',
  });
  const [paginationData, setPaginationData] = useState({currentPage: 0, totalPages: 0, totalRows: 0});
  const [currentPage, setCurrentPage] = useState(1);
  const [suggestValue, setSuggestValue] = useState('');
  const [selectedPID, setSelectedPID] = useState('');

  useEffect(() => {
    let q = (currentPage) ? "&page="+currentPage : "";
    if (dataFilters.query !== "" && dataFilters.query !== undefined) {
      q = q + "&query=" + dataFilters.query;
    }
    if (dataFilters.hospitalId) {
      q = q + "&hospital=" + dataFilters.hospitalId;
    }
    if (dataFilters.icuWardId) {
      q = q + "&icu_ward=" + dataFilters.icuWardId;
    }
    if (dataFilters.pid !== '') {
      q = q + "&pid=" + dataFilters.pid;
    }
    setListDataLoaded(false);
    listAll(q).then((res) => {
      const data = res.data;
      const listData = [];

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
          hospitalId: item.hospital_id || "",
          icuWardId: item.icu_ward_id || "",
          isCritical: Boolean(item.is_critical),
          currentAdmissionId: item.current_admission_id || null
        });
      });
      setRowsData(listData);
      setPaginationData({currentPage: res.currentPage, totalPages: res.totalPages, totalRows: res.totalRows});
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });

    hospitalListAll().then((res) => {
      const data = res.data;
      const listData = [];
      data.forEach((item) => {
        listData.push({
          id: item.id,
          name: item.name,
        });
      });
      setHospitalList(listData);
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });

    icuListAll(dataFilters.hospitalId).then((res) => {
      const data = res.data;
      const listData = [];
      data.forEach((item) => {
        listData.push({
          id: item.id,
          name: item.name,
        });
      });
      setIcuWardsList(listData);
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });
    setListDataLoaded(true);
  }, [reloadListData, dataFilters, currentPage]);

  // Handle events
  const handleShowAdmitView = () => {
    setShowAdmitView(true);
  };
  const handleHideAdmitView = () => {
    setShowAdmitView(false);
  };
  const handleHideAdmitViewReload = () => {
    setShowAdmitView(false);
    setReloadListData(!reloadListData);
  };
  const handleShowDischargeView = () => {
    setShowDischargeView(true);
  };
  const handleHideDischargeView = () => {
    setShowDischargeView(false);
  };
  const handleHideDischargeViewReload = () => {
    setShowDischargeView(false);
    setReloadListData(!reloadListData);
  };
  const handleShowDeleteAlert = () => {
    setShowDeleteAlert(true);
  };
  const handleHideDeleteAlert = () => {
    setShowDeleteAlert(false);
  };
  const handleChangeHospital = (e) => {
    setDataFilters({
      hospitalId: e.target.value || 0,
      icuWardId: "",
      query: (dataFilters.pid !== "") ? '' : dataFilters.query,
      pid: '',
    });
    setCurrentPage(1);
  };
  const handleChangeWard = (e) => {
    setDataFilters({
      hospitalId: dataFilters.hospitalId,
      icuWardId: e.target.value || 0,
      query: dataFilters.query,
      pid: '',
    });
    setCurrentPage(1);
  };
  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  // On record delete
  const onDelete = () => {
    deleteRow(selectedRowId).then((res) => {
      handleHideDeleteAlert();
      setReloadListData(!reloadListData);
    }).catch((err) => {
      if(err.response.data.message !== 'undefined') {
        NotificationManager.error(err.response.data.message, 'Error', 5000);
      } else {
        NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
      }
    });
  };

  // Critical/Not Critical
  const markCritical = (id, val) => {
    const status = (val) ? "critical" : "noncritical";
    updateCritical(id, status).then((res) => {
      setReloadListData(!reloadListData);
    }).catch((err) => {
      if(err.response.data.message !== 'undefined') {
        NotificationManager.error(err.response.data.message, 'Error', 5000);
      } else {
        NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
      }
    });
  };

  // On Filters
  const onFilters = (data) => {
    setDataFilters({
      hospitalId: data.hospitalId || 0,
      icuWardId: data.icuWardId || 0,
      query: data.query
    });
    setReloadListData(!reloadListData);
  };

  const onFiltersReset = () => {
    reset();
    setDataFilters({
      hospitalId: 0,
      icuWardId: 0,
      query: "",
      pid: "",
    });
    setSuggestValue('');
    setReloadListData(!reloadListData);
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
              {(getUserAccesses().includes(USER_RESTRICT_ROUTE.PATIENT_ADD) || !([USER_TYPE.STAFF].includes(getUserDetails().user_type))) &&
                <Link to={RoutePaths.PATIENTS_ADD}>
                  <button type="button" className="btn btn-primary">
                    {addButtonText}
                  </button>
                </Link>
              }
              </div>
            </div>
          </div>
        </div>
        <div className="row justify-content-center mb-3">
          <div className="col-12">
            <div className="row align-items-center auto_searchbar">
              <div className="col autosearch">
                <AutoSuggestView selectedPID={selectedPID} setSelectedPID={setSelectedPID} value={suggestValue} setValue={setSuggestValue} setDataFilters={setDataFilters} setCurrentPage={setCurrentPage} setPaginationData={setPaginationData} />
              </div>
              <div className="col-auto">
                <form onSubmit={handleSubmit(onFilters)}>
                  <div className="form-row filterrow">
                    <div className="form-group filter-row mr-2">
                      {/* <input type="text" name="query" className="form-control form-control-sm" placeholder="Search by name" ref={register} /> */}
                      {/* <AutoSuggestView setDataFilters={setDataFilters} /> */}
                    </div>
                    <div className="form-group filter-row mr-2 change_hospital">
                      <select name="hospitalId" className="form-control form-control-sm" ref={register} onChange={handleChangeHospital}>
                        <option value="">All Hospitals</option>
                        {hospitalList.map((obj, index) => {
                          return (
                            <option value={obj.id} key={"h-" + obj.id}>
                              {obj.name}
                            </option>
                          );
                        })};
                      </select>
                    </div>
                    <div className="form-group filter-row mr-2">
                      <select name="icuWardId" className="form-control form-control-sm" ref={register} onChange={handleChangeWard}>
                        <option value="">All ICU Wards</option>
                        {icuWardsList.map((obj, index) => {
                          return (
                            <option value={obj.id} key={"i-" + obj.id}>
                              {obj.name}
                            </option>
                          );
                        })};
                      </select>
                    </div>
                    <div className="form-group filter-row mr-2">
                      {/* <button type="submit" className="btn btn-sm btn-secondary">Filter</button> */}
                      <button type="button" className="btn btn-sm btn-secondary ml-2" onClick={onFiltersReset}>Reset</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <ListView
          data={rowsData}
          setPatientAdmit={(id) => {
            setSelectedRowId(id);
            handleShowAdmitView();
          }}
          setPatientDischarge={(id) => {
            setSelectedRowId(id);
            handleShowDischargeView();
          }}
          setPatientCritical={(id, val) => {
            markCritical(id, val);
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
      

      {showAdmitView && (
        <AdmitView
          handleHideAdmitView={handleHideAdmitView}
          handleHideAdmitViewReload={handleHideAdmitViewReload}
          rowId={selectedRowId}
        />
      )}
      {showDischargeView && (
        <DischargeView
          handleHideDischargeView={handleHideDischargeView}
          handleHideDischargeViewReload={handleHideDischargeViewReload}
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

export default PatientsView;