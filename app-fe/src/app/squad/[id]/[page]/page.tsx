import SquadMember from "@/components/SquadMember";
import SquadHeader from "./SquadHeader";
import SquadsRibbon from "./SquadsRibbon";
import styles from "./page.module.css";
import { Col, Row } from "react-bootstrap";
import SquadFilter from "@/components/SquadFilter";
import SquadTabs from "./SquadTabs";
import cx from "classnames";
import { NextPageProps } from "@/utils/types";
import SquadChat from "@/components/SquadChat";
import dbConnect from "@/lib/mongoConnect";
import Squads from "@/models/squadModel";
import { jsonStrip } from "@/utils";
import {
    getMembers,
    getMembersRecommend,
} from "@/repositories/squadRepository";
import Header from "@/components/Header";
import SquadEnrollments from "@/models/squadEnrollmentModel";
import { sessionOrLogin } from "@/utils/server";
import { redirect } from "next/navigation";

import type { Metadata } from "next";

export async function generateMetadata(
    pageProps: NextPageProps
): Promise<Metadata> {
    const id = pageProps.params.id;
    await dbConnect();
    const squad = jsonStrip(await Squads.findOne({ _id: id }).exec());
    const name = squad?.name ?? "";
    return {
        title: `${name} Squad | PlayPal`,
    };
}

const SquadPage = async (pageProps: NextPageProps) => {
    const { params } = pageProps;
    const { id, page } = params;

    await dbConnect();
    const session = await sessionOrLogin();
    const hasJoined = await SquadEnrollments.findOne({
        accountId: session.user.id,
        squadId: id,
        leaveDate: null,
    }).exec();
    if (!hasJoined) {
        redirect("/");
    }

    const squad = jsonStrip(await Squads.findOne({ _id: id }).exec());
    const members = jsonStrip(await getMembers(id));
    const membersRecommend = jsonStrip(await getMembersRecommend(members));
    let main;
    if (page === "filters") {
        main = <SquadFilter {...pageProps} squad={squad!} page={page} />;
    } else if (page === "chat") {
        main = <SquadChat {...pageProps} />;
    } else if (page === "members" || page === "request") {
        main = (
            <SquadMember
                {...pageProps}
                members={members}
                membersRecommend={membersRecommend}
            />
        );
    }

    return (
        <div className={cx(styles.layout, "pb-1")} style={{ height: "100dvh" }}>
            <div className="pb-2  d-none d-md-block" style={{ gridArea: "h" }}>
                <Header />
            </div>
            <div
                className="d-none d-md-block  me-2 border-primary-glow rounded background-1 ms-1 panel-layout-child"
                style={{ gridArea: "l" }}
            >
                <SquadsRibbon />
            </div>

            <div
                className={cx(
                    "background-1 h-100",
                    styles["main-content-panel"]
                )}
                style={{
                    overflow: "auto",
                }}
            >
                <SquadHeader squad={squad!} {...jsonStrip(pageProps)} />

                <div className={cx(styles["main-inner"])}>
                    <div
                        className="h-100 d-none d-md-block "
                        style={{
                            overflow: "auto",
                            borderRight: "1px solid red",
                        }}
                    >
                        <SquadFilter
                            {...pageProps}
                            squad={squad!}
                            page={page}
                        />
                    </div>

                    <div className="h-100" style={{ overflow: "auto" }}>
                        <div className="d-md-none h-100">{main}</div>
                        <div
                            className="d-none d-md-block"
                            style={{ height: "100%" }}
                        >
                            <SquadChat {...pageProps} />
                        </div>
                    </div>
                </div>
            </div>
            <div
                className="d-none d-md-block border-primary-glow  background-1 border-bl-0 border-tl-0 me-1"
                style={{
                    gridArea: "r",
                    borderRadius: "0.375rem",
                    width: "25vw",
                    position: "relative",
                }}
            >
                <SquadMember
                    {...pageProps}
                    members={members}
                    membersRecommend={membersRecommend}
                />
            </div>
            <div className="d-md-none h-100" style={{ gridArea: "t" }}>
                <SquadTabs active={page as any} id={id} />
            </div>
        </div>
    );
};

export default SquadPage;
