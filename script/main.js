// @type (HTMLCanvasElement)

const main = () => {
    const myCanvas = document.getElementById('my-canvas')
    const gl = myCanvas.getContext('webgl')

    //#region  //*=========== Vertex Shader ===========
    let vertexShaderCode = 
    `
        void main() {
            float x = 0.0;
            float y = 0.0;
            gl_PointSize = 50.0;
            gl_Position = vec4(x, y, 0.0, 1.0);
        }
    `
    const vertexShaderObject = gl.createShader(gl.VERTEX_SHADER)
    gl.shaderSource(vertexShaderObject, vertexShaderCode)
    gl.compileShader(vertexShaderObject)
    //#endregion  //*======== Vertex Shader ===========

    //#region  //*=========== Fragment Shader ===========
    let fragmentShaderCode =
    `
        precision mediump float;
        void main() {
            float r = 0.96;
            float g = 0.68;
            float b = 0.26;
            gl_FragColor = vec4(r, g, b, 1.0);
        }
    `
    const fragmentShaderObjext = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(fragmentShaderObjext, fragmentShaderCode)
    gl.compileShader(fragmentShaderObjext)
    //#endregion  //*======== Fragment Shader ===========


    //#region  //*=========== Create Executable Container ===========
    const shaderProgram = gl.createProgram()
    gl.attachShader(shaderProgram, vertexShaderObject)
    gl.attachShader(shaderProgram, fragmentShaderObjext)
    gl.linkProgram(shaderProgram)
    gl.useProgram(shaderProgram)
    gl.clearColor(0.38, 0.51, 0.96, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)
    //#endregion  //*======== Create Executable Container ===========


    //#region  //*=========== Draw Points ===========
    gl.drawArrays(gl.POINTS, 0, 1)
    //#endregion  //*======== Draw Points ===========
}