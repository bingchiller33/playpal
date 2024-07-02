"use client";

import AdminNavigationPanel from "@/components/AdminNavigationPanel";
import Dividers from "@/components/Dividers";
import Dropdown from "@/components/Dropdown";
import Header from "@/components/Header";
import dbConnect from "@/lib/mongoConnect";
import { IAccount } from "@/models/account";
import { NextPageProps, WithId } from "@/utils/types";
import Link from "next/link";
import { useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { banUser, changeRole } from "./server";
import { reportToast } from "@/utils/client";
import { ROLES } from "@/utils/constants";
import EditUserInfo from "./EditUserInfo";

const ManageUserView = ({ user }: ManageUserViewProps) => {
    const [role, setRole] = useState(user.role);
    const [banUntil, setBanUntil] = useState<Date | null>(null);
    const [banReason, setBanReason] = useState("");

    const handleSaveRole = async () => {
        const res = await changeRole(user._id.toString(), role);
        reportToast(res, "Role changed successfully");
    };

    const handleBan = async () => {
        const res = await banUser(user._id.toString(), banUntil, banReason);
        reportToast(res, "User restricted successfully");
    };

    return (
        <div>
            <Header />
            <Row className="m-1">
                <Col md={4} className="p-1">
                    <AdminNavigationPanel />
                </Col>
                <Col md={8} className="p-1">
                    <div className="background-1 border-primary-glow p-1 m-1 rounded">
                        <h1>Manage User: {user?.username}</h1>
                        ID: {user?._id.toString()}
                        <Link href={`/profile/${user?._id.toString()}`}>
                            View profile
                        </Link>
                        <h2>Change User Info</h2>
                        <EditUserInfo userId={user._id} />
                        <Dividers />
                        <h2>Manage Subscription</h2>
                        <p>TODO</p>
                        <Dividers />
                        <h2 className="mt-3">Change Role</h2>
                        <div className="d-flex align-items-center gap-2">
                            <span>New Role: </span>
                            <Dropdown
                                options={ROLES}
                                onChange={(e) => setRole(e as any)}
                                value={role}
                                className="flex-grow-1"
                            />
                            <Button onClick={handleSaveRole}>Save</Button>
                        </div>
                        <Dividers />
                        <h2>Restrict User</h2>
                        <div className="d-flex align-items-center gap-2 my-1">
                            <span>Until: </span>
                            <input
                                type="date"
                                className="searchForm pp-form-input"
                                value={
                                    banUntil?.toISOString().split("T")[0] || ""
                                }
                                onChange={(e) =>
                                    setBanUntil(new Date(e.target.value))
                                }
                            />
                            <Button
                                variant="danger"
                                onClick={() => setBanUntil(null)}
                            >
                                Clear
                            </Button>
                        </div>
                        <div className="d-flex align-items-center gap-2 my-1">
                            <span>Reason: </span>
                            <input
                                type="text"
                                className="searchForm pp-form-input"
                                placeholder="Reason for restriction"
                                value={banReason}
                                onChange={(e) => setBanReason(e.target.value)}
                            />
                        </div>
                        <Button
                            className="w-100"
                            variant="danger"
                            onClick={handleBan}
                        >
                            Apply Restriction!
                        </Button>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export interface ManageUserViewProps {
    user: WithId<IAccount>;
}

export default ManageUserView;
