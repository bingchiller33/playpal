import Avatar from "@/components/Avatar";
import { COLORS } from "@/utils/constants";
import { IoIosArrowBack } from "react-icons/io";
import { IoCallOutline } from "react-icons/io5";
import { PiDotsThreeOutline } from "react-icons/pi";
import { CiBellOn } from "react-icons/ci";
const SquadHeader = () => {
    return (
        <div className="d-flex align-items-center gap-1 py-2">
            <IoIosArrowBack color={COLORS.PRIMARY_1} size={28} />
            <Avatar size={32} initials="S" />
            <h1
                className="ms-2"
                style={{ fontSize: 18, margin: 0, fontWeight: "normal" }}
            >
                Squad Header
            </h1>

            <div className="ms-auto">
                <IoCallOutline color={COLORS.PRIMARY_1} size={28} />
            </div>
            <div className="d-md-none">
                <CiBellOn color={COLORS.PRIMARY_1} size={28} />
            </div>
            <PiDotsThreeOutline color={COLORS.PRIMARY_1} size={28} />
        </div>
    );
};

export default SquadHeader;
