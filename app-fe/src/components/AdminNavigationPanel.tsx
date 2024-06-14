import Link from "next/link";
import { FaFilter } from "react-icons/fa";

const AdminNavigationPanel = () => {
    return (
        <div className="background-1 border-primary-glow p-1 m-1 rounded">
            <h1 className="ms-4" style={{ fontSize: 16, fontWeight: "bold" }}>
                Matchmaking
            </h1>
            <Link
                href="/admin/filters/general"
                className="d-flex align-items-center gap-2 admin-nav-item p-2 rounded"
            >
                <FaFilter />
                <p className="m-0">Filter Settings</p>
            </Link>
            <Link
                href="/admin/filters/lol"
                className="d-flex align-items-center gap-2 admin-nav-item p-2 rounded"
            >
                <FaFilter />
                <p className="m-0">Filter: League of Legends</p>
            </Link>
        </div>
    );
};

export default AdminNavigationPanel;
