import "./style.css"
import { WebGlEngine as Engine } from "./webgl"

const appContainer = document.getElementById("app")!;
let engine: Engine
let canvas: HTMLCanvasElement
const RESOLUTION: [number, number] = [320, 180] as const

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

    appContainer.append(canvas)
}

async function initEngine() {
    const _engine = new Engine(canvas)
    _engine.useFullscreenFrameBuffer = true
    await _engine.init(RESOLUTION)

    engine = _engine
}

async function init() {
    await initContent()
    await initEngine()

    console.info("initialization completed")
}

function render() {
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
    // render()
} catch (error) {
    fatal(error)
}
