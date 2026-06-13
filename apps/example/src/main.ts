import { Vec2 } from "@devrals/math";
import "./style.css"

import FloatingInSpace from "@devrals/backdrops/floating-in-space";

const appContainer = document.getElementById("app")!;
const floatingInSpaceEffect = new FloatingInSpace(50, new Vec2(0, 1000))
let canvas: HTMLCanvasElement
let ctx: CanvasRenderingContext2D;

async function initContent() {
    const _canvas = document.createElement("canvas")
    _canvas.id = "background"
    _canvas.width = FloatingInSpace.resolution.width
    _canvas.height = FloatingInSpace.resolution.height
    _canvas.style.imageRendering = "pixelated"
    _canvas.style.width = "100vw"
    _canvas.style.height = "100vh"

    canvas = _canvas
    window.addEventListener("error", (event) => {
        console.error(event.error)
    })

    window.addEventListener("unhandledrejection", (event) => {
        console.error(event.reason)
    })

    appContainer.append(canvas)
}

async function initEngine() {
    ctx = canvas.getContext("2d")!
}

async function init() {
    await initContent()
    await initEngine()

    console.info("initialization completed")
}


let lastFrameTime = performance.now()
let animationId: number;
function render() {
    const now = performance.now()
    const dt = (now - lastFrameTime) / 100
    lastFrameTime = now

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    floatingInSpaceEffect.update(dt)
    floatingInSpaceEffect.draw(ctx)

    animationId = requestAnimationFrame(render)
}

function fatal(error: unknown) {
    cancelAnimationFrame(animationId)
    console.error(error)

    document.body.innerHTML = `
        <div class="fatal-error">
            <h1 style="color: #ef9999;">Fatal Error</h1>
            <pre>${error instanceof Error
            ? `${error.message}\n<h2>Trace</h2>${error.stack}`
            : String(error)}
            </pre>
            <pre>Please report this to developers</pre>
        </div>
    `

    throw error
}

try {
    await init()
    render()
} catch (error) {
    fatal(error)
}
