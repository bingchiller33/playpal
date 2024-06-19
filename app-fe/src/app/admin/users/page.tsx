import AdminNavigationPanel from "@/components/AdminNavigationPanel";
import Header from "@/components/Header";

import { Col, Row } from "react-bootstrap";

const ManageUsersPage = async () => {
    return (
        <div>
            <Header />
            <Row className="m-1">
                <Col md={4} className="p-1">
                    <AdminNavigationPanel />
                </Col>
                <Col md={8} className="p-1">
                    <div className="background-1 border-primary-glow p-1 m-1 rounded">
                        <h1>Manage Users</h1>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default ManageUsersPage;
