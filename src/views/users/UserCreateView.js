import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { RoutePaths } from "../../config/RoutePathConfig";
import PageTitleComponent from "../../components/PageTitleComponent";
import { create, uploadFile } from "../../services/UsersService";
import { listAll as accessPolicyListAll} from "../../services/AccessPolicyService";
import { listAll as userTypeListAll} from "../../services/UserTypeService";
import { NotificationManager } from "react-notifications";
import { COMMON_MESSAGES } from "../../config/AppConfig";

const UserCreateView = (props) => {
  // Set module variables
  const pageTitle = "Add New User";
  const backButtonText = "Back";

  // Set state
  const [userTypeList, setUserTypeList] = useState([]);
  const [accessPolicyList, setAccessPolicyList] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const { register, handleSubmit, errors } = useForm();
  const [selectedFile, setSelectedFile] = useState(null);
  let history = useHistory();

  useEffect(() => {
    userTypeListAll().then((res) => {
      setUserTypeList(res.data);
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });

    accessPolicyListAll().then((res) => {
      setAccessPolicyList(res.data);
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });
  }, []);

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
    create(saveData).then((res) => {
      history.push(RoutePaths.USERS);
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });
  };

  const handleChangeFile = (file) => {
    const data = new FormData() 
    data.append('photo', file);
    uploadFile(data).then((res) => {
      if(res.error) {
        setSelectedFile('');
      } else {
        setSelectedFile(res.data.filename);
      }
    }).catch((err) => {
      setSelectedFile('');
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
            <form id="userform" onSubmit={handleSubmit(onSubmit)}>
              <div className="card shadow">
                <div className="card-body">
                  <div className="row">
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
                          />
                        </div>
                        <div className="form-group col-md-4">
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
                          />
                        </div>
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
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <div className="form-group mt-4">
                        <button
                          className="btn btn-primary"
                          disabled={formSubmitted}
                          type="submit"
                        >
                          {(formSubmitted && "Saving...") || "Save"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default UserCreateView;
