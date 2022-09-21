// @type (HTMLCanvasElement)

const main = () => {
    const myCanvas = document.getElementById('my-canvas')
    const gl = myCanvas.getContext('webgl')

    //#region  //*=========== Define Attribute ===========
    let vertices = [
        // Coord    Color
        0.5, 0.5,   1, 0, 1,    // Point 1  (magenta)
        0.0, 0.0,   1, 1, 0,    // Point 2  (yellow)
        -0.5, 0.5,  0, 1, 1,    // Point 3  (cyan)
        0, 1,       0, 0, 0     // Point 4  (black)
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
        attribute vec3 aColor;
        varying vec3 vColor;
        uniform float uTheta;
        void main() {
            float x = -sin(uTheta) * aPosition.x + cos(uTheta) * aPosition.y;
            float y = sin(uTheta) * aPosition.y + cos(uTheta) * aPosition.x;
            gl_Position = vec4(
                x,
                y,
                0.0,
                1.0
            );
            vColor = aColor;
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
        varying vec3 vColor;
        void main() {
            gl_FragColor = vec4(vColor, 1.0);
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

    let theta = 0.0
    const uTheta = gl.getUniformLocation(shaderProgram, 'uTheta')


    //#region  //*=========== Get Attribute From Array ===========
    const aPosition = gl.getAttribLocation(shaderProgram, 'aPosition')
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 0)
    gl.enableVertexAttribArray(aPosition)

    
    const aColor = gl.getAttribLocation(shaderProgram, 'aColor')
    gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT)
    gl.enableVertexAttribArray(aColor)
    //#endregion  //*======== Get Attribute From Array ===========


    const render = () => {
        //#region  //*=========== Paint The Background ===========
        gl.clearColor(0.38, 0.51, 0.96, 1)
        gl.clear(gl.COLOR_BUFFER_BIT)
        //#endregion  //*======== Paint The Background ===========

        theta += 0.00001

        gl.uniform1f(uTheta, theta)
    
        //#region  //*=========== Draw Using Vertices ===========
        // gl.drawArrays(gl.POINTS, 0, 4); // draw point
        // gl.drawArrays(gl.LINES, 0, 4); // draw lines
        // gl.drawArrays(gl.LINE_LOOP, 0, 4); // draw lines loop
        // gl.drawArrays(gl.LINE_STRIP, 0, 4); // draw lines strip
        // gl.drawArrays(gl.TRIANGLES, 0, 6); // draw triangles
        // gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); // draw triangles strip
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4); // draw triangles fan
        //#endregion  //*======== Draw Points ===========

        render()
    }

    setInterval(render, 1000/30)

}