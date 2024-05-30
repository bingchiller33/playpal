"use client";

import { PrimeReactProvider } from "primereact/api";
import "bootstrap/dist/css/bootstrap.min.css";
import "primereact/resources/themes/lara-dark-purple/theme.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const RootProviders = ({ children }: { children: React.ReactNode }) => {
    return (
        <PrimeReactProvider>
            {children}
            <ToastContainer theme="dark" />
        </PrimeReactProvider>
    );
};

export default RootProviders;
