import Header from "@/components/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="d-flex flex-column h-100">
            <div className="d-none d-md-block">
                <Header />
            </div>
            {children}
        </div>
    );
}
