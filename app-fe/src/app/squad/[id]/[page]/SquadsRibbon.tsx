import Avatar from "@/components/Avatar";
import IconButton from "@/components/IconButton";
import dbConnect from "@/lib/mongoConnect";
import { getUserActiveSquads } from "@/repositories/squadRepository";
import { COLORS } from "@/utils/constants";
import { CiCirclePlus } from "react-icons/ci";
import IconLink from "@/components/IconLink";
import { createSquad } from "./server";
import { sessionOrLogin } from "@/utils/server";

const SquadsRibbon = async ({}: SquadsRibbonProps) => {
    await dbConnect();
    const session = await sessionOrLogin();
    const mySquads = await getUserActiveSquads(session.user.id);

    return (
        <ul className="unstyled-list d-flex flex-column align-items-center p-1">
            {mySquads.map((squad) => (
                <li key={squad._id.toString()} title={squad.squadId.name}>
                    <IconLink href={`/squad/${squad.squadId._id}/chat`}>
                        {squad.squadId.img ? (
                            <Avatar size={36} src={squad.squadId.img} />
                        ) : (
                            <Avatar
                                size={36}
                                initials={squad.squadId.name?.[0] ?? "S"}
                            />
                        )}
                    </IconLink>
                </li>
            ))}

            <li title="Create squad">
                <form action={createSquad}>
                    <IconButton>
                        <CiCirclePlus
                            stroke={COLORS.PRIMARY_1}
                            fill={COLORS.PRIMARY_1}
                            color={COLORS.PRIMARY_1}
                            size={32}
                        />
                    </IconButton>
                </form>
            </li>
        </ul>
    );
};

export interface SquadsRibbonProps {}

export default SquadsRibbon;
