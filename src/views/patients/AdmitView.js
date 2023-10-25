import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "react-bootstrap/Modal";
import { DATE_TIME_FORMAT, COMMON_MESSAGES } from "../../config/AppConfig";
import LoaderComponent from "../../components/LoaderComponent";
import DatePickerComponent from "../../components/DatePickerComponent";
import moment from "moment";
import { viewRow, admit } from "../../services/PatientService";
import { listAll as hospitalListAll } from "../../services/HospitalsService";
import { listAllByHospital as icuListAll } from "../../services/ICUService";
import { NotificationManager } from "react-notifications";

const AdmitView = (props) => {
  const { handleHideAdmitView, handleHideAdmitViewReload, rowId } = props;

  // Set module variables
  const pageTitle = "Patient Admission";

  // Set state
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [hospital, setHospital] = useState(0);
  const [hospitalList, setHospitalList] = useState([]);
  const [icuWardsList, setIcuWardsList] = useState([]);
  const [patientInfo, setPatientInfo] = useState(null);
  const { register, handleSubmit, errors, control } = useForm();

  const handleChangeHospital = (e) => {
    setHospital(e.target.value || 0);
  };

  useEffect(() => {
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

    viewRow(rowId).then((res) => {
      setPatientInfo(res.data);
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });
  }, [hospital, rowId]);

  // Form submit
  const onSubmit = (data) => {
    setFormSubmitted(true);

    const saveData = {
      hospital: data.hospitalId,
      icu_ward: data.icuWardId,
      bed_number: data.bedNumber,
      admission_date: moment(data.inDate).format(DATE_TIME_FORMAT.DDMMYYYYHHmm),
      is_critical: (data.isCritical) ? 1 : 0,
    };
    admit(rowId, saveData).then((res) => {
      handleHideAdmitViewReload();
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });
  };

  if (patientInfo === null) {
    return <LoaderComponent />;
  }
  return (
    <Modal
      size="lg"
      aria-labelledby="example-modal-sizes-title-lg"
      show={true}
      onHide={handleHideAdmitView}
      className="fade show"
    >
      <Modal.Header closeButton>
        <Modal.Title>{pageTitle} - {patientInfo.first_name} {patientInfo.last_name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form className="col-12 mx-auto" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>
              Hospital<i className="text-danger">*</i>
            </label>
            <select
              className={
                "form-control " + (errors.hospitalId && "is-invalid")
              }
              name="hospitalId"
              ref={register({
                required: true,
                validate: (value) => {
                  return !!value.trim();
                },
              })}
              onChange={handleChangeHospital}
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
          <div className="form-group">
            <label>
              ICU Ward<i className="text-danger">*</i>
            </label>
            <select
              className={
                "form-control " + (errors.icuWardId && "is-invalid")
              }
              name="icuWardId"
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
          <div className="form-group">
            <label>Admission Date<i className="text-danger">*</i></label>
            <DatePickerComponent 
              fieldName="inDate" 
              defaultValue={new Date()} 
              errors={errors} 
              control={control} 
              require={true}
              showTime={true}
            />
          </div>
          <div className="form-group">
            <label>Bed Number<i className="text-danger">*</i></label>
            <input
              type="text"
              className={"form-control " + (errors.bedNumber && "is-invalid")}
              name="bedNumber"
              ref={register({
                required: true,
                validate: (value) => {
                  return !!value.trim();
                },
              })}
            />
          </div>
          <div className="form-group">
            <input
              type="checkbox"
              name="isCritical"
              ref={register}
            /> Check if patient is in <span className="text-danger">critical stage</span>
          </div>
          <div className="form-group mt-4">
            <button
              className="btn btn-primary"
              disabled={formSubmitted}
              type="submit"
            >
              {(formSubmitted && "Processing...") || "Admin Patient"}
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default AdmitView;
