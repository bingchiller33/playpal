import Footer from "@/components/Footer";
import Header from "@/components/Header";
import styles from "./page.module.css";
import cx from "classnames";
import Link from "next/link";

const PremiumUpgradeSuccessPage = () => {
    return (
        <div className="d-flex flex-column h-100">
            <Header />
            <main
                className={cx(
                    styles["main"],
                    "flex-grow h-100 d-flex align-items-center justify-content-center"
                )}
            >
                <div className="bg-1 border-primary-glow my-5 mx-2 p-5">
                    <h1
                        className="font-all-star color-primary-1 text-center mb-5"
                        style={{ fontSize: 50 }}
                    >
                        PlayPal Premium Activated
                    </h1>
                    <p className="text-center mt-3 mb-5">
                        Your PlayPal Premium Subcription is now Active. Have fun
                        with your squad and thank you for supporting PlayPal!
                    </p>
                    <div className="d-flex justify-content-center">
                        <Link
                            href="/"
                            className={cx(
                                styles["btn"],
                                "btn btn-primary bg-primary-1 px-3 py-2 "
                            )}
                        >
                            Return to Homepage!
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PremiumUpgradeSuccessPage;
