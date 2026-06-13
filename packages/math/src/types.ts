import type { Vec2, Vec3 } from "./vectors.js"

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
