import { NextPageProps } from "@/utils/types";

const SquadFilter = ({ params }: NextPageProps) => {
    const { id, page } = params;
    return (
        <div>
            <h1>Edit at src/SquadFilter.tsx </h1>
            <p>Squad id: {id}</p>
        </div>
    );
};

export default SquadFilter;
