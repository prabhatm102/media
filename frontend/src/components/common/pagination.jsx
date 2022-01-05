import React from "react";
import _ from "lodash";
import PropTypes from "prop-types";

const Pagination = (props) => {
  const { itemCount, pageSize, onPageChange, currentPage, errMsg } = props;
  const pagesCount = Math.ceil(itemCount / pageSize);

  if (pagesCount === 1) return null;
  if (pagesCount <= 1) return <p>There is no {errMsg}.</p>;

  const pages = _.range(1, pagesCount + 1);

  return (
    <nav className="offset-4">
      <ul className="pagination">
        <li className={currentPage === 1 ? "page-item disabled" : "page-item"}>
          <button className="page-link" onClick={() => onPageChange(1)}>
            <span>&laquo;&laquo;</span>
          </button>
        </li>
        <li className={currentPage === 1 ? "page-item disabled" : "page-item"}>
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage > 1 ? currentPage - 1 : 1)}
          >
            <span>&laquo;</span>
          </button>
        </li>

        {pages.map((page) => {
          return (
            <li
              className={
                page === currentPage ? "page-item active" : "page-item"
              }
              key={page}
            >
              <button className="page-link" onClick={() => onPageChange(page)}>
                {page}
              </button>
            </li>
          );
        })}
        <li
          className={
            currentPage === pages.length ? "page-item disabled" : "page-item"
          }
        >
          <button
            className="page-link"
            onClick={() =>
              onPageChange(
                currentPage < pages.length ? currentPage + 1 : pages.length
              )
            }
          >
            <span>&raquo;</span>
          </button>
        </li>
        <li
          className={
            currentPage === pages.length ? "page-item disabled" : "page-item"
          }
        >
          <button
            className="page-link"
            onClick={() => onPageChange(pages.length)}
          >
            <span>&raquo;&raquo;</span>
          </button>
        </li>
      </ul>
    </nav>
  );
};

Pagination.defaultProps = {
  selectedGenre: "",
};

Pagination.propTypes = {
  itemCount: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
