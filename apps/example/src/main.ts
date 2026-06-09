import "./style.css"

import NorthernLights, { RENDER_RESOLUTION } from "@devrals/backdrops/northern-lights";
import { WebGlEngine as Engine } from "@devrals/webgl-engine"

export const [WIDTH, HEIGHT] = RENDER_RESOLUTION

const appContainer = document.getElementById("app")!;
const norther_lights_effect = new NorthernLights()
let engine: Engine
let canvas: HTMLCanvasElement


async function initContent() {
    const _canvas = document.createElement("canvas")
    _canvas.id = "background"
    _canvas.width = window.innerWidth
    _canvas.height = window.innerHeight

    canvas = _canvas
    window.addEventListener("error", (event) => {
        console.error(event.error)
    })

    window.addEventListener("unhandledrejection", (event) => {
        console.error(event.reason)
    })

    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        engine.gl.viewport(
            0,
            0,
            canvas.width,
            canvas.height
        )
    })

    appContainer.append(canvas)
}

async function initEngine() {
    const _engine = new Engine(canvas)

    await _engine.init()
    _engine.fullscreenFrameBufferSettings = {
        enabled: true,
        resolution: RENDER_RESOLUTION
    }
    _engine.initFrameBuffer(RENDER_RESOLUTION)

    await norther_lights_effect.init(_engine)

    engine = _engine
}

async function init() {
    await initContent()
    await initEngine()

    console.info("initialization completed")
}


const dt = 1 / 60
function render() {

    engine.clearScreen()
    engine.draw(dt, [norther_lights_effect])
    requestAnimationFrame(render)
}

function fatal(error: unknown): never {
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
