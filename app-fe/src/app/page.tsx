import Image from "next/image";
import styles from "./page.module.css";
import Button from "react-bootstrap/Button";
import dbConnect from "@/lib/mongoConnect";
import Aaas from "@/models/aaaModel";
import { create, createSquad, send, sendTag, weight } from "./server";
import { Button as B2r } from "primereact/button";
import Dropdown from "@/components/Dropdown";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { MdOutlinePeople } from "react-icons/md";
import { IoGameController } from "react-icons/io5";
import { RxCountdownTimer } from "react-icons/rx";
import { LuSword, LuSwords } from "react-icons/lu";
import { COLORS } from "@/utils/constants";
import { CiClock2 } from "react-icons/ci";
import { TbSword } from "react-icons/tb";
import { PiPlugsConnectedFill, PiSwordFill } from "react-icons/pi";
import { HiOutlineChatAlt2 } from "react-icons/hi";
import { HiChatBubbleLeftRight, HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { GrConnect } from "react-icons/gr";
import { FaGamepad } from "react-icons/fa";

export default async function Home() {
    await dbConnect();

    const doc = await Aaas.find({}).exec();
    const names = doc.map((aaa) => aaa.name);

    return (
        <main>
            <Header />
            <div className="landing">
                <div className="row landing-1">
                    <div className="col-xxl-4 landing-text">
                        <h1>FIND YOUR DREAM SQUAD</h1>
                        <p className="mt-3">PlayPal is your go-to service for finding and matching players with similar interests. Whether you love intense RPGs, fast-paced shooters, or relaxing strategy games, PlayPal ensures you always have the perfect gaming squad. Join now and enhance your gaming experience!</p>
                        <button className="btn-noBorder mt-3">LET'S TEAM UP</button>
                    </div>
                    <div className="col-xxl-6 landing-img text-center">
                        <img
                            src="/images/landing_1.png"
                        // style={{  borderRadius: "50%", height: "5rem" }}
                        />
                    </div>
                </div>
                <div className="row mb-3 landing-2">
                    <div className="col-xxl-6 landing-img text-center">
                        <img
                            src="/images/landing_2.png"
                        // style={{ borderRadius: "50%", height: "5rem" }}
                        />
                    </div>
                    <div className="col-xxl-6 landing-text">
                        <h1>UNIQUE MATCHMAKING SYSTEM</h1>
                        <p>PlayPal is your go-to service for finding and matching players with similar interests. Whether you love intense RPGs, fast-paced shooters, or relaxing strategy games, PlayPal ensures you always have the perfect gaming squad. Join now and enhance your gaming experience! Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        </p>
                    </div>
                </div>

            </div>
            <div className="container ">
                <h2 className="text-center m-3">Join the Community With</h2>
                <div className="row text-center mb-5">
                    <div className="col-md">
                        <div className="landing-border">
                            <div className="landing-icon"><MdOutlinePeople fill={COLORS.PRIMARY_1} /></div>
                            <h2> 100</h2>
                            <p>Registered Users</p>
                        </div>
                    </div>
                    <div className="col-md">
                        <div className="landing-border">
                            <div className="landing-icon"><IoGameController fill={COLORS.PRIMARY_1} /></div>
                            <h2> 20</h2>
                            <p>Squad Created</p>
                        </div>
                    </div>
                    <div className="col-md">
                        <div className="landing-border">
                            <div className="landing-icon"><CiClock2 fill={COLORS.PRIMARY_1} /></div>
                            <h2> 1000</h2>
                            <p>Play Hours</p>
                        </div>
                    </div>
                    <div className="col-md">
                        <div className="landing-border">
                            <div className="landing-icon"><PiSwordFill fill={COLORS.PRIMARY_1} /></div>
                            <h2> 1000</h2>
                            <p>Play Hours</p>
                        </div>
                    </div>
                </div>
                <div className="row landing-4 landing-border pt-4 pb-4 mb-5">
                    <div className="col-sm-6 text-center">
                    <img
                            src="/images/landing_1.png"
                        style={{height: "15rem" }}
                        />
                    </div>
                    <div className="col-sm-6 landing-text">
                        <h2>Sign up now & find your perfect squad</h2>
                        <p> You are one click from being the champion</p>
                        <button className="btn-noBorder mt-3 mb-2">Sign Up Now</button>
                    </div>
                </div>
                <div className="row text-center landing-5 landing-border pt-4 pb-4">
                    <h2 className="text-center">How To Get Start</h2>
                    <div className="col-sm-4">
                        <div className="landing-icon"><PiPlugsConnectedFill  fill={COLORS.PRIMARY_1} /></div>
                        <h3> Match Squad</h3>
                        <p>Easily find the perfect squad using our advanced matching system. Whether you're a casual or competitive gamer, you'll be paired with players who fit your style.</p>
                    </div>
                    <div className="col-sm-4">
                        <div className="landing-icon"><HiChatBubbleLeftRight fill={COLORS.PRIMARY_1} /></div>
                        <h3>Quick Chat</h3>
                        <p>Quickly connect with your squad using our integrated chat. Strategies, share tips, and get to know your teammates before jumping into the game.</p>
                    </div>
                    <div className="col-sm-4">
                        <div className="landing-icon"><FaGamepad fill={COLORS.PRIMARY_1} /></div>
                        <h3>Play Games</h3>
                        <p>Dive into your favorite games with your matched squad.Enjoy a seamless, engaging gaming experience with players passion.who share your</p>
                    </div>

                </div>
            </div>
            {process.env.MONGO_URI}
            {doc.map((x, i) => (
                <p key={i}>{x.name}</p>
            ))}

            <form action={create}>
                <label>Name</label>
                <input type="text" name="name" />
                <button type="submit">Submit</button>
            </form>
            <form action={createSquad}>
                <button type="submit">Create squad</button>
            </form>

            <form action={weight}>
                <button type="submit">Set weights</button>
            </form>

            <form action={send}>
                <button type="submit">Send</button>
            </form>

            <form action={sendTag}>
                <button type="submit">Send Tag</button>
            </form>

            <Footer />
        </main>
    );
}
