import { describe, it, expect } from "vitest"
import { chooseRand, mod, randRange, clamp, lerp, approach, add, sub, mul, div } from "../functions.js"
import { Vec2, Vec3 } from "../vectors.js"

const v2 = (x: number, y: number) => new Vec2(x, y)
const v3 = (x: number, y: number, z: number) => new Vec3(x, y, z)
const expectVec2 = (v: Vec2, x: number, y: number) => {
    expect(v.x).toBe(x)
    expect(v.y).toBe(y)
}
const expectVec3 = (v: Vec3, x: number, y: number, z: number) => {
    expect(v.x).toBe(x)
    expect(v.y).toBe(y)
    expect(v.z).toBe(z)
}

describe("chooseRand", () => {
    it("returns an element from the array", () => {
        const arr = [1, 2, 3, 4, 5]
        expect(arr).toContain(chooseRand(arr))
    })

    it("works with a single element", () => {
        expect(chooseRand(["only"])).toBe("only")
    })

    it("works with different types", () => {
        const arr = ["a", "b", "c"]
        expect(arr).toContain(chooseRand(arr))
    })

    it("throws and Error if the list is empty", () => {
        expect(() => chooseRand([])).toThrow(Error)
    })
})

describe("mod", () => {
    it("works like normal modulo for positive numbers", () => {
        expect(mod(7, 3)).toBe(1)
        expect(mod(6, 3)).toBe(0)
    })

    it("returns positive result for negative dividend", () => {
        expect(mod(-1, 3)).toBe(2)
        expect(mod(-4, 3)).toBe(2)
    })

    it("handles zero", () => {
        expect(mod(0, 5)).toBe(0)
    })
})

describe("randRange", () => {
    it("returns a value within [min, max)", () => {
        for (let i = 0; i < 100; i++) {
            const val = randRange(5, 10)
            expect(val).toBeGreaterThanOrEqual(5)
            expect(val).toBeLessThan(10)
        }
    })

    it("returns min when min === max", () => {
        expect(randRange(3, 3)).toBe(3)
    })
})

describe("clamp", () => {
    it("returns value when within range", () => {
        expect(clamp(5, 0, 10)).toBe(5)
    })

    it("clamps to min", () => {
        expect(clamp(-5, 0, 10)).toBe(0)
    })

    it("clamps to max", () => {
        expect(clamp(15, 0, 10)).toBe(10)
    })

    it("works on boundaries", () => {
        expect(clamp(0, 0, 10)).toBe(0)
        expect(clamp(10, 0, 10)).toBe(10)
    })
})

describe("lerp", () => {
    it("returns a at t=0", () => {
        expect(lerp(0, 100, 0)).toBe(0)
    })

    it("returns b at t=1", () => {
        expect(lerp(0, 100, 1)).toBe(100)
    })

    it("returns midpoint at t=0.5", () => {
        expect(lerp(0, 100, 0.5)).toBe(50)
    })

    it("works with negative values", () => {
        expect(lerp(-10, 10, 0.5)).toBe(0)
    })
})

describe("approach", () => {
    it("moves current toward target by dt", () => {
        expect(approach(0, 10, 3)).toBe(3)
        expect(approach(10, 0, 3)).toBe(7)
    })

    it("does not overshoot target when approaching from below", () => {
        expect(approach(8, 10, 5)).toBe(10)
    })

    it("does not overshoot target when approaching from above", () => {
        expect(approach(2, 0, 5)).toBe(0)
    })

    it("stays at target when already there", () => {
        expect(approach(5, 5, 3)).toBe(5)
    })
})

describe("vector arithmetic", () => {
    describe("Vec2", () => {
        it("add()", () => expectVec2(add(v2(1, 2), v2(3, 4)), 4, 6))
        it("sub()", () => expectVec2(sub(v2(5, 6), v2(3, 4)), 2, 2))
        it("mul()", () => expectVec2(mul(v2(7, 8), v2(9, 10)), 63, 80))
        it("div()", () => expectVec2(div(v2(12, 10), v2(6, 2)), 2, 5))
    })

    describe("Vec3", () => {
        it("add()", () => expectVec3(add(v3(1, 2, 3), v3(3, 4, 5)), 4, 6, 8))
        it("sub()", () => expectVec3(sub(v3(5, 6, 7), v3(3, 4, 5)), 2, 2, 2))
        it("mul()", () => expectVec3(mul(v3(7, 8, 9), v3(9, 10, 11)), 63, 80, 99))
        it("div()", () => expectVec3(div(v3(12, 10, 9), v3(6, 2, 3)), 2, 5, 3))
    })
})
