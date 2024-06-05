"use client";

import { PrimeReactProvider } from "primereact/api";
import "bootstrap/dist/css/bootstrap.min.css";
import "primereact/resources/themes/lara-dark-purple/theme.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { SessionProvider } from "next-auth/react";
import { PusherProvider } from "@harelpls/use-pusher";
import * as env from "@/utils/env";

interface RootProvidersProps {
    children: React.ReactNode;
    session?: any; // Optionally type the session object if needed
}

const RootProviders = ({ children, session }: RootProvidersProps) => {
    return (
        <SessionProvider session={session}>
            {/* @ts-ignore */}
            <PusherProvider
                clientKey={env.NEXT_PUBLIC_PUSHER_KEY}
                cluster={env.NEXT_PUBLIC_PUSHER_CLUSTER}
            >
                <PrimeReactProvider>
                    {children}
                    <ToastContainer theme="dark" />
                </PrimeReactProvider>
            </PusherProvider>
        </SessionProvider>
    );
};

export default RootProviders;
