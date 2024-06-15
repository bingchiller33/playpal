"use client";
import { IAccount } from "@/models/account";
import IconLink from "./IconLink";
import Avatar from "./Avatar";
import {
    createInvitation,
    getInvitationToSquad,
} from "./SquadInvitation.server";
import { toast } from "react-toastify";
import { useState } from "react";
import { WithId } from "@/utils/types";

const MemberToInvite = ({ member, id }: MemberToInviteProp) => {
    const [isButtonDisabled, setButtonDisabled] = useState(false);
    const handleInvite = async (member: WithId<IAccount>) => {
        const invitation = await createInvitation(id, member._id.toString());
        if (invitation.success) {
            toast.success("Send invitation successfully!");
            setButtonDisabled(true);
        } else {
            toast.error(invitation.msg);
        }
    };

    return (
        <div className="d-flex flex-row mt-2">
            <div className="">
                <IconLink href="/">
                    {member.avatar ? (
                        <Avatar size={36} src={member.avatar} />
                    ) : (
                        <Avatar
                            size={36}
                            initials={member.username?.[0] ?? "P"}
                        />
                    )}
                </IconLink>
            </div>
            <div className=" invite-name d-flex align-items-center">
                <p>{member.username ?? "no username"}</p>
            </div>
            <form>
                <button
                    type="button"
                    className="btn-noBorder"
                    onClick={() => handleInvite(member)}
                    disabled={isButtonDisabled}
                >
                    Invite
                </button>
            </form>
        </div>
    );
};

export interface MemberToInviteProp {
    member: WithId<IAccount>;
    inviterId: string;
    id: string;
}

export default MemberToInvite;
