'use client'
import { IAccount } from "@/models/account";
import IconLink from "./IconLink";
import Avatar from "./Avatar";
import { createInvitation, sendInvitationToSquad } from "./SquadInvitation.server";
import { toast } from "react-toastify";
import { useState } from "react";


const MemberToInvite = ({ member, inviterId, id }: MemberToInviteProp) => {

    const [isButtonDisabled, setButtonDisabled] = useState(false);
    
    console.log({isButtonDisabled})
    const disableButton = () => {
        setButtonDisabled(true);
    }

    const handleCreateInvitation = async (accountId: string) => {
        if (inviterId) {
            const newInvitation = await createInvitation({ inviterId: inviterId, accountId: accountId, squadId: id });
            toast.success("Send invitation successfully!")

            const newNotificationInvite = await sendInvitationToSquad(inviterId, accountId, id.toString());
            toast.success("Send notification invitation successfully!")

        }
    }



    return (
        <div className="d-flex flex-row mt-2" >
            <div className="">
                <IconLink href="/">
                    {member.avatar ? (
                        <Avatar size={36} src={member.avatar} />
                    ) : (
                        <Avatar size={36}
                            initials={member.username?.[0] ?? "P"}
                        />
                    )}

                </IconLink>

            </div>
            <div className=" invite-name d-flex align-items-center">
                <p>{member.username ?? "no username"}</p>
            </div>
            <form>
                <button type="button" className="btn-noBorder" onClick={() => { handleCreateInvitation(member._id), disableButton()}} disabled={isButtonDisabled}>
                    Invite
                </button>
            </form>
        </div>
    )

}

export interface MemberToInviteProp {
    member: IAccount;
    inviterId: string;
    id: String;
}

export default MemberToInvite;