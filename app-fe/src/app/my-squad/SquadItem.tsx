import Avatar from "@/components/Avatar";
import cx from "classnames";
import styles from "./page.module.css";
import Link from "next/link";
import { WithId } from "@/utils/types";
import { ISquad } from "@/models/squadModel";
import IconLink from "@/components/IconLink";

const SquadItem = ({ squad }: SquadItemProps) => {
    return (
        <Link
            href={`/squad/${squad._id}/chat`}
            className="text-decoration-none"
        >
            <li
                className={cx(
                    styles["list-item"],
                    "d-flex px-3 py-3 gap-3 align-items-center"
                )}
            >
                {squad.img ? (
                    <Avatar size={36} src={squad.img} />
                ) : (
                    <Avatar size={36} initials={squad.name?.[0] ?? "S"} />
                )}
                <div>
                    <h4 className="m-0">{squad.name || "Untited Squad"}</h4>
                    <p style={{ opacity: 0.7, fontSize: 12 }} className="m-0">
                        TODO: Latest updates
                    </p>
                </div>
            </li>
        </Link>
    );
};

export interface SquadItemProps {
    squad: WithId<ISquad>;
}

export default SquadItem;
