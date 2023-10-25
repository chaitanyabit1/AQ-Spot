import React, { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import SweetAlert from "react-bootstrap-sweetalert";
import {
  MODULE_ACTION,
  MODULE_ACTION_SEP,
  extractModuleData,
} from "../../config/AppConfig";
import PageTitleComponent from "../../components/PageTitleComponent";
import LoaderContainerComponent from "../../components/LoaderContainerComponent";
import CreateView from "./CreateView";
import EditView from "./EditView";
import DataView from "./DataView";

const UserPolicyView = () => {
  const pageTitle = "User Access Policy";

  const [rowsData, setRowsData] = useState([]);
  const [selectedRowId, setSelectedRowId] = useState(null);

  const [listLoaded, setListLoaded] = useState(false);
  const [listReload, setListReload] = useState(0);
  const [showCreateView, setShowCreateView] = useState(false);
  const [showEditView, setShowEditView] = useState(false);
  const [showDataView, setShowDataView] = useState(false);
  const [showSingleDeletePopup, setShowSingleDeletePopup] = useState(false);

  const onRowActionSelect = (val) => {
    const data = extractModuleData(val);

    switch (data[0]) {
      case MODULE_ACTION.EDIT:
        editRrecord(data[1]);
        break;

      case MODULE_ACTION.VIEW:
        viewRecord(data[1]);
        break;

      case MODULE_ACTION.DELETE:
        showDeletePopup(data[1]);
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        process.env.REACT_APP_API_URL + "/user-policy"
      );
      const data = await response.json();
      setRowsData(data);
      setListLoaded(true);
    }
    fetchData();
  }, [listReload]);

  const onCreateClick = () => {
    setShowCreateView(true);
  };
  const hideCreateView = () => {
    setShowCreateView(false);
  };

  const editRrecord = (id) => {
    setSelectedRowId(id);
    setShowEditView(true);
  };
  const hideEditView = () => {
    setShowEditView(false);
    setSelectedRowId(null);
  };

  const viewRecord = (id) => {
    setSelectedRowId(id);
    setShowDataView(true);
  };
  const hideDataView = () => {
    setShowDataView(false);
    setSelectedRowId(null);
  };

  const showDeletePopup = (id) => {
    setSelectedRowId(id);
    setShowSingleDeletePopup(true);
  };
  const hideDeletePopup = () => {
    setShowSingleDeletePopup(false);
    setSelectedRowId(null);
  };
  const handleSingleDelete = () => {
    async function deleteData() {
      const response = await fetch(
        process.env.REACT_APP_API_URL + "/user-policy/" + selectedRowId,
        { method: "DELETE" }
      );
      if (response.ok) {
        setListReload(Math.random());
      }
    }
    setShowSingleDeletePopup(false);
    setListLoaded(false);
    deleteData();
  };

  if (!listLoaded) {
    return <LoaderContainerComponent title={pageTitle} />;
  }
  return (
    <main role="main" className="main-content">
      <div className="container-fluid">
        <div className="row justify-content-center mb-3">
          <div className="col-12">
            <div className="row align-items-center">
              <div className="col">
                <PageTitleComponent title={pageTitle} />
              </div>
              <div className="col-auto">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={onCreateClick}
                >
                  Add New Policy
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-12">
            <div className="card shadow">
              <div className="card-body">
                <table className="table table-borderless">
                  <thead>
                    <tr>
                      <th className="col-check"></th>
                      <th className="col-wd-80">Policy Name</th>
                      <th className="col-status">Status</th>
                      <th className="col-action">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowsData.map((row, index) => {
                      return (
                        <TableRow
                          obj={row}
                          id={index}
                          key={row.id}
                          onRowActionSelect={onRowActionSelect}
                        />
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCreateView && (
        <CreateView
          hideModal={hideCreateView}
          updateListingReload={(data) => {
            setListReload(data);
          }}
        />
      )}
      {showEditView && (
        <EditView
          hideModal={hideEditView}
          rowId={selectedRowId}
          updateListingReload={(data) => {
            setListReload(data);
          }}
        />
      )}
      {showDataView && (
        <DataView hideModal={hideDataView} rowId={selectedRowId} />
      )}
      {showSingleDeletePopup && (
        <SweetAlert
          warning
          showCancel
          btnSize=""
          confirmBtnText="Delete"
          confirmBtnBsStyle="danger"
          cancelBtnText="Cancel"
          title="Are you sure?"
          focusCancelBtn
          onCancel={hideDeletePopup}
          onConfirm={handleSingleDelete}
        >
          You will not be able to recover the data once deleted!
        </SweetAlert>
      )}
    </main>
  );
};

const TableRow = (props) => {
  return (
    <tr>
      <td className="col-check">
        <input type="checkbox" id={props.obj.id} />
      </td>
      <td>{props.obj.name}</td>
      <td className="col-status">Active</td>
      <td className="col-action">
        <Dropdown
          id={Math.random()}
          onSelect={props.onRowActionSelect}
          className="data-action"
        >
          <Dropdown.Toggle
            variant="secondary"
            className="btn-sm"
            data-toggle="dropdown"
          >
            <i className="fas fa-ellipsis-h"></i>
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item
              eventKey={MODULE_ACTION.VIEW + MODULE_ACTION_SEP + props.obj.id}
            >
              View
            </Dropdown.Item>
            <Dropdown.Item
              eventKey={MODULE_ACTION.EDIT + MODULE_ACTION_SEP + props.obj.id}
            >
              Edit
            </Dropdown.Item>
            <Dropdown.Item
              eventKey={MODULE_ACTION.DELETE + MODULE_ACTION_SEP + props.obj.id}
            >
              Delete
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </td>
    </tr>
  );
};

export default UserPolicyView;
