

import React from "react";
import Account from "@/models/account";
import HeaderView from "./HeaderView";
import { getServerSession } from "next-auth";
const Header = async () => {
    const session = await getServerSession();
    let user: any;
    if (session) {
        user = await Account.findById(session.user.id);
    }

    return (
        <HeaderView user = {user}/>
    );
};

export default Header;
