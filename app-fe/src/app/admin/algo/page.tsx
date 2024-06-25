import AdminNavigationPanel from "@/components/AdminNavigationPanel";
import Dividers from "@/components/Dividers";
import Header from "@/components/Header";

import { Col, Row } from "react-bootstrap";
import { updateTimeFn, updateVariance } from "./server";
import dbConnect from "@/lib/mongoConnect";
import { getData } from "@/repositories/masterDataAlgoRepository";
import { jsonStrip } from "@/utils";

const ManageAlgoPage = async () => {
    await dbConnect();
    const data = jsonStrip(await getData());

    return (
        <div>
            <Header />
            <Row className="m-1">
                <Col md={4} className="p-1">
                    <AdminNavigationPanel />
                </Col>
                <Col md={8} className="p-1">
                    <div className="background-1 border-primary-glow p-1 m-1 rounded">
                        <h1>Matchmaking algorithm settings</h1>
                        <h2>Variance settings</h2>
                        <p>
                            Variance settings is designed to introduce a subtle
                            degree of randomness into the matching process. This
                            ensures that players with similar interests are not
                            constantly matched with the same individuals,
                            thereby enhancing the diversity and enjoyment of the
                            gaming experience.
                        </p>

                        <form className="d-flex gap-2" action={updateVariance}>
                            <input
                                className="pp-form-input searchForm"
                                type="number"
                                name="variance"
                                min="0"
                                max="1"
                                step={0.1}
                                placeholder="Variance value (0-1)"
                                defaultValue={data.variance}
                            />
                            <button
                                className="btn bg-primary-1 text-white"
                                type="submit"
                            >
                                Save
                            </button>
                        </form>

                        <Dividers />

                        <h2>Time function settings</h2>
                        <p>
                            this setting allows you to control how player
                            matching evolves over time. This setting includes
                            two fields: Scale and Exponent (time(t) = Scale * t
                            ^ exponent).
                        </p>

                        <form className="d-flex gap-2" action={updateTimeFn}>
                            <input
                                className="pp-form-input searchForm"
                                type="number"
                                name="base"
                                min="0"
                                step={0.01}
                                defaultValue={data.base}
                                placeholder="Scale"
                            />
                            <input
                                className="pp-form-input searchForm"
                                type="number"
                                name="exp"
                                step={0.01}
                                min="0"
                                placeholder="Exponent"
                                defaultValue={data.exp}
                            />
                            <button
                                className="btn bg-primary-1 text-white"
                                type="submit"
                            >
                                Save
                            </button>
                        </form>
                        <div className="d-none">
                            <Dividers />
                            <h2>Global weights</h2>
                            <p>Lorem ipsum</p>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default ManageAlgoPage;
