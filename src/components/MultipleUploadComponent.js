import React from "react";
import { multipleUploadFile } from "../services/PatientAdmissionService";
import { NotificationManager } from "react-notifications";

const MultipleUploadComponent = (props) => {
  const {fieldName, errors, required, register, fileUploading, setFileUploading, setSelectedFile } = props;

  const handleChangeFile = (file) => {
    if (file.length > 3) { 
      const msg = 'Only 3 document can be uploaded at a time'
      NotificationManager.error(msg, 'Error', 5000);
      return false;
    }      
    setFileUploading(true);
    const data = new FormData();
    for(let x = 0; x<file.length; x++) {
      data.append("document", file[x]);
    }
    multipleUploadFile(data).then((res) => {
      setFileUploading(false);
      if(res.error) {
        NotificationManager.error(res.message, 'Error', 5000);
        setSelectedFile([]);
      } else {
        const listFiles = [];
        (res.data).forEach((item) => {
          listFiles.push({
            filename: item.filename,
          });
        });
        //console.log(listFiles);
        setSelectedFile(listFiles);
      }        
    }).catch((err) => {
      setFileUploading(false);
      setSelectedFile([]);
    });
  };

  return (
    <>
    <input 
      className={"form-control " + (errors[fieldName] && "is-invalid")}
      type="file" 
      name={fieldName}
      multiple
      onChange={(e) => handleChangeFile(e.target.files)} 
      ref={register({
        required,
        validate: (selectedFile) => {
          return !!selectedFile;
        },
      })}
    />
    {(fileUploading) && "Uploading..."}
    </>
  );
};

export default MultipleUploadComponent;