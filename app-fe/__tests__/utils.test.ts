import { minMap } from "@/utils";

describe("Function01", () => {
    it("UC01", () => {
        const actual = minMap({
            a: 1,
            b: 2,
            c: 3,
        });

        expect(actual).toBe(1);
    });

    it("UC02", () => {
        const actual = minMap({});
        expect(actual).toBe(undefined);
    });
});
