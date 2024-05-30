export function jsonStrip<T>(a: T): T {
    return JSON.parse(JSON.stringify(a));
}
