let gl = null;
let prg = null;
let c_width = 0;
let c_height = 0;
let clearColor = [0.3,0.3,0.3,1.0];

let mvMatrix = mat4.create();
let pMatrix = mat4.create();
let nMatrix =  mat4.create();

let modelVerticesBuffer;
let modelIndicesBuffer;

let modelNormalsBuffer;

let vertices;
let indices;

let normals;

let angle = 0;

let shaders = ["phong/shader-fs", "phong/shader-vs"];

document.addEventListener('keydown', event => {
    switch(event.keyCode){
        case 49: {
            shaders = ["phong/shader-fs", "phong/shader-vs"];
            runWebGLApp();
            break;
        }
        case 50: {
            shaders = ["gouraud/shader-fs", "gouraud/shader-vs"];
            runWebGLApp();
            break;
        }
    }
})


function initProgram() {
    const fragmentShader = utils.getShader(gl, shaders[0]);
    const vertexShader = utils.getShader(gl, shaders[1]);
    prg = gl.createProgram();
    gl.attachShader(prg, vertexShader);
    gl.attachShader(prg, fragmentShader);
    gl.linkProgram(prg);

    if (!gl.getProgramParameter(prg, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    gl.useProgram(prg);

    prg.aVertexPosition = gl.getAttribLocation(prg, "aVertexPosition");
    prg.aVertexNormal = gl.getAttribLocation(prg, "aVertexNormal");
        
    prg.uPMatrix = gl.getUniformLocation(prg, "uPMatrix");
    prg.uMVMatrix = gl.getUniformLocation(prg, "uMVMatrix");
    prg.uNMatrix = gl.getUniformLocation(prg, "uNMatrix");
    
    prg.uMaterialAmbient = gl.getUniformLocation(prg, "uMaterialAmbient"); 
    prg.uMaterialDiffuse = gl.getUniformLocation(prg, "uMaterialDiffuse");
    prg.uMaterialSpecular = gl.getUniformLocation(prg, "uMaterialSpecular");
    
    prg.uShininess = gl.getUniformLocation(prg, "uShininess");
    
    prg.uLightAmbient = gl.getUniformLocation(prg, "uLightAmbient");
    prg.uLightDiffuse = gl.getUniformLocation(prg, "uLightDiffuse");
    prg.uLightSpecular = gl.getUniformLocation(prg, "uLightSpecular");
    
    prg.uLightDirection = gl.getUniformLocation(prg, "uLightDirection");

}

function initLights(){
    gl.uniform3fv(prg.uLightDirection,  [-0.25, -0.25, -0.25]);
    gl.uniform4fv(prg.uLightAmbient, [0.03,0.03,0.03,1.0]);
    gl.uniform4fv(prg.uLightDiffuse,  [1.0,1.0,1.0,1.0]); 
    gl.uniform4fv(prg.uLightSpecular,  [1.0,1.0,1.0,1.0]);
    
    gl.uniform4fv(prg.uMaterialAmbient, [1.0,1.0,1.0,1.0]);
    gl.uniform4fv(prg.uMaterialDiffuse, [1.0,0.9,0.4,1.0]);
    gl.uniform4fv(prg.uMaterialSpecular,[1.0,1.0,1.0,1.0]);
    gl.uniform1f(prg.uShininess, 10.0);
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

    normals = utils.calculateNormals(model.vertices, model.indices);

    modelVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, modelVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.vertices), gl.STATIC_DRAW);
    
    modelNormalsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, modelNormalsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

    modelIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, modelIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(model.indices), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ARRAY_BUFFER,null);

    renderLoop();
}
function drawScene() {
    gl.clearColor(...clearColor);
    gl.clearDepth(100.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.viewport(0, 0, c_width, c_height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(45, c_width / c_height, 0.1, 10000.0, pMatrix);
    
    mat4.identity(mvMatrix);
    mat4.translate(mvMatrix, [0.0, 0.0, -10]);

    mat4.rotate(mvMatrix, angle * Math.PI / 180, [0, 1, 0]); 
    
    gl.uniformMatrix4fv(prg.uMVMatrix, false, mvMatrix);
    gl.uniformMatrix4fv(prg.uPMatrix, false, pMatrix);
    
    mat4.set(mvMatrix, nMatrix);
    mat4.inverse(nMatrix);
    mat4.transpose(nMatrix);
    
    gl.uniformMatrix4fv(prg.uNMatrix, false, nMatrix);
    
    
    
    try{
        gl.enableVertexAttribArray(prg.aVertexPosition);
        gl.enableVertexAttribArray(prg.aVertexNormal);
                
        //2. bind buffers 
        gl.bindBuffer(gl.ARRAY_BUFFER, modelVertexBuffer);
        gl.vertexAttribPointer(prg.aVertexPosition, 3, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, modelNormalsBuffer);
        gl.vertexAttribPointer(prg.aVertexNormal,3,gl.FLOAT, false, 0,0);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, modelIndexBuffer);
        gl.drawElements(gl.TRIANGLES, model.indices.length, gl.UNSIGNED_SHORT,0);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        
    }
    catch(err){
        alert(err);
    }
}

let lastTime = 0;


function animate() {
    var timeNow = new Date().getTime();
    if (lastTime != 0) {
        var elapsed = timeNow - lastTime;
        angle += (90 * elapsed) / 10000.0;
    }
    lastTime = timeNow;
}
function renderLoop() {
    requestAnimationFrame(renderLoop);
    drawScene();
    animate();
}



function runWebGLApp() {
    gl = utils.getGLContext("canvas-element-id");
    loadModel("model/part1.json")

    initProgram();
    initLights();
    
}

runWebGLApp();