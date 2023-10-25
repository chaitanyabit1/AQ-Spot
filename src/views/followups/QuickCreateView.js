import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { getByHospital } from "../../services/PatientService";
import { listAll as hospitalListAll } from "../../services/HospitalsService";
//import { listAllByHospital as icuListAll } from "../../services/ICUService";
import { listAll as masterList } from "../../services/MasterPagesService";
import { create } from "../../services/FollowupService";
import { NotificationManager } from "react-notifications";
import { COMMON_MESSAGES } from "../../config/AppConfig";

const QuickCreateView = (props) => {
  const { handleReloadDashboard } = props;

  // Set module variables
  const pageTitle = "Create New Followup";

  // Set state
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [hospital, setHospital] = useState(0);
  //const [icuWard, setIcuWard] = useState(0);
  const [hospitalList, setHospitalList] = useState([]);
  //const [icuWardsList, setIcuWardsList] = useState([]);
  const [patientList, setPatientList] = useState([]);
  const [followupTypeList, setFollowupTypeList] = useState([]);
  const { register, handleSubmit, errors, reset } = useForm();
  const [followupType, setFolloupType] = useState(4);

  const handleChangeHospital = (e) => {
    setHospital(e.target.value || 0);
  };
  // const handleChangeWard = (e) => {
  //   setIcuWard(e.target.value || 0);
  // };

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

    // icuListAll(hospital).then((res) => {
    //   const data = res.data;
    //   const listData = [];
    //   data.forEach((item) => {
    //     listData.push({
    //       id: item.id,
    //       name: item.name,
    //     });
    //   });
    //   setIcuWardsList(listData);
    // }).catch((err) => {
    //   NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    // });

    masterList("followup_types").then((res) => {
      setFollowupTypeList(res.data);
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });

    if(hospital) {
      getByHospital(hospital).then((res) => {
        setPatientList(res.data);
      }).catch((err) => {
        NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
      });
    }
  }, [hospital]);

  const handleChangeFolloupType = (e) => {
    setFolloupType(e.target.value);
  };

  // Form submit
  const onSubmit = (data) => {
    setFormSubmitted(true);

    const saveData = {
      patient: data.patientId,
      type: data.followupTypeId,
      instructions: data.instructions
    };
    create(saveData).then((res) => {
      setFormSubmitted(false);
      reset();
      handleReloadDashboard();
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });
  };

  return (
    <div className="card shadow">
      <div className="card-header">
        <strong className="card-title">{pageTitle}</strong>
      </div>
      <div className="card-body dashboard-quick-cards-1">
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
          {/* <div className="form-group">
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
              onChange={handleChangeWard}
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
          </div> */}
          <div className="form-group">
            <label>
              Patient<i className="text-danger">*</i>
            </label>
            <select
              className={
                "form-control " + (errors.patientId && "is-invalid")
              }
              name="patientId"
              ref={register({
                required: true,
                validate: (value) => {
                  return !!value.trim();
                },
              })}
            >
              <option value="">Select</option>
              {patientList.map((obj, index) => {
                return (
                  <option value={obj.id} key={"p-" + obj.id}>
                    {obj.name}
                  </option>
                );
              })}
              ;
            </select>
          </div>
          <div className="form-group">
            <label>
              Followup Type<i className="text-danger">*</i>
            </label>
            <select
              className={
                "form-control " + (errors.followupTypeId && "is-invalid")
              }
              name="followupTypeId"
              ref={register({
                required: true,
                validate: (value) => {
                  return !!value.trim();
                },
              })}
              onChange={handleChangeFolloupType}
              value={followupType}
            >
              <option value="">Select</option>
              {followupTypeList.map((obj, index) => {
                return (
                  <option value={obj.id} key={"ft-" + obj.id}>
                    {obj.name}
                  </option>
                );
              })}
              ;
            </select>
          </div>
          <div className="form-group">
            <label>
              Instructions<i className="text-danger">*</i>
            </label>
            <textarea
              className={"form-control " + (errors.instructions && "is-invalid")}
              rows="4"
              name="instructions"
              ref={register({
                required: true,
                validate: (value) => {
                  return !!value.trim();
                },
                minLength: 10,
              })}
            ></textarea>
          </div>
          <div className="form-group mt-4">
            <button
              className="btn btn-primary"
              disabled={formSubmitted}
              type="submit"
            >
              {(formSubmitted && "Saving...") || "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuickCreateView;
