import Link from "next/link";
import { Container, Navbar } from "react-bootstrap"
import { BiPhoneCall } from "react-icons/bi";
import { FaFacebook } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const Footer = () => {
    return (
        <Container fluid>
            <div className="row p-4 footer" >
                <div className="col-lg-4 text-center">
                    <p className="footer-logo fw-bold font-all-star">PLAYPAL</p>
                </div>
                <div className="offset-2 col-lg-6">
                    <div className="row">
                        <div className="col-lg">
                            <h5 className=""> PlayPal</h5>
                            <ul
                                className="list-unstyled "
                                style={{ textAlign: "left", textDecoration: "none !important" }}
                            >
                                <li>
                                    <Link href={"/"} className="">
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link href={"/"} className="">
                                        About us
                                    </Link>
                                </li>
                                <li>
                                    <Link href={"/"} className="">
                                        Blog
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="col-lg">
                            <h5 className=" "> Contact us</h5>
                            <ul
                                className="list-unstyled "
                                style={{ textAlign: "left", textDecoration: "none", }}
                            >
                                <li>
                                    <Link href={"/"} className="">
                                        <FaFacebook /> PlayPal
                                    </Link>
                                </li>
                                <li>
                                    <Link href={"/"}  className="">
                                        <BiPhoneCall /> 0999 666 333
                                    </Link>
                                </li>
                                <li>
                                    <Link href={"/"}  className="">
                                        <MdEmail /> Playpal@gmail.com
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="col-lg"></div>
                    </div>
                </div>
                <div className="row">
                    <p className="fst-italic" style={{ opacity: "0.2", fontSize: '12px', marginTop: '25px' }}>Copyright © 2024 - PLAYPAL. All rights reserved. This includes the privacy policy, terms and disclaimer.</p>
                </div>
            </div>
        </Container>

    );
};

export default Footer;
