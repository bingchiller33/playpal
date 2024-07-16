"use client";
import { useSession, signIn, signOut } from "next-auth/react";
export default function Component() {
    const { data: session } = useSession();

    if (session) {
        return (
            <p style={{ color: "white" }}>
                Signed in as {session.user?.email} <br />
                <button onClick={() => signOut()}>Sign out</button>
            </p>
        );
    }
    return (
        <p style={{ color: "white" }}>
            Not signed in <br />
            <button>
                <a href="/auth/login">Sign in</a>
            </button>
        </p>
    );
}
