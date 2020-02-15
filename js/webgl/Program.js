class Program {

    constructor() {
        this.gl = null;
        this.prg = null;

        this.vertexShader = null;
        this.fragmentShader = null;

        this.animationFrame = null;

        this.c_width = 0;
        this.c_height = 0;

    }

    runProgram() {

        const shaders = shader.getShading();

        const fsPromise = utils.getShader(program.gl, shaders[0], "fragment-shader")
            .then(shader => { program.fragmentShader = shader; });

        const vsPromise = utils.getShader(program.gl, shaders[1], "vertex-shader")
            .then(shader => { program.vertexShader = shader; });

        Promise.all([fsPromise, vsPromise])
            .then(() => {
                program.prg = program.gl.createProgram();

                program.gl.attachShader(program.prg, program.vertexShader);
                program.gl.attachShader(program.prg, program.fragmentShader);
                program.gl.linkProgram(program.prg);

                if (!program.gl.getProgramParameter(program.prg, program.gl.LINK_STATUS)) {
                    alert("Could not initialise shaders");
                }

                program.gl.useProgram(program.prg);

                program.getUniforms();
                program.initUniforms();
                program.renderLoop();
            })

    }

    getUniforms() {

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
        this.prg.uReflectorShininess = this.gl.getUniformLocation(this.prg, "uReflectorShininess");

        this.prg.uLightDirection = this.gl.getUniformLocation(this.prg, "uLightDirection");

        this.prg.uFogNear = this.gl.getUniformLocation(this.prg, "uFogNear");
        this.prg.uFogFar = this.gl.getUniformLocation(this.prg, "uFogFar");
        this.prg.uFogColor = this.gl.getUniformLocation(this.prg, "uFogColor");
        this.prg.uLightness = this.gl.getUniformLocation(this.prg, "uLightness");

        this.prg.uBlinnModel = this.gl.getUniformLocation(this.prg, "uBlinnModel");

        this.prg.uLightWorldPosition = this.gl.getUniformLocation(this.prg, "uLightWorldPosition");
        this.prg.uViewWorldPosition = this.gl.getUniformLocation(this.prg, "uViewWorldPosition");
        this.prg.uReflector = this.gl.getUniformLocation(this.prg, "uReflector");

        this.prg.uFog = this.gl.getUniformLocation(this.prg, "uFog");
    }

    initUniforms() {
        this.gl.uniform3fv(this.prg.uLightDirection, [-100, 1000, -100]);

        this.gl.uniform4f(this.prg.uMaterialAmbient, 0.0, 0.0, 0.0, 1.0);
        this.gl.uniform4f(this.prg.uMaterialSpecular, 1.0, 1.0, 1.0, 1.0);
    }

    draw() {
        this.gl.clearColor(...weather.getSkyColor());
        this.gl.depthFunc(this.gl.LEQUAL);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.enable(this.gl.DEPTH_TEST);

        this.gl.uniform1f(this.prg.uFogNear, weather.getFogNear());
        this.gl.uniform1f(this.prg.uFogFar, weather.getFogFar());
        this.gl.uniform4fv(this.prg.uFogColor, weather.getFogColor());
        this.gl.uniform1f(this.prg.uLightness, weather.getLightness());

        this.gl.uniform1f(this.prg.uShininess, shader.getShininess());
        this.gl.uniform1f(this.prg.uReflectorShininess, bumblebee.getReflectorShininess());

        this.gl.uniform1i(this.prg.uBlinnModel, shader.isBlinnModel());
        this.gl.uniform1i(this.prg.uReflector, bumblebee.isReflector());
        this.gl.uniform1i(this.prg.uFog, weather.isEnabledFog());

        try {
            for (const model of scene.objects) {

                const modelMatrix = mat4.create();
                const viewMatrix = mat4.create();
                const projectionMatrix = mat4.create();
                const normalMatrix = mat4.create();

                mat4.identity(modelMatrix);
                mat4.identity(viewMatrix);
                mat4.identity(projectionMatrix);

                mat4.perspective(45, this.c_width / this.c_height, 1, 100.0, projectionMatrix);

                if (model.alias === "bumblebee") {
                    mat4.translate(modelMatrix, bumblebee.getMove());
                    mat4.rotateY(modelMatrix, bumblebee.getAngle());

                    if (model.partname === "belly" && bumblebee.isTurning()) mat4.rotateZ(modelMatrix, bumblebee.getBellyAngle());

                    bumblebee.setPosition([modelMatrix[12], modelMatrix[13], modelMatrix[14]]);
                }


                this.gl.uniform4fv(this.prg.uMaterialDiffuse, model.color);

                switch (camera.type) {
                    case camera.CAMERA_FOLLOWING:
                        camera.lookAt(viewMatrix, bumblebee.getObserver(), bumblebee.getPosition(), bumblebee.getUpVector());
                        break;
                    case camera.CAMERA_TRACKING:
                        camera.lookAt(viewMatrix, [40, 40, 0], bumblebee.getPosition(), [0, -1, 0]);
                        break;
                    case camera.CAMERA_STATIC:
                        camera.lookAt(viewMatrix, [50, 50, 0], [0, 0, 0], [0, -1, 0]);
                        break;
                }

                this.gl.uniform3fv(this.prg.uLightWorldPosition, bumblebee.getPosition());
                this.gl.uniform3fv(this.prg.uViewWorldPosition, bumblebee.getSpotPostion());

                this.gl.uniformMatrix4fv(this.prg.uModelMatrix, false, modelMatrix);
                this.gl.uniformMatrix4fv(this.prg.uViewMatrix, false, viewMatrix);
                this.gl.uniformMatrix4fv(this.prg.uProjectionMatrix, false, projectionMatrix);

                mat4.identity(normalMatrix);
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
                this.gl.vertexAttribPointer(this.prg.aVertexNormal, 3, this.gl.FLOAT, false, 0, 0);

                this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, modelIndexBuffer);
                this.gl.drawElements(this.gl.TRIANGLES, model.indices.length, this.gl.UNSIGNED_SHORT, 0);

                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
                this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);

            }

        }
        catch (err) {
            alert(err);
        }
    }

    changeShaders() {

        this.gl.deleteProgram(this.prg);
        this.gl.deleteShader(this.fragmentShader);
        this.gl.deleteShader(this.vertexShader);
        cancelAnimationFrame(this.animationFrame)

        this.runProgram();
    }

    renderLoop() {
        program.animationFrame = requestAnimationFrame(program.renderLoop);
        bumblebee.bellyAngle += 0.05;
        if (weather.isNight() && weather.getLightness() > 0.05) {
            weather.setLightness(weather.getLightness() - 0.05);
        } else if (!weather.isNight() && weather.getLightness() < 1.0) {
            weather.setLightness(weather.getLightness() + 0.05);
        }

        if (weather.isFog() && weather.getFogFar() > weather.getFogFarDest()) {
            weather.setFogFar(weather.getFogFar() - 1);
        } else if (weather.isFog() && weather.getFogFar() < weather.getFogFarDest()) {
            weather.setFogFar(weather.getFogFar() + 1);
        } else if (!weather.isFog() && weather.getFogFar() < 125.0) {
            weather.setFogFar(weather.getFogFar() + 1);
        }

        if (weather.isFog() && weather.getFogNear() > weather.getFogNearDest()) {
            weather.setFogNear(weather.getFogNear() - 1);
        } else if (weather.isFog() && weather.getFogNear() < weather.getFogNearDest()) {
            weather.setFogNear(weather.getFogNear() + 1);
        } else if (!weather.isFog() && weather.getFogNear() < 100.0) {
            weather.setFogNear(weather.getFogNear() + 1);
            if (weather.getFogNear() >= 100.0) weather.disabledFog();
        }

        program.draw();
    }
}

const program = new Program();