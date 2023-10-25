import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Modal from "react-bootstrap/Modal";
import LoaderComponent from "../../components/LoaderComponent";

const EditView = (props) => {
  const { handleHideEditView, handleReloadListdata, rowId } = props;

  // Set module variables
  const pageTitle = "Edit Followup";

  // Set state
  const rowData = {
    name: "",
    description: "",
    id: rowId,
  };
  const [formSubmitted, setFormSubmitted] = useState(false);
  const { register, handleSubmit, errors } = useForm();

  // Form submit
  const onSubmit = (data) => {
    setFormSubmitted(true);
    handleReloadListdata();
  };

  return (
    <Modal
      size="lg"
      aria-labelledby="example-modal-sizes-title-lg"
      show={true}
      onHide={handleHideEditView}
      className="followups_view fade show"
    >
      <Modal.Header closeButton>
        <Modal.Title>{pageTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {rowData.name === "" ? (
          <LoaderComponent />
        ) : (
          <form className="col-12 mx-auto" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label>
                Name<i className="text-danger">*</i>
              </label>
              <input
                type="text"
                name="name"
                defaultValue={rowData.name}
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
        )}
      </Modal.Body>
    </Modal>
  );
};

export default EditView;
