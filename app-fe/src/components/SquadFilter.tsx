"use client";

import { NextPageProps } from "@/utils/types";
import { Col, Row } from "react-bootstrap";
import Dropdown from "./Dropdown";
import styles from "./SquadFilter.module.css";
import cx from "classnames";
import { Slider } from "primereact/slider";
import TooltipSlider from "./TooltipSlider";
import { Checkbox } from "primereact/checkbox";
import { ToggleButton } from "primereact/togglebutton";
import { Divider } from "primereact/divider";
import { COLORS } from "@/utils/constants";

const SquadFilter = ({ params }: NextPageProps) => {
    const { id, page } = params;
    return (
        <div className="p-3 overflow-hidden">
            <h1>Edit at src/SquadFilter.tsx </h1>
            <p>Squad id: {id}</p>

            <Row>
                <Col xxl={6} className="d-flex align-items-center gap-2 mb-3">
                    <p className={cx("m-0", styles["filter-label-col"])}>
                        Language:
                    </p>
                    <Dropdown className="flex-grow-1" />
                </Col>
                <Col xxl={6} className="d-flex align-items-center gap-2 mb-3">
                    <p className={cx("m-0", styles["filter-label-col"])}>
                        Gender:
                    </p>
                    <Dropdown className="flex-grow-1" />
                </Col>
            </Row>

            <Row>
                <Col className="d-flex align-items-center gap-2 mb-3">
                    <p className={cx("m-0", styles["filter-label-col"])}>
                        Age:
                    </p>
                    <TooltipSlider
                        className="flex-grow-1"
                        range
                        value={[10, 20]}
                        min={0}
                        max={100}
                    />
                </Col>
                <p className={styles["age-info"]}>From 18 to 50 years old</p>
            </Row>

            <Row>
                <Col className="d-flex align-items-center gap-2 mb-3">
                    <p className={cx("m-0", styles["filter-label-col"])}>
                        Number of members:
                    </p>
                    <TooltipSlider
                        className="flex-grow-1"
                        value={5}
                        min={0}
                        max={12}
                    />
                </Col>
            </Row>

            <Row>
                <Col className="d-flex align-items-center gap-2 mb-3">
                    <p className={cx("m-0", styles["filter-label-col"])}>
                        Active hours:
                    </p>
                    <Checkbox />
                    <label>All day</label>
                </Col>
            </Row>

            <Row>
                <Col xxl={6} className="d-flex align-items-center gap-2 mb-3">
                    <p className={cx("m-0", styles["filter-label-col"])}>
                        From:
                    </p>
                    <Dropdown className="flex-grow-1" />
                </Col>
                <Col xxl={6} className="d-flex align-items-center gap-2 mb-3">
                    <p className={cx("m-0", styles["filter-label-col"])}>To:</p>
                    <Dropdown className="flex-grow-1" />
                </Col>
            </Row>

            <Row>
                <Col className="d-flex align-items-center gap-2 mb-3">
                    <p className={cx("m-0", styles["filter-label-col"])}>
                        Play style:
                    </p>
                    <div>
                        <PlaystyleBtn
                            label="Casual"
                            checked={false}
                            onChange={() => {}}
                        />
                        <PlaystyleBtn
                            label="Casual"
                            checked={false}
                            onChange={() => {}}
                        />
                        <PlaystyleBtn
                            label="Casual"
                            checked={false}
                            onChange={() => {}}
                        />
                        <PlaystyleBtn
                            label="Casual"
                            checked={false}
                            onChange={() => {}}
                        />
                        <PlaystyleBtn
                            label="Casual"
                            checked={false}
                            onChange={() => {}}
                        />
                    </div>
                </Col>
            </Row>

            <div
                className="mb-4"
                style={{
                    border: `1px solid ${COLORS.PRIMARY_1}`,
                    opacity: 0.5,
                }}
            />

            <Row>
                <Col className="d-flex align-items-center gap-2 mb-3">
                    <p className={cx("m-0", styles["filter-label-col"])}>
                        Game:
                    </p>
                    <Dropdown className="flex-grow-1" />
                </Col>
            </Row>

            <Row>
                <Col className="d-flex align-items-center gap-2 mb-3">
                    <p className={cx("m-0", styles["filter-label-col"])}>
                        Mode:
                    </p>
                    <Dropdown className="flex-grow-1" />
                </Col>
            </Row>
        </div>
    );
};

const PlaystyleBtn = ({ label, checked, onChange }: PlaystyleBtnProps) => {
    return (
        <ToggleButton
            onLabel={label}
            offLabel={label}
            checked={checked}
            onClick={() => onChange(!checked)}
            className="playstyle-btn me-1 mb-1"
        />
    );
};

export interface PlaystyleBtnProps {
    label: string;
    checked: boolean;
    onChange: (value: boolean) => void;
}

export default SquadFilter;
