import AdminNavigationPanel from "@/components/AdminNavigationPanel";
import Header from "@/components/Header";

import { Button, Col, Row, Table } from "react-bootstrap";
import { IAccount } from "@/models/account";
import { WithId } from "@/utils/types";
import { getMasterData } from "@/repositories/masterDataRepository";
import { saveMasterData } from "./server";

const ManageMasterDataPage = async () => {
    const data = await getMasterData();

    return (
        <div>
            <Header />
            <Row className="m-1">
                <Col md={4} className="p-1">
                    <AdminNavigationPanel />
                </Col>
                <Col md={8} className="p-1">
                    <div className="background-1 border-primary-glow p-1 m-1 rounded">
                        <h1>Manage Master Data</h1>

                        <form action={saveMasterData}>
                            <label>Premium Price (VND)</label>
                            <input
                                type="number"
                                className="pp-form-input"
                                placeholder="Enter premium price"
                                defaultValue={data.premiumPrice}
                            />

                            <button
                                type="submit"
                                className="btn btn-primary bg-primary-1 py-2 px-5 rounded mt-2"
                            >
                                Save
                            </button>
                        </form>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default ManageMasterDataPage;
