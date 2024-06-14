import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ReceiveInviteToSquad from "@/components/ReceiveInviteToSquad";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getAllInvitationToSquad } from "@/repositories/squadRepository";
import { jsonStrip } from "@/utils";
import { NextPageProps } from "@/utils/types";
import { getServerSession } from "next-auth";
import { Container, Modal } from "react-bootstrap";


const ReceiveRequestJoinSquad = async (pageProps: NextPageProps) => {
    const { params } = pageProps;
    const { id, page } = params;
    const session = await getServerSession(authOptions);
    let allInviteToSquad;
    if(session){
        const accountId = session?.user.id;
        allInviteToSquad = jsonStrip(await getAllInvitationToSquad(accountId));
    }

    return (
        <main>
            <Header />
            <Container>
                {
                    id === "all"  ?
                        <div>
                            {
                                allInviteToSquad && allInviteToSquad.map(inv => (
                                    <ReceiveInviteToSquad inv={inv} />
                                ))
                            }
                        </div>
                        :
                        <div>

                        </div>
                }
            </Container>
            <Footer />
        </main>
    )
}



export default ReceiveRequestJoinSquad;