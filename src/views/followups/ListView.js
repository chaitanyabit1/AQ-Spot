import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import {
  MODULE_ACTION,
  MODULE_ACTION_SEP,
  extractModuleData,
  USER_RESTRICT_ROUTE
} from "../../config/AppConfig";
import { getUserAccesses } from "../../session/UserSession";

const ListView = (props) => {
  const { data, setRowEdit, setRowView, setRowDelete } = props;

  // Handle events
  const handleActionSelect = (val) => {
    const actionData = extractModuleData(val);

    switch (actionData[0]) {
      case MODULE_ACTION.EDIT:
        setRowEdit(actionData[1]);
        break;

      case MODULE_ACTION.VIEW:
        setRowView(actionData[1]);
        break;

      case MODULE_ACTION.DELETE:
        setRowDelete(actionData[1]);
        break;

      default:
        break;
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-12">
        <div className="card shadow">
          <div className="card-body">
            <table className="table table-borderless">
              <thead>
                <tr>
                  <th className="col-wd-20">Type</th>
                  <th className="col-wd-20">Patient</th>
                  <th className="col-wd-40">Instructions</th>
                  <th className="col-wd-10 text-center">Status</th>
                  <th className="col-action">Action</th>
                </tr>
              </thead>
              {data.length > 0 ? (
                <tbody>
                  {data.map((obj, index) => {
                    return (
                      <tr key={"row-" + obj.id}>
                        <td>{obj.type}</td>
                        <td>{obj.patient}</td>
                        <td>{obj.instructions}</td>
                        <td className="col-status text-center">
                          {obj.status}
                        </td>
                        <td className="col-action">
                          <Dropdown
                            id={Math.random()}
                            onSelect={handleActionSelect}
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
                                eventKey={
                                  MODULE_ACTION.VIEW +
                                  MODULE_ACTION_SEP +
                                  obj.id
                                }
                              >
                                View
                              </Dropdown.Item>
                              {/* <Dropdown.Item
                                eventKey={
                                  MODULE_ACTION.EDIT +
                                  MODULE_ACTION_SEP +
                                  obj.id
                                }
                              >
                                Edit
                              </Dropdown.Item> */}
                              {(getUserAccesses().includes(USER_RESTRICT_ROUTE.FOLLLOWUPS_DELETE)) && (
                              <Dropdown.Item
                                eventKey={
                                  MODULE_ACTION.DELETE +
                                  MODULE_ACTION_SEP +
                                  obj.id
                                }
                              >
                                Delete
                              </Dropdown.Item>
                              )}
                            </Dropdown.Menu>
                          </Dropdown>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              ) : (
                <tbody>
                  <tr>
                    <td colSpan="3" className="text-center">
                      No records found.
                    </td>
                  </tr>
                </tbody>
              )}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListView;
