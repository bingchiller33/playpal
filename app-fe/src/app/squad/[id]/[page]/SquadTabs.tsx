import { COLORS } from "@/utils/constants";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Col, Row } from "react-bootstrap";
import { CiFilter } from "react-icons/ci";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { TbUsersGroup } from "react-icons/tb";
import styles from "./page.module.css";
import cx from "classnames";
const SquadTabs = ({ id, active }: SquadTabsProps) => {
    return (
        <Row
            className="align-items-center "
            style={{
                borderTop: "1px solid var(--clr-primary-1)",
                background: "var(--clr-background-1)",
            }}
        >
            <Col
                className={cx(
                    "d-flex align-items-center justify-content-center",
                    active === "filters" && styles["tab-active"]
                )}
            >
                <Link
                    href={`/squad/${id}/filters`}
                    className="unstyled-button p-2 w-100"
                >
                    <div className="d-flex flex-column align-items-center ">
                        <CiFilter color={COLORS.PRIMARY_1} />
                        <span style={{ fontSize: 8 }}>Filters</span>
                    </div>
                </Link>
            </Col>
            <Col
                className={cx(
                    "d-flex align-items-center justify-content-center",
                    active === "chat" && styles["tab-active"]
                )}
            >
                <Link
                    href={`/squad/${id}/chat`}
                    className="unstyled-button p-2  w-100"
                >
                    <div className="d-flex flex-column align-items-center">
                        <IoChatboxEllipsesOutline color={COLORS.PRIMARY_1} />
                        <span style={{ fontSize: 8 }}>Chat</span>
                    </div>
                </Link>
            </Col>
            <Col
                className={cx(
                    "d-flex align-items-center justify-content-center",
                    active === "members" && styles["tab-active"]
                )}
            >
                <Link
                    href={`/squad/${id}/members`}
                    className="unstyled-button p-2 w-100"
                >
                    <div className="d-flex flex-column align-items-center ">
                        <TbUsersGroup color={COLORS.PRIMARY_1} />
                        <span style={{ fontSize: 8 }}>Members</span>
                    </div>
                </Link>
            </Col>
        </Row>
    );
};

export interface SquadTabsProps {
    id: string;
    active: "filters" | "chat" | "members";
}

export default SquadTabs;
