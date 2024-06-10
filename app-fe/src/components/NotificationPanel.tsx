"use client";

import { IoIosArrowBack } from "react-icons/io";
import IconLink from "./IconLink";
import { WithId } from "@/utils/types";
import NotificationPanelItem from "./NotificationPanelItem";
import { COLORS } from "@/utils/constants";
import { INotification } from "@/models/notificationModel";
import cx from "classnames";
import { useEffect, useState } from "react";
import { useChannel, useEvent } from "@harelpls/use-pusher";
import { useSession } from "next-auth/react";
import { EVENT_USER_NOTIFICATION } from "@/lib/pusher.common";
import { getAll, getUnread, markAllAsRead } from "./Notification.server";
import IconButton from "./IconButton";

const NotificationPanel = (props: NotificationPanelProps) => {
    const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
    const session = useSession();
    const userId = session.data?.user?.id || "Invalid";
    const channel = useChannel(`user.${userId}`);

    const [dataAll, setDataAll] = useState<WithId<INotification>[]>([]);
    const [dataUnread, setDataUnread] = useState<WithId<INotification>[]>([]);

    async function refetchData() {
        const all = await getAll();
        if (all.success) {
            setDataAll(all.data!);
        }

        const unread = await getUnread();
        if (unread.success) {
            setDataUnread(unread.data!);
        }
    }

    useEvent(channel, EVENT_USER_NOTIFICATION, () => {
        refetchData();
    });

    useEffect(() => {
        refetchData();
    }, []);

    const notifications = activeTab === "all" ? dataAll : dataUnread;

    return (
        <div className="bg-1 h-100 panel-layout-child position-relative d-flex flex-column">
            <div
                className="d-flex align-items-center py-3"
                style={{ borderBottom: "1px solid var(--clr-primary-1)" }}
            >
                <IconButton
                    onClick={() => window.history.back()}
                    style={{ display: props.showBackButton ? "block" : "none" }}
                >
                    <IoIosArrowBack fill={COLORS.PRIMARY_1} size={28} />
                </IconButton>

                <h1
                    className="font-all-star color-primary-1 m-0 p-2 px-md-3"
                    style={{ fontSize: 24 }}
                >
                    NOTIFICATIONS
                </h1>
            </div>

            <div className="col btnLine text-center m-2">
                <div className="row ">
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

            <ul className="unstyled-list h-100 overflow-auto mb-5">
                {notifications.map((n) => (
                    <NotificationPanelItem
                        key={n._id.toString()}
                        notification={n}
                    />
                ))}
            </ul>

            <form
                action={async () => {
                    await markAllAsRead();
                    refetchData();
                }}
                className="d-flex justify-content-center notification-panel-mark-read"
            >
                <button className="unstyled-button p-3">
                    Mark All As Read
                </button>
            </form>
        </div>
    );
};

export interface NotificationPanelProps {
    showBackButton?: boolean;
}

export default NotificationPanel;
