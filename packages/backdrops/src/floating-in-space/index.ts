import { randRange, Vec2 } from "@devrals/math";
import type { Backdrop } from "../index.js";
import type { Resolution } from "@devrals/webgl-engine";

export default class FloatingInSpace implements Backdrop<CanvasRenderingContext2D> {
    private stars: Star[]
    static resolution: Resolution = {
        width: 800,
        height: 600
    }

    direction: Vec2

    constructor(count = 100, direction = new Vec2(-1, 0)) {
        this.direction = direction.normalize()
        this.stars = new Array(count)
        for (let i = 0; i < count; i++) {
            this.stars[i] = {
                position: new Vec2(randRange(0, FloatingInSpace.resolution.width), randRange(0, FloatingInSpace.resolution.height)),
                size: randRange(0.5, 3),
                speed: randRange(1, 8)
            }
        }
    }

    async init() { }

    update(dt: number) {
        for (let i = 0; i < this.stars.length; i++) {
            const star = this.stars[i]

            star.position.x += this.direction.x * star.speed * dt
            star.position.y += this.direction.y * star.speed * dt

            const width = FloatingInSpace.resolution.width
            const height = FloatingInSpace.resolution.height

            if (star.position.x > width) star.position.x -= width
            if (star.position.x < 0) star.position.x += width

            if (star.position.y > height) star.position.y -= height
            if (star.position.y < 0) star.position.y += height

        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "#000"
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

        for (let i = 0; i < this.stars.length; i++) {
            const star = this.stars[i]

            ctx.fillStyle = "#fff"
            ctx.beginPath()
            ctx.arc(star.position.x, star.position.y, star.size, 0, 2 * Math.PI)
            ctx.fill()
        }
    }
}

interface Star {
    position: Vec2
    speed: number
    size: number
}
