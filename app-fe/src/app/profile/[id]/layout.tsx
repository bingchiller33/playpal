import { NextPageProps } from "@/utils/types";
import dbConnect from "@/lib/mongoConnect";
import { jsonStrip } from "@/utils";
import Account from "@/models/account";
import { Metadata } from "next";

export async function generateMetadata(
    pageProps: NextPageProps
): Promise<Metadata> {
    const id = pageProps.params.id;
    await dbConnect();
    const user = jsonStrip(await Account.findById(id).exec());
    const name = user?.username ?? "Unknown Player";
    return {
        title: `${name}'s Profile | PlayPal`,
    };
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
