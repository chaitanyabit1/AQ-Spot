import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { createNote, uploadFile, updateToClose } from "../../services/FollowupService";
import { NotificationManager } from "react-notifications";
import { COMMON_MESSAGES } from "../../config/AppConfig";

const AddNotesView = (props) => {
    const {rowID, reloadFollowupNotes, rowStatus} = props;

    const [formSubmitted, setFormSubmitted] = useState(false);
    const [closeFollowup, setCloseFollowup] = useState(false);
    const [hideNotesForm, setHideNotesForm] = useState(false);
    const [followStatus, setFollowupStatus] = useState(rowStatus);
    const { register, handleSubmit, errors, reset } = useForm();
    const [selectedFile, setSelectedFile] = useState("");

    // Form submit
    const onSubmit = (data) => {
        setFormSubmitted(true);

        const saveData = {
          notes: data.notes,
          document: selectedFile,
        };
        createNote(rowID, saveData).then((res) => {
          if(closeFollowup) { //Code for set Followup status close
            updateToClose(rowID).then((result) => {
              if(result.success) {
                setCloseFollowup(false);
                setFollowupStatus("Closed");
              }
            }).catch((err) => {
              console.log(err);
            });              
          }
          formSumitReset();
          setSelectedFile("");
        }).catch((err) => {
          NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
        });        
    };

    const formSumitReset = () => {
      setFormSubmitted(false);
      reset();
      reloadFollowupNotes();
    };

    const handleSetCloseFollowup = () => {
        setCloseFollowup(true);
    };

    const handleHideForm = () => {
        setHideNotesForm(!hideNotesForm);
    };

    const handleChangeFile = (file) => {
      const data = new FormData() 
      data.append('document', file);
      uploadFile(data).then((res) => {
        if(res.error) {
          setSelectedFile('');
        } else {
          setSelectedFile(res.data.filename);
        }
      }).catch((err) => {
        setSelectedFile('');
      });
    };

    if(followStatus !== "Closed") {
        return (
            <div className="card shadow">
            <div className="card-header">
                <strong className="card-title">Add Notes</strong>
                <button className="btn btn-primary btn-sm frm-hide-button" onClick={handleHideForm} style={{float:"right"}}>
                    {hideNotesForm ? "Show Form" : "Hide Form" }
                </button>
            </div>
            <div className="card-body frm-followup-notes" style={{display: hideNotesForm ? "none" : "block" }}>
                <form className="col-12 mx-auto" onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <label>
                    Notes<i className="text-danger">*</i>
                    </label>
                    <textarea
                    className={"form-control " + (errors.notes && "is-invalid")}
                    rows="4"
                    name="notes"
                    ref={register({
                        required: true,
                        validate: (value) => {
                        return !!value.trim();
                        },
                        minLength: 10,
                    })}
                    ></textarea>
                </div>
                <div className="form-group">
                    <label>Document</label>
                    <input className="form-control" type="file" onChange={(e) => handleChangeFile(e.target.files[0])} />
                </div>
                <div className="form-group mt-4">
                    <button
                    className="btn btn-primary"
                    disabled={formSubmitted}
                    type="submit"
                    >
                    {(formSubmitted && "Saving...") || "Save"}
                    </button>
                    &nbsp;
                    <button
                    className="btn btn-primary"
                    disabled={formSubmitted}
                    type="submit"
                    onClick={handleSetCloseFollowup}
                    >
                    {(formSubmitted && "Saving...") || "Save & Close Followup"}
                    </button>
                </div>
                </form>
            </div>
            </div>
        );
    } else {
        return <></>;
    }
};
export default AddNotesView;