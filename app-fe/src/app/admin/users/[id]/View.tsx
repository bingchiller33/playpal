"use client";

import AdminNavigationPanel from "@/components/AdminNavigationPanel";
import Dividers from "@/components/Dividers";
import Dropdown from "@/components/Dropdown";
import Header from "@/components/Header";
import dbConnect from "@/lib/mongoConnect";
import { IAccount } from "@/models/account";
import { NextPageProps, WithId } from "@/utils/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button, Col, Row, Table } from "react-bootstrap";
import { banUser, changeRole } from "./server";
import { reportToast } from "@/utils/client";
import { ROLES } from "@/utils/constants";
import EditUserInfo from "./EditUserInfo";
import styles from "./page.module.css";
import { fmtDateInput, fmtRelDate } from "@/utils";
import Pagination from "@/components/Pagination";
import { IPremiumTransaction } from "@/models/premiumTransactionModel";
import PremiumTransactionHistory from "@/components/PremiumTransactionHistory";
import * as premiumServer from "@/server/subscriptions.server";

function parseDate(date: string | Date | null) {
    if (!date) {
        return null;
    }

    return new Date(date).toISOString().split("T")[0];
}

const ManageUserView = ({ user, premiumExpire }: ManageUserViewProps) => {
    const [role, setRole] = useState(user.role);
    const [banUntil, setBanUntil] = useState<Date | null>(
        user?.banUntil || null
    );
    const [banReason, setBanReason] = useState(user?.banReason || "");
    const [expiry, setExpiry] = useState<Date | undefined>(premiumExpire);
    const [gen, setGen] = useState(0);

    useEffect(() => {
        setExpiry(premiumExpire);
    }, [premiumExpire]);

    const handleSaveRole = async () => {
        const res = await changeRole(user._id.toString(), role);
        reportToast(res, "Role changed successfully");
    };

    const handleBan = async () => {
        const res = await banUser(user._id.toString(), banUntil, banReason);
        reportToast(res, "User restricted successfully");
    };

    const handleSetExpiry = async () => {
        if (!expiry) {
            return;
        }

        const res = await premiumServer.setExpiry(user._id.toString(), expiry);
        setGen(Math.random());
        reportToast(res, "Subscription expiry set successfully");
    };

    const handleRemoveSub = async () => {
        const res = await premiumServer.removeSubscription(user._id.toString());
        setGen(Math.random());
        reportToast(res, "Subscription removed successfully");
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
                        <EditUserInfo userId={user._id.toString()} />
                        <Dividers />
                        <h2>Manage Subscription</h2>
                        <div>
                            {premiumExpire ? (
                                <p>
                                    This user is subscribed to PlayPal Premium.
                                    <br />
                                    Your subscription will expire at:{" "}
                                    {premiumExpire.toDateString()}
                                </p>
                            ) : (
                                <p>
                                    This user is not subscribed to PlayPal
                                    Premium.
                                </p>
                            )}

                            <div>
                                <label>Set subscription expiry: </label>
                                <input
                                    type="date"
                                    className="pp-form-input"
                                    value={expiry ? fmtDateInput(expiry) : ""}
                                    onChange={(e) =>
                                        setExpiry(new Date(e.target.value))
                                    }
                                />
                                <button
                                    onClick={handleSetExpiry}
                                    className="btn btn-primary bg-primary-1 px-4 py-2 mt-2"
                                >
                                    Set Expiry
                                </button>
                                <button
                                    onClick={handleRemoveSub}
                                    className="btn text-white border-primary-glow px-4 py-2 mt-2 ms-2"
                                >
                                    Remove Subscription
                                </button>
                            </div>

                            <h3 className="mt-2">Subcription History</h3>
                            <PremiumTransactionHistory
                                key={gen}
                                userId={user._id.toString()}
                            />
                        </div>
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
                                value={parseDate(banUntil) || ""}
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
    premiumExpire?: Date;
}

export default ManageUserView;
