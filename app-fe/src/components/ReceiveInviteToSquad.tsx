"use client"
import Account from "@/models/account";
import { ISquadInvitation } from "@/models/squadInvitation";
import Squads from "@/models/squadModel";
import { jsonStrip } from "@/utils";
import { Container } from "react-bootstrap";
import Avatar from "./Avatar";
import IconLink from "./IconLink";
import { AnswerInvitationToJoinTheSquad } from "@/repositories/squadRepository";
import { toast } from "react-toastify";
import dbConnect from "@/lib/mongoConnect";


const ReceiveInviteToSquad = async ({ inv, squadsInvitationId }: InvitationRequest) => {
    await dbConnect();
    const getAccountInfo = async (accountId: String) => {
        const acc = jsonStrip(await Account.findById(accountId));
        return acc;
    }

    const handleAnswer = async (status: boolean) => {
        const answer =  await AnswerInvitationToJoinTheSquad(inv, status, squadInfo?.name ?? "no name", acc?.username ?? "no name");
        toast.success("Answer invitation successfully!")
    }

    const squadInfo = jsonStrip(await Squads.findById(inv.squadId));
    const inviter = await getAccountInfo(inv.inviterId);
    const acc = await getAccountInfo(inv.accountId);
    console.log({inv})

    return (
        <Container className="">
            <div className="receiveInviteToSquad">
                <div className="d-flex flex-row ">
                    <div className="">
                        <IconLink href="/">
                            {
                                squadInfo?.img ? (
                                    <Avatar size={50} src={squadInfo.img} />
                                )
                                    : (
                                        <Avatar size={50} initials={squadInfo?.name?.[0] ?? "P"} />
                                    )
                            }
                        </IconLink>
                    </div>
                    <div className="receiveInvite">
                        <div className="receiveInvite-text">
                            <p><span className="fw-bolder">{inviter?.username ?? "no username"} </span> invites you to join the <span className="fw-bolder">{squadInfo?.name?.[0] ?? "No name"} </span>  squad.</p>
                            <p>Do you want to join?</p>
                        </div>
                    </div>
                </div>
s
                <div className="d-flex flex-row justify-content-end receiveInvite-button">
                    <div>
                        <button className="btn-bordered" onClick={() => handleAnswer(false)}>
                            No
                        </button>
                    </div>
                    <div>
                        <button className="btn-noBorder" onClick={() => handleAnswer(true)}>
                            Yes
                        </button>
                    </div>
                </div>
            </div>
        </Container>
    );

}

export interface InvitationRequest {
    inv: ISquadInvitation;
    squadsInvitationId?: string;
}



export default ReceiveInviteToSquad;