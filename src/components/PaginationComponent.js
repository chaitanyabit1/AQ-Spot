import React from "react";
import { Link } from "react-router-dom";

const PaginationComponent = (props) => {
  const { currentPage, totalRows, totalPages, setCurrentPage } = props;
  const totalPagesArray = Array.from(Array(totalPages).keys());
  
  const handleChangePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  return (currentPage  ===  "" || currentPage < 1 || totalPages <= 1 || totalRows === "" || currentPage>totalPages) ? (
        <div></div>
      )
    :    
      (
      <div>
      <nav aria-label="Table Paging" className="my-3">
        <ul className="pagination justify-content-end mb-0">
          <li className={currentPage === 1 ? 'page-item disabled' : 'page-item'} key="prev">
            <Link className="page-link" onClick={() => handleChangePage(currentPage-1)} to={'#'}>
              Previous
            </Link>
          </li>
          {totalPagesArray.map((page) =>
              <li key={page+1} className={currentPage === page+1 ? 'page-item active' : 'page-item'}>
                <Link className="page-link" onClick={() => handleChangePage(page+1)} to={'#'}>
                  {page+1}
                </Link>
              </li>
          )}
          <li className={currentPage === totalPages ? 'page-item disabled' : 'page-item'} key="next">
            <Link className="page-link" onClick={() => handleChangePage(currentPage+1)} to={'#'}>
              Next
            </Link>
          </li>
        </ul>
      </nav>
      </div>
      );
};
export default PaginationComponent;