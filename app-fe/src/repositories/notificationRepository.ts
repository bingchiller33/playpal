import Notifications from "@/models/notificationModel";
import Aaas from "../models/aaaModel";

// Write common database query here, dont write basic crud here, use the Collection directly
export async function getAllNotifications(userId: string) {
    Notifications.find({ owner: userId }).exec();
}
