import AdminNavigationPanel from "@/components/AdminNavigationPanel";
import OtherCharts from "@/components/DashboardCharts/OtherCharts";
import RegisteredPlayerInfo from "@/components/DashboardCharts/RegisteredPlayers";
import Header from "@/components/Header";
import dbConnect from "@/lib/mongoConnect";
import {
    getDailyAccountRegistered,
    getFilterDistribution,
    getTotalAccount,
    getUserGrowthLastMonth,
    getUserGrowthThisMonth,
} from "@/repositories/accountRepository";
import {
    getActiveSquad,
    getGameDistribution,
} from "@/repositories/squadRepository";
import { sessionOrLogin } from "@/utils/server";
import { Col, Row } from "react-bootstrap";

const AdminPage = async () => {
    await dbConnect();
    const accountInfo = await getDailyAccountRegistered();
    const accountTotal = await getTotalAccount();
    const growthCur = await getUserGrowthThisMonth();
    const growthLast = await getUserGrowthLastMonth();
    const squadData = await getActiveSquad();
    const gameData = await getGameDistribution();
    const filterData = await getFilterDistribution();
    // TODO: Queue Times

    console.log(await sessionOrLogin())

    return (
        <div>
            <Header />
            <Row className="m-1">
                <Col md={4} className="p-1">
                    <AdminNavigationPanel />
                </Col>
                <Col md={8} className="p-1">
                    <div className="background-1 border-primary-glow p-1 m-1 rounded">
                        <h1>Dashboard</h1>
                        <RegisteredPlayerInfo
                            data={accountInfo}
                            total={accountTotal}
                            growthCur={growthCur}
                            growthLast={growthLast}
                        />
                        <OtherCharts
                            squads={squadData}
                            filters={filterData}
                            games={gameData}
                        />
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default AdminPage;
