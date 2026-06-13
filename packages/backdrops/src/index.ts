import type { WebGlEngine } from "@devrals/webgl-engine"

export type DrawContext = CanvasRenderingContext2D | WebGL2RenderingContext | WebGlEngine

export interface Backdrop<Renderer extends DrawContext> {
    init(ctx: Renderer): Promise<void>,
    draw(ctx: Renderer, dt: number): void
    update(dt: number): void
    destroy?(ctx: Renderer): void
}
