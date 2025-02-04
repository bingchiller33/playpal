import IconButton from "@/components/IconButton";
import IconLink from "@/components/IconLink";
import { COLORS } from "@/utils/constants";
import { CiBellOn, CiCirclePlus } from "react-icons/ci";
import { IoIosArrowBack } from "react-icons/io";
import SquadItem from "./SquadItem";
import dbConnect from "@/lib/mongoConnect";
import { getUserActiveSquads } from "@/repositories/squadRepository";
import { sessionOrLogin } from "@/utils/server";
import { createSquad } from "@/server/squad.server";
import NotificationIcon from "@/components/NotificationIcon";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "My Squads | PlayPal",
};



const MySquadPage = async () => {
    await dbConnect();
    const session = await sessionOrLogin();
    const squads = await getUserActiveSquads(session.user.id);

    return (
        <div className="bg-1 h-100 panel-layout-child">
            <div className="d-flex align-items-center py-3">
                <IconLink href="/">
                    <IoIosArrowBack fill={COLORS.PRIMARY_1} size={28} />
                </IconLink>

                <h1
                    className="font-all-star color-primary-1 m-0"
                    style={{ fontSize: 24 }}
                >
                    MY SQUADS
                </h1>

                <div className="ms-auto">
                    <NotificationIcon />
                </div>
                <form action={createSquad}>
                    <IconButton>
                        <CiCirclePlus fill={COLORS.PRIMARY_1} size={32} />
                    </IconButton>
                </form>
            </div>

            <ul className="unstyled-list">
                {squads.map((squad) => (
                    <SquadItem
                        key={squad._id.toString()}
                        squad={squad.squadId}
                    />
                ))}
            </ul>
        </div>
    );
};

export default MySquadPage;
