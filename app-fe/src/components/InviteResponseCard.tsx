import { ISquadInvitation } from "@/models/squadInvitation";
import { Container } from "react-bootstrap";
import Avatar from "./Avatar";
import IconLink from "./IconLink";
import { acceptInvite, declineInvite } from "./SquadInvitation.server";
import { WithId } from "@/utils/types";

const InviteResponseCard = async ({ inv }: InviteResponseCardProps) => {
    const img = inv.squadId.img;
    const name = inv.squadId.name ?? "Unknwon squad";
    const invter = inv.inviterId.username ?? "Unknown player";
    const decline = declineInvite.bind(null, inv._id.toString());
    const accept = acceptInvite.bind(null, inv._id.toString());

    return (
        <Container className="">
            <div className="receiveInviteToSquad">
                <div className="d-flex flex-row ">
                    <div className="">
                        <IconLink href="/">
                            {img ? (
                                <Avatar size={50} src={img} />
                            ) : (
                                <Avatar
                                    size={50}
                                    initials={inv.squadId.name?.[0] ?? "P"}
                                />
                            )}
                        </IconLink>
                    </div>
                    <div className="receiveInvite">
                        <div className="receiveInvite-text">
                            <p className="text-overflow-ellipsis">
                                <span className="fw-bolder">{invter}</span>{" "}
                                invites you to join the{" "}
                                <span className="fw-bolder">{name} </span>{" "}
                                squad.
                            </p>
                            <p>Do you want to join?</p>
                        </div>
                    </div>
                </div>
                <div className="d-flex flex-row justify-content-end receiveInvite-button">
                    <form action={decline}>
                        <button className="btn-bordered">Decline</button>
                    </form>
                    <form action={accept}>
                        <button className="btn-noBorder">Accept</button>
                    </form>
                </div>
            </div>
        </Container>
    );
};

export interface InviteResponseCardProps {
    inv: WithId<ISquadInvitation>;
    squadsInvitationId?: string;
}

export default InviteResponseCard;
