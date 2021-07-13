import React from "react";
import { useReactiveVar } from "@apollo/client";
import { paginationDataVar } from "../graphql/apolloClient";

function PagingOffsetLimitControl({ lastPage }) {
  const paginationData = useReactiveVar(paginationDataVar);
  const { currentPage } = paginationData;

  return (
    <div className=" d-flex">
      <a
        onClick={() => {
            paginationDataVar({
                ...paginationData,
                currentPage: 0,
            });
        }}
        href="#"
        className="page-link"
      >
        <i className="fa fa-angle-double-left" aria-label="First">
          First
        </i>
      </a>
      <a
        onClick={() => {
          if (currentPage > 0) {
            paginationDataVar({
              ...paginationData,
              currentPage: currentPage - 1,
            });
          }
        }}
        href="#"
        className="page-link"
      >
        <i className="fa fa-angle-double-left" aria-label="Previous">
          Previous
        </i>
      </a>
      <div className="d-flex justify-content-center align-items-center m-2">
        {currentPage + 1}
      </div>
      <a
        onClick={() => {
          if (currentPage < lastPage) {
            paginationDataVar({
              ...paginationData,
              currentPage: currentPage + 1,
            });
          }
        }}
        href="#"
        className="page-link"
      >
        <i className="fa fa-angle-double-left" aria-label="Next">
          Next
        </i>
      </a>
      <a
        onClick={() => {
            paginationDataVar({
                ...paginationData,
                currentPage: lastPage,
            });
        }}
        href="#"
        className="page-link"
      >
        <i className="fa fa-angle-double-left" aria-label="Last">
          Last
        </i>
      </a>
    </div>
  );
}

export default PagingOffsetLimitControl;
