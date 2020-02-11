class WebGLApp {    

    run() {

        program.gl = utils.getGLContext("canvas-element-id");
        
        const bumblebeePromise = scene.loadBumblebee();
        const grassPromise = scene.loadGrass();

        for(let i = 0; i < 15; i++) {
            scene.loadFlower();
        }

        Promise.all([bumblebeePromise, grassPromise]).then(program.runProgram)
    }
}

const webGLApp = new WebGLApp();
webGLApp.run();
