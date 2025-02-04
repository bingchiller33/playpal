import { adminOrLogin } from "@/utils/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin | PlayPal",
};



export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    await adminOrLogin();
    return children;
}
