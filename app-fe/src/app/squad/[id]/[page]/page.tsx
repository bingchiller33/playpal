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
import Header from "@/components/Header";
import { getUserActiveSquads } from "@/repositories/squadRepository";

const SquadPage = async (pageProps: NextPageProps) => {
    const { params } = pageProps;
    const { id, page } = params;

    await dbConnect();
    const squad = jsonStrip(await Squads.findOne({ _id: id }).exec());

    let main;
    if (page === "filters") {
        main = <SquadFilter {...pageProps} squad={squad} page={page} />;
    } else if (page === "chat") {
        main = <SquadChat {...pageProps} />;
    } else if (page === "members" || page === "request") {
        main = <SquadMember {...pageProps} />;
    }

    return (
        <div className={cx(styles.layout, "pb-1")} style={{ height: "100vh" }}>
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
                <SquadHeader {...pageProps} squad={squad} />
                <div className={cx(styles["main-inner"])}>
                    <div
                        className="h-100 d-none d-md-block "
                        style={{
                            overflow: "auto",
                            borderRight: "1px solid red",
                        }}
                    >
                        <SquadFilter {...pageProps} squad={squad} page={page} />
                    </div>

                    <div className="h-100" style={{ overflow: "auto" }}>
                        <div className="d-md-none">{main}</div>
                        <div className="d-none d-md-block">
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
                <SquadMember {...pageProps} />
            </div>
            <div className="d-md-none h-100" style={{ gridArea: "t" }}>
                <SquadTabs active={page as any} id={id} />
            </div>
        </div>
    );
};

export default SquadPage;
