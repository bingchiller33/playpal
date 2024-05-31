"use client";

import { Col, Row } from "react-bootstrap";
import Dropdown from "@/components/Dropdown";
import cx from "classnames";
import styles from "./SquadFilter.module.css";
import { useOptimistic, useTransition } from "react";
import { updateSpecFilter } from "./SquadFilter.actions";
import { toast } from "react-toastify";
import debounce from "@/utils/debounce";

export function LolSpecFilter(props: LolSpecFilterProps) {
    const [isPending, startTransition] = useTransition();
    const [filters, setFilters] = useOptimistic(
        props.filter,
        (cur, next: any) => {
            return { ...cur, ...next };
        }
    );

    const debouncedUpdateFilter = debounce(
        async (update: Record<string, any>) => {
            const result = await updateSpecFilter(props.id, update);
            result.success || toast.error(result.msg);
        },
        1000
    );

    const saUpdateFilter = async (update: Record<string, any>) => {
        startTransition(async () => {
            setFilters(update);
            await debouncedUpdateFilter(update);
        });
    };

    const rankOpt = props.ranks.map((x) => ({
        label: x.name,
        value: x._id,
        iconUrl: x.iconUrl,
    }));

    const serverOpt = props.servers.map((x) => ({
        label: x.name,
        value: x._id,
    }));

    return (
        <>
            <Row>
                <Col className="d-flex align-items-center gap-2 mb-3">
                    <p className={cx("m-0", styles["filter-label-col"])}>
                        Server:
                    </p>
                    <Dropdown
                        className="flex-grow-1"
                        options={serverOpt}
                        value={filters.serverId}
                        onChange={(e) => saUpdateFilter({ serverId: e })}
                    />
                </Col>
            </Row>

            <Row>
                <Col className="d-flex align-items-center gap-2 mb-3">
                    <p className={cx("m-0", styles["filter-label-col"])}>
                        Rank:
                    </p>
                    <Dropdown
                        className="flex-grow-1"
                        value={filters.rankId}
                        options={rankOpt}
                        onChange={(e) => saUpdateFilter({ rankId: e })}
                    />
                </Col>
            </Row>
        </>
    );
}

export interface LolSpecFilterProps {
    id: string;
    ranks: any[];
    servers: any[];
    filter: any;
}
