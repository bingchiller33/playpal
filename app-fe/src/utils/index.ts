import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

export function jsonStrip<T>(a: T): T {
    return JSON.parse(JSON.stringify(a));
}

export function minMap(input: Record<string, number>) {
    if (!Object.keys(input).length) {
        return undefined;
    }

    return Object.keys(input)
        .map((x) => input[x])
        .reduce((a, b) => Math.min(a, b));
}

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo("en-US");
export function fmtRelDate(time: number | Date) {
    return timeAgo.format(time);
}
