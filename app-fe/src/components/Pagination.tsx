import React from "react";
import styles from "../app/profile/page.module.css";
import cx from "classnames";

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
        <ul className={cx(styles.pagination, "pagination")}>
            <li className={cx(styles.pagination, "page-item")}>
                <button
                    onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                    className="page-link"
                >
                    Prev
                </button>
            </li>
            {pages.map((page) => (
                <li key={page} className={cx(styles.pagination, "page-item")}>
                    <button
                        onClick={() => {
                            if (page !== currentPage) {
                                onPageChange(page);
                            }
                        }}
                        className={cx("page-link", {
                            [styles.active]: page === currentPage,
                        })}
                    >
                        {page}
                    </button>
                </li>
            ))}
            <li className={cx(styles.pagination, "page-item")}>
                <button
                    onClick={() =>
                        onPageChange(Math.min(currentPage + 1, total))
                    }
                    className="page-link"
                >
                    Next
                </button>
            </li>
        </ul>
    );
};

export default Pagination;
