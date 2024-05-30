import { NextPageProps } from "@/utils/types";
import { PiSignOutBold } from "react-icons/pi";

const SquadMember = ({ params }: NextPageProps) => {
    const { id, page } = params;
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


                </div>
            </div>
            <div></div>
            <h1>Edit at src/SquadMember.tsx </h1>
            <p>Squad id: {id}</p>
        </div>
    );
};

export default SquadMember;
