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
            'url("https://scontent.fhan3-2.fna.fbcdn.net/v/t1.15752-9/436421699_1612300562942126_2734689648388013401_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeFGhc1C5OPqArCOal9mBDFfcVbI3Nr8HopxVsjc2vweimdphGNDEw601zbnCk9IN88HfSUkECClTkoMvCcPNm6l&_nc_ohc=2VqeA9lMY0MQ7kNvgGM8OSX&_nc_ht=scontent.fhan3-2.fna&oh=03_Q7cD1QF1l9oqQ0z0zLLZgL6SM3YCZZk_O3I1hW3E32cwDxs4eg&oe=668379E8")', // Replace with your image URL
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
