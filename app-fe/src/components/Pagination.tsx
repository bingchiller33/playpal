import React from "react";
import styles from "../app/profile/page.module.css";

type PaginationProps = {
  total: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
  total,
  currentPage,
  onPageChange,
}) => {
  const pages = Array.from({ length: total }, (_, index) => index + 1);

  return (
    <div className={styles.pagination}>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => {
            if (page !== currentPage) {
              onPageChange(page);
            }
          }}
          className={page === currentPage ? styles.active : ""}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
