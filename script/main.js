// @type (HTMLCanvasElement)

const main = () => {
    const myCanvas = document.getElementById('my-canvas')
    const gl = myCanvas.getContext('webgl')

    //#region  //*=========== Define Attribute ===========
    let vertices = [
        // Face A       // Red
        -1, -1, -1,     1, 0, 0,    // Index:  0
        1, -1, -1,     1, 0, 0,    // Index:  1
        1,  1, -1,     1, 0, 0,    // Index:  2
        -1,  1, -1,     1, 0, 0,    // Index:  3
        // Face B       // Yellow
        -1, -1,  1,     1, 1, 0,    // Index:  4
        1, -1,  1,     1, 1, 0,    // Index:  5
        1,  1,  1,     1, 1, 0,    // Index:  6
        -1,  1,  1,     1, 1, 0,    // Index:  7
        // Face C       // Green
        -1, -1, -1,     0, 1, 0,    // Index:  8
        -1,  1, -1,     0, 1, 0,    // Index:  9
        -1,  1,  1,     0, 1, 0,    // Index: 10
        -1, -1,  1,     0, 1, 0,    // Index: 11
        // Face D       // Blue
        1, -1, -1,     0, 0, 1,    // Index: 12
        1,  1, -1,     0, 0, 1,    // Index: 13
        1,  1,  1,     0, 0, 1,    // Index: 14
        1, -1,  1,     0, 0, 1,    // Index: 15
        // Face E       // Orange
        -1, -1, -1,     1, 0.5, 0,  // Index: 16
        -1, -1,  1,     1, 0.5, 0,  // Index: 17
        1, -1,  1,     1, 0.5, 0,  // Index: 18
        1, -1, -1,     1, 0.5, 0,  // Index: 19
        // Face F       // White
        -1,  1, -1,     1, 1, 1,    // Index: 20
        -1,  1,  1,     1, 1, 1,    // Index: 21
        1,  1,  1,     1, 1, 1,    // Index: 22
        1,  1, -1,     1, 1, 1     // Index: 23
    ];

    let indices = [
        0, 1, 2,     0, 2, 3,     // Face A
        4, 5, 6,     4, 6, 7,     // Face B
        8, 9, 10,    8, 10, 11,   // Face C
        12, 13, 14,  12, 14, 15,  // Face D
        16, 17, 18,  16, 18, 19,  // Face E
        20, 21, 22,  20, 22, 23,  // Face F
    ];
    //#endregion  //*======== Define Attribute ===========

    //#region  //*=========== Create Buffer For Attribute ===========
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
    //#endregion  //*======== Create Buffer For Attribute ===========

    //#region  //*=========== Create Buffer For Attribute ===========
    const indicesBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)
    //#endregion  //*======== Create Buffer For Attribute ===========

    //#region  //*=========== Vertex Shader ===========
    let vertexShaderCode = 
    `
        attribute vec2 aPosition;
        attribute vec3 aColor;
        varying vec3 vColor;
        uniform mat4 uModel;
        uniform mat4 uView;
        uniform mat4 uProjection;
        void main() {
            gl_Position = uProjection * uView * uModel * vec4(aPosition, 0.0, 1.0);
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
    const uModel = gl.getUniformLocation(shaderProgram, "uModel");
    // View
    let cameraX = 0.0;
    let cameraZ = 5.0;
    let uView = gl.getUniformLocation(shaderProgram, "uView");
    let view = glMatrix.mat4.create();
    glMatrix.mat4.lookAt(
      view,
      [cameraX, 0.0, cameraZ],    // the location of the eye or the camera
      [cameraX, 0.0, -10],        // the point where the camera look at
      [0.0, 1.0, 0.0]
    );
    // Projection
    let uProjection = gl.getUniformLocation(shaderProgram, "uProjection");
    let perspective = glMatrix.mat4.create();
    glMatrix.mat4.perspective(perspective, Math.PI/3, 1.0, 0.5, 10.0);

    let freeze = false



    //#region  //*=========== Get Attribute From Array ===========
    const aPosition = gl.getAttribLocation(shaderProgram, 'aPosition')
    gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 0)
    gl.enableVertexAttribArray(aPosition)

    
    const aColor = gl.getAttribLocation(shaderProgram, 'aColor')
    gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT)
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
        // gl.enable(gl.DEPTH_TEST)

        //#region  //*=========== Paint The Background ===========
        gl.clearColor(0.38, 0.51, 0.96, 1)
        gl.clear(gl.COLOR_BUFFER_BIT)
        //#endregion  //*======== Paint The Background ===========

        if (!freeze) {
            theta += 0.1
            // gl.uniform1f(uTheta, theta)
        }

        // Create identity matrix
        let model = glMatrix.mat4.create()
        glMatrix.mat4.translate(model, model, [moveX, moveY, 0.0])
        glMatrix.mat4.rotateX(
          model, model, theta
        )
        gl.uniformMatrix4fv(uModel, false, model)
        gl.uniformMatrix4fv(uView, false, view)
        gl.uniformMatrix4fv(uProjection, false, perspective)
        // gl.uniform1f(uMoveX, moveX)
        // gl.uniform1f(uMoveY, moveY)
        // gl.uniform2f(uDelta, hDelta, vDelta)

    
        //#region  //*=========== Draw Using Vertices ===========
        // gl.drawArrays(gl.POINTS, 0, 4); // draw point
        // gl.drawArrays(gl.LINES, 0, 4); // draw lines
        // gl.drawArrays(gl.LINE_LOOP, 0, 4); // draw lines loop
        // gl.drawArrays(gl.LINE_STRIP, 0, 4); // draw lines strip
        // gl.drawArrays(gl.TRIANGLES, 0, 6); // draw triangles
        // gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); // draw triangles strip
        // gl.drawArrays(gl.TRIANGLE_FAN, 0, indices.length); // draw triangles fan
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0)
        //#endregion  //*======== Draw Points ===========

        requestAnimationFrame(render)
    }

    requestAnimationFrame(render)
    //#endregion  //*======== Render ===========

}