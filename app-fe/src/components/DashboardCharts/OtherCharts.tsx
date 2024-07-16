"use client";
import { Button, Col, Row } from "react-bootstrap";
import LineChart, { LineChartData } from "./LineChart";
import PieChart, { PieChartData } from "./PieChart";
import RangeSelector from "./RangeSelector";
import Link from "next/link";

const OtherCharts = (props: OtherChartsProps) => {
    return (
        <>
            <Row>
                <Col md={6}>
                    <h2>Active Squads</h2>
                    <RangeSelector />
                    <LineChart data={props.squads} label="Active squads" />
                    <p>Active squads growth over time</p>
                </Col>
                <Col md={6}>
                    <div className="d-flex align-items-center gap-2">
                        <h2 className="m-0">Revenue</h2>
                    </div>
                    <div style={{ opacity: 0 }}>
                        <RangeSelector />
                    </div>
                    <LineChart data={props.revenue} label="Revenue" />
                    <p>Revenue stream daily</p>
                </Col>
            </Row>
            <Row>
                <Col md={6}>
                    <div className="d-flex align-items-center gap-2">
                        <h2 className="m-0">Filter usage distribution</h2>
                        <Link
                            href="/admin/filters/general"
                            className="btn bg-primary-1 border-0 "
                            style={{ color: "white" }}
                        >
                            Manage filters
                        </Link>
                    </div>
                    <PieChart data={props.filters} />
                    <p>Filter usage distribution in all squads over time</p>
                </Col>
                <Col md={6}>
                    <h2>Game choice distribution</h2>
                    <PieChart data={props.games} />
                    <p>Game choice distribution in all squads over time</p>
                </Col>
            </Row>
        </>
    );
};

export interface OtherChartsProps {
    squads: LineChartData;
    filters: PieChartData;
    games: PieChartData;
    revenue: LineChartData;
}

export default OtherCharts;
