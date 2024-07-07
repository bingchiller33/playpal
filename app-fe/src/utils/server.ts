import Account from "@/models/account";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { jsonStrip } from ".";

export async function sessionOrLogin() {
    const session = await getServerSession(authOptions);
    if (!session?.user.id) {
        redirect("/auth/login");
    }

    return session;
}

export async function adminOrLogin() {
    const session = await sessionOrLogin();
    const user = jsonStrip(await Account.findById(session.user.id).exec());
    if (user?.role !== "admin") {
        console.log("Post", user?.role);

        return redirect("/auth/login"); // TODO: Change to insufficicent role page
    }

    return session;
}

export async function dbUserFromSession() {
    const session = await getServerSession(authOptions);
    if (!session?.user.id) {
        return undefined;
    }

    const user = jsonStrip(await Account.findById(session.user.id).exec());
    return user;
}
