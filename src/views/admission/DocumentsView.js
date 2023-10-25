import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { DATE_TIME_FORMAT, COMMON_MESSAGES } from "../../config/AppConfig";
import LoaderComponent from "../../components/LoaderComponent";
import DatePickerComponent from "../../components/DatePickerComponent";
import moment from "moment";
import { create, listAllUploadedDocument, deleteDocument } from "../../services/PatientAdmissionService";
import { listAll as masterList } from "../../services/MasterPagesService";
import { NotificationManager } from "react-notifications";
import PaginationComponent from "../../components/PaginationComponent";
import SweetAlert from "react-bootstrap-sweetalert";
import MultipleUploadComponent from "../../components/MultipleUploadComponent";
import { Link } from "react-router-dom";
import defaultDocImg from "../../assets/img/default-doc.png";
import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Viewer from "react-viewer";

const DocumentsView = (props) => {
  const { patientId, admissionId, discharged } = props;

  // Set state
  const [listData, setListData] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [reloadList, setReloadList] = useState(false);
  const [paginationData, setPaginationData] = useState({currentPage: 0, totalPages: 0, totalRows: 0});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowId, setSelectedRowId] = useState(0);  
  const [parentId, setParentId] = useState(0);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [typeList, setTypeList] = useState([]);
  const [doctype,setDocType]= useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [visible, setVisible] = useState("false");
  const [images, setImages] = useState([]);
  const [dateWiseImages, setDateWiseImages] = useState([]);
  
  useEffect(() => {
    let q = (currentPage) ? "&page="+currentPage : "";
    q = (doctype) ? (q + "&document_type="+doctype) : q;
    listAllUploadedDocument(patientId, admissionId, `documents`, q).then((res) => {
      const data = res.data;
      const listData1 = [];
      const listImages = [];
      data.forEach((item) => {
        const fileExtension = ((item.document).split('.').pop()).toLowerCase();
        let fileType = ['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(fileExtension) ? "Image" : "Document";
          let key = item.for_date;
          if (!listData1[key]) {
            listData1[key] = [];
          }
          listData1[key].push({
              id: item.id,
              date: item.for_date,
              documentType: item.type || "",
              name: item.name,
              notes: item.notes,
              document: item.document,
              type:fileType,
              parent_id:item.parent_id
          });

          if (fileType === "Image") {
            if (!listImages[key]) {
              listImages[key] = [];
            }
            listImages[key].push({
              src: process.env.REACT_APP_UPLOAD_URL + item.document,
              alt: item.name
            });
          }
      });      
      setListData(listData1);
      setDateWiseImages(listImages);
      setPaginationData({currentPage: res.currentPage, totalPages: res.totalPages, totalRows: res.totalRows});
      setDataLoaded(true);
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });    
  }, [reloadList, admissionId, patientId, currentPage, doctype]);

  useEffect(() => {
    masterList("document_types").then((res) => {
      setTypeList(res.data);
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });
  }, []);

  // Handle events
  const handleReload = () => {
    setReloadList(!reloadList);
  };

  const handleAddAction = () => {
    setShowAddForm(true);
  };
  const handleCloseAddAction = () => {
    setShowAddForm(false);
  };
  const handleCloseAddActionAndReload = () => {
    setShowAddForm(false);
    handleReload();
  };

  const handleDeleteAction = () => {
    deleteDocument(patientId, admissionId, parentId, selectedRowId).then((res) => { 
    }).catch((err) => {
      NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
    });

    setReloadList(!reloadList);
    handleHideDeleteAlert();
  };

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  const handleShowDeleteAlert = (id,parent_id) => {
    setSelectedRowId(id);
    setParentId(parent_id)
    setShowDeleteAlert(true);
  };

  const handleHideDeleteAlert = () => {
    setSelectedRowId(0);
    setParentId(0);
    setShowDeleteAlert(false);
    setReloadList(!reloadList);
  };

  const handleClickImage = (key, document) => {
    //console.log(dateWiseImages,"Images");
    const needle = process.env.REACT_APP_UPLOAD_URL + document;
    const index = dateWiseImages[key].findIndex(item => item.src === needle);
    setImages(dateWiseImages[key]);
    setActiveIndex(index);
    setTimeout(
      () => setVisible("true"),
      500
    );    
  };

  if (!dataLoaded) {
    return <LoaderComponent />;
  }

  return (
    <>
      <div className="filtersec" style={{textAlign: 'right'}}>
        <select className="form-control" name="type" placeholder="select" onChange={(e)=>{setDocType(e.target.value);setCurrentPage(1)}}>
          <option value="">All Document Types</option>
          {!(typeList.length===0) ? (typeList.map((obj, index) => {
            return (
              <option value={obj.id} key={obj.id}>
                {obj.name}
              </option>
            );
          })) : <option>No Files</option>}
          ;
        </select>
        {!discharged && 
          (<Button className="btn btn-primary" onClick={handleAddAction} >Add New Document</Button>)
        }
      </div>
      
      {listData && (Object.keys(listData).map((key, i) => (
        <div className="row" key={i}>
          <div className="col-md-12 " >
            <div className="list_key_dated" key={i} >
              <span className="key_dated_list">{key}</span>
                {listData[key] && listData[key].map((row, index) => (                  
                  <div className="list__date" key={index}>
                    <div className="list_menu_cat">
                      <div className={"card shadow mb-4 prp_hgt"}>
                        <div className="text-center document">
                          {!discharged &&
                          (<button type="button" className="btn btn-sm btn_delete" onClick={(e) => handleShowDeleteAlert(row.id, row.parent_id)}>
                            <i className="far fa-trash-alt text-danger"></i>
                          </button>
                          )}
                          <div className="">
                            {row.type === "Image" ?
                              (
                              <img
                              src={process.env.REACT_APP_UPLOAD_URL + row.document}
                              alt="..."
                              className="avatar-img"
                              style={{ width: "70%" }}
                              onClick={() => {
                                handleClickImage(key, row.document);
                              }}
                              />                                                           
                              )
                            :
                              <Link to={{ pathname: process.env.REACT_APP_UPLOAD_URL + row.document }} target="_blank" alt="document">
                                <img
                                src={defaultDocImg}
                                alt="..."
                                className="avatar-img"
                                style={{ width: "70%" }}
                                />
                              </Link>
                            }
                            
                            <div className="__name">{row.name}
                              {/* <Link className="btn btn-sm mr-1" >
                              <i className="far fa-eye text-primary"></i>
                              </Link> */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  ))}
              </div>
          </div>
         
        </div>
      )))}   

      {(images.length) &&
        <Viewer
          visible={visible}
          onClose={() => {
            setVisible(false);
          }}
          zoomSpeed={0.2}
          images={images}
          activeIndex={activeIndex}
          zIndex={99999}
          drag={false}
        />
      }                             
               
      <PaginationComponent 
        currentPage={currentPage || paginationData.currentPage} 
        totalRows={paginationData.totalRows} 
        totalPages={paginationData.totalPages}
        setCurrentPage={(pageNumber) => {handleChangePage(pageNumber);}}
      />

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
          onConfirm={handleDeleteAction}
        >
          You will not be able to recover the data once deleted!
        </SweetAlert>
      )}

      {showAddForm && (
        <AddForm 
          patientId={patientId}
          admissionId={admissionId}
          handleClose={handleCloseAddAction}
          handleCloseAndReload={handleCloseAddActionAndReload}
          typeList={typeList}
        />
      )}

    </>
  );
  }

const AddForm = (props) => {
    const { patientId, admissionId, handleClose, handleCloseAndReload, typeList } = props;
  
    const [formSubmitted, setFormSubmitted] = useState(false);
    const { register, handleSubmit, errors, reset, control } = useForm();
    const [selectedFile, setSelectedFile] = useState([]);
    const [fileUploading, setFileUploading] = useState(false);
  
   
  
    // Form submit
    const onSubmit = (data) => {
      setFormSubmitted(true);
      const saveData = {
        param_id: data.type,
        for_date: moment(data.date).format(DATE_TIME_FORMAT.DDMMYYYY),
        name: data.name,
        notes: data.notes,
        document: selectedFile,
      };
      create(patientId, admissionId, `documents`, saveData).then((res) => {
        reset();
        handleCloseAndReload();
        setFormSubmitted(false);
        setSelectedFile("");
      }).catch((err) => {
        NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
      });
    };

   
    return (
      <Modal
      show={true}
      className="admission_clinical fade show"
      onHide={handleClose}
    >
      <Modal.Header closeButton>
        <Modal.Title>Add Document</Modal.Title>
      </Modal.Header>
      
      <form onSubmit={handleSubmit(onSubmit)}>
      
        <table className="table table-borderless document_area">
          <tbody>
            
            <tr>
              <td className="col-wd-25">
                <select
                  className={
                    "form-control " + (errors.type && "is-invalid")
                  }
                  name="type"
                  ref={register({
                    required: true,
                    validate: (value) => {
                      return !!value.trim();
                    },
                  })}
                >
                  <option value="">Select</option>
                  {typeList.map((obj, index) => {
                    return (
                      <option value={obj.id} key={obj.id}>
                        {obj.name}
                      </option>
                    );
                  })}
                  ;
                </select>
              </td>
              <td className="col-wd-25">
                <input
                  type="text"
                  className={"form-control " + (errors.name && "is-invalid")}
                  name="name"
                  ref={register({
                    required: true,
                    validate: (value) => {
                      return !!value.trim();
                    },
                  })}
                  placeholder="Document Name"
                />
              </td>
              <td className="col-wd-25">
                <DatePickerComponent 
                  fieldName="date" 
                  defaultValue={new Date()} 
                  errors={errors} 
                  control={control} 
                  require={true}
                  showTime={false}
                  maxDate={new Date()}
                />
              </td>              
            </tr>
            <tr>
                <td colSpan="4">
                  <MultipleUploadComponent 
                    fieldName="document"
                    errors={errors}
                    required={true}
                    fileUploading={fileUploading}
                    setFileUploading={setFileUploading}
                    setSelectedFile={setSelectedFile}
                    register={register}
                  />
                </td>
                
            </tr>
            <tr>
              <td colSpan="4">
                <textarea
                  className="form-control"
                  rows="3"
                  name="notes"
                  ref={register}
                  placeholder="Insert notes here"
                ></textarea>
              </td>
            </tr>
            <tr>
              <td colSpan="4">
              {(!fileUploading) &&
                <button
                  className="btn btn-primary"
                  disabled={formSubmitted}
                  type="submit"
                >
                  {(formSubmitted && "Saving...") || "Save"}
                </button>
              }
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </Modal>
      
    );
  };

export default DocumentsView;
