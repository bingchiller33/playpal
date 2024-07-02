import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { COLORS } from "@/utils/constants";
import { Container } from "react-bootstrap";
import { SiTicktick } from "react-icons/si";
import styles from "./page.module.css";
import cx from "classnames";
import ChoosePremiumButton from "./ChoosePremiumButton";

const PremiumCard = ({ exp, premiumPrice }: PremiumCardProps) => {
    return (
        <div
            className="bg-1 border-primary-glow rounded p-3 p-lg-4 py-4 m-1  my-3 position-relative"
            style={{ height: 500 }}
        >
            <div
                className={cx(
                    styles["recommended-tag"],
                    "bg-primary-1 border-primary-glow p-2 rounded w-100 position-absolute"
                )}
            >
                <p className="text-center">Recommended</p>
            </div>

            <p className="">Premium</p>
            <h2 className="color-primary-1 fw-bold" style={{ fontSize: 32 }}>
                19,000 VND / month
            </h2>

            <ul className="list-unstyled">
                <li className="d-flex align-items-center gap-2 my-3">
                    <SiTicktick fill={COLORS.PRIMARY_1} />
                    Find your dream squad faster!
                </li>
                <li className="d-flex align-items-center gap-2 my-3">
                    <SiTicktick fill={COLORS.PRIMARY_1} />
                    Join unlimited squads.
                </li>
                <li className="d-flex align-items-center gap-2 my-3">
                    <SiTicktick fill={COLORS.PRIMARY_1} />
                    No ads.
                </li>
                <li className="d-flex align-items-center gap-2 my-3">
                    <SiTicktick fill={COLORS.PRIMARY_1} />
                    Share photos with your squads.
                </li>
                <li className="d-flex align-items-center gap-2 my-3">
                    <SiTicktick fill={COLORS.PRIMARY_1} />
                    Advanced player stats filtering.
                </li>
            </ul>

            <ChoosePremiumButton exp={exp} premiumPrice={premiumPrice} />
        </div>
    );
};

export default PremiumCard;

export interface PremiumCardProps {
    exp?: Date;
    premiumPrice: number;
}
