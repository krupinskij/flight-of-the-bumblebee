class Program {

    constructor() {
        this.gl = null;
        this.prg = null;

        this.vertexShader = null;
        this.fragmentShader = null;

        this.clearColor = [0.3,0.3,0.3,1.0];

        this.animationFrame = null;

        this.c_width = 0;
        this.c_height = 0;

    }

    init() {
        console.log(webGLApp.shaders[0])
        resize(this.gl.canvas);
        this.gl.viewport(0, 0, this.c_width, this.c_height);

        this.fragmentShader = utils.getShader(this.gl, webGLApp.shaders[0]);
        this.vertexShader = utils.getShader(this.gl, webGLApp.shaders[1]);

        this.prg = this.gl.createProgram();

        this.gl.attachShader(this.prg, this.vertexShader);
        this.gl.attachShader(this.prg, this.fragmentShader);
        this.gl.linkProgram(this.prg);

        if (!this.gl.getProgramParameter(this.prg, this.gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
        }

        this.gl.useProgram(this.prg);

        this.prg.aVertexPosition = this.gl.getAttribLocation(this.prg, "aVertexPosition");
        this.prg.aVertexNormal = this.gl.getAttribLocation(this.prg, "aVertexNormal");

        this.prg.uModelMatrix = this.gl.getUniformLocation(this.prg, "uModelMatrix");
        this.prg.uViewMatrix = this.gl.getUniformLocation(this.prg, "uViewMatrix");
        this.prg.uProjectionMatrix = this.gl.getUniformLocation(this.prg, "uProjectionMatrix");
        this.prg.uNormalMatrix = this.gl.getUniformLocation(this.prg, "uNormalMatrix");
        
        this.prg.uMaterialAmbient = this.gl.getUniformLocation(this.prg, "uMaterialAmbient"); 
        this.prg.uMaterialDiffuse = this.gl.getUniformLocation(this.prg, "uMaterialDiffuse");
        this.prg.uMaterialSpecular = this.gl.getUniformLocation(this.prg, "uMaterialSpecular");
        
        this.prg.uShininess = this.gl.getUniformLocation(this.prg, "uShininess");
        
        this.prg.uLightDirection = this.gl.getUniformLocation(this.prg, "uLightDirection");
    }

    initLights(){
        this.gl.uniform3fv(this.prg.uLightDirection,  [10, 10, 10]);
        
        this.gl.uniform4fv(this.prg.uMaterialAmbient, [1.0,1.0,1.0,1.0]);
        this.gl.uniform4fv(this.prg.uMaterialSpecular,[1.0,1.0,1.0,1.0]);
        this.gl.uniform1f(this.prg.uShininess, 100.0);
    }

    draw() {
    
        this.gl.clearColor(...this.clearColor);
        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.gl.viewport(0, 0, this.c_width, this.c_height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    
        
        
        try{
            for (const model of scene.objects){

                const modelMatrix = mat4.create();
                const viewMatrix = mat4.create();
                const projectionMatrix = mat4.create();
                const normalMatrix = mat4.create();
    
                mat4.identity(modelMatrix);
                mat4.identity(viewMatrix);
                mat4.identity(projectionMatrix);

                mat4.perspective(45, this.c_width / this.c_height, 1, 100.0, projectionMatrix);
                


                if(model.alias==="bumblebee") {
                    mat4.translate(modelMatrix, [bumblebee.moveX,0,bumblebee.moveZ]);
                    mat4.rotateY(modelMatrix, bumblebee.angle);
                    bumblebee.position = [modelMatrix[12], modelMatrix[13], modelMatrix[14]];
                } else {
                    mat4.translate(modelMatrix, [0,0,-1])
                }

                if(model.partname==="right-eye" || model.partname==="left-eye") {
                    this.gl.uniform4fv(this.prg.uMaterialDiffuse, [1.0,1.0,1.0,1.0]);
                } else if(model.partname==="head") {
                    this.gl.uniform4fv(this.prg.uMaterialDiffuse, [0.3,0.3,0.3,0.0]);
                } else if(model.partname==="belly") {
                    this.gl.uniform4fv(this.prg.uMaterialDiffuse, [1.0,0.8,0.0,0.0]);
                } else if(model.partname==="grass") {
                    this.gl.uniform4fv(this.prg.uMaterialDiffuse, [0.0,0.6,0.1,1.0]);
                } else {
                    this.gl.uniform4fv(this.prg.uMaterialDiffuse, [0.0,0.0,0.0,1.0]);
                }

                switch(camera.type) {
                    case camera.CAMERA_FOLLOWING:
                        camera.lookAt(viewMatrix, bumblebee.position.map(p => p+5), bumblebee.position, [1,0,1]);
                        break;
                    case camera.CAMERA_TRACKING:
                        camera.lookAt(viewMatrix, [10,10,10], bumblebee.position, [1,0,1]);
                        break;
                    case camera.CAMERA_STATIC:
                        camera.lookAt(viewMatrix, [10,10,10], [0,0,0], [1,0,1]);
                        break;
                }

                this.gl.uniformMatrix4fv(this.prg.uModelMatrix, false, modelMatrix);
                this.gl.uniformMatrix4fv(this.prg.uViewMatrix, false, viewMatrix);
                this.gl.uniformMatrix4fv(this.prg.uProjectionMatrix, false, projectionMatrix);

                
                mat4.set(viewMatrix, normalMatrix);
                mat4.multiply(normalMatrix, modelMatrix);
                mat4.inverse(normalMatrix);
                mat4.transpose(normalMatrix);
                
                this.gl.uniformMatrix4fv(this.prg.uNormalMatrix, false, normalMatrix);

                const modelVertexBuffer = this.gl.createBuffer();
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, modelVertexBuffer);
                this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(model.vertices), this.gl.STATIC_DRAW);

                const modelNormalsBuffer = this.gl.createBuffer();
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, modelNormalsBuffer);
                this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(model.normals), this.gl.STATIC_DRAW);

                const modelIndexBuffer = this.gl.createBuffer();
                this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, modelIndexBuffer);
                this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(model.indices), this.gl.STATIC_DRAW);

                this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);

                this.gl.enableVertexAttribArray(this.prg.aVertexPosition);
                this.gl.enableVertexAttribArray(this.prg.aVertexNormal);

                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, modelVertexBuffer);
                this.gl.vertexAttribPointer(this.prg.aVertexPosition, 3, this.gl.FLOAT, false, 0, 0);
                
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, modelNormalsBuffer);
                this.gl.vertexAttribPointer(this.prg.aVertexNormal,3, this.gl.FLOAT, false, 0,0);
                
                this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, modelIndexBuffer);
                this.gl.drawElements(this.gl.TRIANGLES, model.indices.length, this.gl.UNSIGNED_SHORT,0);
            
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
                this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);

            }
            
        }
        catch(err){
            alert(err);
        }
    }

    changeShaders() {

        this.gl.deleteProgram(this.prg);
        this.gl.deleteShader(this.fragmentShader);
        this.gl.deleteShader(this.vertexShader);
        cancelAnimationFrame(this.animationFrame)

        this.init();
        this.initLights();
        this.renderLoop();
    }

    renderLoop() {
        program.animationFrame = requestAnimationFrame(program.renderLoop);
        program.draw();
    }
}

const program = new Program();