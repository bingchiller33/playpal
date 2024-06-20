import MasterDataAlgos from "@/models/masterDataAlgoModel";

export async function getData() {
    const data = await MasterDataAlgos.findOne({}).exec();
    if (!data) {
        const newDefault = await MasterDataAlgos.create({
            variance: 0.1,
            base: 1,
            exp: 1.2,
        });

        return newDefault;
    }

    return data;
}

export async function setVariance(value: number) {
    await MasterDataAlgos.findOneAndUpdate(
        {},
        { variance: value },
        { upsert: true }
    );
}

export async function setTimeFn(base: number, exp: number) {
    await MasterDataAlgos.findOneAndUpdate({}, { base, exp }, { upsert: true });
}
