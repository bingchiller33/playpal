"use client";

import { PrimeReactProvider } from "primereact/api";
import "bootstrap/dist/css/bootstrap.min.css";
import "primereact/resources/themes/lara-dark-purple/theme.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { SessionProvider } from "next-auth/react";
import { PusherProvider } from "@harelpls/use-pusher";
import * as env from "@/utils/env";
import * as PusherPushNotifications from "@pusher/push-notifications-web";
import { useEffect } from "react";
import NotificationManager from "./NotificationManger";
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
    TimeScale,
    LineElement,
    ArcElement,
} from "chart.js";

ChartJS.register(
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
    TimeScale,
    LineElement,
    ArcElement
);

interface RootProvidersProps {
    children: React.ReactNode;
    session?: any; // Optionally type the session object if needed
}

const RootProviders = ({ children, session }: RootProvidersProps) => {
    useEffect(() => {
        const tokProvider = new PusherPushNotifications.TokenProvider({
            url: "/api/pusher-registration",
        });

        const beamsClient = new PusherPushNotifications.Client({
            instanceId: env.NEXT_PUBLIC_PUSHER_INSTANCE_ID,
        });

        const userId = session?.user.id;
        if (userId) {
            beamsClient
                .start()
                .then(() =>
                    beamsClient.setUserId(session?.user.id, tokProvider)
                )
                .then(() => beamsClient.setDeviceInterests(["globals"]))
                .then(() =>
                    console.log("Successfully registered and subscribed!")
                )
                .catch(console.error);
        }

        return () => {
            beamsClient.stop().catch(console.error);
        };
    }, [session?.user.id]);

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
                    <NotificationManager
                        userId={session?.user.id}
                        key={Math.random()}
                    />
                </PrimeReactProvider>
            </PusherProvider>
        </SessionProvider>
    );
};

export default RootProviders;
