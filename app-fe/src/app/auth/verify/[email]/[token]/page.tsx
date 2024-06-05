import Footer from "@/components/Footer";
import { COLORS } from "@/utils/constants";
import Header from "@/components/Header";
import { NextPageProps } from "@/utils/types";
import dbConnect from "@/lib/mongoConnect";
import Account from "@/models/account";
import styles from "./page.module.css";
import cx from "classnames";
import { FaRegCircleCheck, FaRegCircleXmark } from "react-icons/fa6";
export default async function verify({ params }: NextPageProps) {
  await dbConnect();
  const doc = await Account.findOne({ token: params.token }).exec();
  if (doc) {
    doc.verified = 1;
    doc.token = "";
    doc.save();
  }

  return (
    <main>
      <Header />
      <div className="container-fluid"
        style={{
          backgroundImage:
            'url("/assets/images/Moodboard.png")', // Replace with your image URL
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "700px"
        }}
      >
        <div className={styles.messageContainer}>
          {doc ? (
            <div className={cx(styles.messagebox, styles.success)}>
              <FaRegCircleCheck color={COLORS.PRIMARY_1} size={100} />
              <h2 style={{ color: "#ED154C" }}>Congratulation</h2>
              <p>Verification successful! Your account has been verified.</p>
              <button className={styles.button}>
                <a href="/auth/login" className={styles.link}>
                  Continue to login page
                </a>
              </button>
            </div>
          ) : (
            <div className={cx(styles.messagebox, styles.error)}>
              <FaRegCircleXmark size={100} />
              <h2 style={{ color: "#ED154C" }}>Not Congratulation</h2>
              <p>Verification failed. The link is invalid or expired.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
