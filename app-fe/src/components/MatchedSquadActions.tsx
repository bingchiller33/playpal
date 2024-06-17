"use client";

import { ISquad } from "@/models/squadModel";
import { WithId } from "@/utils/types";
import { acceptMatch, declideMatch } from "./MatchedSquad.server";
import { reportToast } from "@/utils/client";
import { Button, Modal } from "react-bootstrap";
import { IoMdClose } from "react-icons/io";
import { useState } from "react";

const MatchedSquadActions = (props: MatchedSquadActionsProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="row group-btnCheck text-center">
            <p>Do you want to join this squad?</p>
            <div className="col-6 ">
                <button
                    className="btn-bordered"
                    onClick={async () => {
                        const res = await declideMatch(
                            props.squad._id.toString(),
                            props.squad.matchId
                        );

                        reportToast(res, "Decline success!");
                    }}
                >
                    No
                </button>
            </div>
            <div className="col-6">
                <button
                    className="btn-noBorder"
                    onClick={() => setIsOpen(true)}
                >
                    Yes
                </button>
            </div>

            <Modal
                size="lg"
                className="inviteMemberPopup"
                show={isOpen}
                onHide={() => setIsOpen(false)}
                animation={false}
                style={{ borderRadius: "15px" }}
            >
                <div className="custom modal-content">
                    <div
                        className="modal-header"
                        style={{ position: "relative" }}
                    >
                        <h2 className=" modalHeader text-uppercase font-all-star">
                            MERGE SQUAD
                        </h2>
                        <IoMdClose
                            className="closeInvitePopup"
                            onClick={() => setIsOpen(false)}
                        />
                    </div>

                    <div className="modal-body">
                        <div>
                            <h2>
                                You and all of your squad members will join this
                                squad. Are you sure?
                            </h2>

                            <div className="d-flex justify-content-end gap-2">
                                <Button
                                    variant="outline-success"
                                    onClick={() => setIsOpen(false)}
                                >
                                    No
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={async () => {
                                        const res = await acceptMatch(
                                            props.curSquadId,
                                            props.squad.matchId
                                        );

                                        reportToast(res, "Merge success!");
                                    }}
                                >
                                    Yes
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export interface MatchedSquadActionsProps {
    squad: WithId<ISquad> & { matchId: string };
    curSquadId: string;
}

export default MatchedSquadActions;
