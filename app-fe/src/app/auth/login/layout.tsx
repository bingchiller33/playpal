import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login | PlayPal",
};


export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <> {children} </>
    );
}
