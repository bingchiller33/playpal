import Avatar from "@/components/Avatar";
import { COLORS } from "@/utils/constants";
import { IoIosArrowBack } from "react-icons/io";
import { IoCallOutline } from "react-icons/io5";
import { PiDotsThreeOutline } from "react-icons/pi";
import { CiBellOn } from "react-icons/ci";
import IconLink from "@/components/IconLink";
import IconButton from "@/components/IconButton";
const SquadHeader = () => {
    return (
        <div className="d-flex align-items-center gap-1 py-2">
            <IconLink href="/" className="d-none d-md-block">
                <IoIosArrowBack fill={COLORS.PRIMARY_1} size={28} />
            </IconLink>
            <IconLink href="/my-squad" className="d-block d-md-none">
                <IoIosArrowBack fill={COLORS.PRIMARY_1} size={28} />
            </IconLink>
            <Avatar size={32} initials="S" />
            <h1
                className="ms-2"
                style={{ fontSize: 18, margin: 0, fontWeight: "normal" }}
            >
                Squad Header
            </h1>

            <div className="ms-auto">
                <IconButton>
                    <IoCallOutline stroke={COLORS.PRIMARY_1} size={28} />
                </IconButton>
            </div>
            <div className="d-md-none">
                <IconButton>
                    <CiBellOn fill={COLORS.PRIMARY_1} size={28} />
                </IconButton>
            </div>
            <IconButton className="me-2">
                <PiDotsThreeOutline fill={COLORS.PRIMARY_1} size={28} />
            </IconButton>
        </div>
    );
};

export default SquadHeader;
