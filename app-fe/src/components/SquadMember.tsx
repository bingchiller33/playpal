import { NextPageProps, WithId } from "@/utils/types";
import { PiSignOutBold } from "react-icons/pi";
import TabMembers from "./TabMembers";
import TabRequest from "./TabRequest";
import Link from "next/link";
import cx from "classnames";
import { ISquadEnrollment } from "@/models/squadEnrollmentModel";
import { IAccount } from "@/models/account";
import LeaveSquadButton from "./LeaveSquadButton";
import Squads from "@/models/squadModel";
import { jsonStrip } from "@/utils";
import dbConnect from "@/lib/mongoConnect";
import Image from "next/image";

const SquadMember = async ({
    params,
    members,
    membersRecommend,
}: SquadMemberProp) => {
    const { id, page } = params;
    await dbConnect();
    const squad = jsonStrip(await Squads.findById(id).exec());
    console.log(squad);

    const squadImgUrl = squad?.img || "/images/test.jpg";
    console.log(squadImgUrl);

    let activePage;
    if (page === "request") {
        activePage = <TabRequest id={id} />;
    } else {
        activePage = (
            <TabMembers
                members={members}
                membersRecommend={membersRecommend}
                id={params.id}
            />
        );
    }

    return (
        <div className="container-fluid">
            <div>
                <a className="leave-chat-btn">
                    <PiSignOutBold />
                </a>
            </div>

            <div>
                <div className="col text-center squadChat-head">
                    <Image
                        src={squadImgUrl}
                        alt="Squad Image"
                        width={80}
                        height={80}
                        style={{ borderRadius: "50%", height: "5rem" }}
                    />
                    <h4 className="mt-3 mb-3 ">{squad?.name}</h4>
                </div>
                <div className="col btnLine text-center mb-4">
                    <div className="row">
                        <div
                            className={cx(
                                "col btnLine-members",
                                page != "request" && ["active-membersTab"]
                            )}
                        >
                            <Link href={`/squad/${id}/members`}>Members</Link>
                        </div>
                        <div
                            className={cx(
                                "col btnLine-request",
                                page === "request" && ["active-membersTab"]
                            )}
                        >
                            <Link href={`/squad/${id}/request`}>Request</Link>
                        </div>
                    </div>
                </div>
                <div>{activePage}</div>
            </div>
        </div>
    );
};

export interface SquadMemberProp {
    params: Record<string, string>;
    members: ISquadEnrollment[];
    membersRecommend: WithId<IAccount>[];
}

export default SquadMember;
