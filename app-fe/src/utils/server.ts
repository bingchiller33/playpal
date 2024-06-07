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
