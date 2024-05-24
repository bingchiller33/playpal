import { NextPageProps } from "@/utils/types";
import { redirect } from "next/navigation";

const SquadPage = ({ params }: NextPageProps) => {
    console.log("wghy");
    redirect(`/squad/${params.id}/chat`);
};

export default SquadPage;
