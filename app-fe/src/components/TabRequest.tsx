import { NextPageProps } from "@/utils/types";
import MatchedSquad from "./MatchedSquad";
import SquadMatchs from "@/models/squadMatchModel";
import dbConnect from "@/lib/mongoConnect";
import { getMatchSquads } from "@/repositories/squadRepository";
import { jsonStrip } from "@/utils";
import TabRequestEventWatcher from "./TabRequestEventWatcher";

const TabRequest = async ({ id }: RequestProps) => {
    await dbConnect();
    const squadMatches = jsonStrip(await getMatchSquads(id));

    return (
        <div>
            {squadMatches.map((x) => (
                <MatchedSquad
                    key={x._id.toString()}
                    squad={x}
                    curSquadId={id}
                />
            ))}

            <TabRequestEventWatcher id={id} />
        </div>
    );
};

export interface RequestProps {
    id: string;
}

export default TabRequest;
