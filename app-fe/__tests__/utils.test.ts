import { minMap } from "@/utils";

describe("function minMap", () => {
    it("should return smallest number", () => {
        const actual = minMap({
            a: 1,
            b: 2,
            c: 3,
        });

        expect(actual).toBe(1);
    });

    it("should return undefined", () => {
        const actual = minMap({});
        expect(actual).toBe(undefined);
    });
});
