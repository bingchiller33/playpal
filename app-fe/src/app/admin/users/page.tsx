import AdminNavigationPanel from "@/components/AdminNavigationPanel";
import Header from "@/components/Header";
import dbConnect from "@/lib/mongoConnect";
import Account from "@/models/account";
import { fmtRelDate } from "@/utils";
import Link from "next/link";
import styles from "./page.module.css";

import { Button, Col, Row, Table } from "react-bootstrap";
import Avatar from "@/components/Avatar";

const ManageUsersPage = async () => {
    await dbConnect();
    const users = await Account.find({}).exec();

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
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
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
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default ManageUsersPage;
