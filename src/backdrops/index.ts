import type { WebGlEngine } from "../webgl"

export * from "./northern_lights"

export interface Backdrop {
    init(engine: WebGlEngine): Promise<void>,
    draw(engine: WebGlEngine, dt: number): void
}
