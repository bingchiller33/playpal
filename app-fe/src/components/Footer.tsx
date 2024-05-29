import { Container, Navbar } from "react-bootstrap"
import { BiPhoneCall } from "react-icons/bi";
import { FaFacebook } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const Footer = () => {
    return (
        <Container fluid>
            <div className="row p-4 footer" >
                <div className="col-4 text-center">
                    <p className="footer-logo fw-bold">PLAYPAL</p>
                </div>
                <div className="offset-2 col-6">
                    <div className="row">
                        <div className="col">
                            <h5 className=""> PlayPal</h5>
                            <ul
                                className="list-unstyled "
                                style={{ textAlign: "left", textDecoration: "none", }}
                            >
                                <li>
                                    <a className="">
                                        Home
                                    </a>
                                </li>
                                <li>
                                    <a className="">
                                        About us
                                    </a>
                                </li>
                                <li>
                                    <a className="">
                                        Blog
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="col">
                            <h5 className=" "> Contact us</h5>
                            <ul
                                className="list-unstyled "
                                style={{ textAlign: "left", textDecoration: "none", }}
                            >
                                <li>
                                    <a className="">
                                        <FaFacebook /> PlayPal
                                    </a>
                                </li>
                                <li>
                                    <a className="">
                                        <BiPhoneCall /> 0999 666 333
                                    </a>
                                </li>
                                <li>
                                    <a className="">
                                        <MdEmail /> Playpal@gmail.com
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="col"></div>
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
