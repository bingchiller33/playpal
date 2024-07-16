"use client";

import AdminNavigationPanel from "@/components/AdminNavigationPanel";
import Header from "@/components/Header";
import { fmtRelDate } from "@/utils";
import Link from "next/link";
import styles from "./page.module.css";

import { Button, Col, Row, Table } from "react-bootstrap";
import Avatar from "@/components/Avatar";
import Dropdown from "@/components/Dropdown";
import { BAN_STATUS_FILTERS, ROLES, ROLES_FILTERS } from "@/utils/constants";
import { IAccount } from "@/models/account";
import { useEffect, useState } from "react";
import { WithId } from "@/utils/types";
import { searchPlayers } from "./server";
import Pagination from "@/components/Pagination";
import Dividers from "@/components/Dividers";

const isBanned = (user: WithId<IAccount>) => {
    return user.banUntil && user.banUntil > new Date();
};

const ManageUsersPage = () => {
    const [roleFilter, setRoleFilter] = useState<string>("all");
    const [accountStatus, setAccountStatus] = useState<string>("active");
    const [search, setSearch] = useState<string>("");
    const [users, setUsers] = useState<WithId<IAccount>[]>([]);
    const [page, setPage] = useState<number>(1);
    const [pageCount, setPageCount] = useState<number>(1);
    const [count, setCount] = useState<number>(0);

    useEffect(() => {
        searchPlayers(search, roleFilter, accountStatus, page - 1).then(
            (res) => {
                if (res.success) {
                    setUsers(res.data!);
                    setPageCount(res.pageCount!);
                    setCount(res.count!);
                }
            }
        );
    }, [roleFilter, accountStatus, search, page]);

    return (
        <div>
            <Header />
            <Row className="m-1">
                <Col md={4} className="p-1">
                    <AdminNavigationPanel />
                </Col>
                <Col md={8} className="p-1">
                    <div className="background-1 border-primary-glow p-1 m-1 rounded">
                        <h1>Manage Users</h1>
                        <form>
                            <div className="d-flex gap-2 align-items-center">
                                <label>Search</label>
                                <input
                                    type="text"
                                    className="pp-form-input"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <h3>Filter:</h3>
                            <Row>
                                <Col>
                                    <div className="d-flex gap-2 align-items-center">
                                        <label>Role</label>
                                        <Dropdown
                                            className="flex-grow-1"
                                            options={ROLES_FILTERS}
                                            onChange={(e) =>
                                                setRoleFilter(e as any)
                                            }
                                            value={roleFilter}
                                        />
                                    </div>
                                </Col>
                                <Col>
                                    <div className="d-flex gap-2 align-items-center">
                                        <label>Ban Status</label>
                                        <Dropdown
                                            className="flex-grow-1"
                                            options={BAN_STATUS_FILTERS}
                                            onChange={(e) =>
                                                setAccountStatus(e as any)
                                            }
                                            value={accountStatus}
                                        />
                                    </div>
                                </Col>
                            </Row>
                        </form>

                        <Dividers />
                        <h2>Showing {count} results</h2>
                        <Table
                            responsive
                            striped
                            bordered
                            hover
                            className={styles["table-user"]}
                        >
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Created At</th>
                                    <th>Banned?</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user._id.toString()}>
                                        <td>{user._id.toString()}</td>
                                        <td>
                                            <Link
                                                href={`/profile/${user._id}`}
                                                className="d-flex align-items-center gap-2"
                                            >
                                                <Avatar
                                                    size={32}
                                                    src={user.avatar}
                                                    initials={
                                                        user.username?.[0] ??
                                                        "P"
                                                    }
                                                />

                                                {user.username}
                                            </Link>
                                        </td>
                                        <td>{user.email}</td>
                                        <td>{user.role}</td>
                                        <td>{fmtRelDate(user.createdAt!)}</td>
                                        <td>{isBanned(user) ? "Yes" : "No"}</td>
                                        <td>
                                            <Link
                                                href={`/admin/users/${user._id}`}
                                                className="btn btn-primary"
                                            >
                                                Manage
                                            </Link>
                                        </td>
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
                </Col>
            </Row>
        </div>
    );
};

export default ManageUsersPage;
