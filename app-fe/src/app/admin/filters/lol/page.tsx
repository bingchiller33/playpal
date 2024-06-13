import AdminNavigationPanel from "@/components/AdminNavigationPanel";
import ManageLOLModeFilter from "@/components/FilterSettings/ManageLOLModeFilter";
import ManageLOLRankFilter from "@/components/FilterSettings/ManageLOLRankFilter";
import ManageLOLServerFilter from "@/components/FilterSettings/ManageLOLServerFilter";
import ManageLanguageFilter from "@/components/FilterSettings/ManageLanguageFilter";
import ManagePlayStyleFilter from "@/components/FilterSettings/ManagePlaystyleFilter";
import Header from "@/components/Header";
import dbConnect from "@/lib/mongoConnect";
import DefaultFilters from "@/models/defaultFiltersModel";
import FilterGameModes from "@/models/filterGameModeModel";
import FilterLOLRanks from "@/models/filterLOLRankModel";
import FilterLOLServers from "@/models/filterLOLServerModel";
import FilterLanguages from "@/models/filterLanguageModel";
import FilterPlaystyles from "@/models/filterPlaystyleModel";
import { jsonStrip } from "@/utils";
import { COLORS } from "@/utils/constants";
import { Button, Col, Form, Row } from "react-bootstrap";

const AdminPage = async () => {
    await dbConnect();
    const filterModes = jsonStrip(await FilterGameModes.find({}).exec()).filter(
        (x) => x.gameId == "6656b7cc0342bce980eeb7cb"
    );

    const filterServers = jsonStrip(await FilterLOLServers.find({}).exec());
    const filterRanks = jsonStrip(await FilterLOLRanks.find({}).exec());
    const defaults = jsonStrip(await DefaultFilters.find({}).exec())?.[0];
    return (
        <div>
            <Header />
            <Row className="m-1">
                <Col md={3} className="p-1">
                    <AdminNavigationPanel />
                </Col>
                <Col md={9} className="p-1">
                    <div className="background-1 border-primary-glow p-3 m-1 rounded">
                        <h1>
                            Filter settings specialization: League of Legends
                        </h1>
                        <ManageLOLModeFilter
                            items={filterModes}
                            defaults={defaults}
                        />
                        <div
                            className="my-4"
                            style={{
                                border: `1px solid ${COLORS.PRIMARY_1}`,

                                opacity: 0.5,
                            }}
                        />
                        <ManageLOLServerFilter
                            items={filterServers}
                            defaults={defaults}
                        />

                        <div
                            className="my-4"
                            style={{
                                border: `1px solid ${COLORS.PRIMARY_1}`,

                                opacity: 0.5,
                            }}
                        />

                        <ManageLOLRankFilter
                            items={filterRanks}
                            defaults={defaults}
                        />
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default AdminPage;
