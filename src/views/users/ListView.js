import React from "react";
import { Link, useHistory } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import defaultImg from "../../assets/img/default-user.png";
import {
  MODULE_ACTION,
  MODULE_ACTION_SEP,
  extractModuleData,
  USER_TYPE,
  USER_RESTRICT_ROUTE,
} from "../../config/AppConfig";
import { RoutePaths } from "../../config/RoutePathConfig";
import { getUserAccesses, getUserDetails } from "../../session/UserSession";

const ListView = (props) => {
  const { data, setRowView, setRowDelete } = props;
  let history = useHistory();

  // Handle events
  const handleActionSelect = (val) => {
    const actionData = extractModuleData(val);
    let page = "";

    switch (actionData[0]) {
      case MODULE_ACTION.VIEW:
        setRowView(actionData[1]);
        break;

      case MODULE_ACTION.EDIT:
        page = (RoutePaths.USERS_EDIT).replace(":id", actionData[1]);
        history.push(page);
        break;

      case MODULE_ACTION.DELETE:
        setRowDelete(actionData[1]);
        break;

      default:
        break;
    }
  };

  return (
    <div className="row user_view">
      {data && data.map((row, index) => (
        <div className="col-md-3" key={index}>
          <div className="card shadow mb-4 userviewlist">
            <div className="card-body text-center">
              <div className="avatar avatar-lg mt-4">
                <Link to="">
                  <img
                    src={row.photo ? process.env.REACT_APP_UPLOAD_URL + row.photo : defaultImg}
                    alt="..."
                    className="avatar-img rounded-circle"
                  />
                </Link>
              </div>
              <div className="card-text my-2">
                <strong className="card-title my-0">{row.name}</strong>
                <p className="small mb-0">{row.type}</p>
              </div>
              <div className="card-actions-float">
                <Dropdown id={Math.random()} onSelect={handleActionSelect} className="data-action">
                  <Dropdown.Toggle
                    variant="secondary"
                    className="btn-sm"
                    data-toggle="dropdown"
                  >
                    <i className="fas fa-ellipsis-v"></i>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item 
                      eventKey={
                        MODULE_ACTION.VIEW +
                        MODULE_ACTION_SEP +
                        row.id
                      }
                    >View</Dropdown.Item>
                    {(getUserAccesses().includes(USER_RESTRICT_ROUTE.USER_EDIT) || [USER_TYPE.SUPER_ADMIN, USER_TYPE.CCC_DOCTOR].includes(getUserDetails().user_type)) &&
                     <><Dropdown.Item 
                        eventKey={
                          MODULE_ACTION.EDIT +
                          MODULE_ACTION_SEP +
                          row.id
                        }
                      >Edit</Dropdown.Item>
                      <Dropdown.Item 
                        eventKey={
                          MODULE_ACTION.DELETE +
                          MODULE_ACTION_SEP +
                          row.id
                        }
                      >Delete</Dropdown.Item></>
                      }
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
            {/* <div className="card-footer text-center">
              <p className="small mb-0">{row.hospitals} Hospital(s), {row.wards} ICU Ward(s)</p>
            </div> */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListView;
