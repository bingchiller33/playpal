import { IPremiumTransaction } from "@/models/premiumTransactionModel";
import { WithId } from "@/utils/types";
import {
    HashAlgorithm,
    ProductCode,
    VNPay,
    VnpCurrCode,
    VnpLocale,
} from "vnpay";

export const vnpay = new VNPay({
    tmnCode: "UC1P7GHI",
    secureSecret: "WX2F31NNVLGS0YIYDDFH9RTJV0BZ2KTL",
    vnpayHost: "https://sandbox.vnpayment.vn",
    testMode: true,
});

export async function createPremiumCheckout(info: WithId<IPremiumTransaction>) {
    const url = await vnpay.buildPaymentUrl({
        vnp_Amount: info.finalPrice,
        vnp_IpAddr: "0.0.0.0",
        vnp_TxnRef: info._id.toString(),
        vnp_OrderInfo: "PaypalPremiumSubcription",
        vnp_OrderType: ProductCode.Other,
        vnp_ReturnUrl: "http://localhost:3000/api/cb-vnpay/presub",
        vnp_Locale: VnpLocale.VN,
        vnp_CurrCode: VnpCurrCode.VND,
    });

    return url;
}
