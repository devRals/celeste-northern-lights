import { describe, it, expect } from "vitest"
import { Vec2, Vec3 } from "../vectors.js"

// helpers
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

describe("Vec2", () => {
    describe("static constructors", () => {
        it("zero()", () => expectVec2(Vec2.zero(), 0, 0))
        it("one()", () => expectVec2(Vec2.one(), 1, 1))
        it("initial(v)", () => expectVec2(Vec2.initial(5), 5, 5))
    })

    describe("arithmetic (Vec2)", () => {
        it("add vec", () => expectVec2(v2(1, 2).add(v2(3, 4)), 4, 6))
        it("add scalar", () => expectVec2(v2(1, 2).add(10), 11, 12))
        it("sub vec", () => expectVec2(v2(5, 6).sub(v2(1, 2)), 4, 4))
        it("sub scalar", () => expectVec2(v2(5, 6).sub(2), 3, 4))
        it("mul vec", () => expectVec2(v2(2, 3).mul(v2(4, 5)), 8, 15))
        it("mul scalar", () => expectVec2(v2(2, 3).mul(3), 6, 9))
        it("div vec", () => expectVec2(v2(8, 9).div(v2(2, 3)), 4, 3))
        it("div scalar", () => expectVec2(v2(6, 9).div(3), 2, 3))
        it("is chainable", () => expectVec2(v2(1, 1).add(v2(1, 1)).mul(2), 4, 4))
    })

    describe("dot & cross", () => {
        it("dot product", () => expect(v2(1, 2).dot(v2(3, 4))).toBe(11))
        it("cross product (scalar)", () => expect(v2(1, 0).cross(v2(0, 1))).toBe(1))
        it("cross product negative", () => expect(v2(0, 1).cross(v2(1, 0))).toBe(-1))
    })

    describe("map", () => {
        it("applies cb to x and y", () => expectVec2(v2(2, 3).map(v => v * 2), 4, 6))
    })

    describe("length & lengthSquared", () => {
        it("length of (3, 4) is 5", () => expect(v2(3, 4).length()).toBeCloseTo(5))
        it("lengthSquared of (3, 4) is 25", () => expect(v2(3, 4).lengthSquared()).toBe(25))
    })

    describe("normalize", () => {
        it("unit vector has length 1", () => expect(v2(5, 0).normalize().length()).toBeCloseTo(1))
        it("direction is preserved", () => expectVec2(v2(5, 0).normalize(), 1, 0))
        it("zero vector stays zero", () => expectVec2(v2(0, 0).normalize(), 0, 0))
    })

    describe("distance", () => {
        it("distance between (0,0) and (3,4) is 5", () => expect(v2(0, 0).distance(v2(3, 4))).toBeCloseTo(5))
        it("distance to self is 0", () => expect(v2(3, 4).distance(v2(3, 4))).toBe(0))
    })

    describe("clone", () => {
        it("returns equal values", () => {
            const a = v2(1, 2)
            const b = a.clone()
            expectVec2(b, 1, 2)
        })
        it("is a deep copy", () => {
            const a = v2(1, 2)
            const b = a.clone()
            a.add(v2(10, 10))
            expectVec2(b, 1, 2)
        })
    })

    describe("toArr", () => {
        it("returns [x, y, 0]", () => expect(v2(3, 4).toArr()).toEqual([3, 4, 0]))
    })
})

describe("Vec3", () => {
    describe("static constructors", () => {
        it("zero()", () => expectVec3(Vec3.zero(), 0, 0, 0))
        it("one()", () => expectVec3(Vec3.one(), 1, 1, 1))
        it("initial(v)", () => expectVec3(Vec3.initial(7), 7, 7, 7))
    })

    describe("fromHex", () => {
        it("parses white", () => expectVec3(Vec3.fromHex("ffffff"), 255, 255, 255))
        it("parses black", () => expectVec3(Vec3.fromHex("000000"), 0, 0, 0))
        it("parses blue", () => expectVec3(Vec3.fromHex("0000ff"), 0, 0, 255))
        it("parses a mixed color", () => expectVec3(Vec3.fromHex("ff8000"), 255, 128, 0))
    })

    describe("arithmetic (Vec3)", () => {
        it("add vec", () => expectVec3(v3(1, 2, 3).add(v3(4, 5, 6)), 5, 7, 9))
        it("add scalar", () => expectVec3(v3(1, 2, 3).add(10), 11, 12, 13))
        it("sub vec", () => expectVec3(v3(5, 6, 7).sub(v3(1, 2, 3)), 4, 4, 4))
        it("sub scalar", () => expectVec3(v3(5, 6, 7).sub(2), 3, 4, 5))
        it("mul vec", () => expectVec3(v3(2, 3, 4).mul(v3(5, 6, 7)), 10, 18, 28))
        it("mul scalar", () => expectVec3(v3(2, 3, 4).mul(3), 6, 9, 12))
        it("div vec", () => expectVec3(v3(8, 9, 12).div(v3(2, 3, 4)), 4, 3, 3))
        it("div scalar", () => expectVec3(v3(6, 9, 12).div(3), 2, 3, 4))
        it("is chainable", () => expectVec3(v3(1, 1, 1).add(v3(1, 1, 1)).mul(2), 4, 4, 4))
    })

    describe("dot & cross", () => {
        it("dot product", () => expect(v3(1, 2, 3).dot(v3(4, 5, 6))).toBe(32))
        it("cross product of x and y axes is z", () => expectVec3(v3(1, 0, 0).cross(v3(0, 1, 0)), 0, 0, 1))
        it("cross product does not mutate original", () => {
            const a = v3(1, 0, 0)
            a.cross(v3(0, 1, 0))
            expectVec3(a, 1, 0, 0)
        })
    })

    describe("map", () => {
        it("applies cb to x, y and z", () => expectVec3(v3(1, 2, 3).map(v => v * 3), 3, 6, 9))
    })

    describe("length & lengthSquared", () => {
        it("length of (1,2,2) is 3", () => expect(v3(1, 2, 2).length()).toBeCloseTo(3))
        it("lengthSquared of (1,2,2) is 9", () => expect(v3(1, 2, 2).lengthSquared()).toBe(9))
    })

    describe("normalize", () => {
        it("unit vector has length 1", () => expect(v3(5, 0, 0).normalize().length()).toBeCloseTo(1))
        it("direction is preserved", () => expectVec3(v3(5, 0, 0).normalize(), 1, 0, 0))
        it("zero vector stays zero", () => expectVec3(v3(0, 0, 0).normalize(), 0, 0, 0))
    })

    describe("distance", () => {
        it("distance between (0,0,0) and (1,2,2) is 3", () => expect(v3(0, 0, 0).distance(v3(1, 2, 2))).toBeCloseTo(3))
        it("distance to self is 0", () => expect(v3(1, 2, 3).distance(v3(1, 2, 3))).toBe(0))
    })

    describe("clone", () => {
        it("returns equal values", () => {
            const a = v3(1, 2, 3)
            const b = a.clone()
            expectVec3(b, 1, 2, 3)
        })
        it("is a deep copy", () => {
            const a = v3(1, 2, 3)
            const b = a.clone()
            a.add(v3(10, 10, 10))
            expectVec3(b, 1, 2, 3)
        })
    })

    describe("toArr", () => {
        it("returns [x, y, z]", () => expect(v3(1, 2, 3).toArr()).toEqual([1, 2, 3]))
    })
})
