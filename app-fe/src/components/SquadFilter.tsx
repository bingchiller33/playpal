import dbConnect from "@/lib/mongoConnect";
import SquadFilterView from "./SquadFilterView";
import { jsonStrip } from "@/utils";
import FilterLanguages from "@/models/FilterLanguageModel";
import FilterGenders from "@/models/FilterGenderModel";
import FilterPlaystyles from "@/models/FilterPlaystyleModel";
import FilterGames from "@/models/FilterGameModel";
import FilterGameModes from "@/models/FilterGameModeModel";
import { NextPageProps } from "@/utils/types";
import { LolSpecFilter } from "./SquadSpecFilter";
import FilterLOLRanks from "@/models/FilterLOLRankModel";
import FilterLOLServers from "@/models/FilterLOLServerModel";

const SquadFilter = async (props: SquadFilterProps) => {
    await dbConnect();
    const langs = jsonStrip(await FilterLanguages.find({}).exec());
    const genders = jsonStrip(await FilterGenders.find({}).exec());
    const playstyles = jsonStrip(await FilterPlaystyles.find({}).exec());
    const games = jsonStrip(await FilterGames.find({}).exec());
    const modes = jsonStrip(
        await FilterGameModes.find({ gameId: props.squad.filter.gameId }).exec()
    );

    let spec;
    if (props.squad.filter.gameId === "6656b7cc0342bce980eeb7cb") {
        const ranks = jsonStrip(await FilterLOLRanks.find({}).exec());
        const servers = jsonStrip(await FilterLOLServers.find({}).exec());
        spec = (
            <LolSpecFilter
                id={props.squad._id}
                ranks={ranks}
                servers={servers}
                filter={props.squad.filter.specFilter}
            />
        );
    } else {
        spec = null;
    }

    return (
        <SquadFilterView
            {...props}
            filters={props.squad.filter}
            games={games}
            modes={modes}
            genders={genders}
            languages={langs}
            playstyles={playstyles}
        >
            {spec}
        </SquadFilterView>
    );
};

export interface SquadFilterProps extends NextPageProps {
    squad: any;
}

export default SquadFilter;
