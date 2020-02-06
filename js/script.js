let gl = null;
let prg = null;

let c_width = 0;
let c_height = 0;

let modelVertexBuffer = null;
let modelIndexBuffer = null;

let mvMatrix = mat4.create();
let pMatrix = mat4.create();

let model = undefined;

function initProgram() {
    const fgShader = utils.getShader(gl, 'shader-fs');
    const vxShader = utils.getShader(gl, 'shader-vs');

    prg = gl.createProgram();
    gl.attachShader(prg, vxShader);
    gl.attachShader(prg, fgShader);
    gl.linkProgram(prg);

    if(!gl.getProgramParameter(prg, gl.LINK_STATUS)) {
        alert('Could not initialise shaders');
    }

    gl.useProgram(prg);

    prg.vertexPositionAttribute = gl.getAttribLocation(prg, 'aVertexPosition');
    prg.pMatrixUniform = gl.getUniformLocation(prg, 'uPMatrix');
    prg.mvMatrixUniform = gl.getUniformLocation(prg, 'uMVMatrix');
}

function loadModel(filename) {
    fetch("http://" + document.domain + ":" + location.port + "/" + filename)
    .then(resp => resp.json())
    .then(resp => {
        handleLoadedModel(resp);
    })
}

function handleLoadedModel(payload) {
    model = payload;

    modelVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, modelVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.vertices), gl.STATIC_DRAW);
    

    modelIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, modelIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(model.indices), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ARRAY_BUFFER,null);

    drawScene();
}

function drawScene() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, c_width, c_height);

    mat4.perspective(45, c_width / c_height, 0.1, 10000.0, pMatrix);
    mat4.identity(mvMatrix);
    mat4.translate(mvMatrix, [0.0, 0.0, -10.0]);

    gl.uniformMatrix4fv(prg.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(prg.mvMatrixUniform, false, mvMatrix);

    gl.enableVertexAttribArray(prg.vertexPositionAttribute);

    
    gl.bindBuffer(gl.ARRAY_BUFFER, modelVertexBuffer);
    gl.vertexAttribPointer(prg.aVertexPosition, 3, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, modelIndexBuffer);
    gl.drawElements(gl.LINE_LOOP, model.indices.length, gl.UNSIGNED_SHORT, 0);
}

function runWebGLApp() {
    gl = utils.getGLContext('canvas-element-id');

    initProgram();
    loadModel('model/part1.json');
}

runWebGLApp();