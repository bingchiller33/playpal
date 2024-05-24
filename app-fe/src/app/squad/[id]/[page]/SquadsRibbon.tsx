import Avatar from "@/components/Avatar";
import IconButton from "@/components/IconButton";
import { COLORS } from "@/utils/constants";
import { CiCirclePlus } from "react-icons/ci";

const SquadsRibbon = ({ squads }: SquadsRibbonProps) => {
    return (
        <ul className="unstyled-list d-flex flex-column align-items-center">
            {squads.map((squad) => (
                <li key={squad._id} className="m-2">
                    {squad.avatar ? (
                        <Avatar size={36} src={squad.avatar} />
                    ) : (
                        <Avatar size={36} initials={squad.name[0]} />
                    )}
                </li>
            ))}

            <li>
                <IconButton>
                    <CiCirclePlus color={COLORS.PRIMARY_1} size={32} />
                </IconButton>
            </li>
        </ul>
    );
};

export interface SquadsRibbonProps {
    squads: Squad[];
}

export interface Squad {
    name: string;
    avatar: string;
    _id: string;
}

export default SquadsRibbon;
