import dbConnect from "@/lib/mongoConnect";
import Link from "next/link";
import React from "react";
import { Button, Container, Dropdown, DropdownMenu, DropdownToggle, Nav, NavLink, Navbar, NavbarBrand, NavbarCollapse, NavbarToggle } from "react-bootstrap";
import { BsPersonCircle } from "react-icons/bs";
import { MdNotifications } from "react-icons/md";
import { sessionOrLogin } from "@/utils";
import Account, { IAccount } from "@/models/account";
import Avatar from "./Avatar";
import { signOut } from "next-auth/react";
const Header = async () => {

    await dbConnect();
    const session = await sessionOrLogin();
    let user: any;
    if (session) {

        user = await Account.findById(session.user.id).exec();
    }

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
                    {
                        !session ? (
                            <Nav>
                                <NavLink className="me-2" href="#">
                                    <button className="btn-bordered">
                                        Login
                                    </button>
                                </NavLink>
                                <NavLink href="#">
                                    <button className="btn-noBorder">
                                        Register
                                    </button>
                                </NavLink>

                            </Nav>
                        ) : (
                            <Nav>
                                <MdNotifications />
                                <Dropdown className="header-user">
                                    <DropdownToggle
                                        className="header-avatar "
                                        variant="none"
                                        id="dropdown-basic"
                                    >
                                        {user?.avatar ? (
                                            <Avatar size={40} src={user?.avatar} />
                                        ) : (
                                            <Avatar size={40}
                                                initials={user?.username?.[0] ?? "P"} />
                                        )}
                                        {user?.username ?? 'no username'}
                                    </DropdownToggle>

                                    <DropdownMenu>
                                        {/* <Dropdown.Item onClick={() => signOut()}>Sign out</Dropdown.Item> */}
                                        <Dropdown.Item href="/">Hello</Dropdown.Item>
                                    </DropdownMenu>

                                </Dropdown>
                            </Nav>
                        )
                    }

                </NavbarCollapse>
            </Container>
        </Navbar>
    );
};

export default Header;
