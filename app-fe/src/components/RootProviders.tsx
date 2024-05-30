"use client";

import { PrimeReactProvider } from "primereact/api";
import "bootstrap/dist/css/bootstrap.min.css";
import "primereact/resources/themes/lara-dark-purple/theme.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { SessionProvider } from "next-auth/react";

interface RootProvidersProps {
    children: React.ReactNode;
    session?: any; // Optionally type the session object if needed
}

const RootProviders = ({ children, session }: RootProvidersProps) => {
    return (
        <SessionProvider session={session}>
            <PrimeReactProvider>
                {children}
                <ToastContainer theme="dark" />
            </PrimeReactProvider>
        </SessionProvider>
    );
};

export default RootProviders;
