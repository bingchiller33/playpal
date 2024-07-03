import MasterDatas from "@/models/masterDataModel";

export async function getMasterData() {
    const data =
        (await MasterDatas.findOne({}).exec()) ??
        (await MasterDatas.create({}));
    return data;
}
