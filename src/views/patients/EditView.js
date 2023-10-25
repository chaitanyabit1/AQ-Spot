import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "react-bootstrap/Modal";
import LoaderComponent from "../../components/LoaderComponent";
import { DATE_TIME_FORMAT, COMMON_MESSAGES } from "../../config/AppConfig";
import DatePickerComponent from "../../components/DatePickerComponent";
import moment from "moment";
import { viewRow, update } from "../../services/PatientService";
import { countryList, stateList, cityList } from "../../services/CommonService";
import { NotificationManager } from "react-notifications";

const EditView = (props) => {
  const { handleHideEditView, handleHideEditViewReload, patientId } = props;

  // Set module variables
  const pageTitle = "Update Patient Profile";

  // Set state
  const [patientInfo, setPatientInfo] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [countriesList, setCountriesList] = useState([]);
  const [statesList, setStatesList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const { register, handleSubmit, errors, control } = useForm();

  useEffect(() => {
    countryList().then((res) => {
      setCountriesList(res.data);
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });

    viewRow(patientId).then((res) => {
      setPatientInfo(res.data);
      getStateList(res.data.country_id);
      getCityList(res.data.state_id);
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });

  }, [patientId]);

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
      address: data.address,
      city: data.city,
      state: data.state,
      country: data.country,
      pincode: data.pincode,
      emergancy_phone: data.emergencyPhone
    };
    update(saveData, patientId).then((res) => {
      handleHideEditViewReload();
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });    
  };

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
    getStateList(e.target.value);
    getCityList(0);
  };

  const handleChangeState = (e) => {
    getCityList(e.target.value);
  };

  if (patientInfo === null) {
    return <LoaderComponent />;
  }
  return (
    <Modal
      size="lg"
      aria-labelledby="example-modal-sizes-title-lg"
      show={true}
      onHide={handleHideEditView}
      className="fade show"
    >
      <Modal.Header closeButton>
        <Modal.Title>{pageTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form className="col-12 mx-auto" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-row">
            <div className="form-group col-md-4">
              <label>
                First Name<i className="text-danger">*</i>
              </label>
              <input
                type="text"
                className={"form-control " + (errors.firstName && "is-invalid")}
                name="firstName"
                defaultValue={patientInfo.first_name}
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
              <input type="text" className="form-control" name="middleName" defaultValue={patientInfo.middle_name} ref={register} />
            </div>
            <div className="form-group col-md-4">
              <label>
                Last Name<i className="text-danger">*</i>
              </label>
              <input
                type="text"
                className={"form-control " + (errors.lastName && "is-invalid")}
                name="lastName"
                defaultValue={patientInfo.last_name}
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
                defaultValue={patientInfo.address}
                ref={register}
              ></textarea>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-6">
              <label>City</label>
              <select
                className={
                  "form-control"
                }
                name="country"
                ref={register}
                onChange={handleChangeCountry}
                defaultValue={patientInfo.country_id}
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
                defaultValue={patientInfo.state_id}
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
                defaultValue={patientInfo.city_id}
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
              <input type="text" className="form-control" name="pincode" defaultValue={patientInfo.pincode} ref={register} />
            </div>
          </div>
          <div className="form-row mt-4">
            <div className="form-group col-md-2">
              <label>Birthdate</label>
              <DatePickerComponent 
                fieldName="birth_date" 
                defaultValue={patientInfo.birth_date} 
                errors={errors} 
                control={control} 
                require={false}
                showTime={false}
              />
            </div>
            <div className="form-group col-md-4">
              <label>Email</label>
              <input type="text" className="form-control" name="email" defaultValue={patientInfo.email} ref={register} />
            </div>
            <div className="form-group col-md-3">
              <label>Phone</label>
              <input type="text" className="form-control" name="phone" defaultValue={patientInfo.phone} ref={register} />
            </div>
            <div className="form-group col-md-3">
              <label>Emergency Phone</label>
              <input type="text" className="form-control" name="emergencyPhone" defaultValue={patientInfo.emergancy_phone} ref={register} />
            </div>
          </div>
          <div className="form-row mt-4">
            <div className="form-group col-md-12">
              <button
                className="btn btn-primary"
                disabled={formSubmitted}
                type="submit"
              >
                {(formSubmitted && "Updating...") || "Update Profile"}
              </button>
            </div>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default EditView;
