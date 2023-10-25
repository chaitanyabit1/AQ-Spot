import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { RoutePaths } from "../../config/RoutePathConfig";
import PageTitleComponent from "../../components/PageTitleComponent";
import { DATE_TIME_FORMAT, COMMON_MESSAGES } from "../../config/AppConfig";
import DatePickerComponent from "../../components/DatePickerComponent";
import moment from "moment";
import HospitalEditICUView from "./HospitalEditICUView";
import LoaderComponent from "../../components/LoaderComponent";
import { viewRow, update } from "../../services/HospitalsService";
import { countryList, stateList, cityList } from "../../services/CommonService";
import { NotificationManager } from "react-notifications";

const HospitalEditView = (props) => {
  const { match } = props;
  const hospitalId = match.params["id"];

  // Set module variables
  const pageTitle = "Edit Hospital";
  const backButtonText = "Back";
  const formView = {
    info: "Info",
    subscription: "Subscription",
    icu: "ICU Wards",
  };

  // Set state
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [currentFormView, setCurrentFormView] = useState(formView.info);
  const [hospitalInfo, setHospitalInfo] = useState([]);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [countriesList, setCountriesList] = useState([]);
  const [statesList, setStatesList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const { register, handleSubmit, errors, control } = useForm();
  let history = useHistory();

  const handleVieChange = (view) => {
    if (currentFormView !== view) {
      setCurrentFormView(view);
    }
  };

  useEffect(() => {
    countryList().then((res) => {
      setCountriesList(res.data);
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });

    viewRow(hospitalId).then((res) => {
      const data = res.data;  
      getStateList(data.country_id);
      getCityList(data.state_id);
      setHospitalInfo(data);
      setPageLoaded(true);
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });
  }, [hospitalId]);

  const getStateList = (id) => {
    stateList(id).then((res) => {
      setStatesList(res.data);
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });
  }

  const getCityList = (id) => {
    cityList(id).then((res) => {
      setCitiesList(res.data);
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });
  }

  const handleChangeCountry = (e) => {
    getStateList(e.target.value || 0);
    getCityList(0);
  };

  const handleChangeState = (e) => {
    getCityList(e.target.value || 0);
  };

  const handleChangeCity = (e) => {

  }

  // Form submit
  const onSubmit = (data) => {
    //console.log(data); return;
    setFormSubmitted(true);
    const info = data.info;
    const subscription = data.subscription;
    const saveData = {
      name: info.name,
      subscription_startDate: moment(data.subscription_startDate).format(DATE_TIME_FORMAT.DDMMYYYYHHmm),
      subscription_endDate: moment(data.subscription_endDate).format(DATE_TIME_FORMAT.DDMMYYYYHHmm),
      address: info.address,
      city: 1,
      state: 1,
      country: 1,
      pincode: info.pincode,
      email: info.email,    
      contactPerson: info.contactPerson,
      contactPhone: info.contactPhone,
      amount: subscription.amount,
      paymentMethod: 1,
      notes: subscription.notes,
    };
    update(saveData, hospitalId).then((res) => {
      history.push(RoutePaths.HOSPITALS);
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });
  };

  if (!pageLoaded) {
    return (<LoaderComponent />);
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
                <Link to={RoutePaths.HOSPITALS}>
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
                    <li className="nav-item" onClick={() => handleVieChange(formView.subscription)}>
                      <span className={"nav-link " + (currentFormView === formView.subscription ? "active" : "")}>Subscription</span>
                    </li>
                    <li className="nav-item" onClick={() => handleVieChange(formView.icu)}>
                      <span className={"nav-link " + (currentFormView === formView.icu ? "active" : "")}>ICU Wards</span>
                    </li>
                  </ul>
                  <form onSubmit={handleSubmit(onSubmit)}>
                  <div className={"row " + (currentFormView === formView.info ? "show" : "hide")}>
                    <div className="col-12">
                      <div className="form-row">
                        <div className="form-group col-md-12">
                          <label>
                            Name<i className="text-danger">*</i>
                          </label>
                          <input
                            type="text"
                            className={"form-control " + (errors.info && errors.info.name && "is-invalid")}
                            name="info[name]"
                            ref={register({
                              required: true,
                              validate: (value) => {
                                return !!value.trim();
                              },
                            })}
                            defaultValue={(hospitalInfo.name) ? hospitalInfo.name : ""}
                          />
                        </div>
                      </div>
                      <div className="form-row mt-4">
                        <div className="form-group col-md-12">
                          <label>Address</label>
                          <textarea
                            className="form-control"
                            rows="3"
                            name="info[address]"
                            ref={register}
                            defaultValue={(hospitalInfo.address) ? hospitalInfo.address : ""}
                          ></textarea>
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group col-md-6">
                        <label>Country</label>
                          <select
                            className={
                              "form-control"
                            }
                            name="info[country]"
                            ref={register}
                            onChange={handleChangeCountry}
                            defaultValue={hospitalInfo.country_id}
                          >
                            <option value="">Select</option>
                            {countriesList.map((obj, index) => {
                              return (
                                <option value={obj.id} key={"c-" + obj.id}>
                                  {obj.name}
                                </option>
                              );
                            })}
                            ;
                          </select>  
                        </div>
                        <div className="form-group col-md-6">
                        <label>State</label>
                          <select
                            className={
                              "form-control"
                            }
                            name="info[state]"
                            ref={register}
                            onChange={handleChangeState}
                            defaultValue={hospitalInfo.state_id}
                          >
                            <option value="">Select</option>
                            {statesList.map((obj, index) => {
                              return (
                                <option value={obj.id} key={"s-" + obj.id}>
                                  {obj.name}
                                </option>
                              );
                            })}
                            ;
                          </select>
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group col-md-6">
                        <label>City</label>
                          <select
                            className={
                              "form-control"
                            }
                            name="info[city]"
                            ref={register}
                            onChange={handleChangeCity}
                            defaultValue={hospitalInfo.city_id}
                          >
                            <option value="">Select</option>
                            {citiesList.map((obj, index) => {
                              return (
                                <option value={obj.id} key={"ct-" + obj.id}>
                                  {obj.name}
                                </option>
                              );
                            })}
                            ;
                          </select>
                        </div>
                        <div className="form-group col-md-6">
                          <label>Pincode</label>
                          <input type="text" className="form-control" name="info[pincode]" ref={register} 
                            defaultValue={(hospitalInfo.pincode) ? hospitalInfo.pincode : ""}
                          />
                        </div>
                      </div>
                      <div className="form-row mt-4">
                        <div className="form-group col-md-4">
                          <label>Email</label>
                          <input type="text" className="form-control" name="info[email]" ref={register} 
                            defaultValue={(hospitalInfo.email) ? hospitalInfo.email : ""}
                          />
                        </div>
                        <div className="form-group col-md-4">
                          <label>Contact Person</label>
                          <input type="text" className="form-control" name="info[contactPerson]" ref={register} 
                            defaultValue={(hospitalInfo.contact_person) ? hospitalInfo.contact_person : ""}
                          />
                        </div>
                        <div className="form-group col-md-4">
                          <label>Contact Person Phone</label>
                          <input type="text" className="form-control" name="info[contactPhone]" ref={register} 
                            defaultValue={(hospitalInfo.contact_number) ? hospitalInfo.contact_number : ""}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={"row " + (currentFormView === formView.subscription ? "show" : "hide")}>
                    <div className="col-12">
                      <div className="form-row">
                        <div className="form-group col-md-6">
                          <label>Start Date</label>
                          <DatePickerComponent 
                            fieldName="subscription_startDate" 
                            defaultValue={(hospitalInfo.subscription && hospitalInfo.subscription.sub_start) ? hospitalInfo.subscription.sub_start : new Date()}
                            errors={errors} 
                            control={control} 
                            require={false}
                            showTime={true}
                          />
                        </div>
                        <div className="form-group col-md-6">
                          <label>End Date</label>
                          <DatePickerComponent 
                            fieldName="subscription_endDate" 
                            defaultValue={(hospitalInfo.subscription && hospitalInfo.subscription.sub_end) ? hospitalInfo.subscription.sub_end : new Date()}
                            errors={errors} 
                            control={control} 
                            require={false}
                            showTime={true}
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group col-md-6">
                          <label>Amount</label>
                          <input type="text" className="form-control" name="subscription[amount]" ref={register} 
                            defaultValue={(hospitalInfo.subscription && hospitalInfo.subscription.amount) ? hospitalInfo.subscription.amount : ""}
                          />
                        </div>
                        <div className="form-group col-md-6">
                          <label>Payment Method</label>
                          <input type="text" className="form-control" name="subscription[paymentMethod]" ref={register} 
                            defaultValue={(hospitalInfo.subscription && hospitalInfo.subscription.paymentMethod) ? hospitalInfo.subscription.paymentMethod : ""}
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group col-md-12">
                          <label>Notes</label>
                          <textarea
                            className="form-control"
                            rows="3"
                            name="subscription[notes]"
                            ref={register}
                            defaultValue={(hospitalInfo.subscription && hospitalInfo.subscription.notes) ? hospitalInfo.subscription.notes : ""}
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <div className="form-group mt-4">
                        {currentFormView !== formView.icu && (
                        <button
                          className="btn btn-primary"
                          disabled={formSubmitted}
                          type="submit"
                        >
                          {(formSubmitted && "Saving...") || "Save"}
                        </button>
                        )}
                      </div>
                    </div>
                  </div>
                  </form>
                  <div className={"row " + (currentFormView === formView.icu ? "show" : "hide")}>
                    <div className="col-12">
                      <div className="form-row">
                        <HospitalEditICUView hospitalId={hospitalId} />
                      </div>
                      {/* <div className="form-row">
                        <div className="form-group col-md-6">
                          <label>Users</label>
                          <select
                            className={
                              "form-control " + (errors.icu && errors.icu.users && "is-invalid")
                            }
                            name="icu[users]"
                            multiple
                            size="10"
                            ref={register}
                          >
                            <option value="1">User 1</option>
                            <option value="2">User 2</option>
                            <option value="3">User 3</option>
                            <option value="4">User 4</option>
                            <option value="5">User 5</option>
                            <option value="6">User 6</option>
                            <option value="7">User 7</option>
                            <option value="8">User 8</option>
                            <option value="9">User 9</option>
                            <option value="10">User 10</option>
                          </select>
                        </div>
                        <div className="form-group col-md-6"></div>
                      </div> */}
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

export default HospitalEditView;
