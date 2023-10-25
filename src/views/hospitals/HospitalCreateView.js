import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { RoutePaths } from "../../config/RoutePathConfig";
import PageTitleComponent from "../../components/PageTitleComponent";
import { DATE_TIME_FORMAT } from "../../config/AppConfig";
import DatePickerComponent from "../../components/DatePickerComponent";
import moment from "moment";
import { create } from "../../services/HospitalsService";
import { countryList, stateList, cityList } from "../../services/CommonService";
import { NotificationManager } from "react-notifications";
import { COMMON_MESSAGES } from "../../config/AppConfig";

const HospitalCreateView = (props) => {
  // Set module variables
  const pageTitle = "Add New Hospital";
  const backButtonText = "Back";
  const formView = {
    info: "Info",
    subscription: "Subscription",
  };

  // Set state
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [currentFormView, setCurrentFormView] = useState(formView.info);
  const [countriesList, setCountriesList] = useState([]);
  const [statesList, setStatesList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [country, setCountry] = useState(0);
  const [state, setState] = useState(0);
  const { register, handleSubmit, errors, control } = useForm();
  let history = useHistory();

  useEffect(() => {
    countryList().then((res) => {
      setCountriesList(res.data);
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });

    stateList(country).then((res) => {
      setStatesList(res.data);
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });

    cityList(state).then((res) => {
      setCitiesList(res.data);
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });
  }, [country, state]);

  const handleVieChange = (view) => {
    if (currentFormView !== view) {
      setCurrentFormView(view);
    }
  };

  const handleChangeCountry = (e) => {
    setCountry(e.target.value || 0);
    setState(0);
  };

  const handleChangeState = (e) => {
    setState(e.target.value || 0);
  };

  // Form submit
  const onSubmit = (data) => {
    setFormSubmitted(true);
    const info = data.info;
    const subscription = data.subscription;
    const saveData = {
      name: info.name,
      subscription_startDate: moment(data.subscription_startDate).format(DATE_TIME_FORMAT.DDMMYYYYHHmm),
      subscription_endDate: moment(data.subscription_endDate).format(DATE_TIME_FORMAT.DDMMYYYYHHmm),
      address: info.address,
      city: info.city,
      state: info.state,
      country: info.country,
      pincode: info.pincode,
      email: info.email,    
      contactPerson: info.contactPerson,
      contactPhone: info.contactPhone,
      amount: subscription.amount,
      paymentMethod: 1,
      notes: subscription.notes,
    };
    create(saveData).then((res) => {
      const hospitalId = res.data[0].hospital;
      if(hospitalId) {
        const page = (RoutePaths.HOSPITALS_EDIT).replace(":id", hospitalId);
        history.push(page);
      } else {
        history.push(RoutePaths.HOSPITALS);
      }
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
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
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="card shadow">
                <div className="card-body">
                  <ul className="nav nav-tabs mb-4" role="tablist">
                    <li className="nav-item" onClick={() => handleVieChange(formView.info)}>
                      <span className={"nav-link " + (currentFormView === formView.info ? "active" : "")}>Info</span>
                    </li>
                    <li className="nav-item" onClick={() => handleVieChange(formView.subscription)}>
                      <span className={"nav-link " + (currentFormView === formView.subscription ? "active" : "")}>Subscription</span>
                    </li>
                  </ul>
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
                            defaultValue={1}
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
                            defaultValue={1}
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
                            defaultValue={4}
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
                          <input type="text" className="form-control" name="info[pincode]" ref={register} />
                        </div>
                      </div>
                      <div className="form-row mt-4">
                        <div className="form-group col-md-4">
                          <label>Email</label>
                          <input type="text" className="form-control" name="info[email]" ref={register} />
                        </div>
                        <div className="form-group col-md-4">
                          <label>Contact Person</label>
                          <input type="text" className="form-control" name="info[contactPerson]" ref={register} />
                        </div>
                        <div className="form-group col-md-4">
                          <label>Contact Person Phone</label>
                          <input type="text" className="form-control" name="info[contactPhone]" ref={register} />
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
                            defaultValue={new Date()} 
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
                            defaultValue={new Date()} 
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
                          <input type="text" className="form-control" name="subscription[amount]" ref={register} />
                        </div>
                        <div className="form-group col-md-6">
                          <label>Payment Method</label>
                          <input type="text" className="form-control" name="subscription[paymentMethod]" ref={register} />
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
                          ></textarea>
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

export default HospitalCreateView;
