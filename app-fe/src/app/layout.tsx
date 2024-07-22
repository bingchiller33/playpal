import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import RootProviders from "@/components/RootProviders";
import cx from "classnames";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import localFont from "next/font/local";
import x from "./icon_playpal.png";

export const metadata: Metadata = {
    title: "PlayPal",
    description:
        "PlayPal is your go-to service for finding and matching players with similar interests.",
};

const inter = Inter({ subsets: ["latin"] });

const allStar = localFont({
    src: "./Allstar4.ttf",
    variable: "--font-all-star",
});

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href={x.src} />
            </head>
            <body className={cx(inter.className, allStar.variable)}>
                <RootProviders session={await getServerSession(authOptions)}>
                    {children}
                </RootProviders>
            </body>
        </html>
    );
}
