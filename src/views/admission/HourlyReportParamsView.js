import React, { useEffect, useState } from "react";
import LoaderComponent from "../../components/LoaderComponent";
import  { listAll } from "../../services/PatientAdmissionService";
import { listAllParams as paramsTypeList } from "../../services/MasterPagesService";
import { NotificationManager } from "react-notifications";
import { COMMON_MESSAGES } from "../../config/AppConfig";

const HourlyReportParamsView = (props) => {
  const { selectedType, selectedDate, patientId, admissionId, discharged, register, fields, setFieldsChange } = props;
  const timeData = [
    "08 AM - 09 AM",
    "09 AM - 10 AM",
    "10 AM - 11 AM",
    "11 AM - 12 PM",
    "12 PM - 01 PM",
    "01 PM - 02 PM",
    "02 PM - 03 PM",
    "03 PM - 04 PM",
    "04 PM - 05 PM",
    "05 PM - 06 PM",
    "06 PM - 07 PM",
    "07 PM - 08 PM",
    "08 PM - 09 PM",
    "09 PM - 10 PM",
    "10 PM - 11 PM",
    "11 PM - 12 AM",
    "12 AM - 01 AM",
    "01 AM - 02 AM",
    "02 AM - 03 AM",
    "03 AM - 04 AM",
    "04 AM - 05 AM",
    "05 AM - 06 AM",
    "06 AM - 07 AM",
    "07 AM - 08 AM",
  ];

  // Set state
  const [listData, setListData] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);
  const [subTypeList, setSubTypeList] = useState([]);

  // Fetch data
  useEffect(() => { 
    const query = (selectedType && selectedDate) ? `&type=${selectedType}&date=${selectedDate}` : "";
    listAll(patientId, admissionId, `hourlyreport`, query).then((res) => {
      const data = res.data;
      const values = [];
      let listData = {};
      data.forEach((item) => {
        listData[item.param_id + "_" + item.on_time] = item.value;
        values[item.param_id + "_" + item.on_time] = item.value;
      });
      setListData(listData);
      setFieldsChange(values);
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });

    paramsTypeList("hourly_investigation_params", selectedType).then((res) => {
      setSubTypeList(res.data);
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });
    setDataLoaded(true);
  }, [admissionId, selectedDate, selectedType, patientId]);

  const handleChangeInput = (i, e) => {
    const values = fields;
    values[i] = e.target.value;
    setFieldsChange(values);
  }

  if (!dataLoaded) {
    return <LoaderComponent />;
  }
  return (
    <table className="table table-borderless hourly_report">
      <thead>
        <tr>
          <th className="space_hidden">&nbsp;</th>
          {subTypeList.map((val, index) => (
            <th className="text-center" key={index}>{val.name}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {timeData.map((val, index) => (
          <tr key={index}>
            <td className="col-wd-15">{val}</td>
            {subTypeList.map((obj, i) => (
              <td className="text-center" key={i}>
                {!discharged && (
                  <input 
                    type="text"
                    className="form-control form-control-cus"
                    name={obj.id + "_" + index}
                    ref={register}
                    defaultValue={((obj.id + "_" + index) in listData) ? listData[obj.id + "_" + index] : ""}
                    onChange={e => handleChangeInput(obj.id + "_" + index, e)}
                  />
                )}
                {discharged && ((obj.id + "_" + index) in listData) && listData[obj.id + "_" + index]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default HourlyReportParamsView;
