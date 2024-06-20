import { ISquad } from "@/models/squadModel";
import { getMembers } from "@/repositories/squadRepository";
import { WithId } from "@/utils/types";
import Image from "next/image";
import Avatar from "./Avatar";
import MatchedSquadActions from "./MatchedSquadActions";
import { jsonStrip } from "@/utils";

const MatchedSquad = async (props: MatchedSquadProps) => {
    const { squad } = props;
    const members = jsonStrip(await getMembers(squad._id.toString()));
    return (
        <div className="container-fluid groupMember-request my-2">
            <div className="row  group-header">
                <div className="col-2">
                    <Image
                        alt="Squad image"
                        src={squad.img ?? "/images/test.jpg"}
                        style={{ borderRadius: "50%", height: "3rem" }}
                        width={50}
                        height={50}
                    />
                </div>
                <div className="col-8 members-name d-flex align-items-center">
                    <p>{squad.name ?? "Amazing squad"}</p>
                </div>
            </div>

            {members.map((m) => (
                <div className="row group-members" key={m._id.toString()}>
                    <div className="col-2">
                        <Avatar
                            size={50}
                            src={m.accountId.avatar}
                            initials={m.accountId.username?.[0] ?? "P"}
                        />
                    </div>
                    <div className="col-8 members-name d-flex align-items-center">
                        <p>{m.accountId.username ?? "Player"}</p>
                    </div>
                </div>
            ))}

            <MatchedSquadActions squad={squad} curSquadId={props.curSquadId} />
        </div>
    );
};

export interface MatchedSquadProps {
    squad: WithId<ISquad> & { matchId: string };
    curSquadId: string;
}

export default MatchedSquad;
