import React from "react";
import { Button, Container, Dropdown, DropdownToggle, Nav, NavLink, Navbar, NavbarBrand, NavbarCollapse, NavbarToggle } from "react-bootstrap";
import { BsPersonCircle } from "react-icons/bs";
import { IoPersonCircleOutline } from "react-icons/io5";
import { MdNotifications } from "react-icons/md";

const Header = () => {
    return (
        <Navbar
            expand="lg"
            style={{ backgroundColor: "#242034" }}
        >
            <Container>
                <NavbarBrand href="" style={{ color: "#ED154C" }}>
                    PLAYPAL
                </NavbarBrand>
                <NavbarToggle aria-controls="basic-navbar-nav" />
                <NavbarCollapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <NavLink href="" style={{ color: "white" }}>Home</NavLink>
                        <NavLink href="">About us</NavLink>
                        <NavLink href="">Blog</NavLink>
                    </Nav>

                    <Nav>
                        <NavLink className="me-2" href="#">
                            <Button>
                                Login
                            </Button>
                        </NavLink>
                        <NavLink href="#">
                            <Button>
                                Register
                            </Button>
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
