class Program {

    constructor() {
        this.gl = null;
        this.prg = null;

        this.vertexShader = null;
        this.fragmentShader = null;

        this.clearColor = [0.3,0.3,0.3,1.0];

        this.mvMatrix = mat4.create();
        this.pMatrix = mat4.create();
        this.nMatrix =  mat4.create();
    }

    init() {
        resize(this.gl.canvas);
        this.gl.viewport(0, 0, c_width, c_height);

        this.fragmentShader = utils.getShader(this.gl, "phong/shader-fs");
        this.vertexShader = utils.getShader(this.gl, "phong/shader-vs");

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
        
        this.prg.uPMatrix = this.gl.getUniformLocation(this.prg, "uPMatrix");
        this.prg.uMVMatrix = this.gl.getUniformLocation(this.prg, "uMVMatrix");
        this.prg.uNMatrix = this.gl.getUniformLocation(this.prg, "uNMatrix");
        
        this.prg.uMaterialAmbient = this.gl.getUniformLocation(this.prg, "uMaterialAmbient"); 
        this.prg.uMaterialDiffuse = this.gl.getUniformLocation(this.prg, "uMaterialDiffuse");
        this.prg.uMaterialSpecular = this.gl.getUniformLocation(this.prg, "uMaterialSpecular");
        
        this.prg.uShininess = this.gl.getUniformLocation(this.prg, "uShininess");
        
        this.prg.uLightAmbient = this.gl.getUniformLocation(this.prg, "uLightAmbient");
        this.prg.uLightDiffuse = this.gl.getUniformLocation(this.prg, "uLightDiffuse");
        this.prg.uLightSpecular = this.gl.getUniformLocation(this.prg, "uLightSpecular");
        
        this.prg.uLightDirection = this.gl.getUniformLocation(this.prg, "uLightDirection");
    }

    initLights(){
        this.gl.uniform3fv(this.prg.uLightDirection,  [-0.25, -0.25, -0.25]);
        this.gl.uniform4fv(this.prg.uLightAmbient, [0.03,0.03,0.03,1.0]);
        this.gl.uniform4fv(this.prg.uLightDiffuse,  [1.0,1.0,1.0,1.0]); 
        this.gl.uniform4fv(this.prg.uLightSpecular,  [1.0,1.0,1.0,1.0]);
        
        this.gl.uniform4fv(this.prg.uMaterialAmbient, [1.0,1.0,1.0,1.0]);
        this.gl.uniform4fv(this.prg.uMaterialDiffuse, [1.0,0.9,0.4,1.0]);
        this.gl.uniform4fv(this.prg.uMaterialSpecular,[1.0,1.0,1.0,1.0]);
        this.gl.uniform1f(this.prg.uShininess, 10.0);
    }

    draw() {
    
        this.gl.clearColor(...this.clearColor);
        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.gl.viewport(0, 0, c_width, c_height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    
        mat4.perspective(45, c_width / c_height, 0.1, 10000.0, this.pMatrix);
        
        mat4.identity(this.mvMatrix);
        mat4.translate(this.mvMatrix, [0.0, 0.0, -10]);
        
        this.gl.uniformMatrix4fv(this.prg.uMVMatrix, false, this.mvMatrix);
        this.gl.uniformMatrix4fv(this.prg.uPMatrix, false, this.pMatrix);
        
        mat4.set(this.mvMatrix, this.nMatrix);
        mat4.inverse(this.nMatrix);
        mat4.transpose(this.nMatrix);
        
        this.gl.uniformMatrix4fv(this.prg.uNMatrix, false, this.nMatrix);
        
        console.log(scene.objects)
        
        try{
            for (const model of scene.objects){

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
}

const program = new Program();