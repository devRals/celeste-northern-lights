import type { WebGlEngine } from "@devrals/webgl-engine";
import type { Backdrop } from "../index.js";

export default class Sanctuary implements Backdrop<WebGlEngine> {
    constructor() { }

    async init(ctx: WebGlEngine) { }
    draw(ctx: WebGlEngine, dt: number) { }
    destroy(ctx: WebGlEngine) { }
    update(dt: number) { }
}
