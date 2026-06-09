import frameBufferVSSource from "./frame_buffer_vs.vert?raw"
import frameBufferFSSource from "./frame_buffer_fs.frag?raw"

export interface Backdrop {
    init(engine: WebGlEngine): Promise<void>,
    draw(engine: WebGlEngine, dt: number): void
}

export type Resolution = [number, number]

const FULLSCREEN_FRAMEBUFFER_DATA = {
    posData: new Float32Array([
        -1.0, 1.0,
        -1.0, -1.0,
        1.0, -1.0,

        -1.0, 1.0,
        1.0, -1.0,
        1.0, 1.0,
    ]),

    uvData: new Float32Array([
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,

        0.0, 1.0,
        1.0, 0.0,
        1.0, 1.0
    ])
}

export class WebGlEngine {
    gl: WebGL2RenderingContext
    private frame: {
        buffer: WebGLFramebuffer,
        bufferProgram: WebGLProgram,
        texture: WebGLTexture
        objectArray: WebGLVertexArrayObject
    } | null = null
    fullscreenFrameBufferSettings = {
        enabled: false,
        resolution: [0, 0]
    }

    constructor(canvas: HTMLCanvasElement) {
        this.gl = this.getContext(canvas)
    }

    private getContext(canvas: HTMLCanvasElement) {
        const ctx = canvas.getContext("webgl2");
        if (ctx === null) throw new Error("failed to initialize webgl2. This might be occured due your browsers version. Go fucking update your browser you caveman!")
        return ctx
    }

    async init() {
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height)
    }

    clearScreen() {
        this.gl.clearColor(0, 0, 0, 0)
        this.gl.clear(this.gl.COLOR_BUFFER_BIT)
    }

    draw(dt: number, backdrops: Backdrop[]) {
        const drawAll = () => {
            for (const b of backdrops) b.draw(this, dt)
        }

        if (this.fullscreenFrameBufferSettings.enabled && this.frame) {
            this.gl.bindTexture(this.gl.TEXTURE_2D, null)
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frame.buffer)

            this.gl.disable(this.gl.DEPTH_TEST)
            this.gl.disable(this.gl.BLEND)

            this.gl.clearColor(0, 0, 0, 0)
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)

            const [width, height] = this.fullscreenFrameBufferSettings.resolution
            this.gl.viewport(0, 0, width, height)

            drawAll()

            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
            this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height)

            this.gl.useProgram(this.frame.bufferProgram)
            this.gl.bindVertexArray(this.frame.objectArray)

            this.gl.activeTexture(this.gl.TEXTURE0)
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.frame.texture)
            this.gl.uniform1i(this.gl.getUniformLocation(this.frame.bufferProgram, "u_tex"), 0)

            this.gl.drawArrays(this.gl.TRIANGLES, 0, 6)

            this.gl.bindVertexArray(null)

        } else {
            drawAll()
        }
    }

    createProgram(vertSrc: string, fragSrc: string) {
        const vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER)
        if (vertexShader === null) throw new Error("Failed to create a vertex shader. Why does this mean? I don't have any fucking idea :D")
        this.gl.shaderSource(vertexShader, vertSrc)
        this.gl.compileShader(vertexShader)
        const vertexShaderInfoLog = this.gl.getShaderInfoLog(vertexShader)
        if (vertexShaderInfoLog) throw new Error(`Failed to compile vertex shader. Here's an error message: ${vertexShaderInfoLog}`)

        const fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER)
        if (fragmentShader === null) throw new Error("Failed to create a fragment shader. Why does this mean? I don't have any fucking idea :D")
        this.gl.shaderSource(fragmentShader, fragSrc)
        this.gl.compileShader(fragmentShader)
        const fragmentShaderInfoLog = this.gl.getShaderInfoLog(fragmentShader)
        if (fragmentShaderInfoLog) throw new Error(`Failed to compile fragment shader. Here's an error message: ${fragmentShaderInfoLog}`)

        const shaderProgram = this.gl.createProgram()
        this.gl.attachShader(shaderProgram, vertexShader)
        this.gl.attachShader(shaderProgram, fragmentShader)
        this.gl.linkProgram(shaderProgram)

        const shaderProgramInfoLog = this.gl.getProgramInfoLog(shaderProgram)
        if (shaderProgramInfoLog) throw new Error(`Failed to link the shader program. Here's an error message: ${shaderProgramInfoLog}`)

        return shaderProgram
    }

    initFrameBuffer(res: Resolution) {
        const fbo = this.gl.createFramebuffer()
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, fbo)

        const frameBufferTexture = this.gl.createTexture()
        this.gl.bindTexture(this.gl.TEXTURE_2D, frameBufferTexture)

        this.gl.texImage2D(
            this.gl.TEXTURE_2D,
            0,
            this.gl.RGBA,
            res[0],
            res[1],
            0,
            this.gl.RGBA,
            this.gl.UNSIGNED_BYTE,
            null
        )

        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE)
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE)

        this.gl.framebufferTexture2D(
            this.gl.FRAMEBUFFER,
            this.gl.COLOR_ATTACHMENT0,
            this.gl.TEXTURE_2D,
            frameBufferTexture,
            0
        )

        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)

        const frameBufferProgram = this.createProgram(frameBufferVSSource, frameBufferFSSource)
        this.gl.useProgram(frameBufferProgram)

        const frameBufferObjectArray = this.gl.createVertexArray()
        this.gl.bindVertexArray(frameBufferObjectArray)

        const posDataBuffer = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, posDataBuffer)
        this.gl.bufferData(this.gl.ARRAY_BUFFER, FULLSCREEN_FRAMEBUFFER_DATA.posData, this.gl.STATIC_DRAW)
        this.setVertexAttribute({
            program: frameBufferProgram,
            type: this.gl.FLOAT,
            location: "a_pos",
            size: 2
        })

        const uvDataBuffer = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, uvDataBuffer)
        this.gl.bufferData(this.gl.ARRAY_BUFFER, FULLSCREEN_FRAMEBUFFER_DATA.uvData, this.gl.STATIC_DRAW)
        this.setVertexAttribute({
            program: frameBufferProgram,
            type: this.gl.FLOAT,
            location: "a_uv",
            size: 2
        })

        this.gl.bindVertexArray(null)
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null)

        this.frame = {
            buffer: fbo,
            texture: frameBufferTexture,
            objectArray: frameBufferObjectArray,
            bufferProgram: frameBufferProgram
        }

        console.info("Fullscreen frame buffer initialized")
    }

    setVertexAttribute({
        program, type, location, size, stride = 0, offset = 0, normalized = false
    }: {
        program: WebGLProgram,
        type: GLenum,
        location: string,
        size: number,
        stride?: number,
        offset?: number,
        normalized?: boolean,
    }) {
        const loc = this.gl.getAttribLocation(program, location)
        this.gl.vertexAttribPointer(loc, size, type, normalized, stride, offset)
        this.gl.enableVertexAttribArray(loc)
    }

    async createTexture(imagePath: string, textureParameters: {
        wrap?: "clamp" | "repeat",
        filter?: "nearest" | "linear"
    } = {
            wrap: "clamp",
            filter: "nearest"
        }) {
        const texture = this.gl.createTexture()
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture)

        let target = this.gl.TEXTURE_2D,
            level = 0,
            internalFormat = this.gl.RGBA,
            width = 0,
            height = 0,
            border = 0,
            srcFormat = this.gl.RGBA,
            srcDataType = this.gl.UNSIGNED_BYTE,
            pixelData = new Uint8Array([0, 0, 0, 0])

        // fallback
        this.gl.texImage2D(
            target,
            level,
            internalFormat,
            width,
            height,
            border,
            srcFormat,
            srcDataType,
            pixelData
        )

        // load texture
        const load = async () => {

            const res = await fetch(imagePath);
            const blob = await res.blob();
            const bitmap = await createImageBitmap(blob);

            const [width, height] = [bitmap.width, bitmap.height];

            this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

            this.gl.texImage2D(
                this.gl.TEXTURE_2D,
                0,
                this.gl.RGBA,
                width,
                height,
                0,
                this.gl.RGBA,
                this.gl.UNSIGNED_BYTE,
                bitmap,
            );

            const wrap = textureParameters && textureParameters.wrap === "repeat" ? this.gl.REPEAT : this.gl.CLAMP_TO_EDGE;
            const filter = textureParameters && textureParameters.filter === "linear" ? this.gl.LINEAR : this.gl.NEAREST;

            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, filter);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, filter);

            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, wrap)
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, wrap)

            this.gl.generateMipmap(this.gl.TEXTURE_2D);
            this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        }

        await load()

        return texture
    }

    bindRuntime({
        buffer, program, data, location, size = 0
    }: {
        buffer: WebGLBuffer,
        program: WebGLProgram,
        data: Float32Array<ArrayBuffer>,
        location: string,
        size: number,
    }) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer)
        this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.DYNAMIC_DRAW)
        this.setVertexAttribute({
            program, type: this.gl.FLOAT, location, size
        })
    }
}
