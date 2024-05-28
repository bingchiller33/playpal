"use client";

import { PrimeReactProvider } from "primereact/api";
import "bootstrap/dist/css/bootstrap.min.css";
import "primereact/resources/themes/lara-dark-purple/theme.css";

const RootProviders = ({ children }: { children: React.ReactNode }) => {
    return <PrimeReactProvider>{children}</PrimeReactProvider>;
};

export default RootProviders;
