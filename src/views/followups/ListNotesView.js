import React, { useState, useEffect } from "react";
import { DATE_TIME_FORMAT } from "../../config/AppConfig";
import LoaderComponent from "../../components/LoaderComponent";
import moment from "moment";
import { listAllNote } from "../../services/FollowupService";
import { NotificationManager } from "react-notifications";
import { COMMON_MESSAGES } from "../../config/AppConfig";

const ListNotesView = (props) => {
  const { rowID, reloadFollowupNotes } = props;

  const [hideNotesList, setHideNotesList] = useState(true);
  const [listData, setListData] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Fetch data
  useEffect(() => {
      listAllNote(rowID).then((res) => {
        setListData(res.data);
        setDataLoaded(true);
      }).catch((err) => {
        NotificationManager.error(COMMON_MESSAGES.SOMETHING_WRONG, 'Error', 5000);
      });        
  }, [rowID, reloadFollowupNotes]);

  const handleHideList = () => {
      setHideNotesList(!hideNotesList);
  }

  const handleDocumentOpen = (fileName) => {
    if(fileName) {
      const url = process.env.REACT_APP_UPLOAD_URL + fileName;
      window.open(url, "_blank");
    } else {
      alert("File not uploaded for this!")
    }
  };

  if (!dataLoaded) {
      return <LoaderComponent />;
  }
    
  return (
    <div className="card shadow">
    <div className="card-header">
      <strong className="card-title">List Notes</strong>
      <button className="btn btn-primary btn-sm" onClick={handleHideList} style={{float:"right"}}>
        {hideNotesList ? "Show List" : "Hide List" }
      </button>
    </div>
    <div className="card-body list-followup-notes" style={{display: hideNotesList ? "none" : "block", maxHeight: "220px", overflow: "scroll"}}>
    <table className="table table-borderless">
      <thead>
        <tr>
        <th className="col-wd-50">Note</th>
        <th className="col-wd-15">Document</th>
        <th className="col-wd-20">AddedBy</th>
        <th className="col-wd-15">AddedAt</th>
        </tr>
      </thead>
      <tbody>
        {listData && listData.map((row, index) => (
        <tr key={index}>
          <td>{row.note}</td>
          <td>{row.document &&  
            (
              <button type="button" className="btn btn-sm mr-1" onClick={() => handleDocumentOpen(row.document)}>
                <i className="far fa-file text-primary"></i>
              </button>
            )
            }
          </td>
          <td>{row.modifiedBy}</td>
          <td>{row.modifiedAt && (moment(Date.parse(new Date(row.modifiedAt*1000).toString())).format(DATE_TIME_FORMAT.DDMMYYYYhhmma))}</td>
        </tr>
        ))}
        {listData.length === 0 && (
        <tr>
          <td className="text-center" colSpan="5">No records found.</td>
        </tr>
        )}
      </tbody>
    </table>
    </div>
    </div>
  );
};
export default ListNotesView;