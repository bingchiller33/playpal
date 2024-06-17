import { toast } from "react-toastify";

export function reportToast(
    res: { success: boolean; msg?: string },
    successMsg: string
) {
    if (!res) {
        return;
    }

    if (res.success) {
        toast.success(successMsg);
    } else {
        toast.error(res.msg);
    }
}
