import React from "react";
import stylePagination from "../../styles/Pagination.module.css";

const Pagination = ({ adsPerPage, totalAds, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalAds / adsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <ul className={stylePagination.pagination}>
      {pageNumbers.map((number) => (
        <li key={number} className={stylePagination.page}>
          <p
            onClick={() => paginate(number)}
            className={stylePagination.pagelink}
            style={{ color: "#fff", marginRight:"20px", fontFamily:"Strait", cursor:"pointer"}}
          >
            {number}
          </p>
        </li>
      ))}
    </ul>
  );
};

export default Pagination;
