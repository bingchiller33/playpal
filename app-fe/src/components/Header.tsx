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
                <NavbarBrand className="text-logo" href="" style={{}}>
                    PLAYPAL
                </NavbarBrand>
                <NavbarToggle aria-controls="basic-navbar-nav" />
                <NavbarCollapse id="basic-navbar-nav" >
                    <Nav className="me-auto">
                        <NavLink href="" className="text-white">Home</NavLink>
                        <NavLink href="" className="text-white">About us</NavLink>
                        <NavLink href="" className="text-white">Blog</NavLink>
                    </Nav>

                    <Nav>
                        <NavLink className="me-2" href="#">
                            <Button className="btn-bordered">
                                Login
                            </Button>
                        </NavLink>
                        <NavLink href="#">
                            <Button className="btn-noborder">
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
