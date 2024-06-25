import AdminNavigationPanel from "@/components/AdminNavigationPanel";
import Dividers from "@/components/Dividers";
import ManageLanguageFilter from "@/components/FilterSettings/ManageLanguageFilter";
import ManagePlayStyleFilter from "@/components/FilterSettings/ManagePlaystyleFilter";
import Header from "@/components/Header";
import dbConnect from "@/lib/mongoConnect";
import DefaultFilters from "@/models/defaultFiltersModel";
import FilterLanguages from "@/models/filterLanguageModel";
import FilterPlaystyles from "@/models/filterPlaystyleModel";
import { jsonStrip } from "@/utils";
import { COLORS } from "@/utils/constants";
import { Button, Col, Form, Row } from "react-bootstrap";

const AdminPage = async () => {
    await dbConnect();
    const filterLangs = jsonStrip(await FilterLanguages.find({}).exec());
    const defaults = jsonStrip(await DefaultFilters.find({}).exec())?.[0];
    const filterPlaystyles = jsonStrip(await FilterPlaystyles.find({}).exec());
    return (
        <div>
            <Header />
            <Row className="m-1">
                <Col md={3} className="p-1">
                    <AdminNavigationPanel />
                </Col>
                <Col md={9} className="p-1 ">
                    <div className="background-1 border-primary-glow p-3 m-1 rounded">
                        <h1>Filter settings</h1>
                        <ManageLanguageFilter
                            items={filterLangs}
                            defaults={defaults}
                        />

                        <Dividers />

                        <ManagePlayStyleFilter items={filterPlaystyles} />
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default AdminPage;
