"use client";

import { Col, Row } from "react-bootstrap";
import Dropdown from "@/components/Dropdown";
import cx from "classnames";
import styles from "./SquadFilter.module.css";
import { useOptimistic, useTransition } from "react";
import { revalidateFilters, updateSpecFilter } from "./SquadFilter.server";
import { toast } from "react-toastify";
import promisedb from "@/utils/debounce";
import { useSquadFilterUpdates } from "@/lib/usePusherEvents";
import { useRouter } from "next/navigation";

export function LolSpecFilter(props: LolSpecFilterProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [filters, setFilters] = useOptimistic(
        props.filter,
        (cur, next: any) => {
            return { ...cur, ...next };
        }
    );
    useSquadFilterUpdates(props.id, () => {
        startTransition(async () => {
            await revalidateFilters(props.id, props.page);
            setFilters(props.filter);
        });
    });

    const pdUpdateFilter = promisedb(async (update: Record<string, any>) => {
        const result = await updateSpecFilter(props.id, update);
        result.success || toast.error(result.msg);
    }, 1000);

    const saUpdateFilter = async (update: Record<string, any>) => {
        startTransition(async () => {
            setFilters(update);
            await pdUpdateFilter(update);
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
    page: string;
    ranks: any[];
    servers: any[];
    filter: any;
}
