import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Modal from "react-bootstrap/Modal";

const CreateView = (props) => {
  const { register, handleSubmit, errors } = useForm();
  const [formSubmitted, setFormSubmitted] = useState(false);

  const closeModal = () => {
    if (!formSubmitted) {
      props.hideModal();
    }
  };

  const onSubmit = (data) => {
    setFormSubmitted(true);
    async function submitData() {
      let response = await fetch(
        process.env.REACT_APP_API_URL + "/user-policy",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
          body: JSON.stringify(data),
        }
      );

      let result = await response;
      if (result) {
        props.updateListingReload(Math.random());
        setFormSubmitted(false);
        closeModal();
      }
    }
    submitData();
  };

  return (
    <Modal
      size="lg"
      aria-labelledby="example-modal-sizes-title-lg"
      show={true}
      onHide={closeModal}
      className="fade show"
    >
      <Modal.Header closeButton>
        <Modal.Title>Create New User Access Policy</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form className="col-12 mx-auto" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>
              Name<i className="text-danger">*</i>
            </label>
            <input
              type="text"
              name="name"
              className={"form-control " + (errors.name && "is-invalid")}
              placeholder="Policy Name"
              ref={register({
                required: true,
                validate: (value) => {
                  return !!value.trim();
                },
              })}
            />
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
