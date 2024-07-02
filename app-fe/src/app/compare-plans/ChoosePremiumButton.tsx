"use client";

import { Modal } from "react-bootstrap";
import styles from "./page.module.css";
import cx from "classnames";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import PremiumCard from "./PremiumCard";
import Dividers from "@/components/Dividers";
import { pay } from "./server";
import { addMonth } from "@/utils";

export interface ChoosePremiumButtonProps {
    exp?: Date;
    premiumPrice: number;
}

const ChoosePremiumButton = ({
    exp,
    premiumPrice,
}: ChoosePremiumButtonProps) => {
    const [showModal, setShowModal] = useState(false);
    const [duration, setDuration] = useState(1); // [1, 3, 12]

    function handleCloseModal() {
        setShowModal(false);
    }

    function updateDuration(newDuration: number) {
        setDuration(newDuration);
    }

    function handleCheckout() {
        pay(duration);
    }

    const from = exp || new Date();
    const to = addMonth(new Date(from), duration);
    const price = premiumPrice * duration;

    return (
        <>
            <button
                className={cx(
                    styles["plan-btn"],
                    "btn btn-primary bg-primary-1 position-absolute px-5 py-2 "
                )}
                onClick={() => setShowModal(true)}
            >
                {exp ? "Extend" : "Choose Plan"}
            </button>

            <Modal
                className="inviteMemberPopup"
                show={showModal}
                onHide={handleCloseModal}
                animation={false}
                style={{ borderRadius: "15px" }}
            >
                <div className="custom modal-content">
                    <div
                        className="modal-header"
                        style={{ position: "relative" }}
                    >
                        <h2 className=" modalHeader text-uppercase font-all-star">
                            Checkout
                        </h2>
                        <IoMdClose
                            className="closeInvitePopup"
                            onClick={handleCloseModal}
                        />
                    </div>

                    <div className="modal-body">
                        <h2>You are about to subcribe to PlayPal Premium!</h2>
                        <PremiumCard exp={exp} />

                        <p className="m-0">Duration: </p>
                        <div className="d-flex gap-2">
                            <button
                                onClick={() => updateDuration(1)}
                                className={cx({
                                    "unstyled-button text-white px-2 py-1 rounded":
                                        true,
                                    "border-primary-glow ": duration !== 1,
                                    "btn bg-primary-1": duration === 1,
                                })}
                            >
                                1 month
                            </button>
                            <button
                                onClick={() => updateDuration(3)}
                                className={cx({
                                    "unstyled-button text-white px-2 py-1 rounded":
                                        true,
                                    "border-primary-glow ": duration !== 3,
                                    "btn bg-primary-1": duration === 3,
                                })}
                            >
                                3 months
                            </button>
                            <button
                                onClick={() => updateDuration(12)}
                                className={cx({
                                    "unstyled-button text-white px-2 py-1 rounded":
                                        true,
                                    "border-primary-glow ": duration !== 12,
                                    "btn bg-primary-1": duration === 12,
                                })}
                            >
                                1 year
                            </button>
                        </div>

                        <p className="m-0 mt-2">Coupon Code: </p>
                        <div className="d-flex gap-1 mb-2">
                            <input
                                type="text"
                                className="pp-form-input p-2"
                                placeholder="Enter coupon code"
                            />
                            <button className="btn bg-primary-1 text-white">
                                Check
                            </button>
                        </div>

                        <Dividers />
                        <p>Please review your purchase: </p>
                        <div className="d-flex justify-content-between">
                            <p style={{ opacity: 0.8 }}>
                                Current subcription expiry:
                            </p>
                            <p>{exp?.toDateString() || "N/A"}</p>
                        </div>
                        <div className="d-flex justify-content-between">
                            <p style={{ opacity: 0.8 }}>
                                Purchase subcription from:
                            </p>
                            <p>{from.toDateString()}</p>
                        </div>
                        <div className="d-flex justify-content-between">
                            <p style={{ opacity: 0.8 }}>
                                Purchase subcription to:
                            </p>
                            <p>{to.toDateString()}</p>
                        </div>
                        <Dividers />
                        <div className="d-flex justify-content-between">
                            <p style={{ opacity: 0.8 }}>Price:</p>
                            <p
                                className="fw-bold color-primary-1"
                                style={{ fontSize: 50 }}
                            >
                                {price} VND
                            </p>
                        </div>

                        <button
                            className="btn bg-primary-1 text-white w-100 mt-3"
                            onClick={handleCheckout}
                        >
                            Checkout
                        </button>

                        <i
                            className="mt-1"
                            style={{ opacity: 0.7, fontSize: 10 }}
                        >
                            *All payment through Paypal are non-refundable. We
                            are not responsible for accidental purchase.
                        </i>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default ChoosePremiumButton;
