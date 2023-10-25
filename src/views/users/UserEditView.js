import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { RoutePaths } from "../../config/RoutePathConfig";
import PageTitleComponent from "../../components/PageTitleComponent";
import UserEditHospitaliew from "./UserEditHospitaliew";
import { viewRow, uploadFile, update } from "../../services/UsersService";
import { listAll as accessPolicyListAll} from "../../services/AccessPolicyService";
import { listAll as userTypeListAll} from "../../services/UserTypeService";
import { NotificationManager } from "react-notifications";
import { COMMON_MESSAGES } from "../../config/AppConfig";

const UserEditView = (props) => {
  const { match } = props;
  const userId = match.params["id"];
  
  // Set module variables
  const pageTitle = "Edit User";
  const backButtonText = "Back";
  const formView = {
    info: "Info",
    hospitals: "Hospitals",
  };

  // Set state
  const [currentFormView, setCurrentFormView] = useState(formView.info);
  const [userTypeList, setUserTypeList] = useState([]);
  const [accessPolicyList, setAccessPolicyList] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const { register, handleSubmit, errors } = useForm();
  const [selectedFile, setSelectedFile] = useState(null);
  const [userInfo, setUserInfo] = useState([]);
  const [selectedUserType, setSelectedUserType] = useState("");
  const [selectedAccessPolicy, setSelectedAccessPolicy] = useState("");
  let history = useHistory();
  const [fileUploading, setFileUploading] = useState(false);

  const handleVieChange = (view) => {
    if (currentFormView !== view) {
      setCurrentFormView(view);
    }
  };

  useEffect(() => {
    userTypeListAll().then((res) => {
      const listData = [];
      (res.data).forEach((item) => {
        listData.push({
          id: item.id,
          name: item.name
        });
      });
      setUserTypeList(listData);
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });

    accessPolicyListAll().then((res) => {
      const listData = [];
      (res.data).forEach((item) => {
        listData.push({
          id: item.id,
          name: item.name
        });
      });
      setAccessPolicyList(listData);
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });

    viewRow(userId).then((res) => {
      const data = res.data;
      setUserInfo({
        id: userId,
        userType: data.user_type || "",
        accessPolicy: data.access_policy || "",
        firstName: data.first_name,
        middleName: data.middle_name,
        lastName: data.last_name,
        email: data.email,
        designation: data.designation,
        photo: (data.photo) ? data.photo : ""
      });
      setSelectedUserType(data.user_type_id);
      setSelectedAccessPolicy(data.access_policy_id);
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });
  }, [userId]);

  // Form submit
  const onSubmit = (data) => {
    setFormSubmitted(true);
    const saveData = {
      user_type: data.userTypeId,
      access_policy: data.accessPolicyId,
      first_name: data.firstName,
      middle_name: data.middleName,
      last_name: data.lastName,
      designation: data.designation,
      email: data.email,
      photo: selectedFile,
      password: data.password,
    };
    update(saveData, userId).then((res) => {
      history.push(RoutePaths.USERS);
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });
  };

  const handleChangeUserType = (e) => {
    setSelectedUserType(e.target.value);
  };

  const handleChangeAccessPolicy = (e) => {
    setSelectedAccessPolicy(e.target.value);
  };

  const handleChangeFile = (file) => {
    const data = new FormData() 
    data.append('photo', file);
    setFileUploading(true);
    uploadFile(data).then((res) => {
      if(res.error) {
        setSelectedFile('');
        setFileUploading(false);
      } else {
        setSelectedFile(res.data.filename);
        setFileUploading(false);
      }
    }).catch((err) => {
      setSelectedFile('');
      setFileUploading(false);
    });
  };

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
                <Link to={RoutePaths.USERS}>
                  <button type="button" className="btn btn-outline-secondary">
                    {backButtonText}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
              <div className="card shadow">
                <div className="card-body">
                  <ul className="nav nav-tabs mb-4" role="tablist">
                    <li className="nav-item" onClick={() => handleVieChange(formView.info)}>
                      <span className={"nav-link " + (currentFormView === formView.info ? "active" : "")}>Info</span>
                    </li>
                    <li className="nav-item" onClick={() => handleVieChange(formView.hospitals)}>
                      <span className={"nav-link " + (currentFormView === formView.hospitals ? "active" : "")}>Hospitals</span>
                    </li>                    
                  </ul>
                  <form onSubmit={handleSubmit(onSubmit)}>
                  <div className={"row " + (currentFormView === formView.info ? "show" : "hide")}>
                    <div className="col-12">
                    <div className="form-row">
                        <div className="form-group col-md-4">
                          <label>
                            User Type<i className="text-danger">*</i>
                          </label>
                            <select
                              className={
                                "form-control " + (errors.userTypeId && "is-invalid")
                              }
                              name="userTypeId"
                              ref={register({
                                required: true,
                                validate: (value) => {
                                  return !!value.trim();
                                },
                              })}
                              onChange={handleChangeUserType}
                              value={selectedUserType}
                            >
                            <option value="">Select</option>
                            {userTypeList.map((obj, index) => {
                              return (
                                <option value={obj.id} key={obj.id}>
                                  {obj.name}
                                </option>
                              );
                            })}
                            ;
                          </select>
                        </div>
                        <div className="form-group col-md-4">
                          <label>
                            Access Policy<i className="text-danger">*</i>
                          </label>
                          <select
                            className={
                              "form-control " + (errors.accessPolicyId && "is-invalid")
                            }
                            name="accessPolicyId"
                            ref={register({
                              required: true,
                              validate: (value) => {
                                return !!value.trim();
                              },
                            })}
                            onChange={handleChangeAccessPolicy}
                            value={selectedAccessPolicy}
                          >
                            <option value="">Select</option>
                            {accessPolicyList.map((obj, index) => {
                              return (
                                <option value={obj.id} key={obj.id}>
                                  {obj.name}
                                </option>
                              );
                            })}
                            ;
                          </select>
                        </div>
                        <div className="form-group col-md-4">
                          <label>
                            Designation<i className="text-danger">*</i>
                          </label>
                          <input
                            type="text"
                            className={"form-control " + (errors.designation && "is-invalid")}
                            name="designation"
                            ref={register({
                              required: true,
                              validate: (value) => {
                                return !!value.trim();
                              },
                            })}
                            defaultValue={userInfo.designation}
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group col-md-4">
                          <label>
                            First Name<i className="text-danger">*</i>
                          </label>
                          <input
                            type="text"
                            className={"form-control " + (errors.firstName && "is-invalid")}
                            name="firstName"
                            ref={register({
                              required: true,
                              validate: (value) => {
                                return !!value.trim();
                              },
                            })}
                            defaultValue={userInfo.firstName}
                          />
                        </div>
                        <div className="form-group col-md-4">
                          <label>
                            Middle Name
                          </label>
                          <input
                            type="text"
                            className={"form-control"}
                            name="middleName"
                            ref={register()}
                            defaultValue={userInfo.middleName}
                          />
                        </div>
                        <div className="form-group col-md-4">
                          <label>
                            Last Name<i className="text-danger">*</i>
                          </label>
                          <input
                            type="text"
                            className={"form-control " + (errors.lastName && "is-invalid")}
                            name="lastName"
                            ref={register({
                              required: true,
                              validate: (value) => {
                                return !!value.trim();
                              },
                            })}
                            defaultValue={userInfo.lastName}
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group col-md-4">
                          <label>
                            Email<i className="text-danger">*</i>
                          </label>
                          <input
                            type="text"
                            className={"form-control " + (errors.email && "is-invalid")}
                            name="email"
                            ref={register({
                              required: true,
                              validate: (value) => {
                                return !!value.trim();
                              },
                            })}
                            defaultValue={userInfo.email}
                          />
                        </div>
                        {/* <div className="form-group col-md-4">
                          <label>
                            Password<i className="text-danger">*</i>
                          </label>
                          <input
                            type="password"
                            className={"form-control " + (errors.password && "is-invalid")}
                            name="password"
                            ref={register({
                              required: true,
                              validate: (value) => {
                                return !!value.trim();
                              },
                            })}
                            defaultValue={userInfo.password}
                          />
                        </div> */}
                        <div className="form-group col-md-4">
                          <label>
                            Photo
                          </label>
                          <input 
                            className={"form-control"}
                            type="file" 
                            name="photo"
                            onChange={(e) => handleChangeFile(e.target.files[0])}
                            ref={register()}
                          />
                          {(fileUploading) && "Uploading..."}
                          {userInfo.photo && (
                            <div>
                            <img src={process.env.REACT_APP_UPLOAD_URL + userInfo.photo} 
                            alt="..."
                            className="avatar-img"
                            width="20%"
                            height="20%" 
                            />
                            </div>
                          )
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={"row " + (currentFormView === formView.info ? "show" : "hide")}>
                    <div className="col-12">
                      <div className="form-group mt-4">
                      {(!fileUploading) &&
                        <button
                          className="btn btn-primary"
                          disabled={formSubmitted}
                          type="submit"
                        >
                          {(formSubmitted && "Saving...") || "Save"}
                        </button>
                      }
                      </div>
                    </div>
                  </div>
                  </form>
                  <div className={"row " + (currentFormView === formView.hospitals ? "show" : "hide")}>
                    <div className="col-12">
                      <div className="form-row">
                        <UserEditHospitaliew userId={userId} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>            
          </div>
        </div>
      </div>
    </main>
  );
};

export default UserEditView;
