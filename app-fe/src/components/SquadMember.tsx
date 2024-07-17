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
import Avatar from "./Avatar";

const SquadMember = async ({
    params,
    members,
    membersRecommend,
}: SquadMemberProp) => {
    const { id, page } = params;
    await dbConnect();
    const squad = jsonStrip(await Squads.findById(id).exec());
    const squadImgUrl = squad?.img || "/images/test.jpg";

    let activePage;
    if (page === "request") {
        activePage = <TabRequest id={id} />;
    } else {
        activePage = (
            <TabMembers
                members={members}
                membersRecommend={membersRecommend}
                leader={squad?.leader.toString() || ""}
                id={params.id}
            />
        );
    }

    return (
        <div className="container-fluid">
            <div>
                <LeaveSquadButton id={id} />
            </div>

            <div>
                <div className="col text-center squadChat-head">
                    <div className="d-flex justify-content-center">
                        <Avatar
                            src={squad?.img}
                            initials={squad?.name?.[0] || "S"}
                            size={80}
                        />
                    </div>

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
