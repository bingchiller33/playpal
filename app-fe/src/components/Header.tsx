import Link from "next/link";
import React from "react";
import { Button, Container, Dropdown, DropdownToggle, Nav, NavLink, Navbar, NavbarBrand, NavbarCollapse, NavbarToggle } from "react-bootstrap";
import { BsPersonCircle } from "react-icons/bs";
import { MdNotifications } from "react-icons/md";
const Header = () => {
    return (
        <Navbar
            expand="lg"
            style={{ backgroundColor: "#242034" }}
        >
            <Container>
                <NavbarBrand className="" href="" style={{}}>
                    <Link href={"/"} className="text-logo font-all-star">PLAYPAL </Link>
                </NavbarBrand>
                <NavbarToggle aria-controls="basic-navbar-nav" />
                <NavbarCollapse id="basic-navbar-nav" >
                    <Nav className="me-auto">
                        <NavLink href="" className="text-white header-element">Home</NavLink>
                        <NavLink href="" className="text-white header-element">About us</NavLink>
                        <NavLink href="" className="text-white header-element">Blog</NavLink>
                    </Nav>

                    <Nav>
                        <NavLink className="me-2" href="#">
                            <button className="btn-bordered">
                                Login
                            </button>
                        </NavLink>
                        <NavLink href="#">
                            <button className="btn-noborder">
                                Register
                            </button>
                        </NavLink>

                    </Nav>



                    {/* <Nav>
                        <Dropdown>
                            <MdNotifications />
                            <DropdownToggle
                                variant="none"
                                id="dropdown-basic"
                                style={{ color: "white" }}>
                                <BsPersonCircle />
                            </DropdownToggle>

                        </Dropdown>
                    </Nav> */}
                </NavbarCollapse>
            </Container>
        </Navbar>
    );
};

export default Header;
