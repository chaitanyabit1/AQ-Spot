import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import LoaderComponent from "../../components/LoaderComponent";
import { listAssignedHospitals, assignHospital, deleteAssignHospital } from "../../services/UsersService";
import { listAll as listAllHospitals } from "../../services/HospitalsService";
import { listAllByHospital as listICUWard } from "../../services/ICUService";
import SweetAlert from "react-bootstrap-sweetalert";
import { NotificationManager } from "react-notifications";
import { COMMON_MESSAGES } from "../../config/AppConfig";

const UserEditHospitaliew = (props) => {
  const { userId } = props;
  
  const [listData, setListData] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [reloadListData, setReloadListData] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [deleteRowId, setDeleteRowId] = useState(0);

  // Fetch data
  useEffect(() => {
    listAssignedHospitals(userId).then((res) => {
      setListData(res.data);
      setDataLoaded(true);
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });
  }, [userId, reloadListData]);

  const handleShowDeleteAlert = (id) => {
    setDeleteRowId(id);
    setShowDeleteAlert(true);
  };
  const handleHideDeleteAlert = () => {
    setDeleteRowId(0);
    setShowDeleteAlert(false);
  };

  const handleReloadList = () => {
    setReloadListData(!reloadListData);
  }

  const onDelete = () => {
    if(deleteRowId) {
      deleteAssignHospital(userId, deleteRowId).then((res) => {
      }).catch((err) => {
        NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
      });
    }
    handleHideDeleteAlert();
    setReloadListData(!reloadListData);
  };
 
  if (!dataLoaded) {
    return <LoaderComponent />;
  }
  return (
    <div className="col-12">
    <table className="table table-borderless" style={{marginBottom:"0"}}>
      <thead>
        <tr>
          <th className="col-wd-30">Hospital</th>
          <th className="col-wd-30">ICU Ward</th>
          <th className="col-wd-20 text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        {listData.map((row, index) => (
          <tr key={index}>
            <td>{row.hospital}</td>  
            <td>{row.icu_ward}</td>      
            <td className="text-center">
              <button type="button" className="btn btn-sm" onClick={() => handleShowDeleteAlert(row.id)}>
                <i className="far fa-trash-alt text-danger"></i>
              </button>
            </td>
          </tr>
        ))}   
      </tbody>
    </table>
    {(
        <AddForm 
          userId={userId}
          handleReloadList = {handleReloadList}
        />
    )}

    {showDeleteAlert && (
      <SweetAlert
        warning
        showCancel
        btnSize=""
        confirmBtnText="Delete"
        confirmBtnBsStyle="danger"
        cancelBtnText="Cancel"
        title="Are you sure?"
        focusCancelBtn
        onCancel={handleHideDeleteAlert}
        onConfirm={onDelete}
      >
        You will not be able to recover the data once deleted!
      </SweetAlert>
    )}
    </div>
  );
};

const AddForm = (props) => {
  const { userId, handleReloadList } = props;

  const [hospitalList, setHospitalList] = useState([]);
  const [hospital, setHospital] = useState(null);
  const [icuWardsList, setIcuWardsList] = useState([]);
  const [formSubmittedHospital, setFormSubmittedHospital] = useState(false);
  const { register, handleSubmit, errors, reset } = useForm();

  // Fetch data
  useEffect(() => {
    listAllHospitals().then((res) => {
      const data = res.data;
      const listData = [];
      data.forEach((item) => {
        listData.push({
          id: item.id,
          name: item.name + " - " + item.address
        });
      });
      setHospitalList(listData);
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });

    listICUWard(hospital).then((res) => {
      const data = res.data;
      const listData = [];
      data.forEach((item) => {
        listData.push({
          id: item.id,
          name: item.name
        });
      });
      setIcuWardsList(listData);
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });
  }, [userId, hospital]);

  // Form submit
  const onSubmitHospital = (data) => {
    setFormSubmittedHospital(true);
    const saveData = {
      hospital: data.hospital,
      icu_ward: data.icu_ward,
    };
    assignHospital(userId, saveData).then((res) => {
      reset();
      setFormSubmittedHospital(false);
      handleReloadList();
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });
    
  };

  const handleChangeHospital = (e) => {
    setHospital(e.target.value || 0);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHospital)}>
      <table className="table table-borderless tablehospital" style={{borderBottom: "1px solid #ccc"}}>
      <tbody>
        <tr>
        <td className="col-wd-30">
        <select
          className={
            "form-control " + (errors.hospital && "is-invalid")
          }
          name="hospital"
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
              <option value={obj.id} key={obj.id}>
                {obj.name}
              </option>
            );
          })}
          ;
        </select>
        </td>
        <td className="col-wd-30">
        <select
          className={
            "form-control " + (errors.icu_ward && "is-invalid")
          }
          name="icu_ward"
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
              <option value={obj.id} key={obj.id}>
                {obj.name}
              </option>
            );
          })}
          ;
        </select>
        </td>
        <td className="col-wd-20 text-center save_area">
          <button
            className="btn btn-primary"
            disabled={formSubmittedHospital}
            type="submit"
          >
            {(formSubmittedHospital && "Saving...") || "Save"}
          </button>
        </td>
      </tr>
      </tbody>
      </table>
    </form>
  );
};

export default UserEditHospitaliew;
