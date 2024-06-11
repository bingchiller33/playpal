"use client";

import React, { useEffect } from "react";
import Account, { IAccount } from "@/models/account";
import HeaderView from "./HeaderView";
import { WithId } from "@/utils/types";
import { getAccountInfo } from "./Header.server";
const Header = () => {
    const [user, setUser] = React.useState<WithId<IAccount> | undefined>();
    useEffect(() => {
        getAccountInfo().then((res) => {
            if (res.success) {
                setUser(res.data as any);
            }
        });
    }, []);

    return <HeaderView user={user} />;
};

export default Header;
