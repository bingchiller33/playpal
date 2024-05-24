import { NextPageProps } from "@/utils/types";

const SquadChat = ({ params }: NextPageProps) => {
    const { id, page } = params;
    return (
        <div>
            <h1>Edit at src/SquadChat.tsx </h1>
            <p>Squad id: {id}</p>
        </div>
    );
};

export default SquadChat;
