// @type (HTMLCanvasElement)

const main = () => {
    const myCanvas = document.getElementById('my-canvas')
    const gl = myCanvas.getContext('webgl')

    //#region  //*=========== Define Attribute ===========
    let vertices = [
        0.5, 0.0, 0.0, 1.0, 1.0,   // A: kanan atas    (BIRU LANGIT)
        0.0, -0.5, 1.0, 0.0, 1.0,  // B: bawah tengah  (MAGENTA)
        -0.5, 0.0, 1.0, 1.0, 0.0,  // C: kiri atas     (KUNING)
        0.0, 0.5, 1.0, 1.0, 1.0    // D: atas tengah   (PUTIH)
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
        uniform vec2 uDelta;
        uniform float uMoveX;
        uniform float uMoveY;
        void main() {
            vec2 position = aPosition;  
            vec3 d = vec3(0.5, -0.5, 0.0);
            mat4 translation = mat4(1.0, 0.0, 0.0, 0.0,
                                    0.0, 1.0, 0.0, 0.0,
                                    0.0, 0.0, 1.0, 0.0,
                                    uDelta.x, uDelta.y, 0.0, 1.0); 
                                    
            mat4 rotation = mat4(
                cos(uTheta), sin(uTheta), 0.0, 0.0,
                -sin(uTheta), cos(uTheta), 0.0, 0.0,
                0.0, 0.0, 1.0, 0.0,
                0.0, 0.0, 0.0, 1.0);
            gl_Position = translation * rotation * vec4(aPosition, 0, 1);
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

    let theta = 0.5
    const uTheta = gl.getUniformLocation(shaderProgram, 'uTheta')
    const hDelta = 0.0
    const vDelta = 0.0
    const uDelta = gl.getUniformLocation(shaderProgram, "uDelta");
    let freeze = false



    //#region  //*=========== Get Attribute From Array ===========
    const aPosition = gl.getAttribLocation(shaderProgram, 'aPosition')
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 0)
    gl.enableVertexAttribArray(aPosition)

    
    const aColor = gl.getAttribLocation(shaderProgram, 'aColor')
    gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT)
    gl.enableVertexAttribArray(aColor)
    //#endregion  //*======== Get Attribute From Array ===========


    //#region  //*=========== Mouse Listener ===========
    const onMouseClick = event => {
        freeze = !freeze
    }

    document.addEventListener('click', onMouseClick)
    //#endregion  //*======== Mouse Listener ===========

    
    let keysPressed = {}
    const movement = 0.1
    let moveX = 0
    let moveY = 0
    const uMoveX = gl.getUniformLocation(shaderProgram, 'uMoveX')
    const uMoveY = gl.getUniformLocation(shaderProgram, 'uMoveY')

    //#region  //*=========== Keyboard Listener ===========
    const onKeydown = event => {

        keysPressed[event.key] = true
        if (event.keyCode == 32) freeze = !freeze

        if (keysPressed['ArrowUp'] && keysPressed['ArrowLeft']) {
            moveX -= movement
            moveY += movement
        } else if (keysPressed['ArrowUp'] && keysPressed['ArrowRight']) {
            moveX += movement
            moveY += movement
        } else if (keysPressed['ArrowDown'] && keysPressed['ArrowLeft']) {
            moveX -= movement
            moveY -= movement
        } else if (keysPressed['ArrowDown'] && keysPressed['ArrowRight']) {
            moveX += movement
            moveY -= movement
        } else {
            if (event.keyCode == 37) moveX -= movement
            if (event.keyCode == 38) moveY += movement
            if (event.keyCode == 39) moveX += movement
            if (event.keyCode == 40) moveY -= movement
        }
    }

    const onKeyup = event => {
        
        keysPressed[event.key] = false
        if (event.keyCode == 32) freeze = !freeze

        
        if (event.keyCode == 37) moveX += movement
        if (event.keyCode == 38) moveY -= movement
        if (event.keyCode == 39) moveX -= movement
        if (event.keyCode == 40) moveY += movement
    }

    document.addEventListener('keydown', onKeydown)
    document.addEventListener('keyup', onKeyup)
    //#endregion  //*======== Keyboard Listener ===========


    //#region  //*=========== Render ===========
    const render = () => {
        //#region  //*=========== Paint The Background ===========
        gl.clearColor(0.38, 0.51, 0.96, 1)
        gl.clear(gl.COLOR_BUFFER_BIT)
        //#endregion  //*======== Paint The Background ===========

        if (!freeze) {
            theta += 0.1
            gl.uniform1f(uTheta, theta)
        }
        //
        // gl.uniform1f(uMoveX, moveX)
        // gl.uniform1f(uMoveY, moveY)
        gl.uniform2f(uDelta, hDelta, vDelta)

    
        //#region  //*=========== Draw Using Vertices ===========
        // gl.drawArrays(gl.POINTS, 0, 4); // draw point
        // gl.drawArrays(gl.LINES, 0, 4); // draw lines
        // gl.drawArrays(gl.LINE_LOOP, 0, 4); // draw lines loop
        // gl.drawArrays(gl.LINE_STRIP, 0, 4); // draw lines strip
        // gl.drawArrays(gl.TRIANGLES, 0, 6); // draw triangles
        // gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); // draw triangles strip
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4); // draw triangles fan
        //#endregion  //*======== Draw Points ===========

        requestAnimationFrame(render)
    }

    requestAnimationFrame(render)
    //#endregion  //*======== Render ===========

}