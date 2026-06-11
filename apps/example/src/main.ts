import "./style.css"

import NorthernLights from "@devrals/backdrops/northern-lights"
import { WebGlEngine } from "@devrals/webgl-engine"

const appContainer = document.getElementById("app")!;
const northern_lights = new NorthernLights()
let canvas: HTMLCanvasElement
let engine: WebGlEngine;


async function initContent() {
    const _canvas = document.createElement("canvas")
    _canvas.id = "background"
    _canvas.width = NorthernLights.resolution.width
    _canvas.height = NorthernLights.resolution.height
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

const DRAW_TIME = 1 / 10
async function initEngine() {
    engine = new WebGlEngine(canvas)
    engine.fullscreenFrameBufferSettings = {
        enabled: true,
        resolution: NorthernLights.resolution
    }
    await engine.init()
    await northern_lights.init(engine)

}

async function init() {
    await initContent()
    await initEngine()

    console.info("initialization completed")
}


let animationId: number;
function render() {
    engine.clearScreen()
    engine.draw(DRAW_TIME, (dt) =>
        northern_lights.draw(engine, dt))
    animationId = requestAnimationFrame(render)
}

function fatal(error: unknown): never {
    cancelAnimationFrame(animationId)
    northern_lights.destroy(engine)
    engine.destroyFrameBuffer()
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
