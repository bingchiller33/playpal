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
export function fmtRelDate(time: number | Date | string) {
    if (typeof time === "string") {
        time = Date.parse(time);
    }
    return timeAgo.format(time);
}

export function fmtDateInput(date: Date) {
    return date.toISOString().substring(0, 10);
}

export function addMonth(d: Date, months: number) {
    const curMonth = d.getMonth();
    if (d.getMonth() + months > 12) {
        d.setFullYear(d.getFullYear() + 1);
        d.setMonth(d.getMonth() + months - 12);
    } else {
        d.setMonth(curMonth + months);
    }

    return d;
}
