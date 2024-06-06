import { getServerSession } from "next-auth";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";

export function jsonStrip<T>(a: T): T {
    return JSON.parse(JSON.stringify(a));
}

export function minMap(input: Record<string, number>) {
    if (!Object.keys(input).length) {
        return undefined;
    }

    return Object.keys(input)
        .map((x) => input[x])
        .reduce((a, b) => Math.min(a, b));
}

export async function sessionOrLogin() {
    const session = await getServerSession(authOptions);
    if (!session?.user.id) {
        redirect("/auth/login");
    }

    return session;
}
