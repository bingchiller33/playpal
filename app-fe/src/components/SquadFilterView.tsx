"use client";

import { NextPageProps, WithId } from "@/utils/types";
import { Button, Col, Row } from "react-bootstrap";
import Dropdown from "./Dropdown";
import styles from "./SquadFilter.module.css";
import cx from "classnames";
import TooltipSlider from "./TooltipSlider";
import { Checkbox } from "primereact/checkbox";
import { ToggleButton } from "primereact/togglebutton";
import { COLORS, TIME_FILTER_OPTIONS } from "@/utils/constants";
import {
    enterMatchmaking,
    updateFilter,
    revalidateFilters,
    exitMatchMaking,
} from "./SquadFilter.server";
import { useOptimistic, useTransition } from "react";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import promisedb from "@/utils/debounce";
import { toast } from "react-toastify";
import { useMatchMaking, useSquadFilterUpdates } from "@/lib/usePusherEvents";
import { useRouter } from "next/navigation";
import { ISquad } from "@/models/squadModel";

const SquadFilterView = (props: SquadFilterProps) => {
    const { id, page } = props.params;
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [filters, setFilters] = useOptimistic(
        props.filters,
        (cur, next: any) => {
            return { ...cur, ...next };
        }
    );

    useSquadFilterUpdates(id, async () => {
        startTransition(async () => {
            await revalidateFilters(id, page);
            setFilters(props.filters);
        });
    });

    useMatchMaking(props.squad, (other) => {
        console.log({ other });
    });

    const pdUpdateFilter = promisedb(async (update: Record<string, any>) => {
        const result = await updateFilter(id, update);
        result.success || toast.error(result.msg);
    }, 1000);

    const saUpdateFilter = async (update: Record<string, any>) => {
        startTransition(async () => {
            setFilters(update);
            await pdUpdateFilter(update);
        });
    };

    const langOpt = props.languages.map((x) => ({
        label: x.label,
        value: x._id,
    }));

    const genderOpt = props.genders.map((x) => ({
        label: x.label,
        value: x._id,
    }));

    const gameOpt = props.games.map((x) => ({
        label: x.name,
        value: x._id,
        iconUrl: x.iconUrl,
    }));

    const modeOpt = props.modes.map((x) => ({
        label: x.name,
        value: x._id,
    }));

    return (
        <form className="p-3 h-100 d-flex flex-column panel-layout-child position-relative">
            <h1 className="font-all-star color-primary-1">FILTERS</h1>
            <div className="flex-grow-1 flex-shrink-1">
                <Row>
                    <Col
                        xxl={6}
                        className="d-flex align-items-center gap-2 mb-3"
                    >
                        <p className={cx("m-0", styles["filter-label-col"])}>
                            Language:
                        </p>
                        <Dropdown
                            className="flex-grow-1"
                            value={filters.langId}
                            options={langOpt}
                            onChange={(e) => saUpdateFilter({ langId: e })}
                        />
                    </Col>
                    <Col
                        xxl={6}
                        className="d-flex align-items-center gap-2 mb-3"
                    >
                        <p className={cx("m-0", styles["filter-label-col"])}>
                            Gender:
                        </p>
                        <Dropdown
                            className="flex-grow-1"
                            options={genderOpt}
                            value={filters.genderId}
                            onChange={(e) => saUpdateFilter({ genderId: e })}
                        />
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
                            value={[filters.ageFrom, filters.ageTo]}
                            min={1}
                            max={100}
                            onChange={(e) => {
                                const [from, to] = e.value as [number, number];
                                saUpdateFilter({
                                    ageFrom: from,
                                    ageTo: to,
                                });
                            }}
                        />
                    </Col>
                    <p className={styles["age-info"]}>
                        From {filters.ageFrom} to {filters.ageTo} years old
                    </p>
                </Row>

                <Row>
                    <Col className="d-flex align-items-center gap-2 mb-3">
                        <p className={cx("m-0", styles["filter-label-col"])}>
                            Number of members:
                        </p>
                        <TooltipSlider
                            className="flex-grow-1"
                            value={filters.memberCount}
                            onChange={(e) =>
                                saUpdateFilter({ memberCount: e.value })
                            }
                            min={0}
                            max={12}
                        />
                    </Col>
                </Row>

                {/* TODO: Timezone */}
                <Row>
                    <Col className="d-flex align-items-center gap-2 mb-3">
                        <p className={cx("m-0", styles["filter-label-col"])}>
                            Active hours:
                        </p>
                        <Checkbox
                            checked={filters.activeAllDay}
                            onChange={(e) => {
                                if (e.checked) {
                                    saUpdateFilter({
                                        activeAllDay: e.checked,
                                        activeFrom: 0,
                                        activeTo: 85500,
                                    });
                                } else {
                                    saUpdateFilter({
                                        activeAllDay: e.checked,
                                    });
                                }
                            }}
                        />
                        <label>All day</label>
                    </Col>
                </Row>

                <Row>
                    <Col
                        xxl={6}
                        className="d-flex align-items-center gap-2 mb-3"
                    >
                        <p className={cx("m-0", styles["filter-label-col"])}>
                            From:
                        </p>
                        <Dropdown
                            className="flex-grow-1"
                            options={TIME_FILTER_OPTIONS}
                            disabled={filters.activeAllDay}
                            value={filters.activeFrom.toString()}
                            onChange={(e) =>
                                saUpdateFilter({
                                    activeFrom: parseInt(e as any),
                                })
                            }
                        />
                    </Col>
                    <Col
                        xxl={6}
                        className="d-flex align-items-center gap-2 mb-3"
                    >
                        <p className={cx("m-0", styles["filter-label-col"])}>
                            To:
                        </p>
                        <Dropdown
                            className="flex-grow-1"
                            options={TIME_FILTER_OPTIONS}
                            disabled={filters.activeAllDay}
                            value={filters.activeTo.toString()}
                            onChange={(e) =>
                                saUpdateFilter({
                                    activeTo: parseInt(e as any),
                                })
                            }
                        />
                    </Col>
                </Row>

                <Row>
                    <Col className="d-flex align-items-center gap-2 mb-3">
                        <p className={cx("m-0", styles["filter-label-col"])}>
                            Play style:
                        </p>
                        <div>
                            {props.playstyles.map((x: any) => (
                                <PlaystyleBtn
                                    key={x._id}
                                    label={x.label}
                                    checked={filters.playstyles.includes(x._id)}
                                    onChange={(e) => {
                                        let value;
                                        if (e) {
                                            value = [
                                                ...filters.playstyles,
                                                x._id,
                                            ];
                                        } else {
                                            value = filters.playstyles.filter(
                                                (y: any) => y !== x._id
                                            );
                                        }

                                        saUpdateFilter({
                                            playstyles: value,
                                        });
                                    }}
                                />
                            ))}
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
                        <Dropdown
                            className="flex-grow-1"
                            options={gameOpt}
                            value={filters.gameId}
                            onChange={(e) => saUpdateFilter({ gameId: e })}
                        />
                    </Col>
                </Row>

                <Row>
                    <Col className="d-flex align-items-center gap-2 mb-3">
                        <p className={cx("m-0", styles["filter-label-col"])}>
                            Mode:
                        </p>
                        <Dropdown
                            className="flex-grow-1"
                            options={modeOpt}
                            value={filters.modeId}
                            onChange={(e) => saUpdateFilter({ modeId: e })}
                        />
                    </Col>
                </Row>

                {props.children}
            </div>

            <Button
                className="btn-findteam"
                style={{
                    display: !!props.squad.joinQueue ? "none" : "block",
                }}
                onClick={() => enterMatchmaking(id)}
            >
                <AiOutlineUsergroupAdd />
                <span className="ms-1">Find teammates</span>
            </Button>

            <Button
                className="btn-findteam"
                style={{
                    display: !props.squad.joinQueue ? "none" : "block",
                }}
                onClick={() => exitMatchMaking(id)}
            >
                <AiOutlineUsergroupAdd />
                <span className="ms-1">Stop</span>
            </Button>
        </form>
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

export interface SquadFilterProps extends NextPageProps {
    squad: WithId<ISquad>;
    filters: any;
    languages: any[];
    genders: any[];
    playstyles: any[];
    games: any[];
    modes: any[];
    children?: React.ReactNode;
}

export interface PlaystyleBtnProps {
    label: string;
    checked: boolean;
    onChange: (value: boolean) => void;
}

export default SquadFilterView;
