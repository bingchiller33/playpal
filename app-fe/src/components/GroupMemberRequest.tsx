
const GroupMemberRequest = () => {
    return (
        <div className="container-fluid groupMember-request">
            <div className="row  group-header">
                <div className="col-2">
                    <img
                        src="/images/test.jpg"
                        style={{ borderRadius: "50%", height: "3rem" }}
                    />
                </div>
                <div className="col-8 members-name d-flex align-items-center">
                    <p>Adventure time</p>
                </div>
                {/* <div className=" mt-2 members-line"></div> */}
            </div>


            <div className="row group-members">
                <div className="col-2">
                    <img
                        src="/images/test.jpg"
                        style={{ borderRadius: "50%", height: "3rem" }}
                    />
                </div>
                <div className="col-8 members-name d-flex align-items-center">
                    <p>PanPan</p>
                </div>
            </div>
            <div className="row group-members">
                <div className="col-2">
                    <img
                        src="/images/test.jpg"
                        style={{ borderRadius: "50%", height: "3rem" }}
                    />
                </div>
                <div className="col-8 members-name d-flex align-items-center">
                    <p>PanPan</p>
                </div>
            </div>

            <div className="row group-btnCheck text-center">
                <div className="col-6 ">
                    <button className="btn-bordered">
                        No
                    </button>
                </div>
                <div className="col-6">
                    <button className="btn-noBorder">
                        Yes
                    </button>
                </div>
            </div>

        </div>
    );
};

export interface RequestProps {
    id: string;
}

export default GroupMemberRequest;
