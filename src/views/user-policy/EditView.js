import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "react-bootstrap/Modal";
import LoaderComponent from "../../components/LoaderComponent";

const EditView = (props) => {
  const rowId = props.rowId;
  const [rowData, setRowData] = useState({ name: "" });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const { register, handleSubmit, errors } = useForm();

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        process.env.REACT_APP_API_URL + "/user-policy/" + rowId
      );
      let data = await response.json();
      setRowData(data[0]);
    }
    fetchData();
  }, [rowId]);

  const closeModal = () => {
    if (!formSubmitted) {
      props.hideModal();
    }
  };

  const onSubmit = (data) => {
    setFormSubmitted(true);
    data.id = rowId;
    async function submitData() {
      let response = await fetch(
        process.env.REACT_APP_API_URL + "/user-policy/" + rowId,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
          body: JSON.stringify(data),
        }
      );

      let result = await response;
      if (result) {
        props.updateListingReload(new Date());
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
        <Modal.Title>Edit User Access Policy</Modal.Title>
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
