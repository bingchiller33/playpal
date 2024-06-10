"use client";
import { CiBellOn } from "react-icons/ci";
import IconButton from "./IconButton";
import { COLORS } from "@/utils/constants";
import NotificationPanel from "./NotificationPanel";
import { useState } from "react";
import cx from "classnames";
import IconLink from "./IconLink";

const NotificationIcon = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="position-relative">
            <IconButton className="d-none d-md-block">
                <CiBellOn
                    fill={COLORS.PRIMARY_1}
                    size={28}
                    onClick={() => setIsOpen((v) => !v)}
                />
            </IconButton>

            <IconLink href="/notifications" className="d-block d-md-none">
                <CiBellOn
                    fill={COLORS.PRIMARY_1}
                    size={28}
                    onClick={() => setIsOpen((v) => !v)}
                />
            </IconLink>

            <div
                className="position-absolute popup-notification-panel  d-none d-md-block"
                style={{ top: "100%", right: 0 }}
            >
                <div
                    style={{ display: isOpen ? "block" : "none" }}
                    className="border-primary-glow"
                >
                    <NotificationPanel />
                </div>
            </div>
        </div>
    );
};

export default NotificationIcon;
