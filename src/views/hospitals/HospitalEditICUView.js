import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import LoaderComponent from "../../components/LoaderComponent";
import { listAllByHospital, create } from "../../services/ICUService";
import { NotificationManager } from "react-notifications";
import { COMMON_MESSAGES } from "../../config/AppConfig";

const HospitalEditICUView = (props) => {
  const { hospitalId } = props;

  const [listData, setListData] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [reloadListData, setReloadListData] = useState(false);

  // Fetch data
  useEffect(() => {
    listAllByHospital(hospitalId).then((res) => {
      setListData(res.data);
      setDataLoaded(true);
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });    
  }, [hospitalId, reloadListData]);

  const handleDeleteAction = () => {
    alert("This will open the delete popup");
  };

  const handleReloadList = () => {
    setReloadListData(!reloadListData);
  }
 
  if (!dataLoaded) {
    return <LoaderComponent />;
  }
  return (
    <div className="col-12">
    <table className="table table-borderless" style={{marginBottom:"0"}}>
      <thead>
        <tr>
          <th className="col-wd-40">Ward Name</th>
          <th className="col-wd-40">Capacity</th>
          <th className="col-wd-20 text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        {listData.map((row, index) => (
          <tr key={index}>
            <td>{row.name}</td>
            <td>{row.capacity}</td>            
            <td className="text-center">
              <button type="button" className="btn btn-sm" onClick={handleDeleteAction}>
                <i className="far fa-trash-alt text-danger"></i>
              </button>
            </td>
          </tr>
        ))}   
      </tbody>
    </table>
    {(
        <AddForm 
          hospitalId={hospitalId}
          handleReloadList = {handleReloadList}
        />
    )}  
    </div>
  );
};

const AddForm = (props) => {
  const { hospitalId, handleReloadList } = props;

  const [formSubmittedICU, setFormSubmittedICU] = useState(false);
  const { register, handleSubmit, errors, reset } = useForm();

  // Form submit
  const onSubmitICU = (data) => {
    setFormSubmittedICU(true);
    const saveData = {
      hospital: hospitalId,
      name: data.name,
      capacity: data.capacity
    };

    create(saveData).then((res) => {
      reset();
      setFormSubmittedICU(false);
      handleReloadList();
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmitICU)}>
      <table className="table table-borderless icutblarea" style={{borderBottom: "1px solid #ccc"}}>
      <tbody>
        <tr>
        <td className="col-wd-40">
          <input
            type="text"
            className={"form-control " + (errors.name && "is-invalid")}
            name="name"
            placeholder="Ward Name"
            ref={register({
              required: true,
              validate: (value) => {
                return !!value.trim();
              },
            })}
          />
        </td>
        <td className="col-wd-40">
          <input
            type="text"
            className={"form-control " + (errors.capacity && "is-invalid")}
            name="capacity"
            placeholder="Capacity"
            ref={register({
              required: true,
              validate: (value) => {
                return !!value.trim();
              },
            })}
          />
        </td>
        <td className="col-wd-40 text-center">
          <button
            className="btn btn-primary"
            disabled={formSubmittedICU}
            type="submit"
          >
            {(formSubmittedICU && "Saving...") || "Save"}
          </button>
        </td>
      </tr>
      </tbody>
      </table>
    </form>
  );
};

export default HospitalEditICUView;
