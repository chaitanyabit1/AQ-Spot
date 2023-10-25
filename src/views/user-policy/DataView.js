import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import LoaderComponent from "../../components/LoaderComponent";

const DataView = (props) => {
  const rowId = props.rowId;
  const [rowData, setRowData] = useState({ name: "" });

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

  const closeModal = () => props.hideModal();

  return (
    <Modal
      size="lg"
      aria-labelledby="example-modal-sizes-title-lg"
      show={true}
      onHide={closeModal}
      className="fade show"
    >
      <Modal.Header closeButton>
        <Modal.Title>User Access Policy</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {rowData.name === "" ? <LoaderComponent /> : <>Name: {rowData.name}</>}
      </Modal.Body>
    </Modal>
  );
};

export default DataView;
