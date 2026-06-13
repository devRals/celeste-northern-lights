import type { Vec2, Vec3 } from "./vectors.js"

/**
 * 
 * @param arr 
 * @returns A random object from the given list
 * @throws An `Error` object if the `arr` is empty
 */
export const chooseRand = <T>(arr: T[]): T => {
    if (arr.length > 0) return arr[Math.floor(Math.random() * arr.length)]
    else throw new Error("`chooseRand` recived an empty array which is not approved")
}

export const mod = (x: number, m: number) =>
    (x % m + m) % m

export const randRange = (min: number, max: number) =>
    min + Math.random() * (max - min)

export const clamp = (value: number, min: number, max: number) =>
    Math.max(Math.min(value, max), min)

export const lerp = (a: number, b: number, t: number): number =>
    a * (1 - t) + b * t


export const approach = (current: number, target: number, dt: number) =>
    current < target
        ? Math.min(current + dt, target)
        : Math.max(current - dt, target)

export const add = <V extends Vec2 | Vec3>(a: V, b: V): V => a.clone().add(b as (Vec2 | number) & (Vec3 | number)) as V
export const sub = <V extends Vec2 | Vec3>(a: V, b: V): V => a.clone().sub(b as (Vec2 | number) & (Vec3 | number)) as V
export const mul = <V extends Vec2 | Vec3>(a: V, b: V): V => a.clone().mul(b as (Vec2 | number) & (Vec3 | number)) as V
export const div = <V extends Vec2 | Vec3>(a: V, b: V): V => a.clone().div(b as (Vec2 | number) & (Vec3 | number)) as V
