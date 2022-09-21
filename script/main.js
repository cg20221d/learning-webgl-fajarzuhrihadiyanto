// @type (HTMLCanvasElement)

const main = () => {
    const myCanvas = document.getElementById('my-canvas')
    const gl = myCanvas.getContext('webgl')

    //#region  //*=========== Define Attribute ===========
    let vertices = [
        0.5, 0.5,   // Point 1
        0.0, 0.0,   // Point 2
        -0.5, 0.5,  // Point 3
        0, 1        // Point 4
    ]
    //#endregion  //*======== Define Attribute ===========

    //#region  //*=========== Create Buffer For Attribute ===========
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
    //#endregion  //*======== Create Buffer For Attribute ===========

    //#region  //*=========== Vertex Shader ===========
    let vertexShaderCode = 
    `
        attribute vec2 aPosition;
        void main() {
            float x = aPosition.x;
            float y = aPosition.y;
            gl_PointSize = 2.0;
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
    //#endregion  //*======== Create Executable Container ===========


    //#region  //*=========== Get Attribute From Array ===========
    const aPosition = gl.getAttribLocation(shaderProgram, 'aPosition')
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(aPosition)
    //#endregion  //*======== Get Attribute From Array ===========

    //#region  //*=========== Paint The Background ===========
    gl.clearColor(0.38, 0.51, 0.96, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)
    //#endregion  //*======== Paint The Background ===========

    //#region  //*=========== Draw Using Vertices ===========
    // gl.drawArrays(gl.POINTS, 0, 4); // draw point
    // gl.drawArrays(gl.LINES, 0, 4); // draw lines
    // gl.drawArrays(gl.LINE_LOOP, 0, 4); // draw lines loop
    // gl.drawArrays(gl.LINE_STRIP, 0, 4); // draw lines strip
    // gl.drawArrays(gl.TRIANGLES, 0, 6); // draw triangles
    // gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); // draw triangles strip
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 6); // draw triangles fan
    //#endregion  //*======== Draw Points ===========
}