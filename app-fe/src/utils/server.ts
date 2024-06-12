import Account from "@/models/account";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export async function sessionOrLogin() {
    const session = await getServerSession(authOptions);
    if (!session?.user.id) {
        redirect("/auth/login");
    }

    return session;
}

export async function adminOrLogin() {
    const session = await sessionOrLogin();
    const user = await Account.findById(session.user.id).exec();
    if (user?.role !== "admin") {
        return redirect("/auth/login"); // TODO: Change to insufficicent role page
    }

    return session;
}
