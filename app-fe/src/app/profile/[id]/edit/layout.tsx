import { NextPageProps } from "@/utils/types";
import dbConnect from "@/lib/mongoConnect";
import { jsonStrip } from "@/utils";
import Account from "@/models/account";
import { Metadata } from "next";

export async function generateMetadata(
    pageProps: NextPageProps
): Promise<Metadata> {
    return {
        title: `Edit Profile | PlayPal`,
    };
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
