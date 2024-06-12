"use client";

import Image from "next/image";
import Link from "next/link";
import IconButton from "./IconButton";
import { IoCloseCircleOutline } from "react-icons/io5";
import { COLORS } from "@/utils/constants";
import { SendNotificationOptions } from "@/lib/pusher.server";

const ToastNotification = (props: ToastNotificationProps) => {
    return (
        <div className="position-relative toast-notification-parent">
            <Link href={props.href || "#"} className="text-decoration-none">
                <div className="d-flex align-items-center toast-notification border-primary-glow gap-3 py-3 py-md-4">
                    <Image
                        className="rounded-circle"
                        src={props.img || "/assets/images/notification.svg"}
                        alt="notification icon"
                        width={50}
                        height={50}
                    />

                    <div>
                        <p className="m-0">
                            {props.title} <br />
                            {props.content}
                        </p>
                    </div>
                </div>
            </Link>

            <IconButton
                className="position-absolute toast-close-btn"
                onClick={props.onClose}
            >
                <IoCloseCircleOutline stroke={COLORS.PRIMARY_1} size={24} />
            </IconButton>
        </div>
    );
};

export interface ToastNotificationProps extends SendNotificationOptions {
    onClose: () => void;
}

export default ToastNotification;
