import { NextPageProps } from "@/utils/types";
import { PiSignOutBold } from "react-icons/pi";
import TabMembers from "./TabMembers";
import TabRequest from "./TabRequest";

const SquadMember = ({ params }: NextPageProps) => {

    const { id, page } = params;

    let activePage;
    if (page === "request") {
        activePage = <TabRequest id={id} />;
    } else {
        activePage = <TabMembers id={id} />;
    }

    return (
        <div className="container-fluid">
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
                <div className="col btnLine text-center">
                    <div className="row">
                        <div className="col btnLine-members"><a>Members</a></div>
                        <div className="col btnLine-request"><a>Request</a></div>
                    </div>

                </div>
            </div>
            <div></div>

        </div>
    );
};

export default SquadMember;
