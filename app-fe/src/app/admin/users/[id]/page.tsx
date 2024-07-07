import AdminNavigationPanel from "@/components/AdminNavigationPanel";
import Dividers from "@/components/Dividers";
import Dropdown from "@/components/Dropdown";
import Header from "@/components/Header";
import dbConnect from "@/lib/mongoConnect";
import Account from "@/models/account";
import { NextPageProps } from "@/utils/types";
import Link from "next/link";
import { Button, Col, Row } from "react-bootstrap";
import ManageUserView from "./View";
import { jsonStrip } from "@/utils";
import { redirect } from "next/navigation";
import { getPremiumHistory } from "@/server/subscriptions.server";
import { getFutPremiumExpiry } from "@/repositories/premiumRepository";

const ManageUserPage = async ({ params }: NextPageProps) => {
    const { id } = params;
    await dbConnect();
    const user = jsonStrip(await Account.findById(id).exec());
    if (!user) {
        redirect("/admin/users");
    }

    const expires = await getFutPremiumExpiry(id);
    return <ManageUserView user={user!} premiumExpire={expires} />;
};

export default ManageUserPage;
