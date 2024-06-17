import { adminOrLogin } from "@/utils/server";

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    await adminOrLogin();
    return children;
}
