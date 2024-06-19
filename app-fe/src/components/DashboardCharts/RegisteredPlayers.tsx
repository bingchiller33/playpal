"use client";
import { Line } from "react-chartjs-2";
import { enUS } from "date-fns/locale";
import "chartjs-adapter-date-fns";
import { COLORS } from "@/utils/constants";
import LineChart, { LineChartData } from "./LineChart";
import { Button, Col, Row } from "react-bootstrap";
import RangeSelector from "./RangeSelector";
import Link from "next/link";

const RegisteredPlayerInfo = (props: RegisteredPlayerInfoProps) => {
    return (
        <div>
            <div className="d-flex align-items-center gap-2">
                <h2 className="m-0">Registered users</h2>
                <Link
                    href="/admin/users"
                    className="btn bg-primary-1 border-0 "
                    style={{ color: "white" }}
                >
                    Manage users
                </Link>
            </div>

            <Row>
                <Col md={6}>
                    <RangeSelector />
                    <LineChart data={props.data} label="Registered Users" />
                    <p>Register users growth over time:</p>
                </Col>
                <Col md={6}>
                    <Row>
                        <Col>
                            <p>
                                Total number of account registered on the
                                platform
                            </p>
                            <p style={{ fontSize: 48 }} className="fw-bold">
                                {props.total}
                            </p>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <p>User growth last month</p>
                            <p style={{ fontSize: 48 }} className="fw-bold">
                                {props.growthLast}
                            </p>
                        </Col>
                        <Col md={6}>
                            <p>User growth this month</p>
                            <p style={{ fontSize: 48 }} className="fw-bold">
                                {props.growthCur}
                            </p>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    );
};

export interface RegisteredPlayerInfoProps {
    data: LineChartData;
    total: number;
    growthCur: number;
    growthLast: number;
}

export default RegisteredPlayerInfo;
