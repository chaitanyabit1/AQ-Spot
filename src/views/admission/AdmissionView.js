import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import LoaderComponent from "../../components/LoaderComponent";
import AdmissionParamsView from "./AdmissionParamsView";
import { saveAdmission, viewAdmission } from "../../services/PatientAdmissionService";
import { listAll } from "../../services/MasterPagesService";
import { NotificationManager } from "react-notifications";
import { COMMON_MESSAGES } from "../../config/AppConfig";

const AdmissionView = (props) => {
  const { patientId, admissionId, discharged } = props;

  const [listData, setListData] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const { register, handleSubmit, errors } = useForm();
  const [bmiInfo, SetBMIInfo] = useState([]);

  // Fetch data
  useEffect(() => {
    viewAdmission(patientId, admissionId).then((res) => {
      const data = res.data;
      const bmiDetails = {
        height: (data.height) ? data.height : "",
        weight: (data.weight) ? data.weight : "",
        bmi: (data.bmi) ? data.bmi : ""
      }
      SetBMIInfo(bmiDetails);
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });

    listAll("body_profile_types").then((res) => {
      const data = res.data;
      setListData(data);
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });
    setDataLoaded(true);
  }, [patientId, admissionId]); 

  // Form submit
  const onBMISubmit = (data) => {
    setFormSubmitted(true);
    const bmiDetails = {
      height: (data.height) ? data.height : "",
      weight: (data.weight) ? data.weight : "",
      bmi: (data.bmi) ? data.bmi : ""
    }
    saveAdmission(patientId, admissionId, bmiDetails).then((res) => {
      SetBMIInfo(bmiDetails);
      setFormSubmitted(false);
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });
    //reset();    
  };

  if (!dataLoaded) {
    return <LoaderComponent />;
  }
  return (
      <div className="row">
        <div className="col-12">
          {
            !discharged ? (
              <form onSubmit={handleSubmit(onBMISubmit)}>
                <table className="table table-borderless admission_less">
                  <tbody>
                    <tr>
                      <td className="col-wd-5">
                        Height:
                      </td>
                      <td className="col-wd-25">                        
                        <input
                          type="text"
                          className={"form-control form-control-sm " + (errors.height && "is-invalid")}
                          name="height"
                          ref={register()}
                          defaultValue={bmiInfo.height}
                        />
                      </td>
                      <td className="col-wd-5">
                        Weight:
                      </td>
                      <td className="col-wd-25">
                        <input
                          type="text"
                          className={"form-control form-control-sm " + (errors.weight && "is-invalid")}
                          name="weight"
                          ref={register()}
                          defaultValue={bmiInfo.weight}
                        />
                      </td>
                      <td className="col-wd-5">
                        BMI:
                      </td>
                      <td className="col-wd-20">
                        <input
                          type="text"
                          className={"form-control form-control-sm " + (errors.bmi && "is-invalid")}
                          name="bmi"
                          ref={register()}
                          defaultValue={bmiInfo.bmi}
                        />
                      </td>
                      <td className="col-wd-10 text-right">
                        <button
                          className="btn btn-primary btn-sm"
                          disabled={formSubmitted}
                          type="submit"
                        >
                          {(formSubmitted && "Saving...") || "Save"}
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </form>
            ) : (
              <table className="table table-borderless">
                  <tbody>
                    <tr>
                      <td className="col-wd-5">
                          Height
                      </td>
                      <td className="col-wd-25">                        
                        <strong>{bmiInfo.height}</strong>
                      </td>
                      <td className="col-wd-5">
                        Weight
                      </td>
                      <td className="col-wd-25">
                        <strong>{bmiInfo.weight}</strong>
                      </td>
                      <td className="col-wd-5">
                        BMI
                      </td>
                      <td className="col-wd-25">
                        <strong>{bmiInfo.bmi}</strong>
                      </td>                      
                    </tr>
                  </tbody>
                </table>
            )
          }
        </div>
        <div className="col-12"><br /><br /></div>        
        {listData && listData.map((row, index) => (
            <div className="col-12" key={index}>          
            <strong>{row.name}</strong>
              <AdmissionParamsView patientId={patientId} admissionId={admissionId} discharged={discharged} body_profile_id={row.id} />
            <br />
          </div>          
        ))}
      </div>
  );
};

export default AdmissionView;
