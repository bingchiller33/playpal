"use client";

import Image from "next/image";
import Link from "next/link";
import IconButton from "./IconButton";
import { IoCloseCircleOutline } from "react-icons/io5";
import { COLORS } from "@/utils/constants";
import { SendNotificationOptions } from "@/lib/pusher.server";

const ToastNotification = (props: ToastNotificationProps) => {
    return (
        <Link href={props.href || "#"} className="text-decoration-none">
            <div className="d-flex align-items-center position-relative toast-notification border-primary-glow gap-3 py-3 py-md-4">
                <Image
                    className="rounded-circle"
                    src="/images/test.jpg"
                    alt="notification icon"
                    width={50}
                    height={50}
                />

                <IconButton
                    className="position-absolute toast-close-btn"
                    onClick={props.onClose}
                >
                    <IoCloseCircleOutline stroke={COLORS.PRIMARY_1} size={24} />
                </IconButton>

                <div>
                    <p className="m-0">
                        {props.title} <br />
                        {props.content}
                    </p>
                </div>
            </div>
        </Link>
    );
};

export interface ToastNotificationProps extends SendNotificationOptions {
    onClose: () => void;
}

export default ToastNotification;
