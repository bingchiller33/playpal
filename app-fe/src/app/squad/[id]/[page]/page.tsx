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
import Squads from "@/models/SquadModel";
import { jsonStrip } from "@/utils";

const SquadPage = async (pageProps: NextPageProps) => {
    const { params } = pageProps;
    const { id, page } = params;

    await dbConnect();
    const squad = jsonStrip(await Squads.findOne({ _id: id }).exec());

    let main;
    if (page === "filters") {
        main = <SquadFilter {...pageProps} squad={squad} />;
    } else if (page === "chat") {
        main = <SquadChat {...pageProps} />;
    } else if (page === "members") {
        main = <SquadMember {...pageProps} />;
    }

    return (
        <div className={cx(styles.layout, "m-md-3")}>
            <div
                className="d-none d-md-block  me-3 border-primary-glow rounded background-1"
                style={{ gridArea: "l" }}
            >
                <SquadsRibbon
                    squads={[{ name: "GG" }, { name: "GG" }, { name: "GG" }]}
                />
            </div>
            <div
                className={cx(
                    "d-flex flex-column  background-1",
                    styles["main-content-panel"]
                )}
                style={{ gridArea: "m" }}
            >
                <div
                    style={{ borderBottom: "1px solid var(--clr-primary-1)" }}
                    className="px-2"
                >
                    <SquadHeader />
                </div>

                <Row className="h-100">
                    <Col
                        md={5}
                        className="d-none d-md-block"
                        style={{
                            borderRight: "1px solid red",
                        }}
                    >
                        <SquadFilter {...pageProps} squad={squad} />
                    </Col>
                    <Col md={7}>
                        <div className="d-md-none">{main}</div>
                        <div className="d-none d-md-block">
                            <SquadChat {...pageProps} />
                        </div>
                    </Col>
                </Row>
            </div>
            <div
                className="  d-none d-md-block border-primary-glow rounded background-1 border-bl-0 border-tl-0"
                style={{
                    gridArea: "r",
                    width: "15vw",
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
