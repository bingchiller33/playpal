"use client";

import { PiSignOutBold } from "react-icons/pi";
import IconButton from "./IconButton";
import { COLORS } from "@/utils/constants";
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { IoMdClose } from "react-icons/io";
import { MdOutlineStar } from "react-icons/md";
import { leaveSquad } from "./LeaveSquadButton.server";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const LeaveSquadButton = (props: LeaveSquadButtonProps) => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isConfirm, setIsConfirm] = useState(false);
    const [rating, setRating] = useState(3);

    const starVal = [];
    for (let i = 1; i <= rating; i++) {
        starVal.push(
            <MdOutlineStar
                style={{ cursor: "pointer" }}
                key={i}
                onClick={() => setRating(i)}
                fill="gold"
                size={50}
            />
        );
    }

    for (let i = rating + 1; i <= 5; i++) {
        starVal.push(
            <MdOutlineStar
                style={{ cursor: "pointer" }}
                key={i}
                onClick={() => setRating(i)}
                fill="grey"
                size={50}
            />
        );
    }

    function handleClose() {
        setIsOpen(false);
        setIsConfirm(false);
    }

    async function handleLeaveSquad() {
        const res = await leaveSquad(props.id, rating);
        if (res.success) {
            toast.success("You have left the squad!");
            router.push("/");
        } else {
            toast.error(res.msg);
        }
    }

    return (
        <div>
            <IconButton
                className="leave-chat-btn"
                onClick={() => setIsOpen(true)}
            >
                <PiSignOutBold fill={COLORS.PRIMARY_1} />
            </IconButton>

            <Modal
                size="lg"
                className="inviteMemberPopup"
                show={isOpen}
                onHide={handleClose}
                animation={false}
                style={{ borderRadius: "15px" }}
            >
                <div className="custom modal-content">
                    <div
                        className="modal-header"
                        style={{ position: "relative" }}
                    >
                        <h2 className=" modalHeader text-uppercase font-all-star">
                            Leave Squad
                        </h2>
                        <IoMdClose
                            className="closeInvitePopup"
                            onClick={handleClose}
                        />
                    </div>

                    <div className="modal-body">
                        <div
                            style={{
                                display: isConfirm ? "none" : "block",
                            }}
                        >
                            <h2>
                                You are about to leave this squad! Are you sure?
                            </h2>

                            <div className="d-flex justify-content-end gap-2">
                                <Button
                                    variant="outline-success"
                                    onClick={handleClose}
                                >
                                    No
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={() => setIsConfirm(true)}
                                >
                                    Yes
                                </Button>
                            </div>
                        </div>

                        <div
                            style={{
                                display: !isConfirm ? "none" : "block",
                            }}
                        >
                            <h2>
                                Before you go, please rate your experience with
                                your squad:
                            </h2>
                            <div className="d-flex justify-content-center gap-2">
                                {starVal}
                            </div>
                            <div className="d-flex justify-content-end gap-2">
                                <Button
                                    variant="outline-success"
                                    onClick={handleClose}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={handleLeaveSquad}
                                >
                                    Leave Squad!
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export interface LeaveSquadButtonProps {
    id: string;
}

export default LeaveSquadButton;
