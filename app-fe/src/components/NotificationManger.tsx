"use client";
import { useUserNotification } from "@/lib/usePusherEvents";
import ToastNotification from "./NotificationToast";
import { useState } from "react";

const NotificationManager = (props: NotificationManagerProps) => {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [id, setId] = useState<number>(0);

    useUserNotification(props.userId, false, (cb) => {
        const old = notifications.find((n) => n.tag === cb.tag && n.tag);
        if (old) {
            clearTimeout(old.task);
            Object.assign(old, cb);
            setTimeout(() => {
                setNotifications((prev) => prev.filter((n) => n.id !== old.id));
            }, 10000);
            setNotifications((prev) => [...prev]);
        } else {
            setId(id + 1);
            const task = setTimeout(() => {
                setNotifications((prev) => prev.filter((n) => n.id !== id));
            }, 10000);

            setNotifications((prev) => [...prev, { id, ...cb, task }]);
        }
    });

    return (
        <div className="toast-manager">
            {notifications.map((n) => (
                <ToastNotification
                    key={n.id}
                    {...n}
                    onClose={() =>
                        setNotifications((prev) =>
                            prev.filter((ni) => ni.id !== n.id)
                        )
                    }
                />
            ))}
        </div>
    );
};

export interface NotificationManagerProps {
    userId: string;
}

export default NotificationManager;
