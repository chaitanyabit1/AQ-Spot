import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { RoutePaths, getRoutePatientAdmission } from "../../config/RoutePathConfig";
import PageTitleComponent from "../../components/PageTitleComponent";
import { DATE_TIME_FORMAT, COMMON_MESSAGES } from "../../config/AppConfig";
import DatePickerComponent from "../../components/DatePickerComponent";
import moment from "moment";
import { listAll as hospitalListAll } from "../../services/HospitalsService";
import { listAllByHospital as icuListAll } from "../../services/ICUService";
import { create } from "../../services/PatientService";
import { countryList, stateList, cityList } from "../../services/CommonService";
import { NotificationManager } from "react-notifications";

const PatientCreateView = (props) => {
  // Set module variables
  const pageTitle = "Patients";
  const backButtonText = "Back";
  const formView = {
    profile: "Profile",
    admission: "Admission"
  };

  // Set state
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [currentFormView, setCurrentFormView] = useState(formView.profile);
  const [hospital, setHospital] = useState(0);
  const [hospitalList, setHospitalList] = useState([]);
  const [icuWardsList, setIcuWardsList] = useState([]);
  const [countriesList, setCountriesList] = useState([]);
  const [statesList, setStatesList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [country, setCountry] = useState(0);
  const [state, setState] = useState(0);
  const { register, handleSubmit, errors, control } = useForm();
  let history = useHistory();

  const handleViewChange = (view) => {
    if (currentFormView !== view) {
      setCurrentFormView(view);
    }
  };

  const handleChangeHospital = (e) => {
    setHospital(e.target.value || 0);
  };

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

    icuListAll(hospital).then((res) => {
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
  }, [hospital, country, state]);

  // Form submit
  const onSubmit = (data) => {
    setFormSubmitted(true);
    const saveData = {
      first_name: data.firstName,
      middle_name: data.middleName,
      last_name: data.lastName,
      phone: data.phone,
      email: data.email,
      birth_date: moment(data.birth_date).format(DATE_TIME_FORMAT.DDMMYYYY),
      is_critical: (data.admission_isCritical) ? 1 : 0,
      address: data.address,
      city: data.city,
      state: data.state,
      country: data.country,
      pincode: data.pincode,
      emergancy_phone: data.emergencyPhone,
      hospital: data.admission_hospital,
      icu_ward: data.admission_icuWardId,
      bed_number: data.admission_bedNumber,
      admission_date: moment(data.admission_inDate).format(DATE_TIME_FORMAT.DDMMYYYYHHmm)
    };
    create(saveData).then((res) => {
      const data = res.data;
      if(data.current_admission_id) {
        history.push(getRoutePatientAdmission(data.id, data.current_admission_id, "profile"));
      } else {
        history.push((RoutePaths.PATIENTS_VIEW).replace(":id", data.id));
      }
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });
  };

  const handleChangeCountry = (e) => {
    setCountry(e.target.value || 0);
    setState(0);
  };

  const handleChangeState = (e) => {
    setState(e.target.value || 0);
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
                <Link to={RoutePaths.PATIENTS}>
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
                    <li className="nav-item" onClick={() => handleViewChange(formView.profile)}>
                      <span className={"nav-link " + (currentFormView === formView.profile ? "active" : "")}>Profile</span>
                    </li>
                    <li className={"nav-item"} onClick={() => handleViewChange(formView.admission)}>
                      <span className={"nav-link " + (currentFormView === formView.admission ? "active" : "") + ((errors.admission_hospital || errors.admission_icuWardId || errors.admission_bedNumber) && "form-control is-invalid")}>Admission</span>
                    </li>
                  </ul>
                  <div className={"row " + (currentFormView === formView.profile ? "show" : "hide")}>
                    <div className="col-12">
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
                          <label>Middle Name</label>
                          <input type="text" className="form-control" name="middleName" ref={register} />
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
                      <div className="form-row mt-4">
                        <div className="form-group col-md-12">
                          <label>Address</label>
                          <textarea
                            className="form-control"
                            rows="3"
                            name="address"
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
                            name="country"
                            ref={register}
                            onChange={handleChangeCountry}
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
                            name="state"
                            ref={register}
                            onChange={handleChangeState}
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
                            name="city"
                            ref={register}
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
                          <input type="text" className="form-control" name="pincode" ref={register} />
                        </div>
                      </div>
                      <div className="form-row mt-4">
                        <div className="form-group col-md-2">
                          <label>Birthdate</label>
                          <DatePickerComponent 
                            fieldName="birth_date" 
                            defaultValue={new Date()} 
                            errors={errors} 
                            control={control} 
                            require={false}
                            showTime={false}
                          />
                        </div>
                        <div className="form-group col-md-4">
                          <label>Email</label>
                          <input type="text" className="form-control" name="email" ref={register} />
                        </div>
                        <div className="form-group col-md-3">
                          <label>Phone</label>
                          <input type="text" className="form-control" name="phone" ref={register} />
                        </div>
                        <div className="form-group col-md-3">
                          <label>Emergency Phone</label>
                          <input type="text" className="form-control" name="emergencyPhone" ref={register} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={"row " + (currentFormView === formView.admission ? "show" : "hide")}>
                    <div className="col-12">
                      <div className="form-row">
                        <div className="form-group col-md-6">
                          <label>
                            Hospital<i className="text-danger">*</i>
                          </label>
                          <select
                            className={"form-control " + (errors.admission_hospital && "is-invalid")}
                            name="admission_hospital"
                            onChange={handleChangeHospital}
                            ref={register({
                              required: true,
                              validate: (value) => {
                                return !!value.trim();
                              },
                            })}
                          >
                            <option value="">Select</option>
                            {hospitalList.map((obj, index) => {
                              return (
                                <option value={obj.id} key={"h-" + obj.id}>
                                  {obj.name}
                                </option>
                              );
                            })}
                            ;
                          </select>
                        </div>
                        <div className="form-group col-md-6">
                          <label>
                            ICU Ward<i className="text-danger">*</i>
                          </label>
                          <select
                            className={"form-control " + (errors.admission_icuWardId && "is-invalid")}
                            name="admission_icuWardId"
                            ref={register({
                              required: true,
                              validate: (value) => {
                                return !!value.trim();
                              },
                            })}
                          >
                            <option value="">Select</option>
                            {icuWardsList.map((obj, index) => {
                              return (
                                <option value={obj.id} key={"i-" + obj.id}>
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
                          <label>
                            Admission Date<i className="text-danger">*</i>
                          </label>
                          <DatePickerComponent 
                            fieldName="admission_inDate" 
                            defaultValue={new Date()} 
                            errors={errors} 
                            control={control} 
                            require={true}
                            showTime={true}
                          />
                          
                        </div>
                        <div className="form-group col-md-6">
                          <label>
                            Bed Number<i className="text-danger">*</i>
                          </label>
                          <input
                            type="text"
                            className={"form-control " + (errors.admission_bedNumber && "is-invalid")}
                            name="admission_bedNumber"
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
                        <div className="form-group col-md-6">
                          <input
                            type="checkbox"
                            name="admission_isCritical"
                            ref={register}
                          /> Check if patient is in <span className="text-danger">critical stage</span>
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

export default PatientCreateView;
