export function jsonStrip<T>(a: T): T {
    return JSON.parse(JSON.stringify(a));
}

export function minMap(input: Record<string, number>) {
    return Object.keys(input)
        .map((x) => input[x])
        .reduce((a, b) => Math.min(a, b));
}
