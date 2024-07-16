"use client";

import { useEffect, useState } from "react";
import { IPremiumTransaction } from "@/models/premiumTransactionModel";
import { WithId } from "@/utils/types";
import { getPremiumHistory } from "@/server/subscriptions.server";
import Pagination from "./Pagination";
import styles from "./PremiumTransactionHistory.module.css";
import { Table } from "react-bootstrap";
import { toast } from "react-toastify";
export interface PremiumTransactionHistoryProps {
    userId: string;
}

const PremiumTransactionHistory = ({
    userId,
}: PremiumTransactionHistoryProps) => {
    const [data, setData] = useState<WithId<IPremiumTransaction>[]>([]);
    const [page, setPage] = useState<number>(1);
    const [pageCount, setPageCount] = useState<number>(1);

    useEffect(() => {
        getPremiumHistory(userId, page - 1).then((res) => {
            if (res.success) {
                setData(
                    res.data!.map((x) => ({
                        ...x,
                        from: new Date(x.from),
                        to: new Date(x.to),
                    }))
                );

                setPageCount(res.pageCount!);
            } else {
                toast.error(res.msg);
            }
        });
    }, [page, userId]);

    return (
        <div>
            <Table
                responsive
                bordered
                hover
                className={styles["table-history"]}
            >
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Subcribe Date</th>
                        <th>Expiry</th>
                        <th>Price</th>
                        <th>Transaction ID</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item._id.toString()}>
                            <td>{item.from.toDateString()}</td>
                            <td>{item.from.toDateString()}</td>
                            <td>{item.to.toDateString()}</td>
                            <td>{item.finalPrice} VND</td>
                            <td>{item._id.toString()}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Pagination
                currentPage={page}
                total={pageCount}
                onPageChange={(e) => setPage(e)}
            />
        </div>
    );
};

export default PremiumTransactionHistory;
