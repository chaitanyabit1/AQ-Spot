import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { DATE_TIME_FORMAT, COMMON_MESSAGES } from "../../config/AppConfig";
import LoaderComponent from "../../components/LoaderComponent";
import  { hourlyReportDayList, create } from "../../services/PatientAdmissionService";
import moment from "moment";
import { viewAdmissionById } from "../../services/PatientService";
import { listAll as masterList } from "../../services/MasterPagesService";
import HourlyReportParamsView from "./HourlyReportParamsView";
import { NotificationManager } from "react-notifications";

const HourlyReportView = (props) => {
  const { patientId, admissionId, discharged } = props;
  
  // Set state
  const [dataLoaded, setDataLoaded] = useState(false);
  const [selectedDate, setSelectedDate] = useState(moment().format(DATE_TIME_FORMAT.DDMMYYYY));
  const [selectedType, setSelectedType] = useState(3);
  const [typeList, setTypeList] = useState([]);
  const [reloadList, setReloadList] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const [dayList, setDayList] = useState([]);
  const [fields, setFields] = useState({});

  async function getDayList (inDate, outDate) {
    setDayList(await hourlyReportDayList(inDate, outDate));
  }
 
  // Fetch data
  useEffect(() => {
    let inDate = moment().format(DATE_TIME_FORMAT.DDMMYYYY);
    let outDate = moment().format(DATE_TIME_FORMAT.DDMMYYYY);

    viewAdmissionById(patientId, admissionId).then((res) => {
      const data = res.data;
      inDate = (data.check_in) ? data.check_in: inDate;
      outDate = (data.check_out) ? data.check_out : outDate;
      getDayList(inDate, outDate);
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });

    masterList("hourly_investigation_types").then((res) => {
      setTypeList(res.data);
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });
    setDataLoaded(true);
  }, [reloadList, admissionId, selectedDate, patientId]);

  // Handle events
  const handleChangeType = (e) => {
    reset();
    setFields([]);
    setSelectedType(e.target.value);
    setReloadList(!reloadList);
  };
  const handleChangeDate = (e) => {
    reset();
    setFields([]);
    setSelectedDate(e.target.value);
    setReloadList(!reloadList);
  };

  // Form submit
  const onSubmit = (data) => {
    setFormSubmitted(true);

    {Object.keys(fields).map(function(keyName) {
      setTimeout(() => {
      }, 1000);
      const keyData = keyName.split("_");            
      if (fields[keyName] !== "") {
        const saveData = {
          patient_id: patientId,
          patient_admission_id: admissionId,
          value: fields[keyName],
          param_id: keyData[0],
          type_id: selectedType,
          for_date: selectedDate,
          on_time: keyData[1]
        };
        create(patientId, admissionId, `hourlyreport`, saveData).then((res) => {          
        }).catch((err) => {
          NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
        });
      }
    })}
    setFormSubmitted(false);
    setReloadList(!reloadList);
  };

  if (!dataLoaded) {
    return <LoaderComponent />;
  }
  return (
    <div className="row">
      <div className="col-12">
        <div className="row align-items-center mb-3 hourly_reports">
          <div className="col"></div>
          <div className="col-auto">
            <select className="form-control" onChange={handleChangeType} defaultValue={selectedType}>
              {/* <option value="0">Select</option> */}
              {typeList.map((obj, index) => {
                return (
                  <option value={obj.id} key={obj.id}>
                    {obj.name}
                  </option>
                );
              })}
              ;
            </select>
          </div>
          <div className="col-auto">
            <select className="form-control" onChange={handleChangeDate} defaultValue={setSelectedDate}>
              {dayList.map((obj, index) => {
                return (
                  <option value={obj.key} key={index}>
                    {obj.value}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <HourlyReportParamsView setFieldsChange={(fields) => {setFields(fields);}} fields={fields} selectedType={selectedType} selectedDate={selectedDate} patientId={patientId} admissionId={admissionId} discharged={discharged} register={register} />
          {!discharged && (
            <div className="form-group mt-4">
              <button
                className="btn btn-primary"
                disabled={formSubmitted}
                type="submit"
              >
                {(formSubmitted && "Saving...") || "Save"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default HourlyReportView;
