"use client";

import { IoIosArrowBack } from "react-icons/io";
import IconLink from "./IconLink";
import { WithId } from "@/utils/types";
import NotificationPanelItem from "./NotificationPanelItem";
import { COLORS } from "@/utils/constants";
import { INotification } from "@/models/notificationModel";
import cx from "classnames";
import { useState } from "react";

const NotificationPanel = (props: NotificationPanelProps) => {
    const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
    const notifications =
        activeTab === "all" ? props.notifications : props.unreadNotifications;

    return (
        <div className="bg-1 h-100 panel-layout-child position-relative">
            <div
                className="d-flex align-items-center py-3"
                style={{ borderBottom: "1px solid var(--clr-primary-1)" }}
            >
                <IconLink href="/">
                    <IoIosArrowBack fill={COLORS.PRIMARY_1} size={28} />
                </IconLink>

                <h1
                    className="font-all-star color-primary-1 m-0"
                    style={{ fontSize: 24 }}
                >
                    NOTIFICATIONS
                </h1>
            </div>

            <div className="col btnLine text-center m-2">
                <div className="row">
                    <button
                        onClick={() => setActiveTab("all")}
                        className={cx(
                            "unstyled-button col btnLine-members",
                            activeTab === "all" && ["active-membersTab"]
                        )}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setActiveTab("unread")}
                        className={cx(
                            "unstyled-button col btnLine-request",
                            activeTab === "unread" && ["active-membersTab"]
                        )}
                    >
                        Unread
                    </button>
                </div>
            </div>

            <ul className="unstyled-list">
                {notifications.map((n) => (
                    <NotificationPanelItem
                        key={n._id.toString()}
                        notification={n}
                    />
                ))}
            </ul>

            <form className="d-flex justify-content-center notification-panel-mark-read">
                <button className="unstyled-button p-3">
                    Mark All As Read
                </button>
            </form>
        </div>
    );
};

export interface NotificationPanelProps {
    notifications: WithId<INotification>[];
    unreadNotifications: WithId<INotification>[];
}

export default NotificationPanel;
