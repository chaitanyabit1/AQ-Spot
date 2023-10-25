import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "react-bootstrap/Modal";
import { DATE_TIME_FORMAT, COMMON_MESSAGES } from "../../config/AppConfig";
import LoaderComponent from "../../components/LoaderComponent";
import DatePickerComponent from "../../components/DatePickerComponent";
import moment from "moment";
import { viewRow, dicharge } from "../../services/PatientService";
import { NotificationManager } from "react-notifications";

const DischargeView = (props) => {
  const { handleHideDischargeView, handleHideDischargeViewReload, rowId } = props;

  // Set module variables
  const pageTitle = "Patient Discharge";

  // Set state
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [patientInfo, setPatientInfo] = useState(null);
  const { register, handleSubmit, errors, control } = useForm();

  useEffect(() => {
    viewRow(rowId).then((res) => {
      const data = res.data;
      if(data.current_admission_id) {
        const patientDetails = {
          firstName: data.first_name,
          lastName: data.last_name,
          hospitalId: data.current_admission_data.hospital_id,
          icuWardId: data.current_admission_data.icu_ward_id,
          hospital: data.current_admission_data.hospital,
          icuWard: data.current_admission_data.icu_ward,
          inDate: data.current_admission_data.check_in,
          bedNumber: data.current_admission_data.bed_number,
          currentAdmissionId: data.current_admission_id
        }
        setPatientInfo(patientDetails);
      } else {
        NotificationManager.error(COMMON_MESSAGES.DONT_ACCESS, 'Error', 5000);
      }
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });
  }, [rowId]);

  // Form submit
  const onSubmit = (data) => {
    setFormSubmitted(true);

    const saveData = {
      discharge_date: moment(data.outDate).format(DATE_TIME_FORMAT.DDMMYYYYHHmm),
      notes: data.notes
    };
    dicharge(rowId, saveData).then((res) => {
      handleHideDischargeViewReload();
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
      onHide={handleHideDischargeView}
      className="fade show"
    >
      <Modal.Header closeButton>
        <Modal.Title>{pageTitle} - {patientInfo.firstName} {patientInfo.lastName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form className="col-12 mx-auto" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            Hospital: {patientInfo.hospital}
          </div>
          <div className="form-group">
            ICU Ward: {patientInfo.icuWard}
          </div>
          <div className="form-group">
            Admit Date: {patientInfo.inDate}
          </div>
          <div className="form-group">
            Bed Number: {patientInfo.bedNumber}
          </div>
          <div className="form-group mt-4">
            <label>Discharge Date<i className="text-danger">*</i></label>
            <DatePickerComponent 
              fieldName="outDate" 
              defaultValue={new Date()} 
              errors={errors} 
              control={control} 
              require={true}
              showTime={true}
              minDate={Date.parse(moment(patientInfo.inDate, DATE_TIME_FORMAT.DDMMYYYYHHmm))}
              maxDate={Date.parse(moment())}
            />
          </div>
          <div className="form-group">
            <label>Notes<i className="text-danger">*</i></label>
            <textarea
              className={"form-control " + (errors.notes && "is-invalid")}
              rows="4"
              name="notes"
              ref={register({
                required: true,
                validate: (value) => {
                  return !!value.trim();
                },
              })}
            ></textarea>
          </div>
          <div className="form-group mt-4">
            <button
              className="btn btn-primary"
              disabled={formSubmitted}
              type="submit"
            >
              {(formSubmitted && "Processing...") || "Process Discharge"}
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default DischargeView;
