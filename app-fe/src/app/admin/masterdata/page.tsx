"use client";

import AdminNavigationPanel from "@/components/AdminNavigationPanel";
import Header from "@/components/Header";

import { Button, Col, Row, Table } from "react-bootstrap";
import { getMd, saveMasterData } from "./server";
import { useEffect, useState } from "react";
import { IMasterData } from "@/models/masterDataModel";
import { toast } from "react-toastify";
import { reportToast } from "@/utils/client";

const ManageMasterDataPage = () => {
    const [data, setData] = useState<IMasterData | undefined>();
    useEffect(() => {
        getMd().then((res) => {
            console.log(res);
            setData(res as any);
        });
    }, []);

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

                        <form
                            action={async (e) => {
                                const res = await saveMasterData(e);
                                reportToast(res!, "Saved");
                            }}
                        >
                            <label>Premium Price (VND)</label>
                            <input
                                type="number"
                                name="premiumPrice"
                                className="pp-form-input"
                                placeholder="Enter premium price"
                                defaultValue={data?.premiumPrice ?? 0}
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
