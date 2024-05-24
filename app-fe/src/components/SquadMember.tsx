import { NextPageProps } from "@/utils/types";

const SquadMember = ({ params }: NextPageProps) => {
    const { id, page } = params;
    return (
        <div>
            <h1>Edit at src/SquadMember.tsx </h1>
            <p>Squad id: {id}</p>
        </div>
    );
};

export default SquadMember;
