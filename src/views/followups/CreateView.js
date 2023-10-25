import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Modal from "react-bootstrap/Modal";
import { getUserDetails } from "../../session/UserSession";
import { usersList, followupTypes } from "../../services/FollowupService";

const CreateView = (props) => {
  const { handleHideCreateView, handleReloadListdata } = props;
  const userObj = getUserDetails();

  // Set module variables
  const pageTitle = "Create New Followup";

  // Set state
  const [formSubmitted, setFormSubmitted] = useState(false);
  const { register, handleSubmit, errors } = useForm();

  // Form submit
  const onSubmit = (data) => {
    setFormSubmitted(true);
    async function submitData() {
      let response = await fetch(process.env.REACT_APP_API_URL + "/followups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(data),
      });

      let result = await response;
      if (result.ok) {
        handleReloadListdata();
        handleHideCreateView();
      }
    }
    submitData();
  };

  return (
    <Modal
      size="lg"
      aria-labelledby="example-modal-sizes-title-lg"
      show={true}
      onHide={handleHideCreateView}
      className="fade show"
    >
      <Modal.Header closeButton>
        <Modal.Title>{pageTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form className="col-12 mx-auto" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>
              Sent To<i className="text-danger">*</i>
            </label>
            <select
              className={
                "form-control " + (errors.processed_by_user && "is-invalid")
              }
              name="processed_by_user"
              ref={register({
                required: true,
                validate: (value) => {
                  return !!value.trim();
                },
              })}
            >
              <option value="">Select</option>
              {usersList.map((obj, index) => {
                return obj.id === userObj.id ? (
                  <></>
                ) : (
                  <option value={obj.id} key={"u-" + obj.id}>
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
                "form-control " + (errors.followup_type_id && "is-invalid")
              }
              name="followup_type_id"
              ref={register({
                required: true,
                validate: (value) => {
                  return !!value.trim();
                },
              })}
            >
              <option value="">Select</option>
              {followupTypes.map((obj, index) => {
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
              Description<i className="text-danger">*</i>
            </label>
            <textarea
              className={"form-control " + (errors.description && "is-invalid")}
              rows="4"
              name="description"
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
      </Modal.Body>
    </Modal>
  );
};

export default CreateView;
