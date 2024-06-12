import { NextPageProps } from "@/utils/types";
import { PiSignOutBold } from "react-icons/pi";
import TabMembers from "./TabMembers";
import TabRequest from "./TabRequest";
import Link from "next/link";
import cx from "classnames";
import { ISquadEnrollment } from "@/models/squadEnrollmentModel";
import { IAccount } from "@/models/account";

const SquadMember = ({ params, members, membersRecommend }: SquadMemberProp) => {

    const { id, page } = params;

    let activePage;
    if (page === "request") {
        activePage = <TabRequest id={id} />;
    } else {
        activePage = <TabMembers members={members}  membersRecommend={membersRecommend} id={params.id}/>;
    }

    return (
        <div className="container-fluid" >
            <div>
                <a className="leave-chat-btn">
                    <PiSignOutBold />
                </a>
            </div>

            <div >
                <div className='col text-center squadChat-head'>
                    <img
                        src="/images/test.jpg"
                        style={{ borderRadius: "50%", height: "5rem" }}
                    />
                    <h4 className='mt-3 mb-3 '>We bare bears</h4>
                </div>
                <div className="col btnLine text-center mb-4">
                    <div className="row">
                        <div className={cx("col btnLine-members",
                            page != "request" && ["active-membersTab"]
                        )}
                        >
                            <Link href={`/squad/${id}/members`}>Members</Link>
                            </div>
                        <div className={cx("col btnLine-request",
                            page === "request" && ["active-membersTab"]
                        )}>
                            <Link href={`/squad/${id}/request`}>Request</Link>
                            </div>
                    </div>
                </div>
               <div>{activePage}</div>

            </div>
            <div></div>

        </div>
    );
};

export interface SquadMemberProp{
    params: Record<string, string>;
    members: ISquadEnrollment[];
    membersRecommend: IAccount[];
}

export default SquadMember;
