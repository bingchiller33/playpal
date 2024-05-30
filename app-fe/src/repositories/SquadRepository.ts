import Squads from "@/models/squadModel";

// Write common database query here, dont write basic crud here, use the Collection directly
export async function createSquad() {
    let newSquad = await Squads.create({});
    return newSquad;
}
