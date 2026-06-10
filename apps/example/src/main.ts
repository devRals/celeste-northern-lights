import "./style.css"

import DreamStars from "@devrals/backdrops/dream-stars"

const appContainer = document.getElementById("app")!;
const stars_effect = new DreamStars()
let canvas: HTMLCanvasElement
let ctx: CanvasRenderingContext2D
let animaationId: number


async function initContent() {
    const _canvas = document.createElement("canvas")
    _canvas.id = "background"
    _canvas.width = DreamStars.resolution.width
    _canvas.height = DreamStars.resolution.height
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
    const _ctx = canvas.getContext("2d")
    if (!_ctx) throw new Error("2d draw context init failed ")
    ctx = _ctx

    await stars_effect.init()
}

async function init() {
    await initContent()
    await initEngine()

    console.info("initialization completed")
}


function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    stars_effect.update(1 / 60)
    stars_effect.draw(ctx)

    animaationId = requestAnimationFrame(render)
}

function fatal(error: unknown): never {
    cancelAnimationFrame(animaationId)
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
