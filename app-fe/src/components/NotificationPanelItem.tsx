"use client";

import cx from "classnames";
import Link from "next/link";
import { WithId } from "@/utils/types";
import Image from "next/image";
import { INotification } from "@/models/notificationModel";
import { fmtRelDate } from "@/utils";

const NotificationPanelItem = ({
    notification,
}: NotificationPanelItemProps) => {
    return (
        <Link href={notification.href || "#"} className="text-decoration-none">
            <div
                className={cx(
                    "notification-panel-item d-flex align-items-center gap-3 py-3 py-md-4 px-2",
                    {
                        "notification-panel-item-read": notification.isRead,
                    }
                )}
            >
                <Image
                    className="rounded-circle"
                    src="/images/test.jpg"
                    alt="notification icon"
                    width={50}
                    height={50}
                />

                <div>
                    <p className="m-0">
                        {notification.title} <br />
                        {notification.content}
                    </p>

                    <p
                        className="m-0"
                        style={{
                            fontSize: 12,
                            opacity: 0.7,
                        }}
                    >
                        {fmtRelDate(
                            Date.parse(notification.createdAt as string)
                        )}
                    </p>
                </div>
            </div>
        </Link>
    );
};

export interface NotificationPanelItemProps {
    notification: WithId<INotification>;
}

export default NotificationPanelItem;
