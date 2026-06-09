export class Vec2 {
    x: number
    y: number

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }

    static initial(v: number) {
        return new Vec2(v, v)
    }

    static empty() {
        return new Vec2(0, 0)
    }

    add(other: Vec2 | number) {
        typeof other === "number" ? this.x += other : this.x += other.x
        typeof other === "number" ? this.y += other : this.y += other.y

        return this
    }
    sub(other: Vec2 | number) {
        typeof other === "number" ? this.x -= other : this.x -= other.x
        typeof other === "number" ? this.y -= other : this.y -= other.y

        return this
    }
    mul(other: Vec2 | number) {
        typeof other === "number" ? this.x *= other : this.x *= other.x
        typeof other === "number" ? this.y *= other : this.y *= other.y

        return this
    }
    div(other: Vec2 | number) {
        typeof other === "number" ? this.x /= other : this.x /= other.x
        typeof other === "number" ? this.y /= other : this.y /= other.y

        return this
    }

    map(cb: (v: number) => number) {
        this.x = cb(this.x)
        this.y = cb(this.y)

        return this
    }

    toArr(): [number, number, number] {
        return [
            this.x,
            this.y,
            0
        ]
    }
}

export class Vec3 extends Vec2 {
    z: number

    constructor(x: number, y: number, z: number) {
        super(x, y)
        this.z = z
    }

    static initial(v: number) {
        return new Vec3(v, v, v)
    }

    static empty() {
        return new Vec3(0, 0, 0)
    }

    static fromHex(value: string): Vec3 {
        return new Vec3(
            parseInt(value.slice(0, 2), 16),
            parseInt(value.slice(2, 4), 16),
            parseInt(value.slice(4, 6), 16)
        )
    }

    add(other: Vec3 | number) {
        typeof other === "number" ? this.x += other : this.x += other.x
        typeof other === "number" ? this.y += other : this.y += other.y
        typeof other === "number" ? this.z += other : this.z += other.z

        return this
    }
    sub(other: Vec3 | number) {
        typeof other === "number" ? this.x -= other : this.x -= other.x
        typeof other === "number" ? this.y -= other : this.y -= other.y
        typeof other === "number" ? this.z -= other : this.z -= other.z

        return this
    }
    mul(other: Vec3 | number) {
        this.x *= typeof other === "number" ? other : other.x
        this.y *= typeof other === "number" ? other : other.y
        this.z *= typeof other === "number" ? other : other.z

        return this
    }
    div(other: Vec3 | number) {
        typeof other === "number" ? this.x /= other : this.x /= other.x
        typeof other === "number" ? this.y /= other : this.y /= other.y
        typeof other === "number" ? this.z /= other : this.z /= other.z

        return this
    }

    map(cb: (v: number) => number) {
        this.x = cb(this.x)
        this.y = cb(this.y)
        this.z = cb(this.z)

        return this
    }

    toArr(): [number, number, number] {
        return [
            this.x,
            this.y,
            this.z
        ]
    }
}

export type VertexPositionColorTexture = {
    pos: Vec2,
    color: Vec3,
    uv: Vec2,
    alpha: number
}

export type VertexPositionColor = {
    pos: Vec2,
    color: Vec3,
}

export const chooseRand = <T>(arr: T[]): T =>
    arr[Math.floor(Math.random() * arr.length)]

export const mod = (x: number, m: number) =>
    (x % m + m) % m

export const randRange = (x: number, y: number) =>
    x + Math.random() * y

export const clamp = (value: number, min: number, max: number) =>
    Math.max(Math.min(value, max), min)

export const lerp = (a: number, b: number, t: number): number =>
    a * (1 - t) + b * t


export const approach = (current: number, target: number, dt: number) =>
    current < target
        ? Math.min(current + dt, target)
        : Math.max(current - dt, target)

export const add = <V extends Vec2 | Vec3>(x: V, y: V): V =>
    "z" in x && "z" in y
        ? new Vec3(x.x + y.x, x.y + x.y, x.z + x.z) as V
        : new Vec2(x.x + y.x, x.y + x.y) as V
export const sub = <V extends Vec2 | Vec3>(x: V, y: V): V =>
    "z" in x && "z" in y
        ? new Vec3(x.x - y.x, x.y - x.y, x.z - x.z) as V
        : new Vec2(x.x - y.x, x.y - x.y) as V
export const mul = <V extends Vec2 | Vec3>(x: V, y: V): V =>
    "z" in x && "z" in y
        ? new Vec3(x.x * y.x, x.y * x.y, x.z * x.z) as V
        : new Vec2(x.x * y.x, x.y * x.y) as V
export const div = <V extends Vec2 | Vec3>(x: V, y: V): V =>
    "z" in x && "z" in y
        ? new Vec3(x.x / y.x, x.y / x.y, x.z / x.z) as V
        : new Vec2(x.x / y.x, x.y / x.y) as V
