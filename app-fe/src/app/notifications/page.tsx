import dbConnect from "@/lib/mongoConnect";
import { jsonStrip } from "@/utils";
import NotificationPanel from "@/components/NotificationPanel";
import Notifications, { INotification } from "@/models/notificationModel";
import { WithId } from "@/utils/types";
import { sessionOrLogin } from "@/utils/server";

const NotificationPage = async () => {
    const session = await sessionOrLogin();
    await dbConnect();
    let notifications = [] as WithId<INotification>[];
    let unread = [] as WithId<INotification>[];
    if (session) {
        notifications = jsonStrip(
            await Notifications.find({
                owner: session.user.id,
            })
                .sort({ createdAt: "desc" })
                .exec()
        );

        unread = jsonStrip(
            await Notifications.find({
                owner: session.user.id,
                isRead: false,
            })
                .sort({ createdAt: "desc" })
                .exec()
        );
    }

    return (
        <NotificationPanel
            notifications={notifications}
            unreadNotifications={unread}
        />
    );
};

export default NotificationPage;
