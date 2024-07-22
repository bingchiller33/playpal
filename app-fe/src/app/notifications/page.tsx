import NotificationPanel from "@/components/NotificationPanel";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Notifications | PlayPal",
};

const NotificationPage = async () => {
    return <NotificationPanel showBackButton={true} />;
};

export default NotificationPage;
