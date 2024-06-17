import Footer from "@/components/Footer";
import Header from "@/components/Header";
import InviteResponseCard from "@/components/InviteResponseCard";
import { getAllInvitationToSquad } from "@/repositories/squadRepository";
import { jsonStrip } from "@/utils";
import { sessionOrLogin } from "@/utils/server";
import { NextPageProps } from "@/utils/types";
import { Container, Modal } from "react-bootstrap";

const ReceiveRequestJoinSquad = async (pageProps: NextPageProps) => {
    const { params } = pageProps;
    const { id } = params;
    const session = await sessionOrLogin();
    let invites = jsonStrip(await getAllInvitationToSquad(session.user.id));
    let highlight = undefined;
    if (id !== "all" && !!id) {
        highlight = invites.find((inv) => inv._id.toString() === id);
        invites = invites.filter((inv) => inv._id.toString() !== id);
    }
    return (
        <main className="d-flex flex-column h-100">
            <Header />
            <Container className="flex-grow-1">
                <h1 className="m-3 ms-5 ">Invitations</h1>
                <div>
                    {highlight && <InviteResponseCard inv={highlight} />}
                    {invites.map((inv) => (
                        <InviteResponseCard
                            key={inv._id.toString()}
                            inv={inv}
                        />
                    ))}
                </div>
            </Container>
            <Footer />
        </main>
    );
};

export default ReceiveRequestJoinSquad;
