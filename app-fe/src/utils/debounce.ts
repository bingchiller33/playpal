export default function debounce<T extends Function>(inner: T, ms = 0) {
    let timer: NodeJS.Timeout | undefined;
    let resolves: any[] = [];

    return function (...args: any[]) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            let result = inner(...args);
            resolves.forEach((r) => r(result));
            resolves = [];
        }, ms);

        return new Promise((r) => resolves.push(r));
    };
}
