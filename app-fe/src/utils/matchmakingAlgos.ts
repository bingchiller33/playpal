import { minMap } from ".";

/**
 * Calculate 1 component of relevant vector
 * @param prefered Preference trait, usually specified in squad filter
 * @param target Targeted squad trait to test
 * @param w Final weight
 * @param rv Variance
 */
export function relevant(
    prefered: number,
    target: number,
    w: number,
    rv: number
) {
    return (target * rv - prefered) * w;
}

/**
 * Calculate u value for 1 squad trait
 * @param squadPrefTraits Squad Preferences, Calculated from SquadFilter
 * @param squadAvgTraits Squad Average Member Traits, Calculated from taking avg for each member traits
 * @param feedback The feedback user rated after leaving the squad
 * @param squadTime The amount of time (in days) the account is a member in this squad
 * @param timeSensitivity Global configuration for how sensitive time affect weight value
 */
export function nonNormalDynWeight(
    squadPrefTraits: number,
    squadAvgTraits: number,
    feedback: number,
    squadTime: number,
    timeSensitivity: number
) {
    const r = relevant(squadPrefTraits, squadAvgTraits, 1, 1);
    const abs = Math.abs(r);
    const ratingFactor = abs * (feedback - 3);
    let timeFactor = abs * Math.min((squadTime - 3) * timeSensitivity, 2);
    return 1 + ratingFactor + timeFactor;
}

export function normalizeDynWeight(u: Record<string, number>) {
    const minU = minMap(u)!;
    if (minU < 0) {
        for (const item in u) {
            u[item] += 1 - minU;
        }
    }

    const du = Math.sqrt(
        Object.keys(u)
            .map((x) => u[x] * u[x])
            .reduce((a, b) => a + b)
    );

    for (const item in u) {
        const val = u[item];
        u[item] = du > 0.1 ? (val * val) / du : 0.2;
    }
}

export function varianceRand(variance: number) {
    return 1 - Math.random() * variance;
}

export interface SquadInput {
    squadId: string;
    traits: Record<
        string,
        {
            ideal: number;
            avg: number;
            weight: number;
            random: number;
        }
    >;
}

function rValueSingle(squad: SquadInput, other: SquadInput) {
    let rValue = 0;
    for (const trait in squad.traits) {
        const r = relevant(
            squad.traits[trait].ideal,
            other.traits[trait]?.avg ?? 0,
            squad.traits[trait].weight,
            squad.traits[trait].random
        );
        rValue += r * r;
    }
    return Math.sqrt(rValue);
}

function rValue(squad: SquadInput, other: SquadInput) {
    return Math.max(rValueSingle(squad, other), rValueSingle(other, squad));
}

function timeFn(rVal: number, base: number = 1, exp: number = 1.2) {
    return (rVal / base) ** (1 / exp);
}

export function matchTime(
    squad: SquadInput,
    other: SquadInput,
    base: number = 1,
    exp: number = 1.2
) {
    const rVal = rValue(squad, other);
    return timeFn(rVal, base, exp);
}
