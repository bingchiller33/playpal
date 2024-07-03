import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { COLORS } from "@/utils/constants";
import { Container } from "react-bootstrap";
import { SiTicktick } from "react-icons/si";
import styles from "./page.module.css";
import cx from "classnames";
import { dbUserFromSession } from "@/utils/server";
import ChoosePremiumButton from "./ChoosePremiumButton";
import PremiumCard from "./PremiumCard";
import dbConnect from "@/lib/mongoConnect";
import { getFutPremiumExpiry } from "@/repositories/premiumRepository";
import { getMasterData } from "@/repositories/masterDataRepository";

const HEIGHT = 500;

const ComparePlanPage = async () => {
    await dbConnect();
    const user = await dbUserFromSession();
    const exp = user
        ? await getFutPremiumExpiry(user._id.toString())
        : undefined;
    const price = (await getMasterData()).premiumPrice;

    return (
        <div className={cx(styles["main"])}>
            <Header />
            <Container>
                <h1 className="font-all-star color-primary-1 text-center mt-5">
                    CHOOSE YOUR PLANS
                </h1>
                <p className="text-center mt-2">
                    Choose the best plan for you. Thank you for supporting
                    PlayPal!
                </p>

                <div
                    className={cx(
                        styles["section-plan"],
                        "d-flex flex-wrap my-5"
                    )}
                >
                    <div
                        className="bg-1 border-primary-glow rounded p-3 p-lg-4 py-4 m-1 my-3 position-relative"
                        style={{ height: HEIGHT }}
                    >
                        <p className="">Starter</p>
                        <h2
                            className="color-primary-1 fw-bold"
                            style={{ fontSize: 32 }}
                        >
                            FREE
                        </h2>

                        <ul className="list-unstyled">
                            <li className="d-flex align-items-center gap-2  my-3">
                                <SiTicktick fill={COLORS.PRIMARY_1} />
                                Join up to 3 different squads.
                            </li>
                            <li className="d-flex align-items-center gap-2 my-3">
                                <SiTicktick fill={COLORS.PRIMARY_1} />
                                Chat with your squad members.
                            </li>
                            <li className="d-flex align-items-center gap-2 my-3">
                                <SiTicktick fill={COLORS.PRIMARY_1} />
                                Basic player stats filtering.
                            </li>
                        </ul>

                        <button
                            disabled
                            className={cx(
                                styles["plan-btn"],
                                "btn btn-primary bg-primary-1 position-absolute px-5 py-2 "
                            )}
                        >
                            {exp ? "Higher plan active" : "Current Plan"}
                        </button>
                    </div>

                    <PremiumCard exp={exp} premiumPrice={price} />
                </div>
            </Container>
            <Footer />
        </div>
    );
};

export default ComparePlanPage;
