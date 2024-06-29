"use client";
import Link from "next/link";
import React from "react";
import {
    Container,
    Dropdown,
    DropdownMenu,
    DropdownToggle,
    Nav,
    NavLink,
    Navbar,
    NavbarBrand,
    NavbarCollapse,
    NavbarToggle,
} from "react-bootstrap";
import { IAccount } from "@/models/account";
import Avatar from "./Avatar";
import SearchBar from "./SearchBar";
import NotificationIcon from "./NotificationIcon";
import { COLORS } from "@/utils/constants";
import { IoMdMenu } from "react-icons/io";
import { signOut } from "next-auth/react";
import { WithId } from "@/utils/types";

const HeaderView = ({ user }: HeaderProps) => {
    const isAdmin = user?.role === "admin";

    return (
        <Navbar expand="lg" style={{ backgroundColor: "#242034" }}>
            <Container>
                <NavbarBrand className="" href="" style={{}}>
                    <Link href={"/"} className="text-logo font-all-star">
                        PLAYPAL
                    </Link>
                </NavbarBrand>
                <NavbarToggle
                    aria-controls="basic-navbar-nav "
                    className="header-res"
                >
                    <IoMdMenu fill={COLORS.PRIMARY_1} />{" "}
                </NavbarToggle>
                <NavbarCollapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <NavLink href="" className="text-white header-element">
                            Home
                        </NavLink>
                        <NavLink href="" className="text-white header-element">
                            About us
                        </NavLink>
                        <NavLink href="" className="text-white header-element">
                            Blog
                        </NavLink>
                    </Nav>
                    <div className="flex-grow-1 mx-3 px-5">
                        <SearchBar />
                    </div>
                    {!user ? (
                        <Nav>
                            <NavLink className="me-2" href="/auth/login">
                                <button className="btn-bordered">Login</button>
                            </NavLink>
                            <NavLink href="/auth/register">
                                <button className="btn-noBorder">
                                    Register
                                </button>
                            </NavLink>
                        </Nav>
                    ) : (
                        <Nav style={{ alignItems: "center" }}>
                            <NotificationIcon />
                            <Dropdown className="header-user ">
                                <DropdownToggle
                                    className="header-avatar "
                                    variant="none"
                                    id="dropdown-basic"
                                >
                                    <div className="d-flex align-items-center gap-3">
                                        {user?.avatar ? (
                                            <Avatar
                                                size={40}
                                                src={user?.avatar}
                                            />
                                        ) : (
                                            <Avatar
                                                size={40}
                                                initials={
                                                    user?.username?.[0] ?? "P"
                                                }
                                            />
                                        )}
                                        <span>
                                            {user?.username ?? "no username"}
                                        </span>
                                    </div>
                                </DropdownToggle>

                                <DropdownMenu>
                                    {/* <Dropdown.Item onClick={() => signOut()}>Sign out</Dropdown.Item> */}
                                    <Dropdown.Item href={`profile/${user._id}`}>
                                        My Profile
                                    </Dropdown.Item>
                                    <Dropdown.Item href="/notifications">
                                        Notifications
                                    </Dropdown.Item>
                                    {isAdmin ? (
                                        <Dropdown.Item href="/admin">
                                            Admin
                                        </Dropdown.Item>
                                    ) : (
                                        <></>
                                    )}
                                    <div className="dropdown-divider"></div>
                                    <Dropdown.Item onClick={() => signOut()}>
                                        Sign out
                                    </Dropdown.Item>
                                </DropdownMenu>
                            </Dropdown>
                        </Nav>
                    )}
                </NavbarCollapse>
            </Container>
        </Navbar>
    );
};

export interface HeaderProps {
    user?: WithId<IAccount>;
}

export default HeaderView;
