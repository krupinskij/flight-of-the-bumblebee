class WebGLApp {

    run() {
        program.gl = utils.getGLContext("canvas-element-id");
        
        const bumblebeePromise = scene.loadModel("model/bumblebee.json");
        const grassPromise = scene.loadModel("model/grass.json");

        Promise.all([bumblebeePromise, grassPromise])
        .then(() => {
            program.init();
            program.initLights();
            program.draw();
        })
    }
}

const webGLApp = new WebGLApp();
webGLApp.run();